import { inTransaction } from '../config/db.js'
import {
  createFloor,
  deleteFloor,
  findFloor,
  listBuiltInLinks,
  listFloorItems,
  listFloors,
  listItems,
  replaceItems,
  updateFloor,
} from '../models/floorModel.js'
import { findResourcesByIds, listResources } from '../models/resourceModel.js'
import { getFloorStatuses } from '../services/floorService.js'
import { conflict, invalid, notFound } from '../utils/httpError.js'
import { toLocalParts } from '../utils/time.js'

const requireFloor = async (id) => {
  const floor = await findFloor(id)

  if (!floor) {
    throw notFound('Floor not found')
  }

  return floor
}

const presentItem = (item, resourcesById, builtInByRoom) => {
  const { floorId, ...rest } = item

  if (!item.resourceId) {
    return rest
  }

  const resource = resourcesById.get(item.resourceId)

  return {
    ...rest,
    resource: resource && {
      id: resource.id,
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      facilities: resource.facilities,
      assetKey: resource.assetKey,
      isActive: resource.isActive,
    },
    builtIn: builtInByRoom.get(item.resourceId) ?? [],
  }
}

export async function list(req, res) {
  const [floors, items, resources, links] = await Promise.all([
    listFloors(),
    listFloorItems(),
    listResources({ includeInactive: true }),
    listBuiltInLinks(),
  ])

  const resourcesById = new Map(resources.map((item) => [item.id, item]))
  const builtInByRoom = new Map()

  for (const link of links) {
    const current = builtInByRoom.get(link.roomId) ?? []
    current.push({ id: link.id, name: link.name, assetKey: link.assetKey })
    builtInByRoom.set(link.roomId, current)
  }

  const now = toLocalParts(new Date())

  res.json({
    today: now.dateKey,
    nowMinutes: now.minutes,
    floors: floors.map((floor) => ({
      ...floor,
      items: items
        .filter((item) => item.floorId === floor.id)
        .map((item) => presentItem(item, resourcesById, builtInByRoom)),
    })),
  })
}

export async function status(req, res) {
  const [items, resources] = await Promise.all([
    listFloorItems(),
    listResources({ includeInactive: true }),
  ])

  const resourcesById = new Map(resources.map((item) => [item.id, item]))
  res.json(
    await getFloorStatuses(req.user, items, resourcesById, req.validated.query),
  )
}

export async function create(req, res) {
  res.status(201).json(await createFloor(req.validated.body))
}

export async function update(req, res) {
  const floor = await updateFloor(req.params.id, req.validated.body)

  if (!floor) {
    throw notFound('Floor not found')
  }

  res.json(floor)
}

export async function remove(req, res) {
  if (!(await deleteFloor(req.params.id))) {
    throw notFound('Floor not found')
  }

  res.status(204).end()
}

const assertPlaceable = async (items) => {
  const bookable = items.filter((item) => item.resourceId)
  const ids = bookable.map((item) => item.resourceId)

  if (new Set(ids).size !== ids.length) {
    throw invalid('A room or resource can only be placed once')
  }

  if (
    items.some(
      (item) => !item.resourceId && ['room', 'resource'].includes(item.kind),
    )
  ) {
    throw invalid('Rooms and resources must be linked to a real one')
  }

  if (
    items.some(
      (item) => item.resourceId && !['room', 'resource'].includes(item.kind),
    )
  ) {
    throw invalid('Only rooms and resources can be linked')
  }

  const found = await findResourcesByIds(ids)
  const byId = new Map(found.map((item) => [item.id, item]))

  for (const item of bookable) {
    const resource = byId.get(item.resourceId)

    if (!resource) {
      throw invalid('One of the placed items no longer exists')
    }

    const expected = item.kind === 'room' ? 'room' : 'equipment'

    if (resource.type !== expected) {
      throw invalid(`${resource.name} cannot be placed as a ${item.kind}`)
    }

    if (resource.builtInRoom) {
      throw invalid(
        `${resource.name} is built into ${resource.builtInRoom.name} and shows inside that room`,
      )
    }
  }
}

export async function saveLayout(req, res) {
  await requireFloor(req.params.id)
  const { items } = req.validated.body
  await assertPlaceable(items)

  try {
    await inTransaction((db) => replaceItems(req.params.id, items, db))
  } catch (error) {
    if (error.code === '23505') {
      throw conflict(
        'One of these is already placed on another floor. Remove it there first',
      )
    }

    throw error
  }

  res.json({ saved: (await listItems(req.params.id)).length })
}

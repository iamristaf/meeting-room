import pool from '../config/db.js'

const toItem = (row) => ({
  id: row.id,
  kind: row.kind,
  resourceId: row.resource_id,
  x: Number(row.x),
  y: Number(row.y),
  w: Number(row.w),
  h: Number(row.h),
  rotation: Number(row.rotation),
  shape: row.shape,
  label: row.label,
  icon: row.icon,
})

const toFloor = (row) => ({
  id: row.id,
  name: row.name,
  width: row.width,
  height: row.height,
  sortOrder: row.sort_order,
})

export async function listFloors() {
  const { rows } = await pool.query(
    'select * from floors order by sort_order, created_at',
  )
  return rows.map(toFloor)
}

export async function findFloor(id, db = pool) {
  const { rows } = await db.query('select * from floors where id = $1', [id])
  return rows[0] ? toFloor(rows[0]) : null
}

export async function listFloorItems() {
  const { rows } = await pool.query(
    'select * from floor_items order by created_at, id',
  )
  return rows.map((row) => ({ floorId: row.floor_id, ...toItem(row) }))
}

export async function createFloor({ name, width, height }) {
  const { rows } = await pool.query(
    `insert into floors (name, width, height, sort_order)
     values ($1, $2, $3, coalesce((select max(sort_order) + 1 from floors), 0))
     returning *`,
    [name, width, height],
  )
  return toFloor(rows[0])
}

export async function updateFloor(id, { name, width, height }) {
  const { rows } = await pool.query(
    `update floors set name = $2, width = $3, height = $4 where id = $1 returning *`,
    [id, name, width, height],
  )
  return rows[0] ? toFloor(rows[0]) : null
}

export async function deleteFloor(id) {
  const { rowCount } = await pool.query('delete from floors where id = $1', [
    id,
  ])
  return rowCount > 0
}

export async function replaceItems(floorId, items, db) {
  await db.query('delete from floor_items where floor_id = $1', [floorId])

  for (const item of items) {
    await db.query(
      `insert into floor_items (floor_id, kind, resource_id, x, y, w, h, rotation, shape, label, icon)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        floorId,
        item.kind,
        item.resourceId ?? null,
        item.x,
        item.y,
        item.w,
        item.h,
        item.rotation,
        item.shape,
        item.label,
        item.icon,
      ],
    )
  }
}

export async function listItems(floorId, db = pool) {
  const { rows } = await db.query(
    'select * from floor_items where floor_id = $1 order by created_at, id',
    [floorId],
  )
  return rows.map(toItem)
}

export async function listBuiltInLinks(db = pool) {
  const { rows } = await db.query(
    `select rr.room_id, rr.resource_id, r.name, r.asset_key
     from room_resources rr join resources r on r.id = rr.resource_id
     order by lower(r.name)`,
  )
  return rows.map((row) => ({
    roomId: row.room_id,
    id: row.resource_id,
    name: row.name,
    assetKey: row.asset_key,
  }))
}

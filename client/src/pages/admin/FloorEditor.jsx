import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layers, Plus, Redo2, Save, Undo2, Magnet } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import QueryState from '../../components/ui/QueryState'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FloorCanvas from '../../components/floor/FloorCanvas'
import EditorPalette from '../../components/floor/EditorPalette'
import EditorInspector from '../../components/floor/EditorInspector'
import FloorFormModal from '../../components/floor/FloorFormModal'
import useFetch from '../../hooks/useFetch'
import useToast from '../../hooks/useToast'
import floorService from '../../services/floorService'
import resourceService from '../../services/resourceService'
import getErrorMessage from '../../utils/errorMessage'
import {
  defaultItemFor,
  newClientId,
  toPayloadItem,
} from '../../utils/floorPlan'
import cn from '../../utils/cn'

const loadEditorData = async () => {
  const [plan, resources] = await Promise.all([
    floorService.list(),
    resourceService.listAll(),
  ])
  return { plan, resources }
}

const signature = (floor) =>
  JSON.stringify({
    name: floor.name,
    width: floor.width,
    height: floor.height,
    items: floor.items.map(toPayloadItem),
  })

const metaSignature = (floor) =>
  JSON.stringify([floor.name, floor.width, floor.height])

function Editor({ initialFloors, resources }) {
  const toast = useToast()
  const [floors, setFloors] = useState(initialFloors)
  const [baseline, setBaseline] = useState(initialFloors)
  const [activeId, setActiveId] = useState(initialFloors[0]?.id ?? null)
  const [selectedId, setSelectedId] = useState(null)
  const [tool, setTool] = useState('select')
  const [snap, setSnap] = useState(true)
  const [history, setHistory] = useState({ past: [], future: [] })
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [saving, setSaving] = useState(false)
  const floorsRef = useRef(floors)

  useEffect(() => {
    floorsRef.current = floors
  }, [floors])

  const floor = floors.find((entry) => entry.id === activeId)
  const selected = floor?.items.find((item) => item.id === selectedId)

  const placedIds = useMemo(
    () =>
      new Set(
        floors.flatMap((entry) =>
          entry.items
            .filter((item) => item.resourceId)
            .map((item) => item.resourceId),
        ),
      ),
    [floors],
  )

  const rooms = resources.filter(
    (item) => item.type === 'room' && item.isActive && !placedIds.has(item.id),
  )
  const equipment = resources.filter(
    (item) =>
      item.type === 'equipment' &&
      item.isActive &&
      !item.builtInRoom &&
      !placedIds.has(item.id),
  )

  const dirty = floors.some((entry) => {
    const original = baseline.find((base) => base.id === entry.id)
    return !original || signature(original) !== signature(entry)
  })

  const pushHistory = useCallback(() => {
    setHistory((current) => ({
      past: [...current.past.slice(-49), floorsRef.current],
      future: [],
    }))
  }, [])

  const undo = useCallback(() => {
    const previous = history.past[history.past.length - 1]

    if (!previous) {
      return
    }

    setFloors(previous)
    setHistory({
      past: history.past.slice(0, -1),
      future: [floorsRef.current, ...history.future],
    })
  }, [history])

  const redo = useCallback(() => {
    const [next, ...rest] = history.future

    if (!next) {
      return
    }

    setFloors(next)
    setHistory({ past: [...history.past, floorsRef.current], future: rest })
  }, [history])

  const setItems = useCallback(
    (items) =>
      setFloors((current) =>
        current.map((entry) =>
          entry.id === activeId ? { ...entry, items } : entry,
        ),
      ),
    [activeId],
  )

  const patchSelected = (patch) =>
    setItems(
      floor.items.map((item) =>
        item.id === selectedId ? { ...item, ...patch } : item,
      ),
    )

  const addItem = useCallback(
    (item) => {
      pushHistory()
      const id = newClientId()
      setItems([
        ...floorsRef.current.find((entry) => entry.id === activeId).items,
        { ...item, id },
      ])
      setSelectedId(id)
      setTool('select')
    },
    [activeId, pushHistory, setItems],
  )

  const centerPosition = (size) => {
    const count = floor.items.length % 6
    return {
      x: Math.round((floor.width - size.w) / 2 + count * 20),
      y: Math.round((floor.height - size.h) / 2 + count * 20),
    }
  }

  const handleAddShape = (kind, extra) => {
    const base = defaultItemFor(kind, extra)
    addItem({
      ...base,
      ...centerPosition(base),
      label: kind === 'label' ? 'Label' : '',
    })
  }

  const buildResourceItem = (resource, point) => {
    const kind = resource.type === 'room' ? 'room' : 'resource'
    const base = defaultItemFor(kind, { resourceId: resource.id })
    const position = point
      ? {
          x: Math.round(point.x - base.w / 2),
          y: Math.round(point.y - base.h / 2),
        }
      : centerPosition(base)
    return { ...base, ...position, resource, builtIn: [] }
  }

  const handleAddResource = (resource) => addItem(buildResourceItem(resource))

  const handleDrop = (payload, point) => {
    if (!payload.resource || placedIds.has(payload.resource.id)) {
      return
    }

    addItem(buildResourceItem(payload.resource, point))
  }

  const handleCreateWall = (geometry) => {
    addItem({ ...defaultItemFor('wall'), ...geometry })
    setTool('wall')
  }

  const handleRemove = () => {
    pushHistory()
    setItems(floor.items.filter((item) => item.id !== selectedId))
    setSelectedId(null)
  }

  const handleDuplicate = () => {
    addItem({ ...selected, x: selected.x + 20, y: selected.y + 20 })
  }

  const handleRotate = () => {
    pushHistory()
    patchSelected({ rotation: (Math.round(selected.rotation) + 90) % 360 })
  }

  const handleFloorChange = (patch) =>
    setFloors((current) =>
      current.map((entry) =>
        entry.id === activeId ? { ...entry, ...patch } : entry,
      ),
    )

  const handleCreateFloor = async (values) => {
    const created = await floorService.create(values)
    const entry = { ...created, items: [] }
    setFloors((current) => [...current, entry])
    setBaseline((current) => [...current, entry])
    setActiveId(created.id)
    setSelectedId(null)
    setAdding(false)
    toast.success('Floor added')
  }

  const handleDeleteFloor = async () => {
    try {
      await floorService.remove(activeId)
      const rest = floors.filter((entry) => entry.id !== activeId)
      setFloors(rest)
      setBaseline((current) => current.filter((entry) => entry.id !== activeId))
      setActiveId(rest[0]?.id ?? null)
      setSelectedId(null)
      setHistory({ past: [], future: [] })
      toast.success('Floor deleted')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setRemoving(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      for (const entry of floors) {
        const original = baseline.find((base) => base.id === entry.id)

        if (
          original &&
          metaSignature(original) === metaSignature(entry) &&
          signature(original) === signature(entry)
        ) {
          continue
        }

        if (!original || metaSignature(original) !== metaSignature(entry)) {
          await floorService.update(entry.id, {
            name: entry.name,
            width: entry.width,
            height: entry.height,
          })
        }

        await floorService.saveLayout(entry.id, entry.items.map(toPayloadItem))
      }

      const plan = await floorService.list()
      setFloors(plan.floors)
      setBaseline(plan.floors)
      setHistory({ past: [], future: [] })
      setSelectedId(null)
      toast.success('Floor plan saved')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const onKey = (event) => {
      const target = event.target
      const typing =
        target instanceof HTMLElement &&
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)

      if (event.key === 'Escape') {
        setTool('select')
        setSelectedId(null)
        return
      }

      if (typing) {
        return
      }

      const modifier = event.metaKey || event.ctrlKey

      if (modifier && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
        return
      }

      if (modifier && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        redo()
        return
      }

      if (!selectedId) {
        return
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        pushHistory()
        setItems(
          floorsRef.current
            .find((entry) => entry.id === activeId)
            .items.filter((item) => item.id !== selectedId),
        )
        setSelectedId(null)
        return
      }

      const step = event.shiftKey ? 1 : 10
      const move = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      }[event.key]

      if (move) {
        event.preventDefault()
        pushHistory()
        setItems(
          floorsRef.current
            .find((entry) => entry.id === activeId)
            .items.map((item) =>
              item.id === selectedId
                ? { ...item, x: item.x + move[0], y: item.y + move[1] }
                : item,
            ),
        )
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId, selectedId, pushHistory, redo, undo, setItems])

  return (
    <>
      <PageHeader
        title="Floor plan editor"
        subtitle="Draw your office, then place rooms and resources where they really are"
      >
        {dirty && (
          <span className="rounded-full bg-amber-soft px-3 py-1 text-xs font-semibold text-amber-ink">
            Unsaved changes
          </span>
        )}
        <Button
          variant="secondary"
          onClick={undo}
          disabled={!history.past.length}
          aria-label="Undo"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          variant="secondary"
          onClick={redo}
          disabled={!history.future.length}
          aria-label="Redo"
        >
          <Redo2 className="size-4" />
        </Button>
        <Button
          variant={snap ? 'soft' : 'secondary'}
          onClick={() => setSnap((value) => !value)}
          aria-pressed={snap}
        >
          <Magnet className="size-4" />
          Snap to grid
        </Button>
        <Button onClick={handleSave} loading={saving} disabled={!dirty}>
          <Save className="size-4" />
          Save floor plan
        </Button>
      </PageHeader>

      <div
        className="mb-3 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Floors"
      >
        {floors.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={entry.id === activeId}
            onClick={() => {
              setActiveId(entry.id)
              setSelectedId(null)
            }}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand',
              entry.id === activeId
                ? 'bg-brand text-white dark:text-[#0b0e1c]'
                : 'bg-surface text-muted hover:bg-sunken hover:text-ink',
            )}
          >
            <Layers className="size-4" />
            {entry.name || 'Untitled'}
          </button>
        ))}
        <Button variant="secondary" onClick={() => setAdding(true)}>
          <Plus className="size-4" />
          Add floor
        </Button>
      </div>

      {floor ? (
        <div className="grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)_270px]">
          <div className="order-2 lg:order-1 lg:max-h-[calc(100vh-15.5rem)] lg:overflow-y-auto">
            <EditorPalette
              tool={tool}
              onTool={setTool}
              onAddShape={handleAddShape}
              rooms={rooms}
              equipment={equipment}
              onAddResource={handleAddResource}
            />
          </div>

          <div className="order-1 h-[60vh] min-h-[360px] lg:order-2 lg:h-[calc(100vh-15.5rem)]">
            <FloorCanvas
              key={floor.id}
              floor={floor}
              items={floor.items}
              mode="edit"
              tool={tool}
              snap={snap}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onItemsChange={setItems}
              onGestureStart={pushHistory}
              onCreateWall={handleCreateWall}
              onDropPayload={handleDrop}
            />
          </div>

          <div className="order-3">
            <EditorInspector
              floor={floor}
              item={selected}
              onFloorChange={handleFloorChange}
              onFloorDelete={() => setRemoving(true)}
              onPatch={patchSelected}
              onBeginEdit={pushHistory}
              onRotate={handleRotate}
              onDuplicate={handleDuplicate}
              onRemove={handleRemove}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-4 py-14 text-center">
          <h3 className="font-semibold text-ink">
            Start with your first floor
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Set its size to match your office, then add walls, doors, rooms and
            resources.
          </p>
          <Button className="mt-4" onClick={() => setAdding(true)}>
            <Plus className="size-4" />
            Add floor
          </Button>
        </div>
      )}

      {adding && (
        <FloorFormModal
          onSubmit={handleCreateFloor}
          onClose={() => setAdding(false)}
        />
      )}

      {removing && (
        <ConfirmDialog
          title="Delete this floor?"
          message="The floor and everything drawn on it will be removed. Bookings and the rooms or resources themselves are not affected."
          confirmLabel="Delete floor"
          danger
          onConfirm={handleDeleteFloor}
          onCancel={() => setRemoving(false)}
        />
      )}
    </>
  )
}

export default function FloorEditor() {
  const { data, loading, error, reload } = useFetch(loadEditorData)

  return (
    <QueryState loading={loading} error={error} onRetry={reload}>
      {data && (
        <Editor
          key={JSON.stringify(data.plan.floors.map((entry) => entry.id))}
          initialFloors={data.plan.floors}
          resources={data.resources}
        />
      )}
    </QueryState>
  )
}

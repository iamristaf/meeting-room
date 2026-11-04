import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import cn from '../../utils/cn'
import FloorItem from './FloorItem'
import {
  centerOf,
  GRID,
  LAYER_ORDER,
  resizeFromCorner,
  snapValue,
  wallEnds,
  wallFromPoints,
} from '../../utils/floorPlan'

const MIN_ZOOM = 0.2
const MAX_ZOOM = 3
const PADDING = 32
const CORNERS = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
]

const zoomButton =
  'grid size-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand'

export default function FloorCanvas({
  floor,
  items,
  statuses = {},
  mode = 'view',
  tool = 'select',
  snap = true,
  selectedId = null,
  pinnedId = null,
  renderOverlay,
  wheelZoom = true,
  onSelect,
  onItemsChange,
  onGestureStart,
  onCreateWall,
  onDropPayload,
}) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const gesture = useRef(null)
  const pointers = useRef(new Map())
  const adjusted = useRef(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [view, setView] = useState({ k: 1, tx: 0, ty: 0 })
  const [hoverId, setHoverId] = useState(null)
  const [draft, setDraft] = useState(null)

  const fit = useCallback(() => {
    if (!size.width || !size.height) {
      return
    }

    const padding = size.width < 520 ? 12 : PADDING
    const k = Math.min(
      MAX_ZOOM,
      Math.max(
        MIN_ZOOM,
        Math.min(
          (size.width - padding * 2) / floor.width,
          (size.height - padding * 2) / floor.height,
        ),
      ),
    )

    setView({
      k,
      tx: (size.width - floor.width * k) / 2,
      ty: (size.height - floor.height * k) / 2,
    })
  }, [size, floor.width, floor.height])

  useEffect(() => {
    const node = containerRef.current
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    adjusted.current = false
  }, [floor.id])

  useEffect(() => {
    if (!adjusted.current) {
      fit()
    }
  }, [fit])

  const zoomAt = useCallback((factor, point) => {
    adjusted.current = true
    setView((current) => {
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k * factor))
      const ratio = k / current.k
      return {
        k,
        tx: point.x - (point.x - current.tx) * ratio,
        ty: point.y - (point.y - current.ty) * ratio,
      }
    })
  }, [])

  useEffect(() => {
    const node = svgRef.current

    if (!wheelZoom) {
      return undefined
    }

    const onWheel = (event) => {
      event.preventDefault()
      const rect = node.getBoundingClientRect()
      zoomAt(event.deltaY < 0 ? 1.12 : 1 / 1.12, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }

    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [zoomAt, wheelZoom])

  const toWorld = (event) => {
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left - view.tx) / view.k,
      y: (event.clientY - rect.top - view.ty) / view.k,
    }
  }

  const sorted = useMemo(
    () => [...items].sort((a, b) => LAYER_ORDER[a.kind] - LAYER_ORDER[b.kind]),
    [items],
  )

  const selected = items.find((item) => item.id === selectedId)

  const patchItem = (id, patch) =>
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )

  const beginGesture = () => {
    if (gesture.current && !gesture.current.started) {
      gesture.current.started = true
      onGestureStart?.()
    }
  }

  const startPan = (event) => {
    gesture.current = {
      type: 'pan',
      origin: { x: event.clientX, y: event.clientY },
      view,
      moved: false,
    }
    svgRef.current.setPointerCapture(event.pointerId)
  }

  const trackPointer = (event) => {
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })

    if (pointers.current.size !== 2) {
      return
    }

    const [a, b] = [...pointers.current.values()]
    const rect = svgRef.current.getBoundingClientRect()
    gesture.current = {
      type: 'pinch',
      distance: Math.hypot(a.x - b.x, a.y - b.y),
      view,
      mid: { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top },
    }
    adjusted.current = true
  }

  const handleBackgroundDown = (event) => {
    if (event.button !== 0 || pointers.current.size > 1) {
      return
    }

    if (mode === 'edit' && tool === 'wall') {
      const start = toWorld(event)
      const point = { x: snapValue(start.x, snap), y: snapValue(start.y, snap) }
      gesture.current = { type: 'draw', from: point }
      setDraft({ from: point, to: point })
      svgRef.current.setPointerCapture(event.pointerId)
      return
    }

    startPan(event)
  }

  const handleItemDown = (event, item) => {
    if (event.button !== 0 || pointers.current.size > 1) {
      return
    }

    if (mode === 'edit' && tool === 'wall') {
      return
    }

    event.stopPropagation()

    if (mode === 'view') {
      gesture.current = {
        type: 'pan',
        origin: { x: event.clientX, y: event.clientY },
        view,
        moved: false,
        itemId: item.id,
      }
      svgRef.current.setPointerCapture(event.pointerId)
      return
    }

    onSelect(item.id)
    const point = toWorld(event)
    gesture.current = {
      type: 'move',
      id: item.id,
      origin: point,
      start: { x: item.x, y: item.y },
      started: false,
    }
    svgRef.current.setPointerCapture(event.pointerId)
  }

  const startResize = (event, corner) => {
    event.stopPropagation()
    gesture.current = {
      type: 'resize',
      id: selected.id,
      corner,
      origin: toWorld(event),
      base: { ...selected },
      started: false,
    }
    svgRef.current.setPointerCapture(event.pointerId)
  }

  const startWallEnd = (event, endIndex) => {
    event.stopPropagation()
    const ends = wallEnds(selected)
    gesture.current = {
      type: 'wall-end',
      id: selected.id,
      fixed: ends[1 - endIndex],
      endIndex,
      thickness: selected.h,
      started: false,
    }
    svgRef.current.setPointerCapture(event.pointerId)
  }

  const handleMove = (event) => {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      })
    }

    const current = gesture.current

    if (!current) {
      return
    }

    if (current.type === 'pinch') {
      const [a, b] = [...pointers.current.values()]

      if (!b) {
        return
      }

      const k = Math.min(
        MAX_ZOOM,
        Math.max(
          MIN_ZOOM,
          current.view.k *
            (Math.hypot(a.x - b.x, a.y - b.y) / current.distance),
        ),
      )
      const ratio = k / current.view.k
      setView({
        k,
        tx: current.mid.x - (current.mid.x - current.view.tx) * ratio,
        ty: current.mid.y - (current.mid.y - current.view.ty) * ratio,
      })
      return
    }

    if (current.type === 'pan') {
      const dx = event.clientX - current.origin.x
      const dy = event.clientY - current.origin.y

      if (!current.moved && Math.hypot(dx, dy) < 4) {
        return
      }

      current.moved = true
      adjusted.current = true
      setView({
        ...current.view,
        tx: current.view.tx + dx,
        ty: current.view.ty + dy,
      })
      return
    }

    const point = toWorld(event)

    if (current.type === 'draw') {
      let to = { x: snapValue(point.x, snap), y: snapValue(point.y, snap) }

      if (snap && Math.abs(to.y - current.from.y) <= GRID) {
        to = { ...to, y: current.from.y }
      } else if (snap && Math.abs(to.x - current.from.x) <= GRID) {
        to = { ...to, x: current.from.x }
      }

      setDraft({ from: current.from, to })
      return
    }

    if (current.type === 'move') {
      const dx = point.x - current.origin.x
      const dy = point.y - current.origin.y

      if (!current.started && Math.hypot(dx, dy) * view.k < 3) {
        return
      }

      beginGesture()
      patchItem(current.id, {
        x: snapValue(current.start.x + dx, snap),
        y: snapValue(current.start.y + dy, snap),
      })
      return
    }

    if (current.type === 'resize') {
      beginGesture()
      const delta = {
        x: point.x - current.origin.x,
        y: point.y - current.origin.y,
      }
      const next = resizeFromCorner(current.base, current.corner, delta)
      patchItem(current.id, {
        x: Math.round(next.x),
        y: Math.round(next.y),
        w: Math.round(next.w),
        h: Math.round(next.h),
      })
      return
    }

    if (current.type === 'wall-end') {
      beginGesture()
      const moving = {
        x: snapValue(point.x, snap),
        y: snapValue(point.y, snap),
      }
      const pair =
        current.endIndex === 0
          ? [moving, current.fixed]
          : [current.fixed, moving]
      const geometry = wallFromPoints(pair[0], pair[1], current.thickness)

      if (geometry.w >= 10) {
        patchItem(current.id, geometry)
      }
    }
  }

  const handleUp = (event) => {
    pointers.current.delete(event.pointerId)
    const current = gesture.current

    if (current?.type === 'pinch') {
      if (pointers.current.size < 2) {
        gesture.current = null
      }

      return
    }

    gesture.current = null

    if (svgRef.current?.hasPointerCapture(event.pointerId)) {
      svgRef.current.releasePointerCapture(event.pointerId)
    }

    if (!current) {
      return
    }

    if (current.type === 'draw') {
      const geometry = draft && wallFromPoints(draft.from, draft.to)
      setDraft(null)

      if (geometry && geometry.w >= 20) {
        onCreateWall(geometry)
      }

      return
    }

    if (current.type === 'pan' && !current.moved) {
      onSelect(current.itemId ?? null, { x: event.clientX, y: event.clientY })
    }
  }

  const handleDragOver = (event) => {
    if (mode === 'edit') {
      event.preventDefault()
    }
  }

  const handleDrop = (event) => {
    if (mode !== 'edit') {
      return
    }

    event.preventDefault()
    const raw = event.dataTransfer.getData('text/plain')

    if (!raw) {
      return
    }

    try {
      onDropPayload(JSON.parse(raw), toWorld(event))
    } catch {
      return
    }
  }

  const overlayItem = items.find(
    (item) =>
      item.id === (pinnedId ?? (mode === 'view' ? hoverId : null)) &&
      item.resourceId,
  )
  const overlayPinned = Boolean(pinnedId)
  const compact = size.width < 520
  const overlayPoint = overlayItem && centerOf(overlayItem)
  const overlayStyle = overlayPoint && {
    left: Math.min(
      Math.max(12, view.tx + (overlayItem.x + overlayItem.w) * view.k + 12),
      Math.max(12, size.width - 300),
    ),
    top: Math.min(
      Math.max(12, view.ty + overlayItem.y * view.k),
      Math.max(12, size.height - 220),
    ),
  }

  const handleRadius = 6 / view.k
  const endHandles = selected?.kind === 'wall' ? wallEnds(selected) : null
  const selectedCenter = selected && centerOf(selected)

  return (
    <div
      ref={containerRef}
      className="relative size-full touch-none select-none overflow-hidden rounded-2xl border border-line bg-sunken"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 size-full"
        style={{
          cursor: mode === 'edit' && tool === 'wall' ? 'crosshair' : 'grab',
        }}
        onPointerDownCapture={trackPointer}
        onPointerDown={handleBackgroundDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        <defs>
          <pattern
            id="floor-grid"
            width={GRID * 2}
            height={GRID * 2}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${GRID * 2} 0 L 0 0 0 ${GRID * 2}`}
              fill="none"
              stroke="var(--c-line)"
              strokeWidth={1}
            />
          </pattern>
        </defs>

        <g transform={`translate(${view.tx} ${view.ty}) scale(${view.k})`}>
          <rect
            x={0}
            y={0}
            width={floor.width}
            height={floor.height}
            fill="var(--c-surface)"
            stroke="var(--c-line-strong)"
            strokeWidth={2}
            rx={4}
          />
          {mode === 'edit' && view.k > 0.35 && (
            <rect
              x={0}
              y={0}
              width={floor.width}
              height={floor.height}
              fill="url(#floor-grid)"
              pointerEvents="none"
            />
          )}

          {sorted.map((item) => (
            <FloorItem
              key={item.id}
              item={item}
              mode={mode}
              status={item.resourceId ? statuses[item.resourceId] : null}
              selected={item.id === selectedId}
              hovered={item.id === hoverId}
              onPointerDown={(event) => handleItemDown(event, item)}
              onPointerEnter={() => setHoverId(item.id)}
              onPointerLeave={() => setHoverId(null)}
            />
          ))}

          {draft && (
            <path
              d={`M ${draft.from.x} ${draft.from.y} L ${draft.to.x} ${draft.to.y}`}
              stroke="var(--c-brand)"
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.6}
              pointerEvents="none"
            />
          )}

          {mode === 'edit' && selected && !endHandles && (
            <g
              transform={`rotate(${selected.rotation} ${selectedCenter.x} ${selectedCenter.y})`}
            >
              <rect
                x={selected.x}
                y={selected.y}
                width={selected.w}
                height={selected.h}
                fill="none"
                stroke="var(--c-brand)"
                strokeWidth={1.5 / view.k}
                strokeDasharray={`${6 / view.k} ${4 / view.k}`}
                pointerEvents="none"
              />
              {CORNERS.map((corner) => (
                <circle
                  key={`${corner.x}${corner.y}`}
                  cx={selectedCenter.x + (corner.x * selected.w) / 2}
                  cy={selectedCenter.y + (corner.y * selected.h) / 2}
                  r={handleRadius}
                  fill="var(--c-surface)"
                  stroke="var(--c-brand)"
                  strokeWidth={2 / view.k}
                  style={{ cursor: 'nwse-resize' }}
                  onPointerDown={(event) => startResize(event, corner)}
                />
              ))}
            </g>
          )}

          {mode === 'edit' &&
            endHandles?.map((end, index) => (
              <circle
                key={index}
                cx={end.x}
                cy={end.y}
                r={handleRadius * 1.2}
                fill="var(--c-surface)"
                stroke="var(--c-brand)"
                strokeWidth={2 / view.k}
                style={{ cursor: 'crosshair' }}
                onPointerDown={(event) => startWallEnd(event, index)}
              />
            ))}
        </g>
      </svg>

      <div className="absolute bottom-3 right-3 flex flex-col rounded-xl border border-line bg-surface/95 p-1 shadow-card">
        <button
          type="button"
          className={zoomButton}
          aria-label="Zoom in"
          onClick={() =>
            zoomAt(1.25, { x: size.width / 2, y: size.height / 2 })
          }
        >
          <ZoomIn className="size-4" />
        </button>
        <button
          type="button"
          className={zoomButton}
          aria-label="Zoom out"
          onClick={() => zoomAt(0.8, { x: size.width / 2, y: size.height / 2 })}
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          className={zoomButton}
          aria-label="Fit to screen"
          onClick={() => {
            adjusted.current = false
            fit()
          }}
        >
          <Maximize2 className="size-4" />
        </button>
      </div>

      {overlayItem && renderOverlay && (!compact || overlayPinned) && (
        <div
          className={cn(
            'z-10',
            compact
              ? 'fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30'
              : overlayPinned
                ? 'absolute'
                : 'pointer-events-none absolute',
          )}
          style={compact ? undefined : overlayStyle}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {renderOverlay(overlayItem, overlayPinned, compact)}
        </div>
      )}
    </div>
  )
}

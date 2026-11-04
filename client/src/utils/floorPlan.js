import {
  Armchair,
  ArrowUpDown,
  Bath,
  Coffee,
  Footprints,
  Leaf,
  Monitor,
  Printer,
  Refrigerator,
  Server,
  Sofa,
  Table,
  Utensils,
} from 'lucide-react'

export const DECOR_ICONS = [
  { key: 'plant', label: 'Plant', icon: Leaf },
  { key: 'stairs', label: 'Stairs', icon: Footprints },
  { key: 'lift', label: 'Lift', icon: ArrowUpDown },
  { key: 'desk', label: 'Desk', icon: Monitor },
  { key: 'table', label: 'Table', icon: Table },
  { key: 'sofa', label: 'Sofa', icon: Sofa },
  { key: 'chair', label: 'Chair', icon: Armchair },
  { key: 'pantry', label: 'Pantry', icon: Coffee },
  { key: 'dining', label: 'Dining', icon: Utensils },
  { key: 'fridge', label: 'Fridge', icon: Refrigerator },
  { key: 'printer', label: 'Printer', icon: Printer },
  { key: 'server', label: 'Server', icon: Server },
  { key: 'restroom', label: 'Restroom', icon: Bath },
]

export const decorIconFor = (key) =>
  DECOR_ICONS.find((item) => item.key === key)?.icon ?? Leaf

export const STATUS_STYLES = {
  free: {
    fill: 'var(--c-green-soft)',
    stroke: 'var(--c-green)',
    label: 'Free',
  },
  booked: {
    fill: 'var(--c-rose-soft)',
    stroke: 'var(--c-rose)',
    label: 'Booked',
  },
  mine: {
    fill: 'var(--c-brand-soft)',
    stroke: 'var(--c-brand)',
    label: 'Booked by you',
  },
  closed: {
    fill: 'var(--c-sunken)',
    stroke: 'var(--c-faint)',
    label: 'Closed at this time',
  },
  unavailable: {
    fill: 'var(--c-sunken)',
    stroke: 'var(--c-faint)',
    label: 'Unavailable',
  },
  idle: { fill: 'var(--c-brand-soft)', stroke: 'var(--c-brand)', label: '' },
}

export const LAYER_ORDER = {
  decor: 0,
  room: 1,
  resource: 2,
  wall: 3,
  window: 4,
  door: 5,
  label: 6,
}

export const GRID = 10

export const snapValue = (value, enabled) =>
  enabled ? Math.round(value / GRID) * GRID : Math.round(value)

export const centerOf = (item) => ({
  x: item.x + item.w / 2,
  y: item.y + item.h / 2,
})

const toRadians = (degrees) => (degrees * Math.PI) / 180

export const rotatePoint = (point, degrees) => {
  const angle = toRadians(degrees)
  return {
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
  }
}

export const wallEnds = (item) => {
  const center = centerOf(item)
  const offset = rotatePoint({ x: item.w / 2, y: 0 }, item.rotation)
  return [
    { x: center.x - offset.x, y: center.y - offset.y },
    { x: center.x + offset.x, y: center.y + offset.y },
  ]
}

export const wallFromPoints = (from, to, thickness = 8) => {
  const length = Math.hypot(to.x - from.x, to.y - from.y)
  const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI
  const cx = (from.x + to.x) / 2
  const cy = (from.y + to.y) / 2
  return {
    x: cx - length / 2,
    y: cy - thickness / 2,
    w: length,
    h: thickness,
    rotation: Math.round(angle * 10) / 10,
  }
}

export const resizeFromCorner = (item, corner, pointerDelta, minSize = 10) => {
  const local = rotatePoint(pointerDelta, -item.rotation)
  const width = Math.max(minSize, item.w + corner.x * local.x)
  const height = Math.max(minSize, item.h + corner.y * local.y)
  const shift = rotatePoint(
    {
      x: (corner.x * (width - item.w)) / 2,
      y: (corner.y * (height - item.h)) / 2,
    },
    item.rotation,
  )
  const center = centerOf(item)
  const next = { x: center.x + shift.x, y: center.y + shift.y }
  return { x: next.x - width / 2, y: next.y - height / 2, w: width, h: height }
}

export const newClientId = () =>
  `new-${Math.random().toString(36).slice(2, 10)}`

export const toPayloadItem = (item) => ({
  kind: item.kind,
  resourceId: item.resourceId ?? null,
  x: Math.round(item.x * 10) / 10,
  y: Math.round(item.y * 10) / 10,
  w: Math.round(item.w * 10) / 10,
  h: Math.round(item.h * 10) / 10,
  rotation: Math.round((item.rotation ?? 0) * 10) / 10,
  shape: item.shape ?? 'rect',
  label: item.label ?? '',
  icon: item.icon ?? '',
})

export const isBookable = (item) =>
  item.kind === 'room' || item.kind === 'resource'

export const defaultItemFor = (kind, extra = {}) => {
  const base = {
    rotation: 0,
    shape: 'rect',
    label: '',
    icon: '',
    resourceId: null,
  }
  const sizes = {
    room: { w: 220, h: 160 },
    resource: { w: 80, h: 56 },
    wall: { w: 200, h: 8 },
    door: { w: 56, h: 10 },
    window: { w: 80, h: 8 },
    label: { w: 140, h: 32 },
    decor: { w: 56, h: 56 },
  }
  return { ...base, kind, ...sizes[kind], x: 0, y: 0, ...extra }
}

import { createElement } from 'react'
import { DoorOpen } from 'lucide-react'
import { decorIconFor, STATUS_STYLES } from '../../utils/floorPlan'
import { resolveAssetKey, resourceAssetMeta } from '../../utils/assets'

const truncate = (text, limit) =>
  text.length > limit ? `${text.slice(0, Math.max(1, limit - 1))}...` : text

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function BookableBody({ item, style, mode, status }) {
  const { x, y, w, h } = item
  const cx = x + w / 2
  const cy = y + h / 2
  const resource = item.resource
  const name = item.label || resource?.name || 'Unlinked'
  const fontSize = clamp(Math.min(w / 9, h / 4.2), 11, 20)
  const maxChars = Math.floor((w - 12) / (fontSize * 0.56))
  const isRoom = item.kind === 'room'
  const builtIn = item.builtIn ?? []
  const roomy = h >= 74 && w >= 100

  const lines = []

  if (isRoom && roomy) {
    if (resource?.capacity) {
      lines.push({ text: `${resource.capacity} seats`, size: fontSize * 0.78 })
    }

    if (mode === 'view' && status) {
      lines.push({
        text: STATUS_STYLES[status.state]?.label ?? '',
        size: fontSize * 0.78,
        strong: true,
      })
    } else if (builtIn.length) {
      lines.push({
        text: `${builtIn.length} built in`,
        size: fontSize * 0.78,
      })
    }
  }

  const iconSize = clamp(Math.min(w, h) * 0.42, 14, 34)
  const showIcon = !isRoom
  const Icon = showIcon
    ? resourceAssetMeta(resolveAssetKey(resource ?? item)).icon
    : DoorOpen
  const roomIconSize = clamp(Math.min(w, h) * 0.22, 14, 26)
  const showRoomIcon = isRoom && h >= 100 && w >= 100

  const blockHeight =
    fontSize * 1.25 +
    lines.reduce((total, line) => total + line.size * 1.3, 0) +
    (showIcon || showRoomIcon ? (showIcon ? iconSize : roomIconSize) + 4 : 0)
  let cursor = cy - blockHeight / 2

  const iconNode = (size) => {
    const node = (
      <Icon
        x={cx - size / 2}
        y={cursor}
        width={size}
        height={size}
        color={style.stroke}
        strokeWidth={1.8}
      />
    )
    cursor += size + 4
    return node
  }

  const iconElement =
    showIcon || showRoomIcon
      ? iconNode(showIcon ? iconSize : roomIconSize)
      : null

  const nameY = cursor + fontSize
  cursor = nameY + fontSize * 0.25

  return (
    <g style={{ pointerEvents: 'none' }}>
      {iconElement}
      <text
        x={cx}
        y={nameY}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={700}
        fill="var(--c-ink)"
      >
        {truncate(name, maxChars)}
      </text>
      {lines.map((line, index) => {
        const lineY = cursor + line.size * 1.15 * (index + 1) + index * 2
        return (
          <text
            key={line.text}
            x={cx}
            y={lineY}
            textAnchor="middle"
            fontSize={line.size}
            fontWeight={line.strong ? 700 : 500}
            fill={line.strong ? style.stroke : 'var(--c-muted)'}
          >
            {line.text}
          </text>
        )
      })}
    </g>
  )
}

export default function FloorItem({
  item,
  mode,
  status,
  selected,
  hovered,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  onClick,
}) {
  const { x, y, w, h, rotation } = item
  const cx = x + w / 2
  const cy = y + h / 2
  const bookable = item.kind === 'room' || item.kind === 'resource'
  const state = mode === 'view' ? (status?.state ?? 'idle') : 'idle'
  const style =
    STATUS_STYLES[
      bookable && !item.resource?.isActive && mode === 'view'
        ? 'unavailable'
        : state
    ]
  const dimmed =
    style === STATUS_STYLES.closed || style === STATUS_STYLES.unavailable

  const events = {
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onClick,
  }

  let body = null

  if (bookable) {
    const shared = {
      fill: style.fill,
      stroke: style.stroke,
      strokeWidth: selected || hovered ? 3 : 1.8,
      strokeDasharray: dimmed ? '6 4' : undefined,
    }

    body = (
      <>
        {item.shape === 'ellipse' ? (
          <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} {...shared} />
        ) : (
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={item.kind === 'room' ? 10 : 8}
            {...shared}
          />
        )}
        <g transform={`rotate(${-rotation} ${cx} ${cy})`}>
          <BookableBody item={item} style={style} mode={mode} status={status} />
        </g>
      </>
    )
  } else if (item.kind === 'wall') {
    body = (
      <>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={2}
          fill="var(--c-ink-soft)"
        />
        <rect
          x={x}
          y={cy - Math.max(h, 14) / 2}
          width={w}
          height={Math.max(h, 14)}
          fill="transparent"
        />
      </>
    )
  } else if (item.kind === 'door') {
    body = (
      <>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="var(--c-surface)"
          stroke="var(--c-surface)"
          strokeWidth={1}
        />
        <path
          d={`M ${x} ${cy} L ${x} ${cy - w} A ${w} ${w} 0 0 1 ${x + w} ${cy}`}
          fill="var(--c-brand-soft)"
          fillOpacity={0.5}
          stroke="var(--c-brand)"
          strokeWidth={1.5}
        />
      </>
    )
  } else if (item.kind === 'window') {
    body = (
      <>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="var(--c-sky-soft)"
          stroke="var(--c-sky)"
          strokeWidth={1.5}
        />
        <line
          x1={x}
          y1={cy}
          x2={x + w}
          y2={cy}
          stroke="var(--c-sky)"
          strokeWidth={1}
        />
      </>
    )
  } else if (item.kind === 'label') {
    const size = clamp(h * 0.6, 10, 40)
    body = (
      <>
        <rect x={x} y={y} width={w} height={h} fill="transparent" />
        <g
          transform={`rotate(${-rotation} ${cx} ${cy})`}
          style={{ pointerEvents: 'none' }}
        >
          <text
            x={cx}
            y={cy + size * 0.35}
            textAnchor="middle"
            fontSize={size}
            fontWeight={700}
            fill="var(--c-ink)"
          >
            {item.label || 'Label'}
          </text>
        </g>
      </>
    )
  } else {
    const size = clamp(Math.min(w, h) * 0.6, 12, 80)
    body = (
      <>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={8}
          fill="var(--c-subtle)"
          stroke="var(--c-line-strong)"
          strokeWidth={1.2}
        />
        <g
          transform={`rotate(${-rotation} ${cx} ${cy})`}
          style={{ pointerEvents: 'none' }}
        >
          {createElement(decorIconFor(item.icon), {
            x: cx - size / 2,
            y: cy - size / 2,
            width: size,
            height: size,
            color: 'var(--c-muted)',
            strokeWidth: 1.6,
          })}
        </g>
      </>
    )
  }

  const interactive = mode === 'edit' || bookable

  return (
    <g
      transform={`rotate(${rotation} ${cx} ${cy})`}
      style={{
        cursor: mode === 'edit' ? 'move' : bookable ? 'pointer' : 'default',
        pointerEvents: interactive ? 'auto' : 'none',
      }}
      {...events}
    >
      {body}
    </g>
  )
}

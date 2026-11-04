import { useId } from 'react'
import { Copy, RotateCw, Trash2 } from 'lucide-react'
import Button from '../ui/Button'
import inputClass from '../../utils/fieldStyles'
import { DECOR_ICONS, isBookable } from '../../utils/floorPlan'
import cn from '../../utils/cn'

function NumberField({ label, value, min, max, step = 1, onFocus, onChange }) {
  const id = useId()

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={Math.round(value * 10) / 10}
        className={inputClass(false)}
        onFocus={onFocus}
        onChange={(event) => {
          const next = Number(event.target.value)

          if (!Number.isNaN(next)) {
            onChange(next)
          }
        }}
      />
    </div>
  )
}

export default function EditorInspector({
  floor,
  item,
  onFloorChange,
  onFloorDelete,
  onPatch,
  onBeginEdit,
  onRotate,
  onDuplicate,
  onRemove,
}) {
  if (!item) {
    return (
      <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
        <h3 className="font-semibold text-ink">Floor settings</h3>
        <div>
          <label
            htmlFor="floor-name"
            className="mb-1 block text-xs font-semibold text-muted"
          >
            Name
          </label>
          <input
            id="floor-name"
            value={floor.name}
            maxLength={100}
            className={inputClass(false)}
            onChange={(event) => onFloorChange({ name: event.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Width"
            value={floor.width}
            min={400}
            max={4000}
            step={50}
            onChange={(width) => onFloorChange({ width })}
          />
          <NumberField
            label="Height"
            value={floor.height}
            min={300}
            max={3000}
            step={50}
            onChange={(height) => onFloorChange({ height })}
          />
        </div>
        <p className="text-xs text-muted">
          Select anything on the map to change its size, angle or label. Scroll
          to zoom and drag the background to move around.
        </p>
        <Button
          variant="ghostDanger"
          className="w-full"
          onClick={onFloorDelete}
        >
          <Trash2 className="size-4" />
          Delete this floor
        </Button>
      </div>
    )
  }

  const bookable = isBookable(item)
  const isWall = item.kind === 'wall'
  const title =
    item.resource?.name ??
    {
      wall: 'Wall',
      door: 'Door',
      window: 'Window',
      label: 'Text label',
      decor: 'Furniture',
    }[item.kind]

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        {bookable && (
          <p className="text-xs text-muted">
            {item.kind === 'room' ? 'Meeting room' : 'Resource'}. Name and
            booking rules come from the admin pages.
          </p>
        )}
      </div>

      {item.kind === 'label' && (
        <div>
          <label
            htmlFor="item-label"
            className="mb-1 block text-xs font-semibold text-muted"
          >
            Text
          </label>
          <input
            id="item-label"
            value={item.label}
            maxLength={100}
            className={inputClass(false)}
            onFocus={onBeginEdit}
            onChange={(event) => onPatch({ label: event.target.value })}
          />
        </div>
      )}

      {item.kind === 'decor' && (
        <div>
          <p className="mb-1 text-xs font-semibold text-muted">Icon</p>
          <ul className="grid grid-cols-6 gap-1.5">
            {DECOR_ICONS.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={item.icon === key}
                  onClick={() => {
                    onBeginEdit()
                    onPatch({ icon: key })
                  }}
                  className={cn(
                    'grid size-8 w-full place-items-center rounded-lg border',
                    item.icon === key
                      ? 'border-brand bg-brand-soft text-brand-ink'
                      : 'border-line text-muted hover:bg-sunken',
                  )}
                >
                  <Icon className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {bookable && (
        <div className="grid grid-cols-2 gap-2">
          {['rect', 'ellipse'].map((shape) => (
            <button
              key={shape}
              type="button"
              aria-pressed={item.shape === shape}
              onClick={() => {
                onBeginEdit()
                onPatch({ shape })
              }}
              className={cn(
                'rounded-lg border px-3 py-2 text-xs font-semibold',
                item.shape === shape
                  ? 'border-brand bg-brand-soft text-brand-ink'
                  : 'border-line text-ink-soft hover:bg-sunken',
              )}
            >
              {shape === 'rect' ? 'Rectangle' : 'Oval'}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label={isWall ? 'Length' : 'Width'}
          value={item.w}
          min={10}
          max={4000}
          onFocus={onBeginEdit}
          onChange={(w) => onPatch({ w })}
        />
        <NumberField
          label={isWall ? 'Thickness' : 'Height'}
          value={item.h}
          min={4}
          max={4000}
          onFocus={onBeginEdit}
          onChange={(h) => onPatch({ h })}
        />
        <NumberField
          label="Angle"
          value={item.rotation}
          min={-360}
          max={360}
          onFocus={onBeginEdit}
          onChange={(rotation) => onPatch({ rotation })}
        />
        <NumberField
          label="X"
          value={item.x}
          onFocus={onBeginEdit}
          onChange={(x) => onPatch({ x })}
        />
        <NumberField
          label="Y"
          value={item.y}
          onFocus={onBeginEdit}
          onChange={(y) => onPatch({ y })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onRotate}>
          <RotateCw className="size-4" />
          Rotate
        </Button>
        {!bookable && (
          <Button variant="secondary" onClick={onDuplicate}>
            <Copy className="size-4" />
            Duplicate
          </Button>
        )}
      </div>

      <Button variant="ghostDanger" className="w-full" onClick={onRemove}>
        <Trash2 className="size-4" />
        {bookable ? 'Remove from floor' : 'Delete'}
      </Button>
    </div>
  )
}

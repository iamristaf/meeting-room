import {
  DoorClosed,
  GripVertical,
  MousePointer2,
  PenLine,
  RectangleHorizontal,
  Type,
} from 'lucide-react'
import { DECOR_ICONS } from '../../utils/floorPlan'
import { resolveAssetKey, resourceAssetMeta } from '../../utils/assets'
import cn from '../../utils/cn'

const toolButton =
  'flex items-center justify-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand'

function Section({ title, children }) {
  return (
    <section className="border-t border-line pt-4 first:border-0 first:pt-0">
      <h3 className="mb-2 text-xs font-semibold text-muted">{title}</h3>
      {children}
    </section>
  )
}

function PlaceableRow({ resource, onAdd }) {
  const Icon =
    resource.type === 'room'
      ? GripVertical
      : resourceAssetMeta(resolveAssetKey(resource)).icon

  return (
    <li>
      <button
        type="button"
        draggable
        onDragStart={(event) =>
          event.dataTransfer.setData(
            'text/plain',
            JSON.stringify({
              kind: resource.type === 'room' ? 'room' : 'resource',
              resource,
            }),
          )
        }
        onClick={() => onAdd(resource)}
        className="flex w-full cursor-grab items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-2 text-left text-sm font-medium text-ink-soft transition-colors hover:border-brand hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand"
      >
        <Icon className="size-4 shrink-0 text-faint" />
        <span className="min-w-0 flex-1 truncate">{resource.name}</span>
        {resource.capacity && (
          <span className="text-xs text-faint">{resource.capacity}</span>
        )}
      </button>
    </li>
  )
}

export default function EditorPalette({
  tool,
  onTool,
  onAddShape,
  rooms,
  equipment,
  onAddResource,
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <Section title="Tools">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onTool('select')}
            className={cn(
              toolButton,
              tool === 'select'
                ? 'border-brand bg-brand-soft text-brand-ink'
                : 'border-line text-ink-soft hover:bg-sunken',
            )}
          >
            <MousePointer2 className="size-4" />
            Select
          </button>
          <button
            type="button"
            onClick={() => onTool('wall')}
            className={cn(
              toolButton,
              tool === 'wall'
                ? 'border-brand bg-brand-soft text-brand-ink'
                : 'border-line text-ink-soft hover:bg-sunken',
            )}
          >
            <PenLine className="size-4" />
            Draw wall
          </button>
          <button
            type="button"
            onClick={() => onAddShape('door')}
            className={cn(
              toolButton,
              'border-line text-ink-soft hover:bg-sunken',
            )}
          >
            <DoorClosed className="size-4" />
            Door
          </button>
          <button
            type="button"
            onClick={() => onAddShape('window')}
            className={cn(
              toolButton,
              'border-line text-ink-soft hover:bg-sunken',
            )}
          >
            <RectangleHorizontal className="size-4" />
            Window
          </button>
          <button
            type="button"
            onClick={() => onAddShape('label')}
            className={cn(
              toolButton,
              'col-span-2 border-line text-ink-soft hover:bg-sunken',
            )}
          >
            <Type className="size-4" />
            Text label
          </button>
        </div>
      </Section>

      <Section title="Furniture and fixtures">
        <ul className="grid grid-cols-5 gap-1.5">
          {DECOR_ICONS.map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <button
                type="button"
                title={label}
                aria-label={`Add ${label}`}
                onClick={() => onAddShape('decor', { icon: key })}
                className="grid size-9 w-full place-items-center rounded-lg border border-line text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-brand"
              >
                <Icon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Meeting rooms to place (${rooms.length})`}>
        {rooms.length ? (
          <ul className="space-y-1.5">
            {rooms.map((room) => (
              <PlaceableRow
                key={room.id}
                resource={room}
                onAdd={onAddResource}
              />
            ))}
          </ul>
        ) : (
          <p className="text-xs text-faint">Every room is on a floor.</p>
        )}
      </Section>

      <Section title={`Resources to place (${equipment.length})`}>
        {equipment.length ? (
          <ul className="space-y-1.5">
            {equipment.map((item) => (
              <PlaceableRow
                key={item.id}
                resource={item}
                onAdd={onAddResource}
              />
            ))}
          </ul>
        ) : (
          <p className="text-xs text-faint">
            Resources built into a room appear inside that room.
          </p>
        )}
      </Section>
    </div>
  )
}

import { CalendarPlus, Clock, Users, X } from 'lucide-react'
import BuiltInChips from '../catalog/BuiltInChips'
import Button from '../ui/Button'
import { STATUS_STYLES } from '../../utils/floorPlan'
import cn from '../../utils/cn'

export default function PlaceCard({
  item,
  status,
  pinned,
  timeLabel,
  past,
  onBook,
  compact,
  onClose,
}) {
  const resource = item.resource
  const state = resource?.isActive ? (status?.state ?? 'free') : 'unavailable'
  const style = STATUS_STYLES[state]
  const canBook = state === 'free' && !past

  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface p-4',
        compact ? 'w-full shadow-xl' : 'w-72 shadow-card',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">
            {item.label || resource?.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
            {resource?.capacity ? (
              <>
                <Users className="size-3.5" />
                Up to {resource.capacity}
              </>
            ) : (
              'Resource'
            )}
          </p>
        </div>
        {pinned && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-7 shrink-0 place-items-center rounded-lg text-muted hover:bg-sunken"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <p
        className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
        style={{ background: style.fill, color: style.stroke }}
      >
        <span
          className="size-2 rounded-full"
          style={{ background: style.stroke }}
        />
        {style.label}
      </p>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <Clock className="size-3.5" />
        {timeLabel}
      </p>

      {status?.bookedBy && (
        <p className="mt-2 text-xs text-ink-soft">
          Booked by {status.bookedBy} until {status.until}
        </p>
      )}

      {status?.note && state !== 'free' && (
        <p className="mt-2 text-xs text-ink-soft">{status.note}</p>
      )}

      {status?.next && (
        <p className="mt-2 text-xs text-muted">
          Next: {status.next.from} to {status.next.to} ({status.next.userName})
        </p>
      )}

      {item.builtIn?.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold text-muted">Comes with</p>
          <BuiltInChips items={item.builtIn} limit={3} />
        </div>
      )}

      {pinned && (
        <Button className="mt-4 w-full" disabled={!canBook} onClick={onBook}>
          <CalendarPlus className="size-4" />
          {past ? 'This time has passed' : 'Book now'}
        </Button>
      )}

      {!pinned && (
        <p className="mt-3 text-xs text-faint">Click to open booking</p>
      )}
    </div>
  )
}

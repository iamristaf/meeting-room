<<<<<<< HEAD
import cn from '../../utils/cn'
=======
>>>>>>> personal/main
import {
  CALENDAR_END_HOUR,
  CALENDAR_START_HOUR,
  HOUR_HEIGHT,
} from '../../utils/constants'
import { formatTimeRange } from '../../utils/dateTime'
<<<<<<< HEAD
import { getDisplayStatus } from '../../utils/booking'
import { BOOKING_STATUS } from '../../utils/constants'
=======
>>>>>>> personal/main

const minuteHeight = HOUR_HEIGHT / 60
const gridStart = CALENDAR_START_HOUR * 60
const gridEnd = CALENDAR_END_HOUR * 60

const minutesOfDay = (value, isEnd = false) => {
  const date = new Date(value)
  return date.getHours() * 60 + date.getMinutes() || (isEnd ? 1440 : 0)
}

const hueFor = (id = '') =>
  [...id].reduce((total, char) => (total * 31 + char.charCodeAt(0)) % 360, 7)

export default function BookingBlock({ item, label, onSelect }) {
  const { booking, lane, laneCount } = item
  const start = Math.max(minutesOfDay(booking.startTime), gridStart)
  const end = Math.min(minutesOfDay(booking.endTime, true), gridEnd)
  if (end <= start) return null

  const widthPercent = 100 / laneCount
<<<<<<< HEAD
  const status = getDisplayStatus(booking)
  const cancelled = status === BOOKING_STATUS.cancelled
  const completed = status === BOOKING_STATUS.completed
=======
>>>>>>> personal/main

  return (
    <button
      type="button"
      onClick={() => onSelect(booking)}
<<<<<<< HEAD
      className={cn(
        'absolute box-border overflow-hidden event-block rounded-md border px-1.5 py-1 text-left text-xs transition-shadow hover:shadow-card focus-visible:outline-2 focus-visible:outline-brand',
        completed && 'opacity-70',
        cancelled && 'border-dashed opacity-50',
      )}
=======
      className="absolute box-border overflow-hidden event-block rounded-md border px-1.5 py-1 text-left text-xs transition-shadow hover:shadow-card focus-visible:outline-2 focus-visible:outline-brand"
>>>>>>> personal/main
      style={{
        '--hue': hueFor(booking.resourceId),
        top: (start - gridStart) * minuteHeight + 1,
        height: Math.max((end - start) * minuteHeight - 2, 20),
        left: `calc(${lane * widthPercent}% + 2px)`,
        width: `calc(${widthPercent}% - 4px)`,
      }}
    >
<<<<<<< HEAD
      <span
        className={cn('block truncate font-bold', cancelled && 'line-through')}
      >
        {label}
      </span>
=======
      <span className="block truncate font-bold">{label}</span>
>>>>>>> personal/main
      <span className="block truncate opacity-80">
        {formatTimeRange(booking.startTime, booking.endTime)}
      </span>
    </button>
  )
}

import { listBusyForResources } from '../models/bookingModel.js'
import { getHoursForDay } from '../models/resourceModel.js'
import {
  dayOfWeekFor,
  formatMinutes,
  minutesOnDay,
  shiftDateKey,
  timeToMinutes,
  zonedTimeToUtc,
} from '../utils/time.js'

const BOOKABLE_KINDS = ['room', 'resource']

export async function getFloorStatuses(user, floorItems, resourcesById, query) {
  const { date, time, duration } = query
  const startMinutes = timeToMinutes(time)
  const endMinutes = startMinutes + duration
  const start = zonedTimeToUtc(date, startMinutes)
  const end = new Date(start.getTime() + duration * 60000)
  const dayEnd = zonedTimeToUtc(shiftDateKey(date, 1), 0)

  const ids = [
    ...new Set(
      floorItems
        .filter((item) => BOOKABLE_KINDS.includes(item.kind))
        .map((item) => item.resourceId),
    ),
  ]

  if (!ids.length) {
    return {}
  }

  const rows = await listBusyForResources(ids, start, dayEnd)
  const statuses = {}

  for (const id of ids) {
    const resource = resourcesById.get(id)

    if (!resource) {
      continue
    }

    if (!resource.isActive) {
      statuses[id] = {
        state: 'unavailable',
        note: 'Not available for booking',
      }
      continue
    }

    const hours = await getHoursForDay(id, dayOfWeekFor(date))
    const closed =
      !hours?.isOpen ||
      startMinutes < timeToMinutes(hours.openTime) ||
      endMinutes > timeToMinutes(hours.closeTime)

    if (closed) {
      statuses[id] = {
        state: 'closed',
        note: hours?.isOpen
          ? `Open ${formatMinutes(timeToMinutes(hours.openTime))} to ${formatMinutes(timeToMinutes(hours.closeTime))}`
          : 'Closed on this day',
      }
      continue
    }

    const mine = rows.filter((row) => row.resource_id === id)
    const current = mine.find(
      (row) => new Date(row.start_time) < end && new Date(row.end_time) > start,
    )

    const later = mine.find((row) => new Date(row.start_time) >= end)

    const next = later
      ? {
          from: formatMinutes(minutesOnDay(new Date(later.start_time), date)),
          to: formatMinutes(
            minutesOnDay(new Date(later.end_time), date, { isEnd: true }) ||
              1440,
          ),
          userName: later.user_name,
        }
      : null

    if (current) {
      statuses[id] = {
        state: current.user_id === user.id ? 'mine' : 'booked',
        bookedBy: current.user_name,
        until: formatMinutes(
          minutesOnDay(new Date(current.end_time), date, { isEnd: true }) ||
            1440,
        ),
        next,
      }
      continue
    }

    statuses[id] = { state: 'free', next }
  }

  return statuses
}

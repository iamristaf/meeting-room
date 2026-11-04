import { randomBytes } from 'node:crypto'
import {
  findBookingRow,
  listUserBookings,
  presentCalendar,
} from '../models/bookingModel.js'
import {
  findUserByCalendarToken,
  getCalendarToken,
  saveCalendarToken,
} from '../models/userModel.js'
import { bookingToEvent, buildCalendar } from '../utils/ics.js'
import { forbidden, notFound } from '../utils/httpError.js'

const DAY = 24 * 60 * 60 * 1000

const newToken = () => randomBytes(24).toString('hex')

const feedUrl = (req, token) =>
  `${req.protocol}://${req.get('host')}/api/calendar/feed/${token}.ics`

const sendCalendar = (res, body, filename, disposition = 'inline') => {
  res
    .set({
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `${disposition}; filename="${filename}"`,
      'Cache-Control': 'private, max-age=300',
    })
    .send(body)
}

export async function feedLink(req, res) {
  let token = await getCalendarToken(req.user.id)

  if (!token) {
    token = newToken()
    await saveCalendarToken(req.user.id, token)
  }

  res.json({ url: feedUrl(req, token) })
}

export async function resetFeedLink(req, res) {
  const token = newToken()
  await saveCalendarToken(req.user.id, token)
  res.json({ url: feedUrl(req, token) })
}

export async function feed(req, res) {
  const token = req.params.file.replace(/\.ics$/, '')
  const user = await findUserByCalendarToken(token)

  if (!user) {
    throw notFound('Calendar not found')
  }

  const cutoff = Date.now() - 60 * DAY
  const rows = (await listUserBookings(user.id)).filter(
    (row) => row.status === 'confirmed' && new Date(row.end_time) > cutoff,
  )
  const bookings = await presentCalendar(rows, {
    id: user.id,
    role: 'employee',
  })

  sendCalendar(
    res,
    buildCalendar(bookings.map(bookingToEvent), {
      name: 'RoomBook bookings',
      feed: true,
    }),
    'roombook.ics',
  )
}

export async function bookingFile(req, res) {
  const row = await findBookingRow(req.params.id)

  if (!row || row.parent_booking_id || row.status !== 'confirmed') {
    throw notFound('Booking not found')
  }

  if (row.user_id !== req.user.id && req.user.role !== 'admin') {
    throw forbidden('You can only export your own bookings')
  }

  const [booking] = await presentCalendar([row], req.user)

  sendCalendar(
    res,
    buildCalendar([bookingToEvent(booking)], { name: booking.resourceName }),
    'booking.ics',
    'attachment',
  )
}

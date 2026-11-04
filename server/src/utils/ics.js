const pad = (value) => String(value).padStart(2, '0')

const formatUtc = (value) => {
  const date = new Date(value)
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

const escapeText = (text) =>
  String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

const fold = (line) => {
  const bytes = Buffer.from(line, 'utf8')

  if (bytes.length <= 75) {
    return line
  }

  const parts = []
  let current = ''
  let size = 0

  for (const char of line) {
    const width = Buffer.byteLength(char, 'utf8')
    const limit = parts.length ? 74 : 75

    if (size + width > limit) {
      parts.push(current)
      current = ''
      size = 0
    }

    current += char
    size += width
  }

  parts.push(current)
  return parts.join('\r\n ')
}

export function bookingToEvent(booking) {
  const includes = [
    ...(booking.builtIn ?? []).map((item) => item.name),
    ...(booking.addOns ?? []).map((item) => item.name),
  ]

  const description = [
    booking.purpose && `Purpose: ${booking.purpose}`,
    includes.length && `Includes: ${includes.join(', ')}`,
    'Booked with RoomBook',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    uid: `${booking.id}@roombook`,
    start: booking.startTime,
    end: booking.endTime,
    summary: booking.purpose
      ? `${booking.resourceName}: ${booking.purpose}`
      : booking.resourceName,
    location: booking.resourceName,
    description,
  }
}

export function buildCalendar(
  events,
  { name = 'RoomBook', feed = false } = {},
) {
  const stamp = formatUtc(new Date())

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RoomBook//Bookings//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(name)}`,
  ]

  if (feed) {
    lines.push('REFRESH-INTERVAL;VALUE=DURATION:PT1H', 'X-PUBLISHED-TTL:PT1H')
  }

  for (const event of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${formatUtc(event.start)}`,
      `DTEND:${formatUtc(event.end)}`,
      `SUMMARY:${escapeText(event.summary)}`,
      `LOCATION:${escapeText(event.location)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')
  return `${lines.map(fold).join('\r\n')}\r\n`
}

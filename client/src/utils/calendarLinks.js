const pad = (value) => String(value).padStart(2, '0')

const compactUtc = (value) => {
  const date = new Date(value)
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

const detailsFor = (booking) => {
  const includes = [...(booking.builtIn ?? []), ...(booking.addOns ?? [])].map(
    (item) => item.name,
  )

  return [
    booking.purpose && `Purpose: ${booking.purpose}`,
    includes.length > 0 && `Includes: ${includes.join(', ')}`,
    'Booked with RoomBook',
  ]
    .filter(Boolean)
    .join('\n')
}

const titleFor = (booking) =>
  booking.purpose
    ? `${booking.resourceName}: ${booking.purpose}`
    : booking.resourceName

export const googleEventUrl = (booking) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: titleFor(booking),
    dates: `${compactUtc(booking.startTime)}/${compactUtc(booking.endTime)}`,
    details: detailsFor(booking),
    location: booking.resourceName,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

const outlookEventUrl = (host, booking) => {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: titleFor(booking),
    startdt: new Date(booking.startTime).toISOString(),
    enddt: new Date(booking.endTime).toISOString(),
    body: detailsFor(booking),
    location: booking.resourceName,
  })
  return `https://${host}/calendar/0/deeplink/compose?${params}`
}

export const outlookComEventUrl = (booking) =>
  outlookEventUrl('outlook.live.com', booking)

export const microsoft365EventUrl = (booking) =>
  outlookEventUrl('outlook.office.com', booking)

export const feedSubscribeLinks = (url) => {
  const webcal = url.replace(/^https?:/, 'webcal:')
  const encoded = encodeURIComponent(url)
  const name = encodeURIComponent('RoomBook')

  return {
    apple: webcal,
    google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`,
    outlookCom: `https://outlook.live.com/calendar/0/addfromweb?url=${encoded}&name=${name}`,
    microsoft365: `https://outlook.office.com/calendar/0/addfromweb?url=${encoded}&name=${name}`,
  }
}

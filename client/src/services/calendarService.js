import api, { unwrap } from './api'

const calendarService = {
  getLink: () => unwrap(api.get('/calendar/link')),
  resetLink: () => unwrap(api.post('/calendar/link/reset')),
  downloadBooking: async (id, name = 'booking') => {
    const response = await api.get(`/bookings/${id}/ics`, {
      responseType: 'blob',
    })
    const href = URL.createObjectURL(response.data)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = `${name.replace(/[^\w-]+/g, '-')}.ics`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(href)
  },
}

export default calendarService

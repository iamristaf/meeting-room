import api, { unwrap } from './api'

const floorService = {
  list: () => unwrap(api.get('/floors')),
  status: ({ date, time, duration }) =>
    unwrap(api.get('/floors/status', { params: { date, time, duration } })),
  create: (values) => unwrap(api.post('/floors', values)),
  update: (id, values) => unwrap(api.put(`/floors/${id}`, values)),
  remove: (id) => unwrap(api.delete(`/floors/${id}`)),
  saveLayout: (id, items) => unwrap(api.put(`/floors/${id}/layout`, { items })),
}

export default floorService

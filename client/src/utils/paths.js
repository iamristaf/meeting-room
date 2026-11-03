export const catalogPath = (type) => (type === 'room' ? '/rooms' : '/resources')

export const bookPath = (resource, query = '') =>
  `${catalogPath(resource.type ?? resource.resourceType)}/${resource.id ?? resource.resourceId}/book${query ? `?${query}` : ''}`

export const homePath = (user) => (user?.role === 'admin' ? '/admin' : '/rooms')

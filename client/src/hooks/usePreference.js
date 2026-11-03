import { useCallback, useState } from 'react'

const PREFIX = 'roombook_'

export const readPreference = (key, fallback) => {
  try {
    const stored = localStorage.getItem(PREFIX + key)
    return stored === null ? fallback : JSON.parse(stored)
  } catch {
    return fallback
  }
}

export default function usePreference(key, fallback) {
  const [value, setValue] = useState(() => readPreference(key, fallback))

  const update = useCallback(
    (next) => {
      setValue(next)
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(next))
      } catch {
        return
      }
    },
    [key],
  )

  return [value, update]
}

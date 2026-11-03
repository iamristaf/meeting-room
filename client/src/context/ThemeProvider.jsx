import { useCallback, useEffect, useMemo, useState } from 'react'
import ThemeContext from './ThemeContext'

const THEME_KEY = 'roombook_theme'

const readInitialTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
  } catch {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0b0e1c' : '#3f4fe0')
  }, [theme])

  const chooseTheme = useCallback((next) => {
    const root = document.documentElement
    root.classList.add('theme-switching')
    window.setTimeout(() => root.classList.remove('theme-switching'), 350)
    setTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      return
    }
  }, [])

  const toggleTheme = useCallback(
    () => chooseTheme(theme === 'dark' ? 'light' : 'dark'),
    [chooseTheme, theme],
  )

  const value = useMemo(
    () => ({ theme, setTheme: chooseTheme, toggleTheme }),
    [theme, chooseTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

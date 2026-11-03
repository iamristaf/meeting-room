import { Moon, Sun } from 'lucide-react'
import useTheme from '../../hooks/useTheme'
import cn from '../../utils/cn'

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to day theme' : 'Switch to night theme'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface transition-all hover:bg-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-90',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute size-5 text-amber transition-all duration-300',
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100',
        )}
      />
      <Moon
        className={cn(
          'absolute size-5 text-violet transition-all duration-300',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  )
}

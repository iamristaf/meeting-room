import { useCallback, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import useClickOutside from '../../hooks/useClickOutside'
import cn from '../../utils/cn'

export default function Dropdown({
  label,
  icon: Icon,
  active,
  children,
  align = 'left',
  buttonContent,
  buttonClassName,
  hideChevronOnMobile = false,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])

  useClickOutside(ref, close, open)

  return (
    <div
      ref={ref}
      className="relative"
      onClick={(event) =>
        event.target.closest('a,button[data-close]') && close()
      }
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand',
          active || open
            ? 'bg-brand-soft text-brand-ink'
            : 'text-muted hover:bg-sunken hover:text-ink',
          buttonClassName,
        )}
      >
        {buttonContent ?? (
          <>
            {Icon && <Icon className="size-4" />}
            {label}
          </>
        )}
        <ChevronDown
          className={cn(
            'size-4 transition-transform duration-200',
            open && 'rotate-180',
            hideChevronOnMobile && 'hidden sm:block',
          )}
        />
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-40 mt-2 w-64 origin-top animate-pop rounded-xl border border-line bg-surface p-1.5 shadow-xl',
            align === 'right'
              ? 'right-0 origin-top-right'
              : 'left-0 origin-top-left',
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

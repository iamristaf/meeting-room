import { Link, NavLink } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'
import useAuth from '../../hooks/useAuth'
import { homePath } from '../../utils/paths'
import { memberLinks } from '../../utils/navigation'
import cn from '../../utils/cn'

const linkClass = ({ isActive }) =>
  cn(
    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200',
    isActive
      ? 'bg-brand-soft text-brand-ink'
      : 'text-muted hover:bg-sunken hover:text-ink',
  )

const tabClass = ({ isActive }) =>
  cn(
    'relative flex flex-1 items-center justify-center py-3 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand',
    isActive ? 'text-brand-ink' : 'text-muted hover:text-ink',
  )

export default function Navbar() {
  const { user } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Link
            to={homePath(user)}
            className="mr-2 rounded-lg focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="RoomBook home"
          >
            <Logo />
          </Link>

          <nav
            className="hidden flex-1 items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {memberLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <AccountMenu />
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Main"
      >
        {memberLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={tabClass}
            aria-label={label}
            title={label}
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute inset-x-6 top-0 h-0.5 rounded-full bg-brand transition-all duration-200',
                    isActive ? 'opacity-100' : 'scale-x-0 opacity-0',
                  )}
                />
                <Icon
                  className={cn(
                    'size-6 transition-transform duration-200',
                    isActive && '-translate-y-0.5 scale-110',
                  )}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

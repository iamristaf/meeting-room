import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarPlus,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react'
import AccountMenu from './AccountMenu'
import Sidebar from './Sidebar'
import ThemeToggle from '../ui/ThemeToggle'
import Logo from '../ui/Logo'
import usePreference from '../../hooks/usePreference'
import cn from '../../utils/cn'

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = usePreference('sidebarCollapsed', false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!drawerOpen) {
      return undefined
    }

    const closeOnEscape = (event) =>
      event.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className="min-h-screen">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-line bg-surface transition-[width] duration-300 lg:block',
          collapsed ? 'w-[4.5rem]' : 'w-64',
        )}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeDrawer}
            className="absolute inset-0 animate-fade bg-[#0b0e1c]/60 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-slide-in bg-surface shadow-2xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeDrawer}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-muted hover:bg-sunken hover:text-ink"
            >
              <X className="size-5" />
            </button>
            <Sidebar onNavigate={closeDrawer} />
          </aside>
        </div>
      )}

      <div
        className={cn(
          'transition-[padding] duration-300',
          collapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64',
        )}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="grid size-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-sunken lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden size-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-sunken lg:grid"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </button>
          <span className="lg:hidden">
            <Logo markClassName="size-8" textClassName="text-lg" />
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/rooms"
              aria-label="New booking"
              title="New booking"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-3 text-sm font-semibold text-white dark:text-[#0b0e1c] transition-all hover:bg-brand-strong active:scale-95 sm:px-4"
            >
              <CalendarPlus className="size-4" />
              <span className="hidden sm:inline">New booking</span>
            </Link>
            <ThemeToggle />
            <AccountMenu />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

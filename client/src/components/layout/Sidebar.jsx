import { NavLink } from 'react-router-dom'
import Logo, { LogoMark } from '../ui/Logo'
import { adminSections } from '../../utils/navigation'
import cn from '../../utils/cn'

export default function Sidebar({ collapsed = false, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-line',
          collapsed ? 'justify-center' : 'px-5',
        )}
      >
        {collapsed ? <LogoMark className="size-9" /> : <Logo />}
      </div>

      <nav
        className="flex-1 space-y-5 overflow-y-auto px-3 py-4"
        aria-label="Dashboard"
      >
        {adminSections.map((section) => (
          <div key={section.title}>
            {collapsed ? (
              <span className="mx-3 mb-2 block h-px bg-line" />
            ) : (
              <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-faint">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.links.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    aria-label={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200',
                        collapsed ? 'justify-center px-0' : 'px-3',
                        isActive
                          ? 'bg-brand-soft text-brand-ink'
                          : 'text-muted hover:bg-sunken hover:text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand transition-all duration-200',
                            isActive ? 'opacity-100' : 'scale-y-0 opacity-0',
                          )}
                        />
                        <Icon className="size-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        {!collapsed && (
                          <span className="truncate">{label}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  Moon,
  PanelLeft,
  SlidersHorizontal,
  Sun,
  UserRound,
  Users,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Avatar from '../components/ui/Avatar'
import StatusBadge from '../components/ui/StatusBadge'
import ToggleSwitch from '../components/ui/ToggleSwitch'
import useAuth from '../hooks/useAuth'
import usePreference from '../hooks/usePreference'
import useTheme from '../hooks/useTheme'
import cn from '../utils/cn'

const themeOptions = [
  { value: 'light', label: 'Day', icon: Sun },
  { value: 'dark', label: 'Night', icon: Moon },
]

const viewOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const adminShortcuts = [
  {
    to: '/admin/hours',
    label: 'Operating hours',
    text: 'Set when rooms and resources can be booked',
    icon: Clock,
  },
  {
    to: '/admin/restrictions',
    label: 'Booking restrictions',
    text: 'Control durations, steps and how far ahead people book',
    icon: SlidersHorizontal,
  },
  {
    to: '/admin/employees',
    label: 'Employees',
    text: 'Add people, reset passwords and manage access',
    icon: Users,
  },
]

function Section({ title, text, children }) {
  return (
    <section className="animate-rise rounded-2xl border border-line bg-surface p-5 shadow-card">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      {text && <p className="mt-0.5 text-sm text-muted">{text}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Choice({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95',
        active
          ? 'border-brand bg-brand-soft text-brand-ink'
          : 'border-line text-muted hover:border-line-strong hover:text-ink',
      )}
    >
      {Icon && <Icon className="size-4" />}
      {children}
    </button>
  )
}

export default function Settings() {
  const { user, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()
  const [calendarView, setCalendarView] = usePreference('calendarView', 'day')
  const [sidebarCollapsed, setSidebarCollapsed] = usePreference(
    'sidebarCollapsed',
    false,
  )

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Choose how RoomBook looks and behaves for you"
      />

      <div className="mx-auto grid max-w-3xl gap-6">
        <Section title="Account">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={user.name} className="size-14 text-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{user.name}</p>
              <p className="truncate text-sm text-muted">{user.email}</p>
              <div className="mt-1.5">
                <StatusBadge status={user.role} />
              </div>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-sunken"
            >
              <UserRound className="size-4" />
              Edit profile and password
            </Link>
          </div>
        </Section>

        <Section
          title="Appearance"
          text="Pick a day or night look for the whole app"
        >
          <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
            {themeOptions.map(({ value, label, icon }) => (
              <Choice
                key={value}
                icon={icon}
                active={theme === value}
                onClick={() => setTheme(value)}
              >
                {label}
              </Choice>
            ))}
          </div>
        </Section>

        <Section title="Preferences">
          <div className="space-y-5">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <CalendarDays className="size-4 text-muted" />
                Calendar opens in
              </p>
              <div className="mt-2 grid grid-cols-3 gap-3 sm:max-w-sm">
                {viewOptions.map(({ value, label }) => (
                  <Choice
                    key={value}
                    active={calendarView === value}
                    onClick={() => setCalendarView(value)}
                  >
                    {label}
                  </Choice>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <PanelLeft className="size-4 text-muted" />
                    Compact sidebar
                  </p>
                  <p className="text-sm text-muted">
                    Show only icons in the dashboard menu on large screens
                  </p>
                </div>
                <ToggleSwitch
                  checked={sidebarCollapsed}
                  onChange={setSidebarCollapsed}
                  label="Compact sidebar"
                />
              </div>
            )}
          </div>
        </Section>

        {isAdmin && (
          <Section
            title="Workspace"
            text="Rules that apply to everyone in your organisation"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {adminShortcuts.map(({ to, label, text, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group rounded-xl border border-line p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand-ink transition-transform duration-200 group-hover:scale-110">
                    <Icon className="size-4" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
                  <p className="mt-0.5 text-xs text-muted">{text}</p>
                </Link>
              ))}
            </div>
          </Section>
        )}
      </div>
    </>
  )
}

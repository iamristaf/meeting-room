import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  KeyRound,
  Package,
  UserPlus,
  Users,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import StatusBadge from '../../components/ui/StatusBadge'
import useAuth from '../../hooks/useAuth'
import useFetch from '../../hooks/useFetch'
import bookingService from '../../services/bookingService'
import resourceService from '../../services/resourceService'
import userService from '../../services/userService'
import { getDisplayStatus } from '../../utils/booking'
import { BOOKING_STATUS } from '../../utils/constants'
import {
  formatDuration,
  formatLongDate,
  formatTimeRange,
  minutesBetween,
  todayValue,
} from '../../utils/dateTime'
import cn from '../../utils/cn'

const tones = {
  brand: 'bg-brand-soft text-brand-ink',
  teal: 'bg-teal-soft text-teal-ink',
  amber: 'bg-amber-soft text-amber-ink',
  violet: 'bg-violet-soft text-violet-ink',
  rose: 'bg-rose-soft text-rose-ink',
  sky: 'bg-sky-soft text-sky-ink',
}

const greetingFor = (hour) => {
  if (hour < 12) {
    return 'Good morning'
  }
  if (hour < 17) {
    return 'Good afternoon'
  }
  return 'Good evening'
}

function StatCard({ icon: Icon, label, value, hint, to, tone, index }) {
  return (
    <Link
      to={to}
      style={{ animationDelay: `${index * 50}ms` }}
      className="group animate-rise rounded-2xl border border-line bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'grid size-10 place-items-center rounded-xl',
            tones[tone],
          )}
        >
          <Icon className="size-5" />
        </span>
        <ArrowRight className="size-4 text-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" />
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-ink">
        {value ?? '-'}
      </p>
      <p className="text-sm font-semibold text-ink-soft">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </Link>
  )
}

function Panel({ title, action, children, className }) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-line bg-surface p-5 shadow-card',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

const quickActions = [
  { to: '/rooms', label: 'Book a room', icon: CalendarPlus, tone: 'brand' },
  { to: '/resources', label: 'Book a resource', icon: Package, tone: 'teal' },
  {
    to: '/admin/employees',
    label: 'Add employee',
    icon: UserPlus,
    tone: 'violet',
  },
  { to: '/admin/rooms', label: 'Add a room', icon: Building2, tone: 'amber' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const today = todayValue()
  const [now] = useState(() => new Date())

  const loadToday = useCallback(
    () => bookingService.listAll({ date: today }),
    [today],
  )
  const loadUpcoming = useCallback(
    () => bookingService.listAll({ status: BOOKING_STATUS.confirmed }),
    [],
  )
  const loadAttention = useCallback(
    () => bookingService.listAll({ needsAttention: 'true' }),
    [],
  )
  const loadUsers = useCallback(() => userService.list(), [])

  const { data: todayBookings } = useFetch(loadToday)
  const { data: upcoming } = useFetch(loadUpcoming)
  const { data: attention } = useFetch(loadAttention)
  const { data: resources } = useFetch(resourceService.listAll)
  const { data: users } = useFetch(loadUsers)
  const { data: resetRequests } = useFetch(userService.listResetRequests)

  const schedule = useMemo(
    () =>
      (todayBookings ?? [])
        .filter((booking) => booking.status !== BOOKING_STATUS.cancelled)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [todayBookings],
  )

  const usage = useMemo(() => {
    const totals = new Map()
    schedule.forEach((booking) => {
      const minutes = minutesBetween(
        new Date(booking.startTime),
        new Date(booking.endTime),
      )
      totals.set(
        booking.resourceName,
        (totals.get(booking.resourceName) ?? 0) + minutes,
      )
    })
    const rows = [...totals.entries()]
      .map(([name, minutes]) => ({ name, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5)
    const busiest = rows[0]?.minutes ?? 1
    return rows.map((row) => ({ ...row, share: (row.minutes / busiest) * 100 }))
  }, [schedule])

  const activeResources = (resources ?? []).filter((item) => item.isActive)
  const roomCount = activeResources.filter(
    (item) => item.type === 'room',
  ).length
  const resourceCount = activeResources.length - roomCount
  const activeUsers = (users ?? []).filter((item) => item.isActive).length
  const resetCount = resetRequests?.length ?? 0
  const attentionCount = attention?.length ?? 0
  const firstName = user.name.split(' ')[0]

  const stats = [
    {
      icon: CalendarCheck,
      label: 'Bookings today',
      value: todayBookings ? schedule.length : null,
      hint: 'Excluding cancelled',
      to: '/admin/bookings',
      tone: 'brand',
    },
    {
      icon: CalendarClock,
      label: 'Upcoming bookings',
      value: upcoming?.length,
      hint: 'Confirmed and still ahead',
      to: '/admin/bookings',
      tone: 'sky',
    },
    {
      icon: Building2,
      label: 'Active rooms',
      value: resources ? roomCount : null,
      hint: 'Open for booking',
      to: '/admin/rooms',
      tone: 'teal',
    },
    {
      icon: Package,
      label: 'Active resources',
      value: resources ? resourceCount : null,
      hint: 'Projectors, boards and more',
      to: '/admin/resources',
      tone: 'amber',
    },
    {
      icon: Users,
      label: 'Active employees',
      value: users ? activeUsers : null,
      hint: `${users?.length ?? 0} accounts in total`,
      to: '/admin/employees',
      tone: 'violet',
    },
  ]

  return (
    <>
      <PageHeader
        title={`${greetingFor(now.getHours())}, ${firstName}`}
        subtitle={`${formatLongDate(now)} - here is how your workspace looks today`}
      />

      {(attentionCount > 0 || resetCount > 0) && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {attentionCount > 0 && (
            <Link
              to="/admin/bookings?attention=1"
              className="flex animate-rise items-center gap-3 rounded-2xl border border-amber/40 bg-amber-soft p-4 text-amber-ink transition-transform hover:-translate-y-0.5"
            >
              <AlertTriangle className="size-5 shrink-0" />
              <span className="text-sm font-semibold">
                {attentionCount}{' '}
                {attentionCount === 1 ? 'booking needs' : 'bookings need'}{' '}
                attention
              </span>
              <ArrowRight className="ml-auto size-4" />
            </Link>
          )}
          {resetCount > 0 && (
            <Link
              to="/admin/employees"
              className="flex animate-rise items-center gap-3 rounded-2xl border border-violet/40 bg-violet-soft p-4 text-violet-ink transition-transform hover:-translate-y-0.5"
            >
              <KeyRound className="size-5 shrink-0" />
              <span className="text-sm font-semibold">
                {resetCount} password reset{' '}
                {resetCount === 1 ? 'request' : 'requests'} waiting
              </span>
              <ArrowRight className="ml-auto size-4" />
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} index={index} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="Today's schedule"
          className="xl:col-span-2"
          action={
            <Link
              to="/calendar"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Open calendar
            </Link>
          }
        >
          {!todayBookings ? (
            <p className="py-8 text-center text-sm text-muted">Loading</p>
          ) : schedule.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="Nothing booked today"
              text="Rooms and resources are all free."
            />
          ) : (
            <ul className="divide-y divide-line">
              {schedule.slice(0, 8).map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3"
                >
                  <span className="w-28 shrink-0 text-sm font-bold tabular-nums text-ink">
                    {formatTimeRange(booking.startTime, booking.endTime)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {booking.resourceName}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {booking.purpose || 'No purpose added'} -{' '}
                      {booking.userName}
                    </p>
                  </div>
                  <StatusBadge status={getDisplayStatus(booking)} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Quick actions">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ to, label, icon: Icon, tone }) => (
                <Link
                  key={to + label}
                  to={to}
                  className="group flex flex-col items-start gap-3 rounded-xl border border-line p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card"
                >
                  <span
                    className={cn(
                      'grid size-9 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-110',
                      tones[tone],
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Busiest today">
            {usage.length === 0 ? (
              <p className="text-sm text-muted">No bookings to measure yet.</p>
            ) : (
              <ul className="space-y-3">
                {usage.map((row) => (
                  <li key={row.name}>
                    <div className="mb-1 flex justify-between gap-3 text-sm">
                      <span className="truncate font-semibold text-ink">
                        {row.name}
                      </span>
                      <span className="shrink-0 text-muted">
                        {formatDuration(row.minutes)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-sunken">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-700"
                        style={{ width: `${row.share}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}

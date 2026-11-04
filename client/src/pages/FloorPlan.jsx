import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layers, Map as MapIcon, PencilRuler } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import QueryState from '../components/ui/QueryState'
import EmptyState from '../components/ui/EmptyState'
import SelectField from '../components/ui/SelectField'
import TextField from '../components/ui/TextField'
import FloorCanvas from '../components/floor/FloorCanvas'
import PlaceCard from '../components/floor/PlaceCard'
import useAuth from '../hooks/useAuth'
import useFetch from '../hooks/useFetch'
import floorService from '../services/floorService'
import { STATUS_STYLES } from '../utils/floorPlan'
import { minutesToTime } from '../utils/dateTime'
import { bookPath } from '../utils/paths'
import cn from '../utils/cn'

const TIMES = Array.from({ length: 48 }, (_, index) => {
  const value = minutesToTime(index * 30)
  return { value, label: value }
})

const DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
]

const LEGEND = ['free', 'booked', 'mine', 'closed']

const nextHalfHour = (minutes) =>
  Math.min(1410, Math.ceil((minutes + 1) / 30) * 30)

const formatRange = (date, time, duration) => {
  const [hours, minutes] = time.split(':').map(Number)
  const end = hours * 60 + minutes + duration
  const label = new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  return `${label}, ${time} to ${minutesToTime(Math.min(end, 1439))}`
}

function FloorMap({ meta, floors }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [floorId, setFloorId] = useState(floors[0].id)
  const [date, setDate] = useState(meta.today)
  const [time, setTime] = useState(minutesToTime(nextHalfHour(meta.nowMinutes)))
  const [duration, setDuration] = useState(60)
  const [pinnedId, setPinnedId] = useState(null)

  const floor = floors.find((entry) => entry.id === floorId) ?? floors[0]

  const loadStatus = useCallback(
    () => floorService.status({ date, time, duration }),
    [date, time, duration],
  )
  const { data: statuses, error } = useFetch(loadStatus)

  const past = useMemo(() => {
    if (date < meta.today) {
      return true
    }

    const [hours, minutes] = time.split(':').map(Number)
    return date === meta.today && hours * 60 + minutes < meta.nowMinutes
  }, [date, time, meta])

  const timeLabel = formatRange(date, time, duration)
  const items = useMemo(() => floor.items, [floor])

  const book = (item) =>
    navigate(
      bookPath(
        item.resource,
        `date=${date}&start=${time}&duration=${duration}`,
      ),
    )

  const handleSelect = (id) => {
    const item = items.find((entry) => entry.id === id)
    setPinnedId(item?.resourceId ? id : null)
  }

  return (
    <>
      <PageHeader
        title="Floor plan"
        subtitle="Pick a room or resource on the map to book it"
      >
        {user.role === 'admin' && (
          <Link
            to="/admin/floor-plan"
            className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-sunken"
          >
            <PencilRuler className="size-4" />
            Edit floor plan
          </Link>
        )}
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-line bg-surface p-3 shadow-card sm:gap-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-4">
        <TextField
          label="Date"
          className="col-span-2 sm:col-span-1"
          type="date"
          value={date}
          min={meta.today}
          onChange={(event) =>
            event.target.value && setDate(event.target.value)
          }
        />
        <SelectField
          label="Start"
          value={time}
          options={TIMES}
          onChange={(event) => setTime(event.target.value)}
        />
        <SelectField
          label="Length"
          value={duration}
          options={DURATIONS}
          onChange={(event) => setDuration(Number(event.target.value))}
        />
        <ul className="col-span-2 flex flex-wrap content-end items-end gap-x-4 gap-y-1.5 text-xs font-semibold text-muted sm:col-span-3 lg:col-span-1 lg:pb-2.5">
          {LEGEND.map((key) => (
            <li key={key} className="inline-flex items-center gap-1.5">
              <span
                className="size-3 rounded-sm border-2"
                style={{
                  background: STATUS_STYLES[key].fill,
                  borderColor: STATUS_STYLES[key].stroke,
                }}
              />
              {STATUS_STYLES[key].label}
            </li>
          ))}
        </ul>
      </div>

      {floors.length > 1 && (
        <div
          className="mb-3 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Floors"
        >
          {floors.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={entry.id === floor.id}
              onClick={() => {
                setFloorId(entry.id)
                setPinnedId(null)
              }}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand',
                entry.id === floor.id
                  ? 'bg-brand text-white dark:text-[#0b0e1c]'
                  : 'bg-surface text-muted hover:bg-sunken hover:text-ink',
              )}
            >
              <Layers className="size-4" />
              {entry.name}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-3 rounded-lg bg-rose-soft px-3 py-2 text-sm text-rose-ink">
          {error}
        </p>
      )}

      <div
        className="aspect-(--floor-ratio) max-h-[75vh] w-full lg:aspect-auto lg:h-[calc(100vh-22rem)] lg:max-h-none lg:min-h-[360px]"
        style={{
          '--floor-ratio': `${floor.width + 24} / ${floor.height + 24}`,
        }}
      >
        <FloorCanvas
          key={floor.id}
          floor={floor}
          items={items}
          statuses={statuses ?? {}}
          mode="view"
          pinnedId={pinnedId}
          onSelect={handleSelect}
          renderOverlay={(item, pinned, compact) => (
            <PlaceCard
              item={item}
              status={statuses?.[item.resourceId]}
              pinned={pinned}
              compact={compact}
              timeLabel={timeLabel}
              past={past}
              onBook={() => book(item)}
              onClose={() => setPinnedId(null)}
            />
          )}
        />
      </div>
    </>
  )
}

export default function FloorPlan() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useFetch(floorService.list)

  return (
    <QueryState loading={loading} error={error} onRetry={reload}>
      {data && data.floors.length > 0 && (
        <FloorMap meta={data} floors={data.floors} />
      )}
      {data && data.floors.length === 0 && (
        <>
          <PageHeader title="Floor plan" />
          <EmptyState
            icon={MapIcon}
            title="No floor plan yet"
            text={
              user.role === 'admin'
                ? 'Draw your office, then place rooms and resources on it so people can book from the map.'
                : 'Your admin has not drawn the office yet. You can still book from Meeting rooms and Resources.'
            }
          >
            {user.role === 'admin' && (
              <Link
                to="/admin/floor-plan"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white dark:text-[#0b0e1c]"
              >
                <PencilRuler className="size-4" />
                Create floor plan
              </Link>
            )}
          </EmptyState>
        </>
      )}
    </QueryState>
  )
}

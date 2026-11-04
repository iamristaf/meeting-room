import { useState } from 'react'
import { CalendarSync as SyncIcon, Check, Copy, RefreshCw } from 'lucide-react'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'
import QueryState from '../ui/QueryState'
import useFetch from '../../hooks/useFetch'
import useToast from '../../hooks/useToast'
import calendarService from '../../services/calendarService'
import getErrorMessage from '../../utils/errorMessage'
import { feedSubscribeLinks } from '../../utils/calendarLinks'
import inputClass from '../../utils/fieldStyles'

const linkClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand'

function Feed({ initialUrl }) {
  const toast = useToast()
  const [url, setUrl] = useState(initialUrl)
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [resetting, setResetting] = useState(false)

  const links = feedSubscribeLinks(url)
  const isLocal = /\/\/(localhost|127\.0\.0\.1)/.test(url)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy. Select the link and copy it manually')
    }
  }

  const handleReset = async () => {
    setResetting(true)

    try {
      const next = await calendarService.resetLink()
      setUrl(next.url)
      toast.success('New calendar link created')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setResetting(false)
      setConfirming(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          aria-label="Your private calendar link"
          className={inputClass(false)}
          onFocus={(event) => event.target.select()}
        />
        <Button variant="secondary" onClick={handleCopy} className="shrink-0">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <a href={links.apple} className={linkClass}>
          <SyncIcon className="size-4" />
          Apple Calendar
        </a>
        <a
          href={links.google}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          <SyncIcon className="size-4" />
          Google Calendar
        </a>
        <a
          href={links.outlookCom}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          <SyncIcon className="size-4" />
          Outlook.com
        </a>
        <a
          href={links.microsoft365}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          <SyncIcon className="size-4" />
          Microsoft 365
        </a>
      </div>

      <ul className="space-y-1 text-xs text-muted">
        <li>
          Your upcoming bookings appear in your calendar and update by
          themselves. Google can take several hours to refresh.
        </li>
        <li>
          Anyone with this link can see your bookings, so do not share it.
        </li>
        {isLocal && (
          <li className="text-amber-ink">
            This link points to localhost. Google and Microsoft can only read it
            once the app is online.
          </li>
        )}
      </ul>

      <Button variant="ghost" onClick={() => setConfirming(true)}>
        <RefreshCw className="size-4" />
        Create a new link
      </Button>

      {confirming && (
        <ConfirmDialog
          title="Create a new link?"
          message="Calendars using your current link will stop updating until you subscribe again with the new one."
          confirmLabel="Create new link"
          loading={resetting}
          onConfirm={handleReset}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  )
}

export default function CalendarSync() {
  const { data, loading, error, reload } = useFetch(calendarService.getLink)

  return (
    <QueryState loading={loading} error={error} onRetry={reload}>
      {data && <Feed initialUrl={data.url} />}
    </QueryState>
  )
}

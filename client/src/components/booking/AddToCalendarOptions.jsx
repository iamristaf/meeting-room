import { useState } from 'react'
import { CalendarPlus, Download } from 'lucide-react'
import useToast from '../../hooks/useToast'
import calendarService from '../../services/calendarService'
import getErrorMessage from '../../utils/errorMessage'
import {
  googleEventUrl,
  microsoft365EventUrl,
  outlookComEventUrl,
} from '../../utils/calendarLinks'

const optionClass =
  'flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-55'

export default function AddToCalendarOptions({ booking }) {
  const toast = useToast()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)

    try {
      await calendarService.downloadBooking(booking.id, booking.resourceName)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={googleEventUrl(booking)}
        target="_blank"
        rel="noreferrer"
        className={optionClass}
      >
        <CalendarPlus className="size-4" />
        Google
      </a>
      <a
        href={outlookComEventUrl(booking)}
        target="_blank"
        rel="noreferrer"
        className={optionClass}
      >
        <CalendarPlus className="size-4" />
        Outlook.com
      </a>
      <a
        href={microsoft365EventUrl(booking)}
        target="_blank"
        rel="noreferrer"
        className={optionClass}
      >
        <CalendarPlus className="size-4" />
        Microsoft 365
      </a>
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className={optionClass}
      >
        <Download className="size-4" />
        Apple or other
      </button>
    </div>
  )
}

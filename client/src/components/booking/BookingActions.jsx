import { Link } from 'react-router-dom'
import { CheckCircle2, Pencil, XCircle } from 'lucide-react'
import Button from '../ui/Button'
import buttonClass from '../../utils/buttonStyles'
import {
  canCheckIn,
  canModifyBooking,
  getCheckInDeadline,
} from '../../utils/booking'
import { formatTime } from '../../utils/dateTime'

export default function BookingActions({ booking, onCancel, onCheckIn }) {
  const showCheckIn = onCheckIn && canCheckIn(booking)
  const checkedIn = Boolean(booking.checkedInAt)

  if (!canModifyBooking(booking) && !showCheckIn && !checkedIn) {
    return <span className="text-faint">-</span>
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {showCheckIn && (
        <div>
          <Button
            variant="primary"
            className="px-3 py-1"
            onClick={() => onCheckIn(booking)}
          >
            <CheckCircle2 className="size-4" />
            Check in
          </Button>
          <p className="mt-1 text-xs text-muted">
            Before {formatTime(getCheckInDeadline(booking))} or it is released
          </p>
        </div>
      )}
      {checkedIn && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-ink">
          <CheckCircle2 className="size-4" />
          Checked in
        </span>
      )}
      {canModifyBooking(booking) && (
        <>
          <Link
            to={`/bookings/${booking.id}/edit`}
            className={buttonClass('ghost', 'px-2 py-1')}
          >
            <Pencil className="size-4" />
            Edit
          </Link>
          <Button
            variant="ghostDanger"
            className="px-2 py-1"
            onClick={() => onCancel(booking)}
          >
            <XCircle className="size-4" />
            Cancel
          </Button>
        </>
      )}
    </div>
  )
}

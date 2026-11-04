import Modal from '../ui/Modal'
import AddToCalendarOptions from './AddToCalendarOptions'

export default function AddToCalendarModal({ booking, onClose }) {
  return (
    <Modal title="Add to calendar" onClose={onClose}>
      <p className="mb-4 text-sm text-muted">
        {booking.resourceName}. Apple Calendar and other apps use the downloaded
        file.
      </p>
      <AddToCalendarOptions booking={booking} />
    </Modal>
  )
}

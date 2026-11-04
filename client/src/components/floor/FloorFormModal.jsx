import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import TextField from '../ui/TextField'

export default function FloorFormModal({ onSubmit, onClose }) {
  const [name, setName] = useState('')
  const [width, setWidth] = useState(1200)
  const [height, setHeight] = useState(800)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      setError('Give the floor a name')
      return
    }

    setSaving(true)

    try {
      await onSubmit({
        name: name.trim(),
        width: Number(width),
        height: Number(height),
      })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ?? 'Could not add the floor',
      )
      setSaving(false)
    }
  }

  return (
    <Modal title="Add a floor" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Floor name"
          value={name}
          placeholder="Ground floor"
          error={error}
          autoFocus
          onChange={(event) => {
            setName(event.target.value)
            setError('')
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Width"
            type="number"
            min={400}
            max={4000}
            value={width}
            hint="Units on the grid"
            onChange={(event) => setWidth(event.target.value)}
          />
          <TextField
            label="Height"
            type="number"
            min={300}
            max={3000}
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Add floor
          </Button>
        </div>
      </form>
    </Modal>
  )
}

import { releaseNoShows } from '../services/bookingService.js'

const minGapMs = 15000
let lastRun = 0
let running = null

export async function runRelease() {
  if (running) {
    return running
  }

  lastRun = Date.now()
  running = releaseNoShows()
    .catch((error) => {
      console.error('Could not release unchecked bookings:', error.message)
    })
    .finally(() => {
      running = null
    })

  return running
}

export async function releaseBeforeRequest(req, res, next) {
  if (Date.now() - lastRun >= minGapMs) {
    await runRelease()
  }

  next()
}

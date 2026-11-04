import { Router } from 'express'
import * as calendar from '../controllers/calendarController.js'
import { authenticate } from '../middleware/authenticate.js'
import { notFound } from '../utils/httpError.js'

const router = Router()

router.param('file', (req, res, next, file) =>
  /^[0-9a-f]{48}(\.ics)?$/i.test(file)
    ? next()
    : next(notFound('Calendar not found')),
)

router.get('/feed/:file', calendar.feed)

router.use(authenticate)

router.get('/link', calendar.feedLink)
router.post('/link/reset', calendar.resetFeedLink)

export default router

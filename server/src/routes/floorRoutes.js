import { Router } from 'express'
import * as floors from '../controllers/floorController.js'
import { authenticate, requireAdmin } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { uuidPattern } from '../utils/constants.js'
import { notFound } from '../utils/httpError.js'
import {
  floorSchema,
  layoutSchema,
  statusQuerySchema,
} from '../validation/floorSchemas.js'

const router = Router()

router.param('id', (req, res, next, id) =>
  uuidPattern.test(id) ? next() : next(notFound('Floor not found')),
)

router.use(authenticate)

router.get('/', floors.list)
router.get('/status', validate(statusQuerySchema, 'query'), floors.status)
router.post('/', requireAdmin, validate(floorSchema), floors.create)
router.put('/:id', requireAdmin, validate(floorSchema), floors.update)
router.delete('/:id', requireAdmin, floors.remove)
router.put(
  '/:id/layout',
  requireAdmin,
  validate(layoutSchema),
  floors.saveLayout,
)

export default router

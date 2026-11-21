import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import controller from '../controllers/savingsGoal.controller.js';
import {
  createSavingsGoalSchema,
  updateSavingsGoalSchema,
  savingsGoalIdSchema,
} from '../validators/savingsGoal.validator.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(controller.list));
router.post('/', validate(createSavingsGoalSchema), asyncHandler(controller.create));
router.patch(
  '/:id',
  validate(savingsGoalIdSchema, 'params'),
  validate(updateSavingsGoalSchema),
  asyncHandler(controller.update),
);
router.delete('/:id', validate(savingsGoalIdSchema, 'params'), asyncHandler(controller.remove));

export default router;

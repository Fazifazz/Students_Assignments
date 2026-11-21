import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import controller from '../controllers/budget.controller.js';
import {
  createBudgetSchema,
  updateBudgetSchema,
  listBudgetsSchema,
  budgetIdSchema,
} from '../validators/budget.validator.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listBudgetsSchema, 'query'), asyncHandler(controller.list));
router.post('/', validate(createBudgetSchema), asyncHandler(controller.create));
router.patch(
  '/:id',
  validate(budgetIdSchema, 'params'),
  validate(updateBudgetSchema),
  asyncHandler(controller.update),
);
router.delete('/:id', validate(budgetIdSchema, 'params'), asyncHandler(controller.remove));

export default router;

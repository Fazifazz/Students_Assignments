import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import controller from '../controllers/category.controller.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from '../validators/category.validator.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(controller.list));
router.post('/', validate(createCategorySchema), asyncHandler(controller.create));
router.patch(
  '/:id',
  validate(categoryIdSchema, 'params'),
  validate(updateCategorySchema),
  asyncHandler(controller.update),
);
router.delete('/:id', validate(categoryIdSchema, 'params'), asyncHandler(controller.remove));

export default router;

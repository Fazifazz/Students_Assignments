import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import controller from '../controllers/analytics.controller.js';
import {
  monthYearSchema,
  monthlyReportSchema,
  trendsSchema,
} from '../validators/analytics.validator.js';

const router = Router();

router.use(requireAuth);

router.get('/monthly', validate(monthlyReportSchema, 'query'), asyncHandler(controller.monthly));
router.get('/categories', validate(monthYearSchema, 'query'), asyncHandler(controller.categories));
router.get('/trends', validate(trendsSchema, 'query'), asyncHandler(controller.trends));

export default router;

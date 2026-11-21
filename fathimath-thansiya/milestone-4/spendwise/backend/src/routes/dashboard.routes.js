import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import controller from '../controllers/dashboard.controller.js';
import { monthYearSchema } from '../validators/analytics.validator.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', validate(monthYearSchema, 'query'), asyncHandler(controller.summary));
router.get('/recent-transactions', asyncHandler(controller.recent));
router.get('/spending-overview', validate(monthYearSchema, 'query'), asyncHandler(controller.overview));

export default router;

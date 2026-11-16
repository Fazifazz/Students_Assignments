import { Router } from 'express';
import { getGoal, getGoalProgress, getWeeklySummary, updateGoal } from '../controllers/goalController.js';
import { getReadingActivities } from '../controllers/readingActivityController.js';

const router = Router();

router.get('/activities', getReadingActivities);
router.get('/goals', getGoal);
router.put('/goals', updateGoal);
router.get('/goals/progress', getGoalProgress);
router.get('/goals/weekly-summary', getWeeklySummary);

export default router;

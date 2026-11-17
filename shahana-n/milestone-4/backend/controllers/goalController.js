import goals from '../data/goals.js';
import readingActivities from '../data/readingActivities.js';
import { getGoalProgress as calculateGoalProgress, getWeeklySummary as buildWeeklySummary } from '../utils/reading.js';
import { integerInRange, validateBody } from '../utils/validation.js';

function currentGoal() {
  return goals[0];
}

export function getGoal(_request, response) {
  response.json(currentGoal());
}

export function updateGoal(request, response) {
  validateBody(request.body);
  const targetValue = request.body.dailyTarget ?? request.body.targetPages;
  const dailyTarget = integerInRange(targetValue, 'Daily target', 1, 10000);
  const goal = currentGoal();
  goal.dailyTarget = dailyTarget;
  goal.updatedAt = new Date().toISOString();
  response.json(goal);
}

export function getGoalProgress(_request, response) {
  response.json(calculateGoalProgress(readingActivities, currentGoal().dailyTarget));
}

export function getWeeklySummary(_request, response) {
  response.json(buildWeeklySummary(readingActivities));
}


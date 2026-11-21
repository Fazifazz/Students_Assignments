import SavingsGoal from '../models/SavingsGoal.js';
import ApiError from '../utils/ApiError.js';

/** Adds the derived progress fields to a goal document. */
function serialize(goal) {
  const progressPercent =
    goal.targetAmountPaise > 0 ? (goal.currentAmountPaise / goal.targetAmountPaise) * 100 : 0;

  return {
    _id: goal._id,
    name: goal.name,
    targetAmountPaise: goal.targetAmountPaise,
    currentAmountPaise: goal.currentAmountPaise,
    targetDate: goal.targetDate,
    description: goal.description,
    completed: goal.completed || progressPercent >= 100,
    progressPercent: Math.min(100, Math.round(progressPercent * 100) / 100),
    remainingPaise: Math.max(0, goal.targetAmountPaise - goal.currentAmountPaise),
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}

export async function listGoals(userId) {
  const goals = await SavingsGoal.find({ userId }).sort({ createdAt: -1 });
  return goals.map(serialize);
}

export async function getGoal(userId, goalId) {
  const goal = await SavingsGoal.findOne({ _id: goalId, userId });
  if (!goal) throw ApiError.notFound('Savings goal not found');
  return goal;
}

export async function createGoal(userId, payload) {
  const goal = await SavingsGoal.create({
    userId,
    name: payload.name,
    targetAmountPaise: payload.targetAmountPaise,
    currentAmountPaise: payload.currentAmountPaise ?? 0,
    targetDate: payload.targetDate,
    description: payload.description ?? '',
  });
  return serialize(goal);
}

/**
 * Updates a goal.
 *
 * `contributionPaise` adds money to the goal. A contribution that would take
 * the goal past its target is rejected unless `allowOvershoot` is explicitly
 * requested, so a typo cannot quietly inflate a goal.
 */
export async function updateGoal(userId, goalId, payload) {
  const goal = await getGoal(userId, goalId);

  if (payload.name !== undefined) goal.name = payload.name;
  if (payload.targetAmountPaise !== undefined) goal.targetAmountPaise = payload.targetAmountPaise;
  if (payload.targetDate !== undefined) goal.targetDate = payload.targetDate;
  if (payload.description !== undefined) goal.description = payload.description;
  if (payload.completed !== undefined) goal.completed = payload.completed;

  if (payload.currentAmountPaise !== undefined) {
    goal.currentAmountPaise = payload.currentAmountPaise;
  }

  if (payload.contributionPaise !== undefined) {
    const next = goal.currentAmountPaise + payload.contributionPaise;
    if (next > goal.targetAmountPaise && !payload.allowOvershoot) {
      throw ApiError.badRequest(
        'This contribution would exceed the goal target. Set allowOvershoot to true if that is intended.',
      );
    }
    goal.currentAmountPaise = next;
  }

  if (goal.currentAmountPaise >= goal.targetAmountPaise) {
    goal.completed = true;
  }

  await goal.save();
  return serialize(goal);
}

export async function deleteGoal(userId, goalId) {
  const goal = await getGoal(userId, goalId);
  await goal.deleteOne();
  return { message: 'Savings goal deleted' };
}

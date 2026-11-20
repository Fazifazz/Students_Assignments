// src/pages/LearningGoalsPage.jsx
import React, { useState } from 'react';
import {
  Target,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { GoalFormModal } from '../components/goals/GoalFormModal';
import { LogStudyModal } from '../components/goals/LogStudyModal';
import { Modal } from '../components/common/Modal';
import { getDeadlineStatus, formatDate } from '../utils/dateUtils';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const LearningGoalsPage = () => {
  const {
    profile,
    stats,
    courses,
    dailyHabits,
    toggleHabit,
    addHabit,
    deleteHabit,
    fireConfetti
  } = useCourse();
  const { addToast } = useToast();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);

  // New habit form
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitMinutes, setNewHabitMinutes] = useState(30);

  // Today progress
  const dailyTarget = profile.dailyGoalMinutes || 90;
  const todayLogged = stats.todayStudyMinutes;
  const todayPercent = Math.min(100, Math.round((todayLogged / dailyTarget) * 100));

  // Weekly progress
  const weeklyTargetMinutes = (profile.weeklyGoalHours || 12) * 60;
  const weeklyLoggedMinutes = stats.past7Days.reduce((acc, d) => acc + d.minutes, 0);
  const weeklyPercent = Math.min(100, Math.round((weeklyLoggedMinutes / weeklyTargetMinutes) * 100));

  // Habit checklist stats
  const completedHabitsCount = dailyHabits.filter((h) => h.completed).length;
  const habitsPercent =
    dailyHabits.length === 0
      ? 0
      : Math.round((completedHabitsCount / dailyHabits.length) * 100);

  // Deadlines list
  const coursesWithDeadlines = courses
    .filter((c) => c.deadline && c.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const handleToggleHabit = (id) => {
    toggleHabit(id);
    const h = dailyHabits.find((item) => item.id === id);
    if (h && !h.completed) {
      addToast(`Completed habit: "${h.title}"! Keep shining ⭐`, 'success');
      if (completedHabitsCount + 1 === dailyHabits.length) {
        fireConfetti();
      }
    }
  };

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    addHabit({
      title: newHabitTitle.trim(),
      targetMinutes: Number(newHabitMinutes) || 30
    });
    setNewHabitTitle('');
    setNewHabitMinutes(30);
    setIsAddHabitOpen(false);
    addToast('Daily habit added!', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Learning Goals & Habits</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Set deliberate targets, build unbroken streaks, and beat course deadlines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>Log Time Today</span>
          </button>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 shadow-xs transition-colors"
          >
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Edit Goals</span>
          </button>
        </div>
      </div>

      {/* Target Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Daily Goal Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Daily Study Target
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{todayLogged}m</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ {dailyTarget}m target</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {todayLogged >= dailyTarget
                ? '🎉 Daily goal achieved! Fantastic work!'
                : `${Math.max(0, dailyTarget - todayLogged)} minutes left to hit today's target.`}
            </p>
          </div>

          <div>
            <ProgressBar percent={todayPercent} showLabel={true} size="md" color="auto" />
          </div>
        </div>

        {/* Weekly Target Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Weekly Target (7 Days)
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {(weeklyLoggedMinutes / 60).toFixed(1)}h
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                / {profile.weeklyGoalHours}h target
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {weeklyPercent}% completed toward this week's milestone
            </p>
          </div>

          <div>
            <ProgressBar percent={weeklyPercent} showLabel={true} size="md" color="indigo" />
          </div>
        </div>

        {/* Streak Flame Card */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-md shadow-orange-500/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">
                Consistency Streak
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Flame className="w-5 h-5 text-white fill-white" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-black">{profile.currentStreak} Days</span>
            </div>
            <p className="text-xs text-amber-100">
              Personal all-time record: <strong>{profile.bestStreak} days</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 text-xs text-white/90 flex items-center justify-between">
            <span>Streak status:</span>
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded-full">
              🔥 Active Today
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Daily Habits Checklist & Course Deadlines Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Daily Habits Checklist */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Daily Learning Habits
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {completedHabitsCount} of {dailyHabits.length} habits checked off today ({habitsPercent}%)
                </p>
              </div>

              <button
                onClick={() => setIsAddHabitOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 dark:hover:text-indigo-400 text-xs font-bold rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Habit</span>
              </button>
            </div>

            <ProgressBar percent={habitsPercent} showLabel={false} size="xs" color="emerald" className="mb-4" />

            <div className="space-y-2.5">
              {dailyHabits.map((habit) => (
                <div
                  key={habit.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    habit.completed
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/40 text-slate-500 dark:text-slate-400'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                        habit.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {habit.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          habit.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {habit.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        Target: {habit.targetMinutes}m
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Deadlines Radar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Course Deadlines Radar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track completion dates to avoid crunch time
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              {coursesWithDeadlines.length} active
            </span>
          </div>

          {coursesWithDeadlines.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
              <Calendar className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              No upcoming course deadlines set. Add deadlines when creating or editing courses!
            </div>
          ) : (
            <div className="space-y-3">
              {coursesWithDeadlines.map((c) => {
                const deadline = getDeadlineStatus(c.deadline);

                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/courses/${c.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
                      >
                        {c.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        Target: {formatDate(c.deadline)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          deadline.isUrgent
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {deadline.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Goal Form Modal */}
      <GoalFormModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      {/* Log Study Modal */}
      <LogStudyModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />

      {/* Add Habit Modal */}
      <Modal
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        title="Add Daily Learning Habit"
        subtitle="Small recurring actions lead to mastery over time"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateHabit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Habit Description
            </label>
            <input
              type="text"
              placeholder="e.g. Solve 1 LeetCode problem / Read 10 pages of documentation"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Target Duration (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="180"
              step="5"
              value={newHabitMinutes}
              onChange={(e) => setNewHabitMinutes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddHabitOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            >
              Add Habit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

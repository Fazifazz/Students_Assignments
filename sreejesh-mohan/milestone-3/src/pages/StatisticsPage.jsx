// src/pages/StatisticsPage.jsx
import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  BookOpen,
  PieChart,
  Calendar,
  Sparkles,
  Flame,
  Zap,
  Target
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { WeeklyStudyBarChart } from '../components/charts/WeeklyStudyBarChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { CourseProgressBarChart } from '../components/charts/CourseProgressBarChart';
import { formatDate } from '../utils/dateUtils';

export const StatisticsPage = () => {
  const { courses, profile, stats, studySessions } = useCourse();

  // Badges calculation
  const achievements = [
    {
      id: 'first-step',
      title: 'First Step',
      desc: 'Completed your first course lesson',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      unlocked: stats.completedLessonsCount >= 1
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      desc: 'Maintained a 7-day study streak',
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      unlocked: profile.currentStreak >= 7
    },
    {
      id: 'finisher',
      title: 'The Finisher',
      desc: 'Completed at least 1 full course',
      icon: Award,
      color: 'from-purple-500 to-indigo-600',
      unlocked: stats.completedCourses >= 1
    },
    {
      id: 'polymath',
      title: 'Polymath',
      desc: 'Enrolled in 3 or more skill categories',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-600',
      unlocked: new Set(courses.map((c) => c.category)).size >= 3
    },
    {
      id: 'scholar',
      title: 'Scholar',
      desc: 'Logged over 10 hours of active learning',
      icon: Clock,
      color: 'from-rose-500 to-pink-600',
      unlocked: Number(stats.totalStudyHours) >= 10
    },
    {
      id: 'goal-crusher',
      title: 'Goal Crusher',
      desc: 'Achieved today’s target study duration',
      icon: Target,
      color: 'from-indigo-600 to-violet-700',
      unlocked: stats.todayStudyMinutes >= profile.dailyGoalMinutes
    }
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Learning Analytics & Statistics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Visual insights into your learning velocity, study duration, and skill categories
        </p>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Total Hours
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats.totalStudyHours}h
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Active study logged</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Avg Daily Pace
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {(stats.past7DaysHours / 7).toFixed(1)}h
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Per day this week</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Completion Rate
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats.overallProgressPercent}%
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {stats.completedLessonsCount}/{stats.totalLessonsCount} lessons finished
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Achievements
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {unlockedCount} / {achievements.length}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Badges unlocked</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Weekly Study Hours Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <WeeklyStudyBarChart
            data={stats.past7Days}
            targetDailyMinutes={profile.dailyGoalMinutes}
          />
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Subject Distribution
            </span>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">Enrolled Courses by Category</h4>
          </div>
          <CategoryPieChart courses={courses} />
        </div>
      </div>

      {/* Course Completion Breakdown Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Course Comparison
            </span>
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              Completion Rate Across All Enrolled Courses
            </h4>
          </div>
        </div>
        <CourseProgressBarChart />
      </div>

      {/* Badges & Achievements Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Learning Milestones & Badges</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unlock badges as you complete courses, build streaks, and conquer goals
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
            {unlockedCount} of {achievements.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  item.unlocked
                    ? 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 shadow-xs'
                    : 'bg-slate-50/30 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/60 opacity-50 grayscale'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white mb-2 shadow-sm`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">{item.title}</h5>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{item.desc}</p>
                <span
                  className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.unlocked
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Study Session Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Study Sessions Log</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete history of recorded study time and completed milestones
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {studySessions.length} sessions logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Notes / Accomplishments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studySessions.slice(0, 10).map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {formatDate(session.date)}
                  </td>
                  <td className="py-3 px-3 font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap">
                    {session.courseTitle}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                    {session.minutes} mins ({(session.minutes / 60).toFixed(1)}h)
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 truncate max-w-xs">
                    {session.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

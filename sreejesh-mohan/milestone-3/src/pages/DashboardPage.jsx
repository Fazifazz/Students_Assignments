// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Flame,
  ArrowRight,
  Plus,
  Play,
  Calendar,
  Sparkles,
  Award,
  Target
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { CategoryBadge, StatusBadge, LevelBadge } from '../components/common/Badge';
import { WeeklyStudyBarChart } from '../components/charts/WeeklyStudyBarChart';
import { CourseFormModal } from '../components/courses/CourseFormModal';
import { LogStudyModal } from '../components/goals/LogStudyModal';
import { getDeadlineStatus, formatDate } from '../utils/dateUtils';
import { useToast } from '../context/ToastContext';

export const DashboardPage = () => {
  const { courses, profile, stats, getCourseStats, addCourse, studySessions } = useCourse();
  const { addToast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Active / In-progress courses to show in Continue Learning
  const inProgressCourses = courses.filter((c) => c.status === 'In Progress');
  const activeCourses = inProgressCourses.length > 0 ? inProgressCourses : courses.slice(0, 3);

  // Today's daily target progress
  const todayTargetMinutes = profile.dailyGoalMinutes || 90;
  const todayProgressPercent = Math.min(
    100,
    Math.round((stats.todayStudyMinutes / todayTargetMinutes) * 100)
  );

  const handleAddCourse = (courseData) => {
    const created = addCourse(courseData);
    addToast(`"${created.title}" added to your course library! 📚`, 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ready to boost your skills today?</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Welcome back, {profile.name}! 👋
          </h2>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed mb-6 font-normal">
            You've completed <strong className="text-white font-bold">{stats.completedLessonsCount} lessons</strong> across {stats.totalEnrolled} courses.
            Keep your {profile.currentStreak}-day learning streak alive!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Log Study Session</span>
            </button>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Explore My Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative blur spheres */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-20 -bottom-16 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Enrolled Courses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enrolled Courses
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalEnrolled}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({stats.completedCourses} completed)
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{stats.inProgressCourses} currently active</span>
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Lessons
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.completedLessonsCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              / {stats.totalLessonsCount} total
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{stats.overallProgressPercent}% complete</span>
          </div>
        </div>

        {/* Learning Hours Logged */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Learning Hours
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalStudyHours}h
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">logged</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Past 7 days: <strong className="text-slate-800 dark:text-slate-200 font-bold">{stats.past7DaysHours}h</strong></span>
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Progress
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.overallProgressPercent}%
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar percent={stats.overallProgressPercent} showLabel={false} size="sm" color="auto" />
          </div>
        </div>
      </div>

      {/* Main Split Grid: Continue Learning & Today's Goal / Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (2 cols): Continue Learning & Course Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Continue Learning</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Jump right back into your active courses</p>
            </div>
            <Link
              to="/courses"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View all courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Active Course Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeCourses.length === 0 ? (
              <div className="col-span-full py-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No courses in progress</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-3">Add a YouTube playlist or choose a preset course to begin.</p>
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Course</span>
                </button>
              </div>
            ) : (
              activeCourses.map((course) => {
              const cStats = getCourseStats(course);
              const deadline = getDeadlineStatus(course.deadline);

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail banner */}
                    <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-700 to-purple-800" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <CategoryBadge category={course.category} className="!bg-black/40 !text-white !border-white/20 backdrop-blur-md text-[10px]" />
                        <StatusBadge status={course.status} />
                      </div>
                      <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 text-[11px] text-white/90">
                        <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                        <span className="font-semibold">{cStats.completedLessons}/{cStats.totalLessons} lessons done</span>
                      </div>
                    </div>

                    <div className="p-4 pb-0">
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1 block"
                      >
                        {course.title}
                      </Link>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        By {course.instructor}
                      </p>

                      {course.deadline && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Deadline:</span>
                          <span className={`font-semibold ${deadline.isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {deadline.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-2">
                    <div className="flex justify-between items-center text-xs mb-1 font-medium">
                      <span className="text-slate-400 text-[11px]">Progress</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{cStats.percent}%</span>
                    </div>

                    <ProgressBar percent={cStats.percent} showLabel={false} size="sm" color="auto" />

                    <Link
                      to={`/courses/${course.id}`}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch & Continue</span>
                    </Link>
                  </div>
                </div>
              );
            }))}
          </div>

          {/* Weekly Learning Activity Chart Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <WeeklyStudyBarChart
              data={stats.past7Days}
              targetDailyMinutes={profile.dailyGoalMinutes}
            />
          </div>
        </div>

        {/* Right Column (1 col): Daily Goal Widget, Streak & Recent Activity */}
        <div className="space-y-6">
          {/* Daily Goal Target Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Today's Goal</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Target: {Math.round(todayTargetMinutes / 60 * 10) / 10} hours/day
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
                {todayProgressPercent}%
              </span>
            </div>

            <ProgressBar percent={todayProgressPercent} showLabel={false} size="md" color="auto" />

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>
                Logged: <strong className="text-slate-800 dark:text-slate-200">{stats.todayStudyMinutes}m</strong>
              </span>
              <span>
                Remaining:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {Math.max(0, todayTargetMinutes - stats.todayStudyMinutes)}m
                </strong>
              </span>
            </div>

            <button
              onClick={() => setIsLogOpen(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Log Minutes For Today</span>
            </button>
          </div>

          {/* Streak Flame Motivation */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/15">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Flame className="w-6 h-6 text-white fill-white animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-medium text-amber-100">Daily Streak</span>
                <h4 className="text-xl font-black">{profile.currentStreak} Days In A Row!</h4>
              </div>
            </div>
            <p className="text-xs text-white/90 leading-relaxed mb-4">
              Consistency is key to mastering technical skills. Best streak record:{' '}
              <strong className="underline">{profile.bestStreak} days</strong>.
            </p>
            <Link
              to="/goals"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black/20 hover:bg-black/30 px-3.5 py-2 rounded-xl transition-all"
            >
              <span>View Learning Habits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Study Sessions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recent Sessions</h4>
              <Link to="/statistics" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Stats
              </Link>
            </div>

            <div className="space-y-3">
              {studySessions.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
                  No study sessions recorded yet. Log your first session above!
                </p>
              ) : (
                studySessions.slice(0, 4).map((session) => (
                  <div
                    key={session.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {session.courseTitle}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatDate(session.date)}
                      </p>
                    </div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-md">
                      +{session.minutes}m
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Modals for dashboard triggers */}
      <CourseFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddCourse}
      />
      <LogStudyModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
      />
    </div>
  );
};

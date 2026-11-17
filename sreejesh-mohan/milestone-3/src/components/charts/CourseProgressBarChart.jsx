// src/components/charts/CourseProgressBarChart.jsx
import React from 'react';
import { useCourse } from '../../context/CourseContext';
import { ProgressBar } from '../common/ProgressBar';
import { CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CourseProgressBarChart = () => {
  const { courses, getCourseStats } = useCourse();

  // Sort courses by completion percentage descending
  const sortedCourses = [...courses].sort((a, b) => {
    const statA = getCourseStats(a);
    const statB = getCourseStats(b);
    return statB.percent - statA.percent;
  });

  return (
    <div className="space-y-4">
      {sortedCourses.map((course) => {
        const stats = getCourseStats(course);
        const isDone = stats.percent === 100;

        return (
          <div
            key={course.id}
            className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Link
                to={`/courses/${course.id}`}
                className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[260px] sm:max-w-md"
              >
                {course.title}
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                {isDone ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {stats.percent}%
                  </span>
                )}
              </div>
            </div>

            <ProgressBar percent={stats.percent} showLabel={false} size="sm" color="auto" />

            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">{course.category}</span>
              <span>
                {stats.completedLessons} of {stats.totalLessons} lessons done ({Math.round(stats.completedMins / 60 * 10) / 10}h / {course.totalEstimatedHours}h)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

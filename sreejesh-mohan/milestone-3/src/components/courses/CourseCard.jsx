// src/components/courses/CourseCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  Edit2,
  Trash2,
  Play,
  ExternalLink,
  Video
} from 'lucide-react';
import { StatusBadge, CategoryBadge, LevelBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { getDeadlineStatus } from '../../utils/dateUtils';
import { useCourse } from '../../context/CourseContext';

export const CourseCard = ({
  course,
  viewMode = 'grid',
  onEdit,
  onDelete
}) => {
  const { getCourseStats } = useCourse();
  const stats = getCourseStats(course);
  const deadlineInfo = getDeadlineStatus(course.deadline);
  const [imageError, setImageError] = useState(false);

  // Gradient fallback
  const coverGradients = {
    'Web Development': 'from-blue-600 via-indigo-600 to-indigo-800',
    'Data Science & AI': 'from-purple-600 via-violet-600 to-indigo-900',
    'UI/UX Design': 'from-amber-500 via-orange-600 to-rose-600',
    'Cloud & DevOps': 'from-cyan-600 via-teal-600 to-emerald-700',
    'Mobile Apps': 'from-emerald-500 via-teal-600 to-cyan-700',
    'Cybersecurity': 'from-rose-600 via-pink-700 to-purple-800'
  };

  const bgGradient = coverGradients[course.category] || 'from-indigo-600 to-slate-800';

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-xs border border-slate-100 dark:border-slate-800">
            {course.thumbnail && !imageError ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white`}>
                <BookOpen className="w-6 h-6" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <CategoryBadge category={course.category} />
              <LevelBadge level={course.level} />
              <StatusBadge status={course.status} />
              {course.playlistUrl && (
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  YouTube
                </span>
              )}
            </div>
            <Link
              to={`/courses/${course.id}`}
              className="text-base font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
            >
              {course.title}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>By {course.instructor}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.totalEstimatedHours}h total
              </span>
            </p>
            {course.keywords && course.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {course.keywords.slice(0, 4).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress & Deadline */}
        <div className="flex items-center gap-6 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
          <div className="w-full md:w-44">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {stats.completedLessons}/{stats.totalLessons} lessons
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{stats.percent}%</span>
            </div>
            <ProgressBar percent={stats.percent} showLabel={false} size="sm" color="auto" />
          </div>

          {course.deadline && (
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[11px] text-slate-400">Deadline</span>
              <span className={`text-xs font-semibold ${deadlineInfo.isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {deadlineInfo.text}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link
              to={`/courses/${course.id}`}
              className="px-3.5 py-2 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white text-indigo-700 dark:text-indigo-300 rounded-xl transition-all inline-flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Watch</span>
            </Link>
            <button
              onClick={() => onEdit(course)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Edit Course"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(course)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Delete Course"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group">
      {/* Banner / Thumbnail Cover */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-900">
        {course.thumbnail && !imageError ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${bgGradient}`} />
        )}

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/40 to-black/20" />

        {/* Play button hover badge */}
        <Link
          to={`/courses/${course.id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </Link>

        {/* Top Badges & Edit actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <CategoryBadge category={course.category} className="!bg-black/40 !text-white !border-white/20 backdrop-blur-md pointer-events-auto shadow-xs" />
          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              onClick={() => onEdit(course)}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 hover:text-white transition-colors"
              title="Edit course"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(course)}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-600/80 backdrop-blur-md text-white/90 hover:text-white transition-colors"
              title="Delete course"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Bar on Thumbnail */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95 z-20 pointer-events-none">
          <LevelBadge level={course.level} />
          {course.deadline && (
            <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] border border-white/10">
              <Calendar className="w-3 h-3 text-amber-400" />
              {deadlineInfo.text}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <StatusBadge status={course.status} />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" />
              {course.totalEstimatedHours}h total
            </span>
          </div>

          <Link
            to={`/courses/${course.id}`}
            className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-1.5"
          >
            {course.title}
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.instructor}</span>
          </p>

          {course.keywords && course.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {course.keywords.slice(0, 3).map((kw, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60"
                >
                  #{kw}
                </span>
              ))}
              {course.keywords.length > 3 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium self-center">
                  +{course.keywords.length - 3}
                </span>
              )}
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {course.description || 'No description provided.'}
          </p>
        </div>

        {/* Progress Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {stats.completedLessons}/{stats.totalLessons} Lessons
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{stats.percent}%</span>
          </div>
          <ProgressBar percent={stats.percent} showLabel={false} size="sm" color="auto" />

          <div className="mt-4">
            <Link
              to={`/courses/${course.id}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white text-slate-700 dark:text-slate-300 transition-all duration-200 border border-slate-200 dark:border-slate-700 group-hover:border-indigo-600 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Course Videos</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

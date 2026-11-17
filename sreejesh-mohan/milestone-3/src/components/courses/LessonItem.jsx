// src/components/courses/LessonItem.jsx
import React, { useState } from 'react';
import {
  Check,
  Clock,
  Edit2,
  Trash2,
  FileText,
  Play,
  CheckCircle2,
  Video
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getYoutubeThumbnail } from '../../utils/youtubeUtils';

export const LessonItem = ({
  lesson,
  index,
  isActive = false,
  onSelect,
  onToggle,
  onEdit,
  onDelete
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const thumbnail = lesson.youtubeId ? getYoutubeThumbnail(lesson.youtubeId) : null;

  return (
    <div
      className={`group rounded-2xl border transition-all duration-200 overflow-hidden ${
        isActive
          ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-md'
          : lesson.completed
          ? 'bg-emerald-50/25 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-900/40'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-xs'
      }`}
    >
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
        {/* Left: Checkbox, Thumbnail Preview, Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Checkbox toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 ${
              lesson.completed
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
            title={lesson.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {lesson.completed && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          {/* Lesson Video Thumbnail Button */}
          <div
            onClick={onSelect}
            className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 cursor-pointer group/thumb border border-slate-200 shadow-xs"
            title="Click to play this video lesson"
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={lesson.title}
                className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300 opacity-90 group-hover/thumb:opacity-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-900 text-indigo-300">
                <Video className="w-5 h-5" />
              </div>
            )}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                isActive
                  ? 'bg-indigo-900/60 opacity-100'
                  : 'bg-black/30 opacity-70 group-hover/thumb:opacity-100'
              }`}
            >
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
          </div>

          {/* Title and metadata */}
          <div className="min-w-0 flex-1 cursor-pointer" onClick={onSelect}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">
                #{index + 1}
              </span>
              <p
                className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                  isActive
                    ? 'text-indigo-700 dark:text-indigo-300 font-bold'
                    : lesson.completed
                    ? 'text-slate-500 dark:text-slate-400'
                    : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                }`}
              >
                {lesson.title}
              </p>
            </div>

            <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                {lesson.duration}m
              </span>

              {isActive && (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-100/70 dark:bg-indigo-950 px-1.5 py-0.5 rounded text-[10px]">
                  Playing Now
                </span>
              )}

              {lesson.completed && !isActive && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}

              {lesson.notes && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotes(!showNotes);
                  }}
                  className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium ml-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>{showNotes ? 'Hide notes' : 'Notes'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit Lesson"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title="Delete Lesson"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Notes */}
      {showNotes && lesson.notes && (
        <div className="px-4 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="font-bold text-slate-700 dark:text-slate-200 mb-0.5">Lesson Notes:</p>
          <p className="italic">{lesson.notes}</p>
        </div>
      )}
    </div>
  );
};

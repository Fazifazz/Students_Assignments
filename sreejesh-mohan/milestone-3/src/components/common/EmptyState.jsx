// src/components/common/EmptyState.jsx
import React from 'react';
import { BookOpen, Search, Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No courses found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText,
  onAction,
  actionIcon: ActionIcon = Sparkles
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <ActionIcon className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

// src/components/common/Badge.jsx
import React from 'react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Completed
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          In Progress
        </span>
      );
    case 'Not Started':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>
          Not Started
        </span>
      );
  }
};

export const CategoryBadge = ({ category, className = '' }) => {
  const categoryStyles = {
    'Web Development': 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/50',
    'Data Science & AI': 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/50',
    'UI/UX Design': 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50',
    'Cloud & DevOps': 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/50',
    'Mobile Apps': 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50',
    'Cybersecurity': 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/50'
  };

  const style = categoryStyles[category] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style} ${className}`}>
      {category}
    </span>
  );
};

export const LevelBadge = ({ level }) => {
  const levelStyles = {
    Beginner: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    Intermediate: 'text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
    Advanced: 'text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40'
  };

  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${levelStyles[level] || 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
      {level}
    </span>
  );
};

// src/components/common/ProgressBar.jsx
import React from 'react';

export const ProgressBar = ({
  percent = 0,
  showLabel = true,
  size = 'md',
  color = 'indigo',
  className = ''
}) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  const sizeClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const colorGradients = {
    indigo: 'from-indigo-500 to-violet-600',
    emerald: 'from-emerald-400 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-400 to-pink-500',
    cyan: 'from-cyan-400 to-blue-500'
  };

  // Determine automatic color based on completion if default indigo
  let gradientClass = colorGradients[color] || colorGradients.indigo;
  if (color === 'auto') {
    if (clampedPercent === 100) gradientClass = colorGradients.emerald;
    else if (clampedPercent >= 60) gradientClass = colorGradients.indigo;
    else if (clampedPercent >= 25) gradientClass = colorGradients.cyan;
    else gradientClass = colorGradients.amber;
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-medium text-slate-500 dark:text-slate-400">Progress</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{clampedPercent}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
};

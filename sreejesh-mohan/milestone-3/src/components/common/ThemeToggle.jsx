// src/components/common/ThemeToggle.jsx
import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Compact Icon Toggle Button for Header & Navigation Bars
 */
export const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl transition-all duration-200 border ${
        isDarkMode
          ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-750 hover:text-amber-300 hover:border-slate-600 shadow-sm shadow-amber-500/10'
          : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-indigo-600 shadow-xs'
      } ${className}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDarkMode ? (
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 zoom-in duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-[-90deg] zoom-in duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold select-none">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};

/**
 * Segmented Control for Settings Page (Light / Dark / System)
 */
export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const options = [
    {
      id: 'light',
      label: 'Light Mode',
      desc: 'Clean & high contrast',
      icon: Sun,
      color: 'text-amber-500'
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      desc: 'Easy on the eyes at night',
      icon: Moon,
      color: 'text-indigo-400'
    },
    {
      id: 'system',
      label: 'System Sync',
      desc: 'Matches OS settings',
      icon: Monitor,
      color: 'text-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative ${
              isSelected
                ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 dark:bg-indigo-950/40 dark:border-indigo-400 dark:ring-indigo-400/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSelected
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${opt.color}`} />
              </div>
              {isSelected && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs" />
              )}
            </div>

            <div>
              <p
                className={`text-sm font-bold leading-tight ${
                  isSelected
                    ? 'text-indigo-900 dark:text-white'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {opt.label}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {opt.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

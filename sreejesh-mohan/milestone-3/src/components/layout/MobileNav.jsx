// src/components/layout/MobileNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  BarChart3,
  Settings,
  X,
  PlusCircle,
  Flame
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { EduTrackLogo } from '../common/EduTrackLogo';

export const MobileNav = ({ isOpen, onClose, onOpenAddCourse }) => {
  const { profile, courses } = useCourse();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Courses', path: '/courses', icon: BookOpen, badge: courses.length },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Stats', path: '/statistics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 border-r border-slate-200 dark:border-slate-800">
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
            <NavLink to="/" onClick={onClose}>
              <EduTrackLogo size={32} showTagline={false} />
            </NavLink>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add */}
          <div className="p-4">
            <button
              onClick={() => {
                onOpenAddCourse();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          </div>

          {/* Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer with Theme Toggle & Streak */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Appearance
            </span>
            <ThemeToggle showLabel={true} />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/40 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{profile.currentStreak} Day Learning Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
};

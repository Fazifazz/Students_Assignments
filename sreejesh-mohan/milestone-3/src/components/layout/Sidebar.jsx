// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  BarChart3,
  Settings,
  Flame,
  PlusCircle
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { EduTrackLogo } from '../common/EduTrackLogo';

export const Sidebar = ({ onOpenAddCourse }) => {
  const { profile, courses } = useCourse();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    {
      name: 'My Courses',
      path: '/courses',
      icon: BookOpen,
      badge: courses.length
    },
    { name: 'Learning Goals', path: '/goals', icon: Target },
    { name: 'Progress & Stats', path: '/statistics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 min-h-screen flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 h-screen z-30 transition-colors duration-200">
      <div>
        {/* App Logo / Brand */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/" className="hover:opacity-95 transition-opacity">
            <EduTrackLogo size={38} showTagline={true} />
          </NavLink>
        </div>

        {/* Quick Action */}
        <div className="p-4 pb-2">
          <button
            onClick={onOpenAddCourse}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
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

      {/* Footer Profile & Streak Card */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {/* Streak banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                {profile.currentStreak} Day Streak!
              </p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400">Keep up the daily habit</p>
            </div>
          </div>
        </div>

        {/* User Mini Profile */}
        <NavLink
          to="/settings"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {profile.name}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{profile.email}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

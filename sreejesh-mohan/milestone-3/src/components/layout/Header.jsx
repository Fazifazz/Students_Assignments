// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Plus,
  Flame,
  Clock,
  Bell,
  Search,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { EduTrackIcon } from '../common/EduTrackLogo';

export const Header = ({ onOpenAddCourse, onOpenLogStudy, onToggleMobileNav }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, courses } = useCourse();
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic Page Titles
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Dashboard', subtitle: `Welcome back, ${profile.name.split(' ')[0]}!` };
    if (path.startsWith('/courses/')) return { title: 'Course Details', subtitle: 'Curriculum, milestones and lesson progress' };
    if (path === '/courses') return { title: 'My Courses', subtitle: 'Manage your enrolled courses, status, and deadlines' };
    if (path === '/goals') return { title: 'Learning Goals', subtitle: 'Track daily targets, streaks, and deadlines' };
    if (path === '/statistics') return { title: 'Progress & Statistics', subtitle: 'Deep dive into learning analytics and achievements' };
    if (path === '/settings') return { title: 'Settings', subtitle: 'Customize profile, preferences, and data backups' };
    return { title: 'EduTrack', subtitle: 'Course Learning Tracker' };
  };

  const { title, subtitle } = getPageInfo();

  // Upcoming courses deadline alerts
  const urgentCourses = courses.filter((c) => {
    if (!c.deadline || c.status === 'Completed') return false;
    const diff = new Date(c.deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days <= 7;
  });

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
      {/* Left: Mobile trigger & Page Titles */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="md:hidden">
          <EduTrackIcon size={30} />
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Actions, Streak, Theme Toggle & Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold shadow-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{profile.currentStreak} Days</span>
        </div>

        {/* Log Study Time Button */}
        <button
          onClick={onOpenLogStudy}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 rounded-xl transition-all shadow-xs"
          title="Log study session"
        >
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Log Time</span>
        </button>

        {/* Add Course Button */}
        <button
          onClick={onOpenAddCourse}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-95 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Course</span>
        </button>

        {/* Dark Mode Switch / Toggle Button */}
        <ThemeToggle />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {urgentCourses.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Notifications & Alerts</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {urgentCourses.length} alert{urgentCourses.length === 1 ? '' : 's'}
                </span>
              </div>

              {urgentCourses.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  <Sparkles className="w-6 h-6 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                  All course deadlines are on track! No urgent alerts.
                </div>
              ) : (
                <div className="space-y-2">
                  {urgentCourses.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        navigate(`/courses/${c.id}`);
                        setShowNotifications(false);
                      }}
                      className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 hover:bg-amber-100/60 dark:hover:bg-amber-950/50 cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{c.title}</p>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                        Target deadline is coming up on {c.deadline}!
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

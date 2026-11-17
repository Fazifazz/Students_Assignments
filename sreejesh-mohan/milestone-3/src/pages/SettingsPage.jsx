// src/pages/SettingsPage.jsx
import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Briefcase,
  Target,
  Clock,
  Sparkles,
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  Check,
  Moon,
  Bell,
  AlertTriangle,
  Database,
  FileText
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { ThemeSelector } from '../components/common/ThemeToggle';

// 3D Cartoon Character Avatars
const AVATAR_OPTIONS = [
  '/avatars/avatar-1.jpg',
  '/avatars/avatar-2.jpg',
  '/avatars/avatar-3.jpg',
  '/avatars/avatar-4.jpg',
  '/avatars/avatar-5.jpg',
  '/avatars/avatar-6.jpg'
];

export const SettingsPage = () => {
  const {
    profile,
    updateProfile,
    resetToSampleData,
    exportDataJSON,
    importDataJSON
  } = useCourse();
  const { addToast } = useToast();

  const fileInputRef = useRef(null);
  const backupInputRef = useRef(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: profile.name || '',
    title: profile.title || '',
    email: profile.email || '',
    avatar: (!profile.avatar || profile.avatar.includes('photo-1534528741775')) ? AVATAR_OPTIONS[0] : profile.avatar,
    bio: profile.bio || '',
    dailyGoalMinutes: profile.dailyGoalMinutes || 90,
    weeklyGoalHours: profile.weeklyGoalHours || 12
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    deadlineAlerts: true
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Save profile updates
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name.trim(),
      title: profileForm.title.trim(),
      email: profileForm.email.trim(),
      avatar: profileForm.avatar.trim(),
      bio: profileForm.bio.trim(),
      dailyGoalMinutes: Number(profileForm.dailyGoalMinutes) || 90,
      weeklyGoalHours: Number(profileForm.weeklyGoalHours) || 12
    });
    addToast('Profile settings saved successfully!', 'success');
  };

  // Local image upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setProfileForm((prev) => ({ ...prev, avatar: result }));
        addToast('Photo selected! Click Save to apply.', 'info');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Import JSON backup
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const success = importDataJSON(content);
        if (success) {
          addToast('Backup restored successfully!', 'success');
        } else {
          addToast('Invalid backup file.', 'error');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl pb-12 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal profile, appearance, learning targets, and data
        </p>
      </div>

      {/* 1. Profile Information */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Profile Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize your student identity and study profile
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={profileForm.avatar}
                alt="Profile Preview"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md shrink-0"
              />

              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                  {AVATAR_OPTIONS.map((avatarUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileForm((prev) => ({ ...prev, avatar: avatarUrl }))}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden transition-all duration-200 ${
                        profileForm.avatar === avatarUrl
                          ? 'ring-3 ring-indigo-600 scale-105 shadow-md'
                          : 'opacity-75 hover:opacity-100 hover:scale-105 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <img src={avatarUrl} alt="3D Cartoon Avatar" className="w-full h-full object-cover" />
                      {profileForm.avatar === avatarUrl && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Select a preset avatar or upload your own picture from your computer
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Role / Headline
            </label>
            <input
              type="text"
              value={profileForm.title}
              onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
              placeholder="e.g. Aspiring Full Stack & Cloud Developer"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
            />
          </div>

          {/* Learning Goals */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Daily Study Goal (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                step="15"
                value={profileForm.dailyGoalMinutes}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, dailyGoalMinutes: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Weekly Target (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="70"
                value={profileForm.weeklyGoalHours}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, weeklyGoalHours: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. Appearance & Theme */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance & Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your preferred display theme or sync with system preferences
            </p>
          </div>
        </div>

        <ThemeSelector />
      </div>

      {/* 3. Notifications */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Notifications & Alerts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure study reminders and course alerts
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Daily Study Reminder
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Prompt to log learning session if daily target not yet met
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.dailyReminder}
              onChange={(e) =>
                setNotifications({ ...notifications, dailyReminder: e.target.checked })
              }
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Course Deadline Warnings
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Show warning alerts when a course completion deadline is within 7 days
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.deadlineAlerts}
              onChange={(e) =>
                setNotifications({ ...notifications, deadlineAlerts: e.target.checked })
              }
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Data Backup & Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Data Management & Backup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export a backup copy of your course data or restore from file
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Export JSON */}
          <button
            type="button"
            onClick={exportDataJSON}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all text-center cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Export Backup (.JSON)</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all text-center cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Restore Backup File</span>
            <input
              ref={backupInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset / Restore Demo Data */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              Reset to Sample Demo Data
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Reload the default 5 courses, study logs, and habits
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Sample Data</span>
          </button>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetToSampleData();
          addToast('Restored default courses, stats, and habits!', 'success');
        }}
        title="Restore Sample Data?"
        message="This will reload the initial sample courses and study history. You can export a backup beforehand if you want to keep your current data."
        confirmText="Yes, Restore Data"
        confirmVariant="warning"
      />
    </div>
  );
};

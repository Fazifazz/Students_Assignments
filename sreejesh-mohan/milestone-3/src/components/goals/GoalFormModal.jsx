// src/components/goals/GoalFormModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useCourse } from '../../context/CourseContext';
import { Target, Zap } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const GoalFormModal = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useCourse();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    dailyGoalMinutes: 90,
    weeklyGoalHours: 12
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        dailyGoalMinutes: profile.dailyGoalMinutes || 90,
        weeklyGoalHours: profile.weeklyGoalHours || 12
      });
    }
  }, [profile, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      dailyGoalMinutes: Number(formData.dailyGoalMinutes),
      weeklyGoalHours: Number(formData.weeklyGoalHours)
    });
    addToast('Learning goals updated successfully!', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Study Goals"
      subtitle="Establish daily & weekly learning habits that match your schedule"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Daily Goal (Minutes)
          </label>
          <input
            type="number"
            min="15"
            max="480"
            step="15"
            value={formData.dailyGoalMinutes}
            onChange={(e) => setFormData({ ...formData, dailyGoalMinutes: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Equivalent to {(formData.dailyGoalMinutes / 60).toFixed(1)} hours per day
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Weekly Target (Hours)
          </label>
          <input
            type="number"
            min="1"
            max="80"
            value={formData.weeklyGoalHours}
            onChange={(e) => setFormData({ ...formData, weeklyGoalHours: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Recommended: ~{Math.round((formData.weeklyGoalHours / 7) * 60)} minutes/day
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
          >
            Save Goals
          </button>
        </div>
      </form>
    </Modal>
  );
};

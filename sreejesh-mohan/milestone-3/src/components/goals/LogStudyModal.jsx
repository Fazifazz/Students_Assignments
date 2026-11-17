// src/components/goals/LogStudyModal.jsx
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useCourse } from '../../context/CourseContext';
import { Clock, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const LogStudyModal = ({ isOpen, onClose, preselectedCourseId = '' }) => {
  const { courses, logStudySession } = useCourse();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    courseId: preselectedCourseId || (courses[0]?.id || ''),
    minutes: 45,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.minutes || formData.minutes <= 0) {
      errs.minutes = 'Please enter valid study minutes (greater than 0)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    logStudySession({
      courseId: formData.courseId,
      minutes: Number(formData.minutes),
      date: formData.date,
      notes: formData.notes
    });

    addToast(`Logged ${formData.minutes} minutes of study time! Keep it up! 🚀`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Study Session"
      subtitle="Record time spent learning, reading docs, or building course projects"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Course
          </label>
          <select
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id} className="dark:bg-slate-900 dark:text-white">
                {course.title}
              </option>
            ))}
            <option value="" className="dark:bg-slate-900 dark:text-white">Other / General Study</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Minutes Studied <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="600"
                step="5"
                value={formData.minutes}
                onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.minutes
                    ? 'border-rose-300 dark:border-rose-700'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.minutes && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.minutes}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Quick select presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Quick Add:
          </label>
          <div className="flex gap-2">
            {[25, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setFormData({ ...formData, minutes: mins })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  formData.minutes === mins
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Session Notes / Accomplishments
          </label>
          <textarea
            rows="2"
            placeholder="e.g. Completed Redux Toolkit setup, solved 2 algorithm challenges"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
          />
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
            Log Session
          </button>
        </div>
      </form>
    </Modal>
  );
};

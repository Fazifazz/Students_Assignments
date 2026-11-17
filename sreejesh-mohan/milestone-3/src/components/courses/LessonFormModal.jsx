// src/components/courses/LessonFormModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  extractYoutubeId,
  getYoutubeThumbnail,
  fetchYoutubeMetadata
} from '../../utils/youtubeUtils';
import { Video, Clock, Download, Loader2, CheckCircle2 } from 'lucide-react';

export const LessonFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  lessonToEdit = null
}) => {
  const isEditing = !!lessonToEdit;

  const [formData, setFormData] = useState({
    title: '',
    duration: 45,
    youtubeId: '',
    notes: ''
  });

  const [isFetching, setIsFetching] = useState(false);
  const [fetchMessage, setFetchMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lessonToEdit) {
      setFormData({
        title: lessonToEdit.title || '',
        duration: lessonToEdit.duration || 45,
        youtubeId: lessonToEdit.youtubeId || '',
        notes: lessonToEdit.notes || ''
      });
    } else {
      setFormData({
        title: '',
        duration: 45,
        youtubeId: '',
        notes: ''
      });
    }
    setFetchMessage('');
    setErrors({});
  }, [lessonToEdit, isOpen]);

  // Fetch title automatically from YouTube link
  const handleAutoFetchTitle = async () => {
    if (!formData.youtubeId.trim()) return;
    setIsFetching(true);
    setFetchMessage('');
    try {
      const data = await fetchYoutubeMetadata(formData.youtubeId.trim());
      if (data && data.title) {
        setFormData((prev) => ({
          ...prev,
          title: data.title,
          notes: prev.notes || (data.author ? `Video lesson by ${data.author}` : '')
        }));
        setFetchMessage(`Fetched title: "${data.title}"!`);
      } else {
        setFetchMessage('Could not fetch title automatically. Please enter title manually.');
      }
    } catch {
      setFetchMessage('Network error. Please enter title manually.');
    } finally {
      setIsFetching(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Lesson title is required';
    }
    if (!formData.duration || formData.duration <= 0) {
      errs.duration = 'Please provide duration in minutes';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  const parsedVideoId = extractYoutubeId(formData.youtubeId);
  const previewThumbnail = parsedVideoId ? getYoutubeThumbnail(parsedVideoId) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Lesson' : 'Add New Lesson'}
      subtitle={
        isEditing
          ? 'Update lesson title, video link, duration, and personal notes'
          : 'Paste any YouTube link to auto-fetch video title and embed'
      }
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* YouTube Video URL / ID with Auto-Fetch */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>YouTube Video URL or ID</span>
          </label>
          <div className="flex gap-2 mt-1.5">
            <input
              type="text"
              placeholder="e.g. https://www.youtube.com/watch?v=bMknfKXIFA8"
              value={formData.youtubeId}
              onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
              className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAutoFetchTitle}
              disabled={isFetching || !formData.youtubeId.trim()}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 active:scale-95"
            >
              {isFetching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Fetch Title</span>
            </button>
          </div>

          {fetchMessage && (
            <p className="mt-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{fetchMessage}</span>
            </p>
          )}

          {previewThumbnail && (
            <div className="mt-2.5 flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <img
                src={previewThumbnail}
                alt="Video thumbnail preview"
                className="w-16 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
              />
              <div className="text-[11px] text-slate-500 dark:text-slate-400 min-w-0">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">YouTube Embed Ready</span>
                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate block">ID: {parsedVideoId}</span>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Lesson Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Master React 19 useActionState & Server Actions"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-200'
                : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Duration (Minutes) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="5"
            max="300"
            step="5"
            placeholder="45"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
              errors.duration
                ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-200'
                : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {errors.duration && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Key Concepts / Notes (Optional)
          </label>
          <textarea
            rows="3"
            placeholder="Add key formulas, code snippets, or ideas to remember..."
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
            {isEditing ? 'Save Changes' : 'Add Lesson'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

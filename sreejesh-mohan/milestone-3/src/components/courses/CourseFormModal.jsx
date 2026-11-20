// src/components/courses/CourseFormModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import { PRESET_COURSES } from '../../data/presetCourses';
import {
  extractYoutubeId,
  extractPlaylistId,
  getYoutubeThumbnail,
  fetchFullPlaylistData,
  inferCategoryFromTitle,
  inferLevelFromTitle
} from '../../utils/youtubeUtils';
import {
  Video,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  ListPlus,
  Play,
  Check,
  Clock,
  ArrowRight,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Layers,
  ListVideo,
  Key,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const QUICK_SAMPLE_PLAYLISTS = [
  {
    label: 'React 19 Tutorial',
    url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUdxb0nAwZ78nz3cDEk97C'
  },
  {
    label: 'Next.js 15 Masterclass',
    url: 'https://www.youtube.com/playlist?list=PLillGF-RfqbYeckUaD1z6nE4DoOz574G0'
  },
  {
    label: 'TypeScript Guide',
    url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUxtBLX646Mr45NEGugk0o'
  },
  {
    label: 'Python Fundamentals',
    url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTskrapNbzXhCoQlqNeQdBGg'
  }
];

export const CourseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  courseToEdit = null
}) => {
  const isEditing = !!courseToEdit;

  // Active tab: 'playlist' | 'presets' | 'manual'
  const [modalMode, setModalMode] = useState(isEditing ? 'manual' : 'playlist');

  // --- Mode 1: 1-Click YouTube Playlist Auto-Fetcher State ---
  const [playlistInput, setPlaylistInput] = useState('');
  const [isFetchingPlaylist, setIsFetchingPlaylist] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [fetchedCoursePreview, setFetchedCoursePreview] = useState(null);
  const [showLessonList, setShowLessonList] = useState(false);

  // Optional YouTube API Key state
  const [customApiKey, setCustomApiKey] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('edutrack_yt_api_key') || '' : '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // --- Mode 2: Manual Form State (for editing or custom courses) ---
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    category: 'Web Development',
    level: 'Beginner',
    status: 'Not Started',
    deadline: '',
    totalEstimatedHours: 12,
    thumbnail: '',
    playlistUrl: '',
    description: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (courseToEdit) {
      setModalMode('manual');
      setFormData({
        title: courseToEdit.title || '',
        instructor: courseToEdit.instructor || '',
        category: courseToEdit.category || 'Web Development',
        level: courseToEdit.level || 'Beginner',
        status: courseToEdit.status || 'Not Started',
        deadline: courseToEdit.deadline || '',
        totalEstimatedHours: courseToEdit.totalEstimatedHours || 12,
        thumbnail: courseToEdit.thumbnail || '',
        playlistUrl: courseToEdit.playlistUrl || '',
        description: courseToEdit.description || '',
        notes: courseToEdit.notes || ''
      });
    } else {
      setModalMode('playlist');
      setPlaylistInput('');
      setFetchedCoursePreview(null);
      setFetchError(null);
      setShowLessonList(false);
      setFormData({
        title: '',
        instructor: '',
        category: 'Web Development',
        level: 'Beginner',
        status: 'Not Started',
        deadline: '',
        totalEstimatedHours: 12,
        thumbnail: '',
        playlistUrl: '',
        description: '',
        notes: ''
      });
    }
    setErrors({});
  }, [courseToEdit, isOpen]);

  // Save API Key if entered
  const handleSaveApiKey = (key) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined') {
      if (key.trim()) {
        localStorage.setItem('edutrack_yt_api_key', key.trim());
      } else {
        localStorage.removeItem('edutrack_yt_api_key');
      }
    }
  };

  // --- Automatic Playlist Fetch Handler ---
  const handleFetchPlaylist = async (urlToFetch) => {
    const url = (urlToFetch || playlistInput).trim();
    if (!url) {
      setFetchError('Please enter or paste a YouTube playlist link or ID.');
      return;
    }

    setIsFetchingPlaylist(true);
    setFetchError(null);
    setFetchedCoursePreview(null);

    try {
      const data = await fetchFullPlaylistData(url, customApiKey.trim() || null);
      if (!data || !data.title) {
        throw new Error('Could not find playlist data. Please verify the URL.');
      }

      setFetchedCoursePreview(data);
      setShowLessonList(data.lessons && data.lessons.length > 0);
    } catch (err) {
      setFetchError(
        err.message ||
          'Failed to extract playlist. If it is private or restricted, please check the link or provide a YouTube Data API Key.'
      );
    } finally {
      setIsFetchingPlaylist(false);
    }
  };

  // Handle Clipboard Paste
  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setPlaylistInput(text);
          handleFetchPlaylist(text);
        }
      }
    } catch {
      // ignore clipboard error
    }
  };

  // --- Confirm & Create Course with All Fetched Lessons ---
  const handleConfirmAddFetchedCourse = () => {
    if (!fetchedCoursePreview) return;

    const lessonsPayload = (fetchedCoursePreview.lessons || []).map((les, idx) => ({
      id: 'les-yt-' + Date.now() + '-' + idx,
      title: les.title || `Lesson ${idx + 1}`,
      duration: les.durationMinutes || 20,
      youtubeId: les.videoId || '',
      completed: false,
      completedAt: null,
      notes: ''
    }));

    const coursePayload = {
      title: fetchedCoursePreview.title.trim(),
      instructor: fetchedCoursePreview.instructor.trim() || 'YouTube Channel',
      category: fetchedCoursePreview.category || 'Web Development',
      courseType: fetchedCoursePreview.category || 'Web Development',
      keywords: fetchedCoursePreview.keywords || [],
      level: fetchedCoursePreview.level || 'Beginner',
      status: 'In Progress',
      deadline: '',
      totalEstimatedHours: fetchedCoursePreview.totalEstimatedHours || 12,
      thumbnail: fetchedCoursePreview.thumbnail || '',
      playlistUrl: fetchedCoursePreview.playlistUrl || playlistInput.trim(),
      description:
        fetchedCoursePreview.description ||
        `Complete YouTube course containing ${lessonsPayload.length} video lessons.`,
      lessons: lessonsPayload
    };

    onSubmit(coursePayload);
    onClose();
  };

  // --- Preset Course Importer ---
  const handleSelectPreset = (preset) => {
    const coursePayload = {
      ...preset,
      lessons: preset.lessons.map((l, idx) => ({
        ...l,
        id: 'les-preset-' + Date.now() + '-' + idx,
        completed: false,
        completedAt: null
      }))
    };
    onSubmit(coursePayload);
    onClose();
  };

  // --- Manual Form Submit (for edit / custom) ---
  const validateManual = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Course title is required';
    if (!formData.instructor.trim()) errs.instructor = 'Instructor or channel name is required';
    if (!formData.totalEstimatedHours || formData.totalEstimatedHours <= 0) {
      errs.totalEstimatedHours = 'Please enter a valid estimated duration in hours';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!validateManual()) return;
    onSubmit(formData);
    onClose();
  };

  const categories = INITIAL_CATEGORIES.filter((c) => c !== 'All');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Course Details' : 'Add Course from YouTube Playlist'}
      subtitle={
        isEditing
          ? 'Update course metadata, YouTube links, and roadmap'
          : 'Paste any YouTube playlist link to auto-fetch all videos and create your course instantly.'
      }
      maxWidth="max-w-2xl"
    >
      {/* Mode Switcher Tabs (Only when creating a new course) */}
      {!isEditing && (
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setModalMode('playlist')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              modalMode === 'playlist'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>YouTube Playlist (1-Click)</span>
          </button>
          <button
            type="button"
            onClick={() => setModalMode('presets')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              modalMode === 'presets'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Presets</span>
          </button>
          <button
            type="button"
            onClick={() => setModalMode('manual')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              modalMode === 'manual'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Manual Form</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 1: 1-Click YouTube Playlist Auto-Fetcher (PRIMARY) */}
      {/* ======================================================== */}
      {modalMode === 'playlist' && (
        <div className="space-y-4">
          {/* Main Link Input Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50/70 via-indigo-50/40 to-slate-50 dark:from-red-950/20 dark:via-indigo-950/20 dark:to-slate-900 border border-red-200/60 dark:border-red-900/40 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-600" />
                <span>YouTube Playlist Link or ID</span>
              </label>

              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 hover:underline"
              >
                <Copy className="w-3 h-3" />
                <span>Paste Link</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUdxb0nAwZ78nz3cDEk97C"
                value={playlistInput}
                onChange={(e) => setPlaylistInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFetchPlaylist();
                  }
                }}
                className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition-all shadow-xs"
              />

              <button
                type="button"
                onClick={() => handleFetchPlaylist()}
                disabled={isFetchingPlaylist || !playlistInput.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {isFetchingPlaylist ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fetching All Videos...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Fetch All Videos</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Links */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">Quick Samples:</span>
              {QUICK_SAMPLE_PLAYLISTS.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => {
                    setPlaylistInput(sample.url);
                    handleFetchPlaylist(sample.url);
                  }}
                  className="px-2 py-0.5 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] font-medium transition-all"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Optional YouTube Data API Key Toggle */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <Key className="w-3 h-3 text-amber-500" />
                <span>Optional: Use personal YouTube API Key {customApiKey ? '(Configured)' : ''}</span>
                {showApiKeyInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {showApiKeyInput && (
              <div className="mt-2 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 animate-fade-in">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  YouTube Data API v3 Key (Zero setup needed by default, optional backup):
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={customApiKey}
                    onChange={(e) => handleSaveApiKey(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs font-mono"
                  />
                  {customApiKey && (
                    <button
                      type="button"
                      onClick={() => handleSaveApiKey('')}
                      className="px-2 py-1 text-slate-400 hover:text-rose-500 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fetch Error Feedback */}
          {fetchError && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Playlist Extraction Notice</p>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">{fetchError}</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Tip: You can also choose one of our <strong>Curated Presets</strong> above or configure a YouTube API key.
                </p>
              </div>
            </div>
          )}

          {/* Fetched Course & Lessons Preview Card */}
          {fetchedCoursePreview && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 shadow-md space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Playlist Successfully Extracted!</span>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-md">
                  {fetchedCoursePreview.lessons?.length || 0} Lessons Found
                </span>
              </div>

              {/* Course Card Preview */}
              <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                {fetchedCoursePreview.thumbnail ? (
                  <img
                    src={fetchedCoursePreview.thumbnail}
                    alt={fetchedCoursePreview.title}
                    className="w-full sm:w-36 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-xs"
                  />
                ) : (
                  <div className="w-full sm:w-36 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-slate-400">
                    <Video className="w-8 h-8 text-red-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {fetchedCoursePreview.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="text-slate-400 dark:text-slate-500 font-normal">Instructor / Channel:</span>
                    <span className="text-indigo-700 dark:text-indigo-400 font-bold">{fetchedCoursePreview.instructor}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800">
                      <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Section: {fetchedCoursePreview.category}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      📊 {fetchedCoursePreview.level}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold">
                      ⏱️ ~{fetchedCoursePreview.totalEstimatedHours} Hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted Keywords Pills */}
              {fetchedCoursePreview.keywords && fetchedCoursePreview.keywords.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Extracted Tech Stack & Keywords:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {fetchedCoursePreview.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-600 text-xs font-bold shadow-2xs"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsible Lessons Preview List */}
              {fetchedCoursePreview.lessons && fetchedCoursePreview.lessons.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/60">
                  <button
                    type="button"
                    onClick={() => setShowLessonList(!showLessonList)}
                    className="w-full p-2.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ListVideo className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Preview All {fetchedCoursePreview.lessons.length} Video Lessons</span>
                    </span>
                    {showLessonList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showLessonList && (
                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-200/70 dark:divide-slate-800 p-1 text-xs">
                      {fetchedCoursePreview.lessons.map((les, i) => (
                        <div key={i} className="p-2 flex items-center gap-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <span className="text-[11px] font-bold text-slate-400 w-5 text-right shrink-0">
                            #{i + 1}
                          </span>
                          {les.thumbnail ? (
                            <img
                              src={les.thumbnail}
                              alt=""
                              className="w-10 h-6 object-cover rounded shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <Play className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                          <span className="flex-1 font-medium text-slate-800 dark:text-slate-200 truncate" title={les.title}>
                            {les.title}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
                            {les.durationMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Big 1-Click Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmAddFetchedCourse}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 active:scale-[0.99] text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    Add Course with {fetchedCoursePreview.lessons?.length || 0} Lessons & Start Learning 🚀
                  </span>
                </button>
                <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                  Zero setup required! All lesson titles, durations, and videos are ready to play.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: Curated Presets Tab                              */}
      {/* ======================================================== */}
      {modalMode === 'presets' && (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold mb-0.5">🌟 Hand-Picked High Quality Courses</p>
            Choose from ready-to-study complete playlists with real curriculum and YouTube videos.
          </div>

          {PRESET_COURSES.map((preset) => (
            <div
              key={preset.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={preset.thumbnail}
                  alt={preset.title}
                  className="w-16 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{preset.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {preset.instructor} • {preset.lessons.length} Lessons • {preset.totalEstimatedHours}h
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Import Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: Manual / Custom Course Form (For Edits & Custom)  */}
      {/* ======================================================== */}
      {modalMode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Course Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Modern Full-Stack Next.js 15 Masterclass"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title}</p>}
          </div>

          {/* Instructor & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Instructor / Channel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. freeCodeCamp / Net Ninja"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.instructor
                    ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-200'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
              {errors.instructor && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.instructor}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-slate-900 dark:text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thumbnail & YouTube Playlist Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Cover Thumbnail URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube Playlist Link (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/playlist?list=..."
                value={formData.playlistUrl}
                onChange={(e) => setFormData({ ...formData, playlistUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Level, Status & Estimated Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="Beginner" className="dark:bg-slate-900 dark:text-white">Beginner</option>
                <option value="Intermediate" className="dark:bg-slate-900 dark:text-white">Intermediate</option>
                <option value="Advanced" className="dark:bg-slate-900 dark:text-white">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="Not Started" className="dark:bg-slate-900 dark:text-white">Not Started</option>
                <option value="In Progress" className="dark:bg-slate-900 dark:text-white">In Progress</option>
                <option value="Completed" className="dark:bg-slate-900 dark:text-white">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Est. Hours <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={formData.totalEstimatedHours}
                onChange={(e) =>
                  setFormData({ ...formData, totalEstimatedHours: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Target Deadline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Target Completion Deadline (Optional)
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Course Description & Objectives
            </label>
            <textarea
              rows="3"
              placeholder="What will you master in this course?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Modal Buttons */}
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
              {isEditing ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

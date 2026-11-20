// src/pages/CourseDetailsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  BookOpen,
  FileText,
  ExternalLink,
  Sparkles,
  Award,
  Filter,
  Play,
  SkipForward,
  SkipBack,
  Video,
  ListVideo,
  Layers,
  ListPlus,
  Loader2,
  Download
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge, CategoryBadge, LevelBadge } from '../components/common/Badge';
import { LessonItem } from '../components/courses/LessonItem';
import { LessonFormModal } from '../components/courses/LessonFormModal';
import { CourseFormModal } from '../components/courses/CourseFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LogStudyModal } from '../components/goals/LogStudyModal';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { getDeadlineStatus, formatDate, formatMinutesToHours } from '../utils/dateUtils';
import {
  getYoutubeEmbedUrl,
  extractPlaylistId,
  extractAllYoutubeIds,
  getYoutubeThumbnail,
  fetchFullPlaylistData
} from '../utils/youtubeUtils';
import { useToast } from '../context/ToastContext';

export const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    courses,
    updateCourse,
    deleteCourse,
    addLesson,
    updateLesson,
    deleteLesson,
    toggleLesson,
    updateCourseNotes,
    getCourseStats,
    fireConfetti
  } = useCourse();
  const { addToast } = useToast();

  const course = courses.find((c) => c.id === id);

  // Playlist ID if available
  const playlistId = course?.playlistUrl ? extractPlaylistId(course.playlistUrl) : '';

  // Player Mode: 'playlist' (YouTube videoseries player) vs 'lesson' (single video)
  const [playerMode, setPlayerMode] = useState('lesson');

  // Active playing lesson state
  const [activeLessonId, setActiveLessonId] = useState(null);

  // View tabs & lesson filters
  const [activeTab, setActiveTab] = useState('player'); // player | notes
  const [lessonFilter, setLessonFilter] = useState('all'); // all | completed | remaining

  // Modals state
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isLogStudyOpen, setIsLogStudyOpen] = useState(false);
  const [isAutoFetchingPlaylist, setIsAutoFetchingPlaylist] = useState(false);

  // Bulk links / playlist generator modal
  const [isBulkLessonModalOpen, setIsBulkLessonModalOpen] = useState(false);
  const [bulkLinksText, setBulkLinksText] = useState('');
  const [autoGenCount, setAutoGenCount] = useState(10);

  // Course notes
  const [notesContent, setNotesContent] = useState(course?.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Automatically select initial lesson
  useEffect(() => {
    if (course && course.lessons && course.lessons.length > 0) {
      if (!activeLessonId || !course.lessons.some((l) => l.id === activeLessonId)) {
        const firstIncomplete = course.lessons.find((l) => !l.completed);
        setActiveLessonId(firstIncomplete ? firstIncomplete.id : course.lessons[0].id);
      }
    } else if (playlistId) {
      setPlayerMode('playlist');
    }
  }, [course, activeLessonId, playlistId]);

  useEffect(() => {
    if (course) {
      setNotesContent(course.notes || '');
    }
  }, [course]);

  if (!course) {
    return (
      <div className="py-12">
        <EmptyState
          icon={BookOpen}
          title="Course Not Found"
          description="The course you are looking for does not exist or may have been deleted."
          actionText="Back to My Courses"
          onAction={() => navigate('/courses')}
        />
      </div>
    );
  }

  const stats = getCourseStats(course);
  const deadlineInfo = getDeadlineStatus(course.deadline);
  const isAllComplete = stats.percent === 100 && stats.totalLessons > 0;

  // Active playing lesson
  const activeLesson =
    (course.lessons || []).find((l) => l.id === activeLessonId) ||
    course.lessons?.[0] ||
    null;

  const activeLessonIndex = (course.lessons || []).findIndex(
    (l) => l.id === activeLesson?.id
  );

  // Filter lessons for list
  const filteredLessons = (course.lessons || []).filter((l) => {
    if (lessonFilter === 'completed') return l.completed;
    if (lessonFilter === 'remaining') return !l.completed;
    return true;
  });

  // Handlers
  const handleToggleLesson = (lessonId) => {
    toggleLesson(course.id, lessonId);
    const target = course.lessons.find((l) => l.id === lessonId);
    if (target && !target.completed) {
      addToast(`Lesson completed! Study time logged. 🚀`, 'success');
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < course.lessons.length - 1) {
      setActiveLessonId(course.lessons[activeLessonIndex + 1].id);
      setPlayerMode('lesson');
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonId(course.lessons[activeLessonIndex - 1].id);
      setPlayerMode('lesson');
    }
  };

  const handleSaveLesson = (lessonData) => {
    if (lessonToEdit) {
      updateLesson(course.id, lessonToEdit.id, lessonData);
      addToast(`Lesson "${lessonData.title}" updated!`, 'success');
      setLessonToEdit(null);
    } else {
      addLesson(course.id, lessonData);
      addToast(`Added lesson "${lessonData.title}"!`, 'success');
    }
  };

  const handleConfirmDeleteLesson = () => {
    if (lessonToDelete) {
      deleteLesson(course.id, lessonToDelete.id);
      addToast(`Lesson removed.`, 'info');
      setLessonToDelete(null);
    }
  };

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    updateCourseNotes(course.id, notesContent);
    setTimeout(() => {
      setIsSavingNotes(false);
      addToast('Course notes saved!', 'success');
    }, 200);
  };

  const handleConfirmDeleteCourse = () => {
    deleteCourse(course.id);
    addToast(`Course "${course.title}" was deleted.`, 'info');
    navigate('/courses');
  };

  // Auto-fetch all video lessons from YouTube playlist for this course
  const handleAutoFetchPlaylistLessons = async () => {
    if (!course.playlistUrl) {
      addToast('No YouTube playlist URL linked to this course.', 'error');
      return;
    }
    setIsAutoFetchingPlaylist(true);
    try {
      const data = await fetchFullPlaylistData(course.playlistUrl);
      if (data && data.lessons && data.lessons.length > 0) {
        const newLessons = data.lessons.map((les, idx) => ({
          id: 'les-yt-' + Date.now() + '-' + idx,
          title: les.title || `Lesson ${idx + 1}`,
          duration: les.durationMinutes || 20,
          youtubeId: les.videoId || '',
          completed: false,
          completedAt: null,
          notes: ''
        }));
        updateCourse(course.id, {
          lessons: newLessons,
          thumbnail: course.thumbnail || data.thumbnail || '',
          instructor:
            !course.instructor || course.instructor === 'Self-Paced'
              ? data.instructor
              : course.instructor,
          keywords:
            course.keywords && course.keywords.length > 0
              ? course.keywords
              : data.keywords || [],
          courseType: course.courseType || data.courseType || data.category,
          category: course.category || data.category,
          status: course.status === 'Completed' ? 'In Progress' : course.status
        });
        addToast(`Fetched ${newLessons.length} lessons from YouTube playlist! 🚀`, 'success');
        if (newLessons[0]) {
          setActiveLessonId(newLessons[0].id);
          setPlayerMode('lesson');
        }
      } else {
        addToast('No videos could be extracted from this playlist link.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Failed to auto-fetch playlist videos.', 'error');
    } finally {
      setIsAutoFetchingPlaylist(false);
    }
  };

  // Auto-generate N lessons for this playlist
  const handleGeneratePlaylistChecklist = (count) => {
    const generated = [];
    for (let i = 1; i <= count; i++) {
      generated.push({
        id: 'les-gen-' + Date.now() + '-' + i,
        title: `${course.title} - Part ${i}`,
        duration: 35,
        youtubeId: activeLesson?.youtubeId || '',
        completed: false,
        completedAt: null,
        notes: `Part ${i} in playlist.`
      });
    }

    const updatedLessons = [...(course.lessons || []), ...generated];
    updateCourse(course.id, {
      lessons: updatedLessons,
      status: course.status === 'Completed' ? 'In Progress' : course.status
    });
    addToast(`Generated ${count} checklist lessons for this playlist! 🎯`, 'success');
    if (!activeLessonId && generated[0]) {
      setActiveLessonId(generated[0].id);
    }
  };

  // Bulk paste links importer for this course
  const handleImportBulkLinksToCourse = (e) => {
    e.preventDefault();
    const videoIds = extractAllYoutubeIds(bulkLinksText);

    if (videoIds.length === 0) {
      addToast('No YouTube video links detected. Please paste valid URLs.', 'error');
      return;
    }

    const newLessons = videoIds.map((vId, idx) => ({
      id: 'les-bulk-' + Date.now() + '-' + idx,
      title: `${course.title} - Video #${(course.lessons?.length || 0) + idx + 1}`,
      duration: 35,
      youtubeId: vId,
      completed: false,
      completedAt: null,
      notes: ''
    }));

    const updated = [...(course.lessons || []), ...newLessons];
    updateCourse(course.id, {
      lessons: updated,
      thumbnail: course.thumbnail || getYoutubeThumbnail(videoIds[0])
    });

    addToast(`Imported ${newLessons.length} video lessons to course! 🚀`, 'success');
    setIsBulkLessonModalOpen(false);
    setBulkLinksText('');
    if (newLessons[0]) {
      setActiveLessonId(newLessons[0].id);
      setPlayerMode('lesson');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>

        <div className="flex items-center gap-2">
          {course.playlistUrl && (
            <a
              href={course.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900/50 transition-colors"
              title="Open full playlist on YouTube.com"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open on YouTube</span>
            </a>
          )}
          <button
            onClick={() => setIsLogStudyOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Log Study Time</span>
          </button>
          <button
            onClick={() => setIsEditCourseOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
            title="Edit Course Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsDeleteCourseOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
            title="Delete Course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Course Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <CategoryBadge category={course.category} />
              <LevelBadge level={course.level} />
              <StatusBadge status={course.status} />
              {playlistId && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                  <Video className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  YouTube Playlist
                </span>
              )}
              {isAllComplete && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  100% Completed
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {course.instructor}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {course.totalEstimatedHours}h estimated ({formatMinutesToHours(stats.totalMins)} video lessons)
              </span>
              {course.deadline && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Target: {formatDate(course.deadline)} (
                  <strong className={deadlineInfo.isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}>
                    {deadlineInfo.text}
                  </strong>
                  )
                </span>
              )}
            </div>

            {course.keywords && course.keywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Keywords / Tech Stack:</span>
                </span>
                {course.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200/70 dark:border-indigo-800/60 shadow-2xs"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mini progress bar module */}
          <div className="w-full lg:w-72 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {stats.completedLessons}/{stats.totalLessons} Lessons Done
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{stats.percent}%</span>
            </div>
            <ProgressBar percent={stats.percent} showLabel={false} size="md" color="auto" />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-right">
              {stats.completedMins}m logged of {stats.totalMins}m curriculum
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('player')}
            className={`pb-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'player'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Video Player & Curriculum</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {course.lessons?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Course Notes & Takeaways</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Video Player & Lesson List */}
      {activeTab === 'player' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column (8 cols): Embedded YouTube Video Player */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Player Mode Switcher (if playlist exists) */}
            {playlistId && (
              <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-600" />
                  <span>Player Mode:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPlayerMode('playlist')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      playerMode === 'playlist'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <span>▶ YouTube Full Playlist Player</span>
                  </button>
                  {activeLesson?.youtubeId && (
                    <button
                      type="button"
                      onClick={() => setPlayerMode('lesson')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        playerMode === 'lesson'
                          ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <span>🎬 Lesson Video #{activeLessonIndex + 1}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Video Iframe Container */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <div className="relative aspect-video w-full bg-black">
                {playerMode === 'playlist' && playlistId ? (
                  <iframe
                    key="embed-playlist-series"
                    src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`}
                    title={`${course.title} - Full YouTube Playlist Series`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : activeLesson?.youtubeId ? (
                  <iframe
                    key={activeLesson.id}
                    src={getYoutubeEmbedUrl(activeLesson.youtubeId)}
                    title={activeLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : playlistId ? (
                  <iframe
                    key="fallback-playlist"
                    src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`}
                    title={course.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                    <Video className="w-12 h-12 text-slate-600 mb-2" />
                    <p className="text-sm font-bold text-white mb-1">No video linked for this lesson</p>
                    <p className="text-xs max-w-sm mb-4">
                      Click edit lesson to paste any YouTube video link or ID.
                    </p>
                    <button
                      onClick={() => {
                        setLessonToEdit(activeLesson);
                        setIsAddLessonOpen(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                    >
                      Attach YouTube Video
                    </button>
                  </div>
                )}
              </div>

              {/* Player Bottom Control Bar */}
              {activeLesson && (
                <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
                        Lesson #{activeLessonIndex + 1}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {activeLesson.duration} minutes
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold truncate text-white">
                      {activeLesson.title}
                    </h3>
                  </div>

                  {/* Actions: Mark Completed & Next/Prev */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrevLesson}
                      disabled={activeLessonIndex <= 0}
                      className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl hover:bg-slate-800 transition-colors"
                      title="Previous Lesson"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleLesson(activeLesson.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                        activeLesson.completed
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>{activeLesson.completed ? 'Completed' : 'Mark as Completed'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextLesson}
                      disabled={activeLessonIndex >= course.lessons.length - 1}
                      className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl hover:bg-slate-800 transition-colors"
                      title="Next Lesson"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Active Lesson Details & Key Concepts Card */}
            {activeLesson && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Lesson Notes & Objectives</span>
                  </h4>
                  <button
                    onClick={() => {
                      setLessonToEdit(activeLesson);
                      setIsAddLessonOpen(true);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    Edit Lesson Details
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeLesson.notes ||
                    'No personal notes added for this lesson yet. Click "Edit Lesson Details" to record key takeaways.'}
                </p>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Lesson Playlist List */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ListVideo className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum & Lessons</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsBulkLessonModalOpen(true)}
                    className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold"
                    title="Paste multiple video links or auto-generate playlist checklist"
                  >
                    <ListPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setLessonToEdit(null);
                      setIsAddLessonOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* If course has no lessons or playlist exists, show quick checklist generator */}
              {(!course.lessons || course.lessons.length === 0) && (
                <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-indigo-50 dark:from-red-950/30 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-center space-y-3">
                  <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Want to import all videos from this YouTube playlist?
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Extract every single video title, duration, and link into trackable lessons automatically!
                    </p>
                  </div>

                  {course.playlistUrl && (
                    <button
                      type="button"
                      onClick={handleAutoFetchPlaylistLessons}
                      disabled={isAutoFetchingPlaylist}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isAutoFetchingPlaylist ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Fetching Playlist Lessons...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Fetch All Playlist Lessons Now (1-Click)</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Or quick-generate parts:</span>
                    {[5, 10, 15].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => handleGeneratePlaylistChecklist(cnt)}
                        className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 font-bold rounded-md shadow-xs transition-colors"
                      >
                        +{cnt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lesson Filters */}
              {course.lessons && course.lessons.length > 0 && (
                <div className="flex items-center gap-1 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
                  {[
                    { id: 'all', label: `All (${course.lessons?.length || 0})` },
                    { id: 'remaining', label: `Remaining (${stats.totalLessons - stats.completedLessons})` },
                    { id: 'completed', label: `Done (${stats.completedLessons})` }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setLessonFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        lessonFilter === f.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Lesson Item List */}
              {filteredLessons.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  No lessons match the selected filter.
                </div>
              ) : (
                <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                  {filteredLessons.map((lesson, idx) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      index={idx}
                      isActive={playerMode === 'lesson' && activeLesson?.id === lesson.id}
                      onSelect={() => {
                        setActiveLessonId(lesson.id);
                        setPlayerMode('lesson');
                      }}
                      onToggle={() => handleToggleLesson(lesson.id)}
                      onEdit={() => {
                        setLessonToEdit(lesson);
                        setIsAddLessonOpen(true);
                      }}
                      onDelete={() => setLessonToDelete(lesson)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Course Notes */}
      {activeTab === 'notes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal Course Notes</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Write down key formulas, insights, questions for discussion, and code snippets
              </p>
            </div>
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              {isSavingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          <textarea
            rows="12"
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            placeholder="Document your key learnings, architecture decisions, tips, or homework tasks..."
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 transition-all leading-relaxed"
          />
        </div>
      )}

      {/* Add / Edit Lesson Modal */}
      <LessonFormModal
        isOpen={isAddLessonOpen}
        onClose={() => {
          setIsAddLessonOpen(false);
          setLessonToEdit(null);
        }}
        onSubmit={handleSaveLesson}
        lessonToEdit={lessonToEdit}
      />

      {/* Edit Course Modal */}
      <CourseFormModal
        isOpen={isEditCourseOpen}
        onClose={() => setIsEditCourseOpen(false)}
        onSubmit={(updatedData) => {
          updateCourse(course.id, updatedData);
          addToast(`Course updated successfully!`, 'success');
        }}
        courseToEdit={course}
      />

      {/* Log Study Modal for this specific course */}
      <LogStudyModal
        isOpen={isLogStudyOpen}
        onClose={() => setIsLogStudyOpen(false)}
        preselectedCourseId={course.id}
      />

      {/* Bulk Paste Video Links Modal */}
      <Modal
        isOpen={isBulkLessonModalOpen}
        onClose={() => setIsBulkLessonModalOpen(false)}
        title="Add Videos to Playlist"
        subtitle="Quickly add multiple YouTube videos or auto-generate checklist lessons"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {/* Quick Auto-generate option */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60">
            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-1">
              Option A: 1-Click Checklist Generator
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              Add blank video lesson slots to check off as you watch the playlist:
            </p>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    handleGeneratePlaylistChecklist(num);
                    setIsBulkLessonModalOpen(false);
                  }}
                  className="flex-1 py-1.5 bg-white dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="flex-shrink mx-3 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* Option B: Paste YouTube video links */}
          <form onSubmit={handleImportBulkLinksToCourse} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Option B: Paste Video Links
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                Paste any YouTube video links (one per line or from the playlist page):
              </p>
              <textarea
                rows="5"
                placeholder={`https://www.youtube.com/watch?v=wm5gMKuwSYk\nhttps://www.youtube.com/watch?v=843nec-IvW0\nhttps://www.youtube.com/watch?v=d5x0JCb277k`}
                value={bulkLinksText}
                onChange={(e) => setBulkLinksText(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsBulkLessonModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all"
              >
                Import Video Links
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Lesson Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!lessonToDelete}
        onClose={() => setLessonToDelete(null)}
        onConfirm={handleConfirmDeleteLesson}
        title="Delete Lesson?"
        message={`Are you sure you want to remove lesson "${lessonToDelete?.title}"?`}
        confirmText="Delete Lesson"
        confirmVariant="danger"
      />

      {/* Delete Course Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteCourseOpen}
        onClose={() => setIsDeleteCourseOpen(false)}
        onConfirm={handleConfirmDeleteCourse}
        title="Delete Entire Course?"
        message={`Are you sure you want to delete "${course.title}"? All lessons, notes, and progress will be deleted permanently.`}
        confirmText="Delete Course"
        confirmVariant="danger"
      />
    </div>
  );
};

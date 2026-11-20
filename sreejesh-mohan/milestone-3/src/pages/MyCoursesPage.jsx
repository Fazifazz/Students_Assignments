// src/pages/MyCoursesPage.jsx
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen,
  ArrowUpDown,
  X
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { CourseCard } from '../components/courses/CourseCard';
import { CourseFormModal } from '../components/courses/CourseFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { useToast } from '../context/ToastContext';

export const MyCoursesPage = () => {
  const { courses, addCourse, updateCourse, deleteCourse, getCourseStats } = useCourse();
  const { addToast } = useToast();

  // Search, Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('recent'); // recent | progress-desc | progress-asc | deadline | title
  const [viewMode, setViewMode] = useState('grid'); // grid | list

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search filter
        const matchesSearch =
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (course.keywords && course.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase())));

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || course.category === selectedCategory;

        // Status filter
        const matchesStatus =
          selectedStatus === 'All' || course.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'progress-desc') {
          return getCourseStats(b).percent - getCourseStats(a).percent;
        }
        if (sortBy === 'progress-asc') {
          return getCourseStats(a).percent - getCourseStats(b).percent;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'deadline') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        // Default: 'recent'
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [courses, searchQuery, selectedCategory, selectedStatus, sortBy, getCourseStats]);

  // Handlers
  const handleSaveCourse = (formData) => {
    if (courseToEdit) {
      updateCourse(courseToEdit.id, formData);
      addToast(`Updated "${formData.title}" successfully!`, 'success');
      setCourseToEdit(null);
    } else {
      const created = addCourse(formData);
      addToast(`Added "${created.title}" to your courses!`, 'success');
    }
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      addToast(`Course "${courseToDelete.title}" was removed.`, 'info');
      setCourseToDelete(null);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('recent');
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'All' || selectedStatus !== 'All';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Enrolled Courses</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Organize, filter, and track all your courses and certifications ({courses.length} total)
          </p>
        </div>

        <button
          onClick={() => {
            setCourseToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Search, Filter Bar & View Toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by course title, instructor, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Not Started</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value="recent">Recently Added</option>
              <option value="progress-desc">Progress: High to Low</option>
              <option value="progress-asc">Progress: Low to High</option>
              <option value="deadline">Deadline: Urgent First</option>
              <option value="title">Course Name (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shrink-0 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Course Cards Grid/List */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={hasActiveFilters ? 'No courses match your filters' : 'No courses yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search terms or clearing category & status filters.'
              : 'Start your learning journey by adding your first course or certification.'
          }
          actionText={hasActiveFilters ? 'Clear Filters' : 'Add First Course'}
          onAction={
            hasActiveFilters
              ? clearAllFilters
              : () => {
                  setCourseToEdit(null);
                  setIsAddModalOpen(true);
                }
          }
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              viewMode={viewMode}
              onEdit={(c) => {
                setCourseToEdit(c);
                setIsAddModalOpen(true);
              }}
              onDelete={(c) => setCourseToDelete(c)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Course Modal */}
      <CourseFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCourseToEdit(null);
        }}
        onSubmit={handleSaveCourse}
        courseToEdit={courseToEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Course?"
        message={`Are you sure you want to delete "${courseToDelete?.title}"? All associated lessons, progress, and course notes will be permanently removed.`}
        confirmText="Delete Course"
        confirmVariant="danger"
      />
    </div>
  );
};

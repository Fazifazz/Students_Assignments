// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { CourseFormModal } from '../courses/CourseFormModal';
import { LogStudyModal } from '../goals/LogStudyModal';
import { useCourse } from '../../context/CourseContext';
import { useToast } from '../../context/ToastContext';

export const Layout = () => {
  const { addCourse } = useCourse();
  const { addToast } = useToast();

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isLogStudyOpen, setIsLogStudyOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleCreateCourse = (courseData) => {
    const created = addCourse(courseData);
    addToast(`"${created.title}" added to your enrolled courses! 🎯`, 'success');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar onOpenAddCourse={() => setIsAddCourseOpen(true)} />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenAddCourse={() => setIsAddCourseOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddCourse={() => setIsAddCourseOpen(true)}
          onOpenLogStudy={() => setIsLogStudyOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Add Course Modal */}
      <CourseFormModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onSubmit={handleCreateCourse}
      />

      {/* Global Log Study Time Modal */}
      <LogStudyModal
        isOpen={isLogStudyOpen}
        onClose={() => setIsLogStudyOpen(false)}
      />
    </div>
  );
};

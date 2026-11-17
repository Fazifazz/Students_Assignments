// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CourseProvider } from './context/CourseContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { MyCoursesPage } from './pages/MyCoursesPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { LearningGoalsPage } from './pages/LearningGoalsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CourseProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="courses" element={<MyCoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailsPage />} />
              <Route path="goals" element={<LearningGoalsPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CourseProvider>
    </ToastProvider>
  </ThemeProvider>
  );
}

export default App;

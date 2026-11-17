// src/context/CourseContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_COURSES,
  INITIAL_STUDY_SESSIONS,
  INITIAL_DAILY_HABITS,
  INITIAL_USER_PROFILE
} from '../data/initialData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { extractYoutubeId } from '../utils/youtubeUtils';

const CourseContext = createContext(null);

const STORAGE_KEYS = {
  COURSES: 'edutrack_courses_v2',
  SESSIONS: 'edutrack_sessions_v2',
  HABITS: 'edutrack_habits_v2',
  PROFILE: 'edutrack_profile_v2'
};

export const CourseProvider = ({ children }) => {
  // State initialization with localStorage fallback
  const [courses, setCourses] = useState(() =>
    loadFromStorage(STORAGE_KEYS.COURSES, INITIAL_COURSES)
  );

  const [studySessions, setStudySessions] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SESSIONS, INITIAL_STUDY_SESSIONS)
  );

  const [dailyHabits, setDailyHabits] = useState(() =>
    loadFromStorage(STORAGE_KEYS.HABITS, INITIAL_DAILY_HABITS)
  );

  const [profile, setProfile] = useState(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.PROFILE, INITIAL_USER_PROFILE);
    if (!loaded.avatar || loaded.avatar.includes('photo-1534528741775')) {
      return { ...loaded, avatar: '/avatars/avatar-1.jpg' };
    }
    return loaded;
  });

  // Sync to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COURSES, courses);
  }, [courses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SESSIONS, studySessions);
  }, [studySessions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HABITS, dailyHabits);
  }, [dailyHabits]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  // Trigger celebration confetti
  const fireConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  // Compute stats for a single course
  const getCourseStats = useCallback((course) => {
    if (!course || !course.lessons) {
      return { percent: 0, completedLessons: 0, totalLessons: 0, completedMins: 0, totalMins: 0 };
    }
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter((l) => l.completed).length;
    const percent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    const totalMins = course.lessons.reduce((acc, l) => acc + (Number(l.duration) || 0), 0);
    const completedMins = course.lessons
      .filter((l) => l.completed)
      .reduce((acc, l) => acc + (Number(l.duration) || 0), 0);

    return { percent, completedLessons, totalLessons, completedMins, totalMins };
  }, []);

  // CRUD for Courses
  const addCourse = useCallback((courseData) => {
    const id = 'course-' + Date.now();
    const newCourse = {
      id,
      title: courseData.title.trim(),
      instructor: courseData.instructor?.trim() || 'Self-Paced',
      category: courseData.category || 'Web Development',
      level: courseData.level || 'Beginner',
      status: courseData.status || 'Not Started',
      deadline: courseData.deadline || '',
      totalEstimatedHours: Number(courseData.totalEstimatedHours) || 10,
      coverColor: courseData.coverColor || 'from-indigo-600 to-violet-600',
      accentColor: courseData.accentColor || '#4f46e5',
      thumbnail: courseData.thumbnail?.trim() || '',
      playlistUrl: courseData.playlistUrl?.trim() || '',
      description: courseData.description?.trim() || '',
      createdAt: new Date().toISOString().split('T')[0],
      notes: courseData.notes?.trim() || '',
      keywords: courseData.keywords || courseData.tags || [],
      courseType: courseData.courseType || courseData.category || 'Web Development',
      lessons: courseData.lessons || []
    };

    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  }, []);

  const updateCourse = useCallback((courseId, updatedFields) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return { ...c, ...updatedFields };
        }
        return c;
      })
    );
  }, []);

  const deleteCourse = useCallback((courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  }, []);

  // CRUD for Lessons
  const addLesson = useCallback((courseId, lessonData) => {
    const lessonId = 'les-' + Date.now();
    const newLesson = {
      id: lessonId,
      title: lessonData.title.trim(),
      duration: Number(lessonData.duration) || 30,
      youtubeId: extractYoutubeId(lessonData.youtubeId || ''),
      completed: false,
      completedAt: null,
      notes: lessonData.notes?.trim() || ''
    };

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = [...(c.lessons || []), newLesson];
          return {
            ...c,
            lessons: updatedLessons,
            // If was Not Started, keep or move depending on status
            status: c.status === 'Completed' ? 'In Progress' : c.status
          };
        }
        return c;
      })
    );
  }, []);

  const updateLesson = useCallback((courseId, lessonId, updatedLessonData) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = c.lessons.map((l) =>
            l.id === lessonId
              ? {
                  ...l,
                  ...updatedLessonData,
                  youtubeId: updatedLessonData.youtubeId !== undefined
                    ? extractYoutubeId(updatedLessonData.youtubeId)
                    : l.youtubeId
                }
              : l
          );
          return { ...c, lessons: updatedLessons };
        }
        return c;
      })
    );
  }, []);

  const deleteLesson = useCallback((courseId, lessonId) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = c.lessons.filter((l) => l.id !== lessonId);
          return { ...c, lessons: updatedLessons };
        }
        return c;
      })
    );
  }, []);

  // Toggle Lesson Completion
  const toggleLesson = useCallback((courseId, lessonId) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          let wasCompleted = false;
          let lessonDuration = 30;

          const updatedLessons = c.lessons.map((l) => {
            if (l.id === lessonId) {
              wasCompleted = !l.completed;
              lessonDuration = l.duration || 30;
              return {
                ...l,
                completed: !l.completed,
                completedAt: !l.completed ? new Date().toISOString().split('T')[0] : null
              };
            }
            return l;
          });

          const completedCount = updatedLessons.filter((l) => l.completed).length;
          const totalCount = updatedLessons.length;
          const isAllCompleted = totalCount > 0 && completedCount === totalCount;

          let newStatus = c.status;
          if (isAllCompleted) {
            newStatus = 'Completed';
            fireConfetti();
          } else if (completedCount > 0) {
            newStatus = 'In Progress';
          } else if (completedCount === 0) {
            newStatus = 'Not Started';
          }

          // If lesson was just marked completed, automatically log study time for today
          if (wasCompleted) {
            const todayStr = new Date().toISOString().split('T')[0];
            setStudySessions((prevSessions) => [
              {
                id: 'sess-' + Date.now(),
                date: todayStr,
                minutes: lessonDuration,
                courseId: c.id,
                courseTitle: c.title,
                notes: `Completed lesson: ${c.lessons.find((l) => l.id === lessonId)?.title}`
              },
              ...prevSessions
            ]);
          }

          return {
            ...c,
            lessons: updatedLessons,
            status: newStatus
          };
        }
        return c;
      })
    );
  }, [fireConfetti]);

  // Update Course Notes
  const updateCourseNotes = useCallback((courseId, notes) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, notes } : c))
    );
  }, []);

  // Study Sessions Logging
  const logStudySession = useCallback(({ courseId, minutes, notes, date }) => {
    const todayStr = date || new Date().toISOString().split('T')[0];
    const targetCourse = courses.find((c) => c.id === courseId);

    const newSession = {
      id: 'sess-' + Date.now(),
      date: todayStr,
      minutes: Number(minutes) || 30,
      courseId: courseId || '',
      courseTitle: targetCourse ? targetCourse.title : 'General Study Session',
      notes: notes?.trim() || ''
    };

    setStudySessions((prev) => [newSession, ...prev]);

    // Check if daily target achieved and trigger celebration
    const todayTotalMins = studySessions
      .filter((s) => s.date === todayStr)
      .reduce((sum, s) => sum + s.minutes, 0) + (Number(minutes) || 30);

    if (todayTotalMins >= profile.dailyGoalMinutes) {
      fireConfetti();
    }
  }, [courses, studySessions, profile.dailyGoalMinutes, fireConfetti]);

  // Daily Habits
  const toggleHabit = useCallback((habitId) => {
    setDailyHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, completed: !h.completed } : h))
    );
  }, []);

  const addHabit = useCallback((habitData) => {
    const newHabit = {
      id: 'habit-' + Date.now(),
      title: habitData.title.trim(),
      targetMinutes: Number(habitData.targetMinutes) || 30,
      category: habitData.category || 'General',
      completed: false
    };
    setDailyHabits((prev) => [...prev, newHabit]);
  }, []);

  const deleteHabit = useCallback((habitId) => {
    setDailyHabits((prev) => prev.filter((h) => h.id !== habitId));
  }, []);

  // Profile update
  const updateProfile = useCallback((newProfileData) => {
    setProfile((prev) => ({ ...prev, ...newProfileData }));
  }, []);

  // Reset to initial sample data
  const resetToSampleData = useCallback(() => {
    setCourses(INITIAL_COURSES);
    setStudySessions(INITIAL_STUDY_SESSIONS);
    setDailyHabits(INITIAL_DAILY_HABITS);
    setProfile(INITIAL_USER_PROFILE);
    saveToStorage(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    saveToStorage(STORAGE_KEYS.SESSIONS, INITIAL_STUDY_SESSIONS);
    saveToStorage(STORAGE_KEYS.HABITS, INITIAL_DAILY_HABITS);
    saveToStorage(STORAGE_KEYS.PROFILE, INITIAL_USER_PROFILE);
    fireConfetti();
  }, [fireConfetti]);

  // Export JSON
  const exportDataJSON = useCallback(() => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      courses,
      studySessions,
      dailyHabits,
      profile
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edutrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [courses, studySessions, dailyHabits, profile]);

  // Import JSON
  const importDataJSON = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.courses && Array.isArray(parsed.courses)) {
        setCourses(parsed.courses);
      }
      if (parsed.studySessions && Array.isArray(parsed.studySessions)) {
        setStudySessions(parsed.studySessions);
      }
      if (parsed.dailyHabits && Array.isArray(parsed.dailyHabits)) {
        setDailyHabits(parsed.dailyHabits);
      }
      if (parsed.profile) {
        setProfile((prev) => ({ ...prev, ...parsed.profile }));
      }
      return true;
    } catch (e) {
      console.error('Failed to parse import JSON:', e);
      return false;
    }
  }, []);

  // Global Aggregated Statistics
  const stats = useMemo(() => {
    const totalEnrolled = courses.length;
    const completedCourses = courses.filter((c) => c.status === 'Completed').length;
    const inProgressCourses = courses.filter((c) => c.status === 'In Progress').length;
    const notStartedCourses = courses.filter((c) => c.status === 'Not Started').length;

    let totalLessonsCount = 0;
    let completedLessonsCount = 0;
    let totalEstimatedCourseHours = 0;

    courses.forEach((c) => {
      totalEstimatedCourseHours += Number(c.totalEstimatedHours) || 0;
      if (c.lessons) {
        totalLessonsCount += c.lessons.length;
        completedLessonsCount += c.lessons.filter((l) => l.completed).length;
      }
    });

    const overallProgressPercent =
      totalLessonsCount === 0 ? 0 : Math.round((completedLessonsCount / totalLessonsCount) * 100);

    // Total actual study hours from recorded sessions
    const totalStudyMinutes = studySessions.reduce((acc, s) => acc + (Number(s.minutes) || 0), 0);
    const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

    // Today's logged minutes
    const todayStr = new Date().toISOString().split('T')[0];
    const todayStudyMinutes = studySessions
      .filter((s) => s.date === todayStr)
      .reduce((acc, s) => acc + (Number(s.minutes) || 0), 0);

    // Past 7 days calculation
    const past7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayMinutes = studySessions
        .filter((s) => s.date === dateStr)
        .reduce((acc, s) => acc + (Number(s.minutes) || 0), 0);

      past7Days.push({
        date: dateStr,
        day: dayName,
        minutes: dayMinutes,
        hours: (dayMinutes / 60).toFixed(1)
      });
    }

    const past7DaysMinutes = past7Days.reduce((acc, d) => acc + d.minutes, 0);
    const past7DaysHours = (past7DaysMinutes / 60).toFixed(1);

    return {
      totalEnrolled,
      completedCourses,
      inProgressCourses,
      notStartedCourses,
      totalLessonsCount,
      completedLessonsCount,
      overallProgressPercent,
      totalStudyMinutes,
      totalStudyHours,
      todayStudyMinutes,
      past7Days,
      past7DaysHours,
      totalEstimatedCourseHours
    };
  }, [courses, studySessions]);

  const value = {
    courses,
    studySessions,
    dailyHabits,
    profile,
    stats,
    getCourseStats,
    addCourse,
    updateCourse,
    deleteCourse,
    addLesson,
    updateLesson,
    deleteLesson,
    toggleLesson,
    updateCourseNotes,
    logStudySession,
    toggleHabit,
    addHabit,
    deleteHabit,
    updateProfile,
    resetToSampleData,
    exportDataJSON,
    importDataJSON,
    fireConfetti
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

import { createId } from './id.js';

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function timestampDaysAgo(days, hour = 9) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function dateKeyDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return localDateKey(date);
}

export function addProgressActivity(book, nextPage, activities) {
  const previousHighWater = Number.isInteger(book.highestPageRead) ? book.highestPageRead : book.pagesRead;
  const pages = Math.max(0, nextPage - previousHighWater);

  book.pagesRead = nextPage;
  book.highestPageRead = Math.max(previousHighWater, nextPage);
  book.status = nextPage >= book.totalPages ? 'Completed' : nextPage > 0 ? 'Reading' : 'Want to Read';
  book.updatedAt = new Date().toISOString();

  if (pages === 0) return null;

  const activity = {
    id: createId(),
    bookId: book.id,
    pages,
    date: localDateKey(),
    createdAt: new Date().toISOString(),
  };
  activities.unshift(activity);
  return activity;
}

export function pagesReadOnDate(activities, date = localDateKey()) {
  return activities.reduce((total, activity) => total + (activity.date === date ? activity.pages : 0), 0);
}

export function getGoalProgress(activities, dailyTarget) {
  const date = localDateKey();
  const pagesRead = pagesReadOnDate(activities, date);
  return {
    date,
    dailyTarget,
    pagesRead,
    remainingPages: Math.max(0, dailyTarget - pagesRead),
    percentComplete: Math.min(100, Math.round((pagesRead / dailyTarget) * 100)),
    streak: getCurrentStreak(activities),
  };
}

export function getCurrentStreak(activities) {
  const today = localDateKey();
  const uniqueDates = [...new Set(activities.map((activity) => activity.date))].sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const yesterday = dateKeyDaysAgo(1);
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 0;
  let expectedDate = new Date(`${uniqueDates[0]}T12:00:00`);
  for (const date of uniqueDates) {
    if (date !== localDateKey(expectedDate)) break;
    streak += 1;
    expectedDate.setDate(expectedDate.getDate() - 1);
  }
  return streak;
}

export function activityForDisplay(activity, books) {
  const book = books.find((item) => item.id === activity.bookId);
  return {
    ...activity,
    bookTitle: book?.title || 'Removed book',
    detail: `Read ${activity.pages} ${activity.pages === 1 ? 'page' : 'pages'}`,
    type: 'progress',
  };
}

export function getWeeklySummary(activities) {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - mondayOffset + index);
    const key = localDateKey(date);
    return {
      date: key,
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      pages: pagesReadOnDate(activities, key),
    };
  });

  return {
    days,
    totalPages: days.reduce((total, day) => total + day.pages, 0),
    streak: getCurrentStreak(activities),
  };
}

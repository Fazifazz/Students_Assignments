import { dateKeyDaysAgo, timestampDaysAgo } from '../utils/reading.js';

const readingActivities = [
  {
    id: 'activity-1',
    bookId: 'book-1',
    pages: 24,
    date: dateKeyDaysAgo(0),
    createdAt: timestampDaysAgo(0, 9),
  },
  {
    id: 'activity-2',
    bookId: 'book-2',
    pages: 18,
    date: dateKeyDaysAgo(1),
    createdAt: timestampDaysAgo(1, 18),
  },
  {
    id: 'activity-3',
    bookId: 'book-4',
    pages: 16,
    date: dateKeyDaysAgo(2),
    createdAt: timestampDaysAgo(2, 8),
  },
];

export default readingActivities;

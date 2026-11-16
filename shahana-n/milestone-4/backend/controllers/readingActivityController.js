import readingActivities from '../data/readingActivities.js';
import books from '../data/books.js';
import { activityForDisplay } from '../utils/reading.js';

export function getReadingActivities(_request, response) {
  const activities = [...readingActivities]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((activity) => activityForDisplay(activity, books));
  response.json(activities);
}

import { apiClient } from './api';

export function normalizeBook(book) {
  return {
    ...book,
    id: String(book.id),
    coverUrl: book.coverImage ?? book.coverUrl ?? '',
    favorite: Boolean(book.isFavorite ?? book.favorite),
  };
}

export function serializeBook(book) {
  const { coverUrl, favorite, ...details } = book;
  return {
    ...details,
    coverImage: coverUrl ?? book.coverImage ?? '',
    isFavorite: favorite ?? book.isFavorite ?? false,
  };
}

export function normalizeWishlistBook(book) {
  return { ...book, id: String(book.id), coverUrl: book.coverImage ?? book.coverUrl ?? '' };
}

export function normalizeBookmark(bookmark) {
  return { ...bookmark, id: String(bookmark.id), bookId: String(bookmark.bookId) };
}

export function normalizeActivity(activity) {
  return { ...activity, id: String(activity.id), bookId: String(activity.bookId) };
}

export async function fetchReadingSummary() {
  const [progress, weeklySummary, activities] = await Promise.all([
    apiClient.get('/goals/progress'),
    apiClient.get('/goals/weekly-summary'),
    apiClient.get('/activities'),
  ]);
  return { progress: progress.data, weeklySummary: weeklySummary.data, activities: activities.data.map(normalizeActivity) };
}

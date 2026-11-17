import books from '../data/books.js';
import bookmarks from '../data/bookmarks.js';
import goals from '../data/goals.js';
import readingActivities from '../data/readingActivities.js';
import { activityForDisplay, addProgressActivity, getGoalProgress, getWeeklySummary } from '../utils/reading.js';
import { createId } from '../utils/id.js';
import { badRequest, notFoundError, requiredText, integerInRange, optionalText, validateBody, validateId } from '../utils/validation.js';

const allowedStatuses = new Set(['Reading', 'Completed', 'Want to Read']);

function publicBook(book) {
  const { highestPageRead, ...result } = book;
  return result;
}

function findBook(bookId) {
  const book = books.find((item) => item.id === bookId);
  if (!book) throw notFoundError('Book not found.');
  return book;
}

function readStatus(value, pagesRead, totalPages) {
  const status = value === 'Currently Reading' ? 'Reading' : value || 'Want to Read';
  if (!allowedStatuses.has(status)) {
    throw badRequest('Status must be Reading, Completed, or Want to Read.');
  }
  if (pagesRead >= totalPages) return 'Completed';
  if (pagesRead > 0 && status === 'Want to Read') return 'Reading';
  return status;
}

function normalizeFavorite(body) {
  const value = body.isFavorite ?? body.favorite ?? false;
  if (typeof value !== 'boolean') throw badRequest('isFavorite must be true or false.');
  return value;
}

export function getBooks(_request, response) {
  response.json(books.map(publicBook));
}

export function getBook(request, response) {
  validateId(request.params.bookId, 'Book ID');
  response.json(publicBook(findBook(request.params.bookId)));
}

export function createBook(request, response) {
  validateBody(request.body);
  const title = requiredText(request.body.title, 'Title');
  const author = requiredText(request.body.author, 'Author');
  const genre = requiredText(request.body.genre, 'Genre');
  const totalPages = integerInRange(request.body.totalPages, 'Total pages', 1);
  const pagesRead = request.body.pagesRead === undefined ? 0 : integerInRange(request.body.pagesRead, 'Pages read', 0, totalPages);
  const book = {
    id: createId(),
    title,
    author,
    genre,
    totalPages,
    pagesRead,
    highestPageRead: pagesRead,
    coverImage: optionalText(request.body.coverImage ?? request.body.coverUrl, 'Cover image URL', 2000),
    description: optionalText(request.body.description, 'Description'),
    status: readStatus(request.body.status, pagesRead, totalPages),
    isFavorite: normalizeFavorite(request.body),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  books.unshift(book);
  response.status(201).json(publicBook(book));
}

export function updateBook(request, response) {
  validateId(request.params.bookId, 'Book ID');
  validateBody(request.body);
  const book = findBook(request.params.bookId);

  const title = request.body.title === undefined ? book.title : requiredText(request.body.title, 'Title');
  const author = request.body.author === undefined ? book.author : requiredText(request.body.author, 'Author');
  const genre = request.body.genre === undefined ? book.genre : requiredText(request.body.genre, 'Genre');
  const totalPages = request.body.totalPages === undefined ? book.totalPages : integerInRange(request.body.totalPages, 'Total pages', 1);
  const pagesRead = request.body.pagesRead === undefined ? book.pagesRead : integerInRange(request.body.pagesRead, 'Pages read', 0, totalPages);

  book.title = title;
  book.author = author;
  book.genre = genre;
  book.totalPages = totalPages;
  if (pagesRead !== book.pagesRead) addProgressActivity(book, pagesRead, readingActivities);
  if (request.body.coverImage !== undefined || request.body.coverUrl !== undefined) {
    book.coverImage = optionalText(request.body.coverImage ?? request.body.coverUrl, 'Cover image URL', 2000);
  }
  if (request.body.description !== undefined) book.description = optionalText(request.body.description, 'Description');
  if (request.body.status !== undefined && pagesRead === book.pagesRead) {
    book.status = readStatus(request.body.status, book.pagesRead, book.totalPages);
  } else {
    book.status = readStatus(book.status, book.pagesRead, book.totalPages);
  }
  if (request.body.isFavorite !== undefined || request.body.favorite !== undefined) {
    book.isFavorite = normalizeFavorite(request.body);
  }
  book.updatedAt = new Date().toISOString();
  response.json(publicBook(book));
}

export function updateProgress(request, response) {
  validateId(request.params.bookId, 'Book ID');
  validateBody(request.body);
  const book = findBook(request.params.bookId);
  const pagesRead = integerInRange(request.body.pagesRead, 'Pages read', 0, book.totalPages);
  const activity = addProgressActivity(book, pagesRead, readingActivities);
  response.json({
    book: publicBook(book),
    activity,
    progress: getGoalProgress(readingActivities, goals[0].dailyTarget),
    weeklySummary: getWeeklySummary(readingActivities),
    activities: [...readingActivities]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((item) => activityForDisplay(item, books)),
  });
}

export function toggleFavorite(request, response) {
  validateId(request.params.bookId, 'Book ID');
  const book = findBook(request.params.bookId);
  book.isFavorite = !book.isFavorite;
  book.updatedAt = new Date().toISOString();
  response.json(publicBook(book));
}

export function deleteBook(request, response) {
  validateId(request.params.bookId, 'Book ID');
  const book = findBook(request.params.bookId);
  books.splice(books.indexOf(book), 1);
  for (let index = bookmarks.length - 1; index >= 0; index -= 1) {
    if (bookmarks[index].bookId === book.id) bookmarks.splice(index, 1);
  }
  response.status(204).end();
}


import bookmarks from '../data/bookmarks.js';
import books from '../data/books.js';
import { createId } from '../utils/id.js';
import { badRequest, notFoundError, optionalText, integerInRange, validateBody, validateId } from '../utils/validation.js';

function findBook(bookId) {
  const book = books.find((item) => item.id === bookId);
  if (!book) throw notFoundError('Book not found.');
  return book;
}

function findBookmark(bookId, bookmarkId) {
  const bookmark = bookmarks.find((item) => item.id === bookmarkId && item.bookId === bookId);
  if (!bookmark) throw notFoundError('Bookmark not found for this book.');
  return bookmark;
}

function validatePage(page, book) {
  return integerInRange(page, 'Page number', 1, book.totalPages);
}

export function getAllBookmarks(_request, response) {
  response.json([...bookmarks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

export function getBookBookmarks(request, response) {
  validateId(request.params.bookId, 'Book ID');
  findBook(request.params.bookId);
  response.json(bookmarks.filter((item) => item.bookId === request.params.bookId));
}

export function createBookmark(request, response) {
  validateId(request.params.bookId, 'Book ID');
  validateBody(request.body);
  const book = findBook(request.params.bookId);
  const bookmark = {
    id: createId(),
    bookId: book.id,
    page: validatePage(request.body.page, book),
    note: optionalText(request.body.note, 'Note', 2000),
    createdAt: new Date().toISOString(),
  };
  bookmarks.unshift(bookmark);
  response.status(201).json(bookmark);
}

export function updateBookmark(request, response) {
  validateId(request.params.bookId, 'Book ID');
  validateId(request.params.bookmarkId, 'Bookmark ID');
  validateBody(request.body);
  const book = findBook(request.params.bookId);
  const bookmark = findBookmark(request.params.bookId, request.params.bookmarkId);
  if (request.body.page !== undefined) bookmark.page = validatePage(request.body.page, book);
  if (request.body.note !== undefined) bookmark.note = optionalText(request.body.note, 'Note', 2000);
  response.json(bookmark);
}

export function deleteBookmark(request, response) {
  validateId(request.params.bookId, 'Book ID');
  validateId(request.params.bookmarkId, 'Bookmark ID');
  const bookmark = findBookmark(request.params.bookId, request.params.bookmarkId);
  bookmarks.splice(bookmarks.indexOf(bookmark), 1);
  response.status(204).end();
}

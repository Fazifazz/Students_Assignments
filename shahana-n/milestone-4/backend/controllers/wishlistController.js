import wishlist from '../data/wishlist.js';
import books from '../data/books.js';
import { createId } from '../utils/id.js';
import { conflictError, notFoundError, requiredText, optionalText, integerInRange, validateBody, validateId } from '../utils/validation.js';

function normalizeText(value) {
  return value.trim().toLocaleLowerCase();
}

function assertUnique(title, author, ignoreWishlistId = null) {
  const duplicateInWishlist = wishlist.some((item) => item.id !== ignoreWishlistId
    && normalizeText(item.title) === normalizeText(title)
    && normalizeText(item.author) === normalizeText(author));
  const duplicateInLibrary = books.some((item) => normalizeText(item.title) === normalizeText(title)
    && normalizeText(item.author) === normalizeText(author));
  if (duplicateInWishlist || duplicateInLibrary) {
    throw conflictError('A book with this title and author is already on your wishlist or in your library.');
  }
}

export function getWishlist(_request, response) {
  response.json(wishlist);
}

export function createWishlistBook(request, response) {
  validateBody(request.body);
  const title = requiredText(request.body.title, 'Title');
  const author = requiredText(request.body.author, 'Author');
  const genre = requiredText(request.body.genre, 'Genre');
  assertUnique(title, author);
  const item = {
    id: createId(),
    title,
    author,
    genre,
    coverImage: optionalText(request.body.coverImage ?? request.body.coverUrl, 'Cover image URL', 2000),
    createdAt: new Date().toISOString(),
  };
  wishlist.unshift(item);
  response.status(201).json(item);
}

export function deleteWishlistBook(request, response) {
  validateId(request.params.wishlistId, 'Wishlist ID');
  const item = wishlist.find((entry) => entry.id === request.params.wishlistId);
  if (!item) throw notFoundError('Wishlist item not found.');
  wishlist.splice(wishlist.indexOf(item), 1);
  response.status(204).end();
}

export function moveWishlistBookToLibrary(request, response) {
  validateId(request.params.wishlistId, 'Wishlist ID');
  validateBody(request.body);
  const item = wishlist.find((entry) => entry.id === request.params.wishlistId);
  if (!item) throw notFoundError('Wishlist item not found.');
  const duplicateInLibrary = books.some((book) => normalizeText(book.title) === normalizeText(item.title)
    && normalizeText(book.author) === normalizeText(item.author));
  if (duplicateInLibrary) throw conflictError('This book is already in your library.');
  const totalPages = integerInRange(request.body.totalPages, 'Total pages', 1);
  const book = {
    id: createId(),
    title: item.title,
    author: item.author,
    genre: item.genre,
    totalPages,
    pagesRead: 0,
    highestPageRead: 0,
    coverImage: item.coverImage,
    description: '',
    status: 'Want to Read',
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  wishlist.splice(wishlist.indexOf(item), 1);
  books.unshift(book);
  const { highestPageRead, ...publicBook } = book;
  response.status(201).json(publicBook);
}

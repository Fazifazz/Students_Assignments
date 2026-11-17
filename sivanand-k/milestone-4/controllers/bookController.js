const Book = require('../models/Book');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateBook(bookData) {
  if (!bookData || typeof bookData !== 'object' || Array.isArray(bookData)) {
    return 'Request body must be a JSON object';
  }

  const requiredStringFields = ['title', 'author', 'genre'];

  for (const field of requiredStringFields) {
    if (typeof bookData[field] !== 'string' || bookData[field].trim() === '') {
      return `${field} must be a non-empty string`;
    }
  }

  if (!Number.isInteger(bookData.publishedYear)) {
    return 'publishedYear must be an integer';
  }

  if (typeof bookData.available !== 'boolean') {
    return 'available must be a boolean';
  }

  return null;
}

function validateId(id) {
  if (!Book.isValidId(id)) {
    throw createError('Book ID must be a valid UUID', 400);
  }
}

function getAllBooks(req, res, next) {
  try {
    const search = req.query.search || req.query.q || '';
    const { genre } = req.query;
    res.status(200).json({ success: true, data: Book.getAll({ search, genre }) });
  } catch (error) {
    next(error);
  }
}

function searchBooks(req, res, next) {
  try {
    const search = req.query.search || req.query.q || '';
    const { genre } = req.query;
    res.status(200).json({ success: true, data: Book.getAll({ search, genre }) });
  } catch (error) {
    next(error);
  }
}

function getBookById(req, res, next) {
  try {
    validateId(req.params.id);
    const book = Book.findById(req.params.id);

    if (!book) {
      throw createError('Book not found', 404);
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

function createBook(req, res, next) {
  try {
    const validationError = validateBook(req.body);

    if (validationError) {
      throw createError(validationError, 400);
    }

    const book = Book.create({
      title: req.body.title.trim(),
      author: req.body.author.trim(),
      genre: req.body.genre.trim(),
      publishedYear: req.body.publishedYear,
      available: req.body.available
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

function updateBook(req, res, next) {
  try {
    validateId(req.params.id);
    const validationError = validateBook(req.body);

    if (validationError) {
      throw createError(validationError, 400);
    }

    const book = Book.update(req.params.id, {
      title: req.body.title.trim(),
      author: req.body.author.trim(),
      genre: req.body.genre.trim(),
      publishedYear: req.body.publishedYear,
      available: req.body.available
    });

    if (!book) {
      throw createError('Book not found', 404);
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
}

function deleteBook(req, res, next) {
  try {
    validateId(req.params.id);

    if (!Book.remove(req.params.id)) {
      throw createError('Book not found', 404);
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllBooks,
  searchBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};

const { randomUUID } = require('crypto');

const books = [
  {
    id: randomUUID(),
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    publishedYear: 1937,
    available: true
  },
  {
    id: randomUUID(),
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    publishedYear: 1813,
    available: true
  },
  {
    id: randomUUID(),
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    publishedYear: 1949,
    available: false
  },
  {
    id: randomUUID(),
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    publishedYear: 1925,
    available: true
  },
  {
    id: randomUUID(),
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    publishedYear: 1960,
    available: true
  }
];

function getAll(filters = {}) {
  let result = books;

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    result = result.filter((book) =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.genre) {
    const genre = filters.genre.toLowerCase();
    result = result.filter((book) => book.genre.toLowerCase() === genre);
  }

  return result;
}

function findById(id) {
  return books.find((book) => book.id === id);
}

function create(bookData) {
  const book = { id: randomUUID(), ...bookData };
  books.push(book);
  return book;
}

function update(id, bookData) {
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return undefined;
  }

  books[bookIndex] = { id, ...bookData };
  return books[bookIndex];
}

function remove(id) {
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return false;
  }

  books.splice(bookIndex, 1);
  return true;
}

function isValidId(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

module.exports = {
  getAll,
  findById,
  create,
  update,
  remove,
  isValidId
};

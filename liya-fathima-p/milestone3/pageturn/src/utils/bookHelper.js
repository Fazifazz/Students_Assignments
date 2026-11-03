export const STATUSES = [
  "Want to Read",
  "Currently Reading",
  "Completed",
];

export const GENRES = [
  "Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Biography",
  "Self-Help",
  "History",
  "Technology",
  "Other",
];

export const getProgress = (book) => {
  if (!book.totalPages || book.totalPages <= 0) return 0;

  return Math.min(
    100,
    Math.round((book.currentPage / book.totalPages) * 100)
  );
};

export const normalizeBook = (book) => {
  const totalPages = Math.max(1, Number(book.totalPages) || 1);
  const status = book.status || "Want to Read";

  let currentPage = Math.max(
    0,
    Math.min(totalPages, Number(book.currentPage) || 0)
  );

  if (status === "Completed") currentPage = totalPages;
  if (status === "Want to Read") currentPage = 0;

  return {
    ...book,
    totalPages,
    currentPage,
    status,
    rating: Math.min(5, Math.max(0, Number(book.rating) || 0)),
  };
};

const sampleBooks = [
  {
    id: "book-1",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    totalPages: 320,
    currentPage: 120,
    status: "Currently Reading",
    rating: 0,
    review: "",
    createdAt: "2026-10-20T10:00:00.000Z",
  },
  {
    id: "book-2",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
    totalPages: 208,
    currentPage: 208,
    status: "Completed",
    rating: 5,
    review: "A beautiful story about following your dreams.",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    id: "book-3",
    title: "Ikigai",
    author: "Héctor García and Francesc Miralles",
    genre: "Self-Help",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg",
    totalPages: 208,
    currentPage: 0,
    status: "Want to Read",
    rating: 0,
    review: "",
    createdAt: "2026-10-22T10:00:00.000Z",
  },
  {
    id: "book-4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
    totalPages: 310,
    currentPage: 85,
    status: "Currently Reading",
    rating: 0,
    review: "",
    createdAt: "2026-10-21T10:00:00.000Z",
  },
  {
    id: "book-5",
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Self-Help",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
    totalPages: 304,
    currentPage: 304,
    status: "Completed",
    rating: 4,
    review: "",
    createdAt: "2026-10-17T10:00:00.000Z",
  },
  {
    id: "book-6",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
    totalPages: 688,
    currentPage: 0,
    status: "Want to Read",
    rating: 0,
    review: "",
    createdAt: "2026-10-23T10:00:00.000Z",
  },
];

export const getInitialBooks = () => {
  try {
    const saved = localStorage.getItem("pageturn-books");

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeBook) : sampleBooks;
    }
  } catch (error) {
    console.error("Could not load saved books:", error);
  }

  return sampleBooks.map(normalizeBook);
};

export const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `book-${Date.now()}-${Math.random().toString(36).slice(2)}`;
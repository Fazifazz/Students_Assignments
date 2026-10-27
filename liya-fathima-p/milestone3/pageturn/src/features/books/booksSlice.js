import { createSlice } from "@reduxjs/toolkit";
import { getInitialBooks, normalizeBook } from "../../utils/bookHelper";

const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: getInitialBooks(),
  },
  reducers: {
    addBook: (state, action) => {
      state.books.unshift(normalizeBook(action.payload));
    },

    updateBook: (state, action) => {
      const index = state.books.findIndex(
        (book) => book.id === action.payload.id
      );

      if (index !== -1) {
        state.books[index] = normalizeBook({
          ...state.books[index],
          ...action.payload,
        });
      }
    },

    deleteBook: (state, action) => {
      state.books = state.books.filter(
        (book) => book.id !== action.payload
      );
    },

    updateReadingProgress: (state, action) => {
      const book = state.books.find(
        (item) => item.id === action.payload.id
      );

      if (!book) return;

      const page = Number(action.payload.currentPage);

      if (
        !Number.isFinite(page) ||
        page < 0 ||
        page > book.totalPages
      ) return;

      book.currentPage = page;

      if (page === book.totalPages) {
        book.status = "Completed";
      } else if (book.status === "Completed") {
        book.status = "Currently Reading";
      }
    },

    updateBookStatus: (state, action) => {
      const book = state.books.find(
        (item) => item.id === action.payload.id
      );

      if (!book) return;

      book.status = action.payload.status;

      if (book.status === "Completed") {
        book.currentPage = book.totalPages;
      } else if (book.status === "Want to Read") {
        book.currentPage = 0;
      }
    },

    updateBookRating: (state, action) => {
      const book = state.books.find(
        (item) => item.id === action.payload.id
      );

      if (!book) return;

      const { rating, review } = action.payload;

      if (rating !== undefined) {
        const value = Number(rating);
        book.rating =
          Number.isInteger(value) && value >= 0 && value <= 5
            ? value
            : 0;
      }

      if (review !== undefined) {
        book.review = review;
      }
    },
  },
});

export const {
  addBook,
  updateBook,
  deleteBook,
  updateReadingProgress,
  updateBookStatus,
  updateBookRating,
} = booksSlice.actions;

export default booksSlice.reducer;
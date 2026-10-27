import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../features/books/booksSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
});

// Persist Redux changes in one place, not separately in every page.
store.subscribe(() => {
  try {
    localStorage.setItem(
      "pageturn-books",
      JSON.stringify(store.getState().books.books)
    );
  } catch (error) {
    console.error("Could not save books:", error);
  }
});
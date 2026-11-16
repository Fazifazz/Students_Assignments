import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import bookmarksReducer from '../features/bookmarks/bookmarksSlice';
import goalsReducer from '../features/goals/goalsSlice';
import readingActivityReducer from '../features/readingActivity/readingActivitySlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    wishlist: wishlistReducer,
    bookmarks: bookmarksReducer,
    goals: goalsReducer,
    readingActivity: readingActivityReducer,
  },
});

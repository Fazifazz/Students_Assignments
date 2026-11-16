import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api';
import { fetchReadingSummary, normalizeActivity, normalizeBook, serializeBook } from '../../services/readtrackApi';
import { moveWishlistBook } from '../wishlist/wishlistSlice';

const requestError = (error, rejectWithValue) => rejectWithValue(error.response?.data?.message || error.message || 'The request could not be completed.');

export const fetchBooks = createAsyncThunk('books/fetchAll', async (_unused, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/books');
    return response.data.map(normalizeBook);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const fetchBook = createAsyncThunk('books/fetchOne', async (bookId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`/books/${bookId}`);
    return normalizeBook(response.data);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const addBook = createAsyncThunk('books/addBook', async (book, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/books', serializeBook(book));
    return normalizeBook(response.data);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const updateBook = createAsyncThunk('books/updateBook', async (book, { getState, rejectWithValue }) => {
  try {
    const previousBook = getState().books.items.find((item) => item.id === book.id);
    const response = await apiClient.put(`/books/${book.id}`, serializeBook(book));
    const progressChanged = previousBook && previousBook.pagesRead !== Number(book.pagesRead);
    const summary = progressChanged ? await fetchReadingSummary() : null;
    return {
      book: normalizeBook(response.data),
      progress: summary?.progress,
      weeklySummary: summary?.weeklySummary,
      activities: summary?.activities,
    };
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (bookId, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/books/${bookId}`);
    return String(bookId);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const toggleFavorite = createAsyncThunk('books/toggleFavorite', async (bookId, { rejectWithValue }) => {
  try {
    const response = await apiClient.patch(`/books/${bookId}/favourite`);
    return normalizeBook(response.data);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const updateProgress = createAsyncThunk('books/updateProgress', async ({ id, pagesRead }, { rejectWithValue }) => {
  try {
    const response = await apiClient.patch(`/books/${id}/progress`, { pagesRead });
    return {
      book: normalizeBook(response.data.book),
      activity: response.data.activity ? normalizeActivity(response.data.activity) : null,
      progress: response.data.progress,
      weeklySummary: response.data.weeklySummary,
      activities: response.data.activities.map(normalizeActivity),
    };
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

const booksSlice = createSlice({
  name: 'books',
  initialState: { items: [], loading: true, error: null },
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Books could not be loaded.';
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        const index = state.items.findIndex((book) => book.id === action.payload.id);
        if (index === -1) state.items.push(action.payload);
        else state.items[index] = action.payload;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.items.findIndex((book) => book.id === action.payload.book.id);
        if (index !== -1) state.items[index] = action.payload.book;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.items = state.items.filter((book) => book.id !== action.payload);
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const index = state.items.findIndex((book) => book.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        const index = state.items.findIndex((book) => book.id === action.payload.book.id);
        if (index !== -1) state.items[index] = action.payload.book;
        state.error = null;
      })
      .addCase(moveWishlistBook.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addMatcher((action) => action.type.startsWith('books/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('books/') && action.type.endsWith('/fulfilled'), (state) => {
        state.loading = false;
      })
      .addMatcher((action) => action.type.startsWith('books/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'The book request failed.';
      });
  },
});

export default booksSlice.reducer;

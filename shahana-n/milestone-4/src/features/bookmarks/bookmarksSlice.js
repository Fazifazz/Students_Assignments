import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api';
import { normalizeBookmark } from '../../services/readtrackApi';

const requestError = (error, rejectWithValue) => rejectWithValue(error.response?.data?.message || error.message || 'The request could not be completed.');

export const fetchBookmarks = createAsyncThunk('bookmarks/fetchAll', async (_unused, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/bookmarks');
    return response.data.map(normalizeBookmark);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const addBookmark = createAsyncThunk('bookmarks/add', async (bookmark, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(`/books/${bookmark.bookId}/bookmarks`, { page: bookmark.page, note: bookmark.note });
    return normalizeBookmark(response.data);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const updateBookmark = createAsyncThunk('bookmarks/update', async (bookmark, { rejectWithValue }) => {
  try {
    const response = await apiClient.put(`/books/${bookmark.bookId}/bookmarks/${bookmark.id}`, {
      page: bookmark.page,
      note: bookmark.note,
    });
    return normalizeBookmark(response.data);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const deleteBookmark = createAsyncThunk('bookmarks/delete', async (bookmarkId, { getState, rejectWithValue }) => {
  const bookmark = getState().bookmarks.items.find((item) => item.id === String(bookmarkId));
  if (!bookmark) return rejectWithValue('Bookmark not found.');
  try {
    await apiClient.delete(`/books/${bookmark.bookId}/bookmarks/${bookmark.id}`);
    return bookmark.id;
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: { items: [], loading: true, error: null },
  reducers: {
    setBookmarks(state, action) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Bookmarks could not be loaded.';
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(updateBookmark.fulfilled, (state, action) => {
        const index = state.items.findIndex((bookmark) => bookmark.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.error = null;
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.items = state.items.filter((bookmark) => bookmark.id !== action.payload);
        state.error = null;
      })
      .addCase('books/deleteBook/fulfilled', (state, action) => {
        state.items = state.items.filter((bookmark) => bookmark.bookId !== action.payload);
      })
      .addMatcher((action) => action.type.startsWith('bookmarks/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('bookmarks/') && action.type.endsWith('/fulfilled'), (state) => {
        state.loading = false;
      })
      .addMatcher((action) => action.type.startsWith('bookmarks/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'The bookmark request failed.';
      });
  },
});

export const { setBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;

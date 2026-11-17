import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api';
import { normalizeBook, normalizeWishlistBook } from '../../services/readtrackApi';

const requestError = (error, rejectWithValue) => rejectWithValue(error.response?.data?.message || error.message || 'The request could not be completed.');

export const fetchWishlist = createAsyncThunk('wishlist/fetchAll', async (_unused, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/wishlist');
    return response.data.map(normalizeWishlistBook);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const addWishlistBook = createAsyncThunk('wishlist/add', async (book, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/wishlist', {
      title: book.title,
      author: book.author,
      genre: book.genre,
      coverImage: book.coverUrl ?? book.coverImage ?? '',
    });
    return normalizeWishlistBook(response.data);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const removeWishlistBook = createAsyncThunk('wishlist/remove', async (wishlistId, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/wishlist/${wishlistId}`);
    return String(wishlistId);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const moveWishlistBook = createAsyncThunk('wishlist/moveToLibrary', async ({ id, totalPages }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(`/wishlist/${id}/move-to-library`, { totalPages });
    return normalizeBook(response.data);
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: true, error: null },
  reducers: {
    setWishlist(state, action) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'The wishlist could not be loaded.';
      })
      .addCase(addWishlistBook.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(removeWishlistBook.fulfilled, (state, action) => {
        state.items = state.items.filter((book) => book.id !== action.payload);
        state.error = null;
      })
      .addCase(moveWishlistBook.fulfilled, (state, action) => {
        state.items = state.items.filter((book) => book.id !== action.meta.arg.id);
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('wishlist/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('wishlist/') && action.type.endsWith('/fulfilled'), (state) => {
        state.loading = false;
      })
      .addMatcher((action) => action.type.startsWith('wishlist/') && action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'The wishlist request failed.';
      });
  },
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

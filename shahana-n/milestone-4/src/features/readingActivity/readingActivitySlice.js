import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api';
import { normalizeActivity } from '../../services/readtrackApi';

export const fetchReadingActivities = createAsyncThunk('readingActivity/fetchAll', async (_unused, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/activities');
    return response.data.map(normalizeActivity);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Reading activity could not be loaded.');
  }
});

const activitiesSlice = createSlice({
  name: 'readingActivity',
  initialState: { items: [], loading: true, error: null },
  reducers: {
    setReadingActivities(state, action) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchReadingActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReadingActivities.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchReadingActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Reading activity could not be loaded.';
      })
      .addCase('books/updateProgress/fulfilled', (state, action) => {
        state.items = action.payload.activities;
      })
      .addCase('books/updateBook/fulfilled', (state, action) => {
        if (action.payload.activities) state.items = action.payload.activities;
      });
  },
});

export const { setReadingActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;

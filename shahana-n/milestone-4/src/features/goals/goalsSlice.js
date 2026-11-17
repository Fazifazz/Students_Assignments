import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api';
import { fetchReadingSummary } from '../../services/readtrackApi';

const requestError = (error, rejectWithValue) => rejectWithValue(error.response?.data?.message || error.message || 'The request could not be completed.');

export const fetchGoals = createAsyncThunk('goals/fetch', async (_unused, { rejectWithValue }) => {
  try {
    const [goal, progress, weeklySummary] = await Promise.all([
      apiClient.get('/goals'),
      apiClient.get('/goals/progress'),
      apiClient.get('/goals/weekly-summary'),
    ]);
    return {
      dailyTarget: goal.data.dailyTarget,
      progress: progress.data,
      weeklySummary: weeklySummary.data,
    };
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

export const setDailyTarget = createAsyncThunk('goals/setDailyTarget', async (dailyTarget, { rejectWithValue }) => {
  try {
    const response = await apiClient.put('/goals', { dailyTarget: Number(dailyTarget) });
    const summary = await fetchReadingSummary();
    return { dailyTarget: response.data.dailyTarget, ...summary };
  } catch (error) {
    return requestError(error, rejectWithValue);
  }
});

function applyProgress(state, progress, weeklySummary) {
  state.dailyTarget = progress.dailyTarget;
  state.dailyProgress = Object.fromEntries(weeklySummary.days.map((day) => [day.date, day.pages]));
  state.streak = weeklySummary.streak;
  state.lastReadingDate = progress.pagesRead > 0 ? progress.date : null;
}

const goalsSlice = createSlice({
  name: 'goals',
  initialState: { dailyTarget: 30, dailyProgress: {}, streak: 0, lastReadingDate: null, loading: true, error: null },
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        applyProgress(state, action.payload.progress, action.payload.weeklySummary);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Reading goals could not be loaded.';
      })
      .addCase(setDailyTarget.fulfilled, (state, action) => {
        applyProgress(state, action.payload.progress, action.payload.weeklySummary);
        state.loading = false;
        state.error = null;
      })
      .addCase('books/updateProgress/fulfilled', (state, action) => {
        applyProgress(state, action.payload.progress, action.payload.weeklySummary);
      })
      .addCase('books/updateBook/fulfilled', (state, action) => {
        if (action.payload.progress && action.payload.weeklySummary) {
          applyProgress(state, action.payload.progress, action.payload.weeklySummary);
        }
      })
      .addCase(setDailyTarget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDailyTarget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'The reading goal could not be saved.';
      });
  },
});

export default goalsSlice.reducer;

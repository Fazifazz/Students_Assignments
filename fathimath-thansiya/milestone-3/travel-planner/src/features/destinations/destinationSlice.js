import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { destinations } from "../../data/destinations";
import { fetchCountryInfo } from "../../services/countriesApi";

const STORAGE_KEY = "travel-planner:favourites";

const loadFavouriteIds = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(saved || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const initialState = {
  all: destinations,
  favourites: loadFavouriteIds(),
  filters: {
    query: "",
    budget: "all",
    type: "all",
    style: "all",
    sort: "name",
  },
  countryInfo: {},
  loading: false,
  error: null,
};

export const fetchCountryDetails = createAsyncThunk(
  "destinations/fetchCountryDetails",
  async (countryName, { rejectWithValue }) => {
    try {
      const country = await fetchCountryInfo(countryName);
      return { countryName, country };
    } catch (error) {
      return rejectWithValue(
        error.message || "Could not fetch country details.",
      );
    }
  },
);

const destinationSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {
    toggleFavourite: (state, action) => {
      const destinationId = action.payload;
      if (state.favourites.includes(destinationId)) {
        state.favourites = state.favourites.filter(
          (id) => id !== destinationId,
        );
      } else {
        state.favourites = [...state.favourites, destinationId];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favourites));
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        query: "",
        budget: "all",
        type: "all",
        style: "all",
        sort: "name",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountryDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.country) {
          state.countryInfo[action.payload.countryName] =
            action.payload.country;
        }
      })
      .addCase(fetchCountryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Country information unavailable.";
      });
  },
});

export const { toggleFavourite, setFilters, clearFilters } =
  destinationSlice.actions;
export default destinationSlice.reducer;

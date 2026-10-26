import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "travel-planner:trips";

const loadTrips = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(saved || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const createActivityId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const tripSlice = createSlice({
  name: "trips",
  initialState: {
    trips: loadTrips(),
  },
  reducers: {
    createTrip: (state, action) => {
      const trip = {
        id: action.payload.id || `trip-${Date.now()}`,
        ...action.payload,
        itinerary: action.payload.itinerary || [],
        createdAt: new Date().toISOString(),
      };

      state.trips = [trip, ...state.trips];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trips));
    },
    updateTrip: (state, action) => {
      const updatedTrip = action.payload;
      state.trips = state.trips.map((trip) =>
        trip.id === updatedTrip.id ? { ...trip, ...updatedTrip } : trip,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trips));
    },
    deleteTrip: (state, action) => {
      state.trips = state.trips.filter((trip) => trip.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trips));
    },
    addActivity: (state, action) => {
      const { tripId, activity } = action.payload;
      state.trips = state.trips.map((trip) => {
        if (trip.id !== tripId) return trip;

        return {
          ...trip,
          itinerary: [
            ...(trip.itinerary || []),
            { ...activity, id: createActivityId() },
          ],
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trips));
    },
    updateActivity: (state, action) => {
      const { tripId, activityId, updates } = action.payload;
      state.trips = state.trips.map((trip) => {
        if (trip.id !== tripId) return trip;

        return {
          ...trip,
          itinerary: (trip.itinerary || []).map((activity) =>
            activity.id === activityId ? { ...activity, ...updates } : activity,
          ),
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trips));
    },
    deleteActivity: (state, action) => {
      const { tripId, activityId } = action.payload;
      state.trips = state.trips.map((trip) => {
        if (trip.id !== tripId) return trip;

        return {
          ...trip,
          itinerary: (trip.itinerary || []).filter(
            (activity) => activity.id !== activityId,
          ),
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trips));
    },
    reorderActivity: (state, action) => {
      const { tripId, activityId, direction } = action.payload;
      state.trips = state.trips.map((trip) => {
        if (trip.id !== tripId) return trip;

        const items = [...(trip.itinerary || [])];
        const index = items.findIndex((item) => item.id === activityId);

        if (index < 0) return trip;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return trip;

        const [moveItem] = items.splice(index, 1);
        items.splice(targetIndex, 0, moveItem);

        return { ...trip, itinerary: items };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.trips));
    },
  },
});

export const {
  createTrip,
  updateTrip,
  deleteTrip,
  addActivity,
  updateActivity,
  deleteActivity,
  reorderActivity,
} = tripSlice.actions;

export default tripSlice.reducer;

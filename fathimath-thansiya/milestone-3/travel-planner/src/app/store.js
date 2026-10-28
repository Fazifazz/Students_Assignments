import { configureStore } from "@reduxjs/toolkit";
import destinationReducer from "../features/destinations/destinationSlice";
import tripReducer from "../features/trips/tripSlice";
import budgetReducer from "../features/budget/budgetSlice";
import weatherReducer from "../features/weather/weatherSlice";

export const store = configureStore({
  reducer: {
    destinations: destinationReducer,
    trips: tripReducer,
    budget: budgetReducer,
    weather: weatherReducer,
  },
});

export default store;

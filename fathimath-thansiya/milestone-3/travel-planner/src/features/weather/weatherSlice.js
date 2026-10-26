import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWeatherForCoordinates } from "../../services/weatherApi";

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Heavy freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Heavy showers",
  82: "Violent showers",
  85: "Heavy snow showers",
  86: "Light snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Heavy thunderstorm with hail",
};

const normalizeWeatherData = (payload) => {
  const current = payload.current;
  const daily = payload.daily || {};

  return {
    current: {
      temperature: current?.temperature_2m ?? null,
      windSpeed: current?.wind_speed_10m ?? null,
      weatherCode: current?.weather_code ?? null,
      description:
        weatherCodeMap[current?.weather_code ?? 0] || "Weather conditions",
      time: current?.time ?? null,
    },
    forecast: (daily.time || []).map((date, index) => ({
      date,
      max: daily.temperature_2m_max?.[index] ?? null,
      min: daily.temperature_2m_min?.[index] ?? null,
      weatherCode: daily.weather_code?.[index] ?? null,
      description:
        weatherCodeMap[daily.weather_code?.[index] ?? 0] ||
        "Weather conditions",
    })),
  };
};

export const fetchWeatherForDestination = createAsyncThunk(
  "weather/fetchWeatherForDestination",
  async ({ id, latitude, longitude }, { rejectWithValue }) => {
    try {
      const data = await fetchWeatherForCoordinates({ latitude, longitude });
      return { id, data: normalizeWeatherData(data) };
    } catch (error) {
      return rejectWithValue(error.message || "Unable to fetch weather.");
    }
  },
);

const initialState = {
  byDestination: {},
  loadingByDestination: {},
  errorByDestination: {},
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherForDestination.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.loadingByDestination[id] = true;
        state.errorByDestination[id] = null;
      })
      .addCase(fetchWeatherForDestination.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.byDestination[id] = data;
        state.loadingByDestination[id] = false;
        state.errorByDestination[id] = null;
      })
      .addCase(fetchWeatherForDestination.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.loadingByDestination[id] = false;
        state.errorByDestination[id] =
          action.payload || "Could not load weather.";
      });
  },
});

export default weatherSlice.reducer;

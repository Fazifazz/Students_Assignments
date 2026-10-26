import axios from "axios";

const weatherClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 12000,
});

export const fetchWeatherForCoordinates = async ({ latitude, longitude }) => {
  const response = await weatherClient.get("/forecast", {
    params: {
      latitude,
      longitude,
      current: "temperature_2m,wind_speed_10m,weather_code",
      hourly: "temperature_2m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      forecast_days: 3,
      timezone: "auto",
    },
  });

  return response.data;
};

import axios from "axios";

const api = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

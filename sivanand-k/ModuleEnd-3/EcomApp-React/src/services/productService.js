import axios from "axios";

const API_URL = "https://shopnest-api-u2a8.onrender.com/products";

export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

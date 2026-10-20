// src/api/axiosInstance.js
// Configured Axios client strictly serving Indian & Kerala cuisine (no international items)
import axios from 'axios';
import { KERALA_RECIPES } from '../data/keralaRecipes';

const api = axios.create({
  baseURL: 'https://api.indianculinary.local',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to serve strictly authentic Indian and Kerala recipes
api.interceptors.request.use(async (config) => {
  const url = config.url || '';

  // Intercept search requests: /search.php?s={query}
  if (url.includes('/search.php')) {
    const query = (config.params?.s || '').toLowerCase().trim();

    let matchedRecipes = [];
    if (!query) {
      matchedRecipes = [...KERALA_RECIPES];
    } else {
      matchedRecipes = KERALA_RECIPES.filter((meal) => {
        const title = meal.strMeal.toLowerCase();
        const cat = meal.strCategory.toLowerCase();
        const tags = (meal.strTags || '').toLowerCase();
        const area = meal.strArea.toLowerCase();

        // Check title, category, tags, area, and ingredients
        const inIngredients = Array.from({ length: 12 }, (_, i) =>
          (meal[`strIngredient${i + 1}`] || '').toLowerCase()
        ).some((ing) => ing.includes(query));

        return (
          title.includes(query) ||
          cat.includes(query) ||
          tags.includes(query) ||
          area.includes(query) ||
          inIngredients
        );
      });
    }

    config.adapter = async () => ({
      data: { meals: matchedRecipes.length > 0 ? matchedRecipes : null },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    });
    return config;
  }

  // Intercept lookup by ID requests: /lookup.php?i={id}
  if (url.includes('/lookup.php')) {
    const id = config.params?.i;
    const recipe = KERALA_RECIPES.find((m) => String(m.idMeal) === String(id));

    config.adapter = async () => ({
      data: { meals: recipe ? [recipe] : null },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    });
    return config;
  }

  return config;
});

export default api;

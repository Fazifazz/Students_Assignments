// src/context/FavouritesContext.jsx
// Shared context to manage favourites state across navigation and persistence
import { createContext, useContext, useState, useEffect } from 'react';

const FavouritesContext = createContext(null);

const STORAGE_KEY = 'flavorfind_favourites_v1';

export function FavouritesProvider({ children }) {
  // Initialize from localStorage or empty array
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to parse favourites from localStorage', e);
      return [];
    }
  });

  // Sync to localStorage whenever favourites state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (e) {
      console.warn('Failed to save favourites to localStorage', e);
    }
  }, [favourites]);

  // Check if a recipe is already favourited
  const isFavourite = (idMeal) => {
    if (!idMeal) return false;
    return favourites.some((item) => String(item.idMeal) === String(idMeal));
  };

  // Add recipe to favourites
  const addToFavourites = (recipe) => {
    if (!recipe || !recipe.idMeal) return;
    setFavourites((prev) => {
      if (prev.some((item) => String(item.idMeal) === String(recipe.idMeal))) {
        return prev;
      }
      return [recipe, ...prev];
    });
  };

  // Remove recipe from favourites
  const removeFromFavourites = (idMeal) => {
    if (!idMeal) return;
    setFavourites((prev) => prev.filter((item) => String(item.idMeal) !== String(idMeal)));
  };

  // Toggle favourite status
  const toggleFavourite = (recipe) => {
    if (!recipe || !recipe.idMeal) return;
    if (isFavourite(recipe.idMeal)) {
      removeFromFavourites(recipe.idMeal);
    } else {
      addToFavourites(recipe);
    }
  };

  // Clear all favourites
  const clearFavourites = () => {
    setFavourites([]);
  };

  const value = {
    favourites,
    favouritesCount: favourites.length,
    isFavourite,
    addToFavourites,
    removeFromFavourites,
    toggleFavourite,
    clearFavourites,
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

/**
 * Custom hook to access favourites context
 */
export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
}

export default FavouritesContext;

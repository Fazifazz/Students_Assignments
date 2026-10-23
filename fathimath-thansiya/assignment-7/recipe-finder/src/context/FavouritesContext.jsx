import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const FavouritesContext = createContext({
  favourites: [],
  addFavourite: () => {},
  removeFavourite: () => {},
  isFavourite: () => false,
});

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  // Save favourites whenever they change
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = useCallback((recipe) => {
    setFavourites((prev) => {
      if (prev.some((r) => r.idMeal === recipe.idMeal)) return prev;
      return [...prev, recipe];
    });
  }, []);

  const removeFavourite = useCallback((id) => {
    setFavourites((prev) => prev.filter((r) => r.idMeal !== id));
  }, []);

  const isFavourite = useCallback(
    (id) => favourites.some((r) => r.idMeal === id),
    [favourites],
  );

  const value = useMemo(
    () => ({
      favourites,
      addFavourite,
      removeFavourite,
      isFavourite,
    }),
    [favourites, addFavourite, removeFavourite, isFavourite],
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

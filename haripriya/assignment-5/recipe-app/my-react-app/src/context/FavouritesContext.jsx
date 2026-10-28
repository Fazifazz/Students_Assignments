
import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
    const [favourites, setFavourites] = useLocalStorage(
        "favourites",
        []
    );

    const toggleFavourite = (recipe) => {
        setFavourites((prev) => {
            const exists = prev.some(
                (item) => item.idMeal === recipe.idMeal
            );

            if (exists) {
                return prev.filter(
                    (item) => item.idMeal !== recipe.idMeal
                );
            }

            return [...prev, recipe];
        });
    };

    return (
        <FavouritesContext.Provider
            value={{ favourites, toggleFavourite }}
        >
            {children}
        </FavouritesContext.Provider>
    );
}

export function useFavourites() {
    return useContext(FavouritesContext);
}

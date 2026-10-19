
import { useState } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Favourites from "./pages/Favourites";

function App() {
  const [favourites, setFavourites] = useState([]);

  function onToggleFavourite(recipe) {
    setFavourites((previous) => {
      const alreadySaved = previous.some(
        (item) => item.idMeal === recipe.idMeal
      );

      if (alreadySaved) {
        return previous.filter(
          (item) => item.idMeal !== recipe.idMeal
        );
      }

      return [...previous, recipe];
    });
  }

  return (
    <>
      <Navbar favouritesCount={favourites.length} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/recipes"
          element={
            <Recipes
              favourites={favourites}
              onToggleFavourite={onToggleFavourite}
            />
          }
        />

        <Route
          path="/recipes/:id"
          element={<RecipeDetail />}
        />

        <Route
          path="/favourites"
          element={
            <Favourites
              favourites={favourites}
              onToggleFavourite={onToggleFavourite}
            />
          }
        />

        <Route
          path="*"
          element={
            <main className="page-container">
              <h1>Page not found</h1>
            </main>
          }
        />
      </Routes>
    </>
  );
}

export default App;

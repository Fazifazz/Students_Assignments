import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Favourites from "./pages/Favourites";
import Footer from "./components/Footer";

function App() {
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favourites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  function handleSave(recipe) {
    setFavourites((current) => {
      const exists = current.some((item) => item.idMeal === recipe.idMeal);

      if (exists) {
        return current.filter((item) => item.idMeal !== recipe.idMeal);
      }

      return [...current, recipe];
    });
  }

  return (
    <>
      <Navbar favourites={favourites} />

      <Routes>
        <Route
          path="/"
          element={<Home favourites={favourites} onSave={handleSave} />}
        />

        <Route
          path="/recipes"
          element={<Recipes favourites={favourites} onSave={handleSave} />}
        />

        <Route
          path="/recipes/:id"
          element={<RecipeDetail favourites={favourites} onSave={handleSave} />}
        />

        <Route
          path="/favourites"
          element={<Favourites favourites={favourites} onSave={handleSave} />}
        />

        <Route
          path="*"
          element={
            <main className="container section">
              <h1>404 — Page not found</h1>
              <a href="/">Go Home</a>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}
export default App;

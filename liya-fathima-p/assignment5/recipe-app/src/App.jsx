import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Favourites from "./pages/Favourites";

function App() {
  const [favourites, setFavourites] = useState([]);

  // add if not present, remove if already present
  const toggleFavourite = (recipe) => {
    const exists = favourites.some((f) => f.idMeal === recipe.idMeal);
    if (exists) {
      setFavourites(favourites.filter((f) => f.idMeal !== recipe.idMeal));
    } else {
      setFavourites([...favourites, recipe]);
    }
  };

  return (
    <>
      <Navbar count={favourites.length} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/recipes"
            element={<Recipes favourites={favourites} toggleFavourite={toggleFavourite} />}
          />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route
            path="/favourites"
            element={<Favourites favourites={favourites} toggleFavourite={toggleFavourite} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
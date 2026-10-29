import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Recipes from './pages/Recipes.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import Favourites from './pages/Favourites.jsx';
import NotFound from './pages/NotFound.jsx';

// localStorage keeps saved recipes after a page refresh.
const STORAGE_KEY = 'recipe-haven-favourites';

function readFavourites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    // If saved data is damaged, start with an empty favourites list.
    return [];
  }
}

export default function App() {
  // Lift favourites state here so every page can read and update it.
  const [favourites, setFavourites] = useState(readFavourites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  function toggleFavourite(recipe) {
    setFavourites((currentFavourites) => {
      const alreadySaved = currentFavourites.some(
        (item) => item.idMeal === recipe.idMeal
      );

      if (alreadySaved) {
        return currentFavourites.filter((item) => item.idMeal !== recipe.idMeal);
      }

      return [...currentFavourites, recipe];
    });
  }

  return (
    <div className="app-shell">
      <Navbar favouriteCount={favourites.length} />

      {/* React Router chooses which page to show for the current URL. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/recipes"
          element={
            <Recipes
              favourites={favourites}
              onToggleFavourite={toggleFavourite}
            />
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <RecipeDetail
              favourites={favourites}
              onToggleFavourite={toggleFavourite}
            />
          }
        />
        <Route
          path="/favourites"
          element={
            <Favourites
              favourites={favourites}
              onToggleFavourite={toggleFavourite}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
          {/* Reusable footer appears on every page */}
          
      <Footer />
    </div>
  );
}

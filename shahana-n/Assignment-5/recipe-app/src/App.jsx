
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Recipes from './pages/Recipe';
import RecipeDetail from './pages/RecipeDetails';
import Favourites from './pages/Favourites';

function App() {
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favourites')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  function addToFavourites(recipe) {
    setFavourites((prev) => {
      if (prev.some((item) => item.idMeal === recipe.idMeal)) {
        return prev;
      }
      return [...prev, recipe];
    });
  }

  function removeFromFavourites(id) {
    setFavourites((prev) =>
      prev.filter((recipe) => recipe.idMeal !== id)
    );
  }

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                favourites={favourites}
                addToFavourites={addToFavourites}
                removeFromFavourites={removeFromFavourites}
              />
            }
          />

          <Route
            path="/recipes"
            element={
              <Recipes
                favourites={favourites}
                addToFavourites={addToFavourites}
                removeFromFavourites={removeFromFavourites}
              />
            }
          />

          <Route
            path="/recipes/:id"
            element={
              <RecipeDetail
                favourites={favourites}
                addToFavourites={addToFavourites}
              />
            }
          />

          <Route
            path="/favourites"
            element={
              <Favourites
               favourites={favourites}
               addToFavourites={addToFavourites}
               removeFromFavourites={removeFromFavourites}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;

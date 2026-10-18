import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import './App.css'
import Navbar from './components/navbar.jsx'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import RecipeDetails from './pages/RecipeDetails'
import Favourites from './pages/Favourites'

function App() {
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('recipe-favourites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(
      'recipe-favourites',
      JSON.stringify(favourites)
    )
  }, [favourites])

  function toggleFavourite(recipe) {
    setFavourites((current) => {
      const alreadySaved = current.some(
        (item) => item.idMeal === recipe.idMeal
      )

      if (alreadySaved) {
        return current.filter(
          (item) => item.idMeal !== recipe.idMeal
        )
      }

      return [...current, recipe]
    })
  }

  return (
    <BrowserRouter>
      <Navbar />

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
          path="/recipe/:id"
          element={<RecipeDetails />}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="footer">
        Made with ♥ for food lovers
      </footer>
    </BrowserRouter>
  )
}

export default App
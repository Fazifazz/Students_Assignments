import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetails'
import Favourites from './pages/Favourites'
import Home from './pages/Home'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
      <Footer />
    </>
  )

}
export default App
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import Recipes from './components/Recipes'
import RecipeDetails from './components/RecipeDetails'
import Favourites from './components/Favourites'
import NotFound from './components/NotFound'

import './App.css'

function App() {

  return (
    <>
      <div className="app">
        <Navbar />
         <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="*" element={<NotFound />} />
          </Routes> 
       </main> 
        <Footer />
      </div>
    </>
  )
}

export default App

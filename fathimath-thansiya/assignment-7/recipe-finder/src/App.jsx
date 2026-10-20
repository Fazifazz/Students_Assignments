import React from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer.jsx";
import Recipes from "./pages/Recipes.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import Favourites from "./pages/Favourites.jsx";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route
            path="*"
            element={
              <div className="not-found">
                <h2>404 — Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

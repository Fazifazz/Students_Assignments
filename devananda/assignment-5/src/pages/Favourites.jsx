import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'

function Favourites({ favourites, onToggleFavourite }) {
  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">YOUR PERSONAL COLLECTION</span>
        <h1>My Favourites ♥</h1>
        <p>Your saved recipes, all in one place.</p>
      </section>

      {favourites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h2>No favourites yet</h2>
          <p>Save recipes you love and they will appear here.</p>
          <Link to="/recipes?q=chicken" className="primary-link">
            Explore Recipes
          </Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {favourites.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              favourites={favourites}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default Favourites
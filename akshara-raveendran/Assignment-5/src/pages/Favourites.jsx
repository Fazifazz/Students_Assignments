import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecipeGrid from '../components/RecipeGrid.jsx';

export default function Favourites({ favourites, onToggleFavourite }) {
  return (
    <main className="page-shell">
      <section className="page-intro favourites-intro">
        <span className="eyebrow"><Heart size={14} /> YOUR PERSONAL COOKBOOK</span>
        <h1>Recipes to <em>love.</em></h1>
        <p>All your saved favourites, together in one delicious place.</p>
      </section>

      {favourites.length ? (
        <>
          <div className="results-heading">
            <div>
              <span className="eyebrow">SAVED FOR LATER</span>
              <h2>Your favourites</h2>
            </div>
            <span className="results-count"><Heart size={15} /> {favourites.length} saved</span>
          </div>
          <RecipeGrid
            recipes={favourites}
            favourites={favourites}
            onToggleFavourite={onToggleFavourite}
          />
        </>
      ) : (
        <div className="favourites-empty">
          <span className="empty-icon"><Heart size={28} /></span>
          <h2>Your cookbook is waiting.</h2>
          <p>Tap the heart on any recipe to save it here. Your favourites will be ready whenever you are.</p>
          <Link to="/recipes" className="button button-primary">
            Discover recipes <Search size={17} />
          </Link>
        </div>
      )}
    </main>
  );
}

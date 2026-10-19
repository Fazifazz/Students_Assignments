
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="hero">
      <div className="hero-content">
        <span className="eyebrow">YOUR EVERYDAY FOOD COMPANION</span>

        <h1>Discover recipes.<br />Create delicious memories.</h1>

        <p>
          Explore new dishes, discover cooking inspiration,
          and save your favourite recipes in one place.
        </p>

        <Link to="/recipes" className="primary-button">
          Explore Recipes →
        </Link>
      </div>
    </main>
  );
}

export default Home;


import { Link } from "react-router-dom";
import { Search, ChefHat, Heart, BookOpen } from "lucide-react";

function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            <ChefHat size={17} /> YOUR DAILY DOSE OF DELICIOUS
          </span>

          <h1>
            Good food.
            <br />
            <span>Good mood.</span>
          </h1>

          <p>
            Discover delicious recipes, explore new flavours,
            and find your next favourite meal.
          </p>

          <Link to="/recipes" className="primary-btn">
            <Search size={19} />
            Explore Recipes
          </Link>

          <div className="hero-note">
            <span>✦</span> Find something delicious to cook today
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
            alt="Freshly prepared colourful meal"
          />
          <div className="image-tag">
            <span>🍋</span>
            <div>
              <strong>Fresh ideas</strong>
              <small>Made for your kitchen</small>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span className="eyebrow">YOUR KITCHEN COMPANION</span>
          <h2>Everything you need to cook happy.</h2>
          <p>From finding inspiration to saving the recipes you love.</p>
        </div>

        <div className="feature-grid">
          <Link to="/recipes" className="feature-card">
            <div className="feature-icon orange">
              <Search size={25} />
            </div>
            <h3>Discover recipes</h3>
            <p>Find meals by searching for your favourite ingredients or dishes.</p>
            <span className="feature-link">Start exploring →</span>
          </Link>

          <Link to="/favourites" className="feature-card">
            <div className="feature-icon pink">
              <Heart size={25} />
            </div>
            <h3>Save favourites</h3>
            <p>Keep your favourite dishes together for the next time you cook.</p>
            <span className="feature-link">View favourites →</span>
          </Link>

          <Link to="/recipes" className="feature-card">
            <div className="feature-icon green">
              <BookOpen size={25} />
            </div>
            <h3>Learn to cook</h3>
            <p>Explore ingredients and step-by-step cooking instructions.</p>
            <span className="feature-link">Find a recipe →</span>
          </Link>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span className="eyebrow">A LITTLE INSPIRATION GOES A LONG WAY</span>
          <h2>Your next favourite dish is waiting.</h2>
          <p>Let's make something delicious today.</p>
        </div>
        <Link to="/recipes" className="primary-btn">
          Find a recipe →
        </Link>
      </section>
    </main>
  );
}

export default Home;

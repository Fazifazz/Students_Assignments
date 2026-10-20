import { Link } from "react-router-dom";

export default function Home() {
  const FEATURES = [
    {
      icon: "🔍",
      title: "Smart Search",
      text: "Find recipes by name, ingredient, or category using TheMealDB.",
      img: "/assets/feature-1.jpg",
    },
    {
      icon: "📖",
      title: "Full Details",
      text: "Ingredients, step-by-step instructions, and video tutorials.",
      img: "/assets/feature-2.jpg",
    },
    {
      icon: "⭐",
      title: "Save Favourites",
      text: "Bookmark recipes and keep them handy across your session.",
      img: "/assets/feature-3.jpg",
    },
  ];

  const POPULAR = [
    { q: "chicken", label: "Chicken", img: "/assets/chicken.jpg" },
    { q: "pasta", label: "Pasta", img: "/assets/pasta.jpg" },
    { q: "beef", label: "Beef", img: "/assets/beef.jpg" },
    { q: "dessert", label: "Dessert", img: "/assets/dessert.jpg" },
    { q: "seafood", label: "Seafood", img: "/assets/seafood.jpg" },
    { q: "vegan", label: "Vegan", img: "/assets/vegan.jpg" },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>Discover Delicious Recipes</h1>
          <p>
            Search thousands of recipes from around the world. Find dishes by
            name, save your favourites, and cook with confidence.
          </p>
          <div className="hero-actions">
            <Link to="/recipes" className="btn btn-primary btn-lg">
              Start Searching
            </Link>
            <Link to="/favourites" className="btn btn-secondary btn-lg">
              View Favourites
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/assets/hero.jpg"
            alt="A spread of fresh food on a table"
            loading="eager"
          />
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <h2>Why Cook With Us</h2>
          <p>Everything you need to find, plan, and cook your next meal.</p>
        </div>
        <div className="features">
          {FEATURES.map((f) => (
            <article className="feature-card" key={f.title}>
              <div
                className="feature-image"
                style={{ backgroundImage: `url(${f.img})` }}
                aria-hidden="true"
              />
              <div className="feature-body">
                <span className="feature-icon" aria-hidden="true">
                  {f.icon}
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-alt">
        <div className="section-head">
          <h2>Popular Categories</h2>
          <p>Jump straight into a category you love.</p>
        </div>
        <div className="category-grid">
          {POPULAR.map((c) => (
            <Link key={c.q} to={`/recipes?q=${c.q}`} className="category-card">
              <img src={c.img} alt={c.label} loading="lazy" />
              <span className="category-label">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

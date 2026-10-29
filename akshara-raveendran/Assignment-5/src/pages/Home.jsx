import { ArrowRight, Search, Sparkles, Leaf, Heart, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Chicken', note: 'Curry, roast & tandoori', emoji: '🍗', query: 'chicken' },
  { name: 'Seafood', note: 'Karimeen, prawns & mussels', emoji: '🐟', query: 'seafood' },
  { name: 'Vegetarian', note: 'Kuruma, gobi & avial', emoji: '🥥', query: 'vegetarian' },
  { name: 'South Indian', note: 'Kerala favourites & more', emoji: '🍛', query: 'kerala' },
];

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="pill-label"><Sparkles size={14} /> SOUTH INDIAN FLAVOURS, MADE LOVABLE</span>
          <h1>Find your next<br /><em>favourite</em> dish.</h1>
          <p>From Kerala chicken curry and karimeen mappas to prawn roast, veg kuruma and chilli gobi — discover dishes you love cooking at home.</p>
          <div className="hero-actions"><Link to="/recipes" className="button button-primary">Explore recipes <ArrowRight size={17} /></Link><span className="hero-note"><span className="avatar-stack"><i>🥑</i><i>🍋</i><i>🍅</i></span> Made for home cooks</span></div>
          <div className="hero-stats"><div><strong>15+</strong><span>South Indian dishes</span></div><div><strong>Easy</strong><span>Step-by-step guides</span></div><div><strong>Local</strong><span>favourite flavours</span></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame"><img src="/images/south-indian-hero.jpg" alt="Fresh colourful meal bowl with vegetables" /></div>
          <div className="floating-note note-top"><span className="note-icon"><Leaf size={17} /></span><span><b>Fresh ingredients</b><small>Always a good idea</small></span></div>
          <div className="floating-note note-bottom"><span className="rating-star">✦</span><span><b>A pinch of inspiration</b><small>For every kind of cook</small></span></div>
          <div className="hero-scribble">made with ♡</div>
        </div>
        <div className="hero-decor decor-one">✳</div><div className="hero-decor decor-two">✦</div>
      </section>

      <section className="category-section section-shell">
        <div className="section-heading"><div><span className="eyebrow">WHAT ARE YOU CRAVING?</span><h2>Explore our <em>menu</em></h2></div><Link to="/recipes" className="text-link">See all recipes <ArrowRight size={16} /></Link></div>
        <div className="category-grid">{categories.map(category => <Link key={category.name} to={`/recipes?search=${encodeURIComponent(category.query)}`} className="category-card"><span className="category-emoji">{category.emoji}</span><span className="category-name">{category.name}</span><span className="category-note">{category.note}</span><ArrowRight size={16} className="category-arrow" /></Link>)}</div>
      </section>
      <section className="home-cta"><div className="cta-icon"><ChefHat size={25} /></div><div><span className="eyebrow">YOUR NEXT DELICIOUS MOMENT</span><h2>Your next South Indian favourite is waiting.</h2><p>Find chicken, seafood and vegetarian dishes — from everyday curries to special treats.</p></div><Link to="/recipes" className="button button-light">Find a recipe <Search size={17} /></Link><Heart className="cta-heart" size={64} /></section>
    </main>
  );
}

import { Link } from "react-router-dom";
import { useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";

export default function Home({ products }) {
  const [selected, setSelected] = useState("all");
  const featured = products.filter((product) => selected === "all" || product.category === selected).slice(0, 8);

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow"><span className="eyebrow-line"></span> THE EVERYDAY EDITION</span>
              <h1>Good things.<br /><em>Thoughtfully</em> chosen.</h1>
              <p className="hero-copy">A considered collection of everyday essentials — from personal style to your workspace and reading shelf.</p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/products" className="btn btn-dark btn-lg rounded-pill px-4 hero-cta">Explore collection <i className="bi bi-arrow-up-right ms-2"></i></Link>
                <a href="#featured" className="btn btn-outline-dark btn-lg rounded-pill px-4">Discover more</a>
              </div>
              <div className="hero-proof"><div className="proof-avatars"><span>SN</span><span>✦</span><span>✓</span></div><div><strong>Simple choices, better days.</strong><small>Curated across 4 everyday categories</small></div></div>
            </div>
            <div className="col-lg-6">
              <div className="hero-visual">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=90" alt="Neutral wardrobe essentials arranged thoughtfully" />
                <div className="hero-image-label"><span>THE EDIT / 01</span><strong>Less, but considered.</strong></div>
                <div className="hero-stamp"><i className="bi bi-stars"></i><span>THE<br />SHOPNEST<br />STANDARD</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container category-intro section-space">
        <div className="section-heading-row"><div><span className="eyebrow">SHOP BY CATEGORY</span><h2>Find your everyday.</h2></div><Link to="/products" className="text-link">View all products <i className="bi bi-arrow-up-right"></i></Link></div>
        <div className="category-feature-grid">
          {[
            { name: "Clothing", text: "Pieces to wear on repeat.", icon: "bi-person-standing", category: "Clothing", image: "photo-1483985988355-763728e1935b" },
            { name: "Chappal & footwear", text: "Comfort from the ground up.", icon: "bi-handbag", category: "Chappal & Footwear", image: "photo-1543163521-1bf539c55dd2" },
            { name: "Electronics", text: "Tools for modern routines.", icon: "bi-headphones", category: "Electronics", image: "photo-1498049794561-7780e7231661" },
            { name: "Books", text: "Ideas worth spending time with.", icon: "bi-book", category: "Books", image: "photo-1507842217343-583bb7270b66" }
          ].map((item) => <Link to={`/products?category=${encodeURIComponent(item.category)}`} className="category-feature" key={item.category}>
            <img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=800&q=85`} alt="" loading="lazy" />
            <div className="category-feature-overlay"><span>{item.text}</span><h3>{item.name}</h3><span className="category-arrow"><i className="bi bi-arrow-up-right"></i></span></div>
          </Link>)}
        </div>
      </section>

      <section id="featured" className="featured-section section-space">
        <div className="container">
          <div className="section-heading-row"><div><span className="eyebrow">THE SHOPNEST SELECTION</span><h2>Considered favourites.</h2><p className="section-subtitle">A few well-chosen things to make daily life feel a little better.</p></div><Link to="/products" className="text-link">Browse collection <i className="bi bi-arrow-up-right"></i></Link></div>
          <CategoryFilter selected={selected} onSelect={setSelected} />
          <div className="mt-4"><ProductGrid products={featured} /></div>
        </div>
      </section>

      <section className="promise-band">
        <div className="container"><div className="row g-4">
          <div className="col-6 col-lg-3 promise-item"><i className="bi bi-box-seam"></i><div><strong>Thoughtful selection</strong><span>Useful, everyday finds</span></div></div>
          <div className="col-6 col-lg-3 promise-item"><i className="bi bi-shield-check"></i><div><strong>Clear information</strong><span>Details at a glance</span></div></div>
          <div className="col-6 col-lg-3 promise-item"><i className="bi bi-heart"></i><div><strong>Save your favourites</strong><span>Keep what you love close</span></div></div>
          <div className="col-6 col-lg-3 promise-item"><i className="bi bi-phone"></i><div><strong>Made for every screen</strong><span>Browse wherever you are</span></div></div>
        </div></div>
      </section>
    </>
  );
}
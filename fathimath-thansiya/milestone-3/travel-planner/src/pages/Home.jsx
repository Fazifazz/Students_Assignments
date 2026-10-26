import {
  ArrowRight,
  CalendarDays,
  MapPinned,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { toggleFavourite } from "../features/destinations/destinationSlice";
import DestinationCard from "../components/DestinationCard";

const categoryCards = [
  {
    title: "Beach escapes",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    type: "Beach",
  },
  {
    title: "Mountain air",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    type: "Mountain",
  },
  {
    title: "City stories",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
    type: "City",
  },
  {
    title: "Off-grid thrills",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    type: "Adventure",
  },
];

const steps = [
  {
    icon: MapPinned,
    title: "Choose your vibe",
    text: "Browse destinations curated around beaches, culture, nature, and city energy.",
  },
  {
    icon: CalendarDays,
    title: "Shape your itinerary",
    text: "Build a trip with dates, daily plans, and the perfect pace for your group.",
  },
  {
    icon: ShieldCheck,
    title: "Track spending",
    text: "Keep your budget in check with clear summaries and travel expense monitoring.",
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const destinations = useSelector((state) => state.destinations.all);
  const favourites = useSelector((state) => state.destinations.favourites);
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return destinations.slice(0, 3);

    return destinations
      .filter(
        (destination) =>
          destination.name.toLowerCase().includes(term) ||
          destination.country.toLowerCase().includes(term) ||
          destination.type.toLowerCase().includes(term),
      )
      .slice(0, 3);
  }, [destinations, search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="page-shell home-page">
      <section className="hero-section">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-light">
              Built for the curious traveller
            </span>
            <h1>Design a journey that feels effortlessly yours.</h1>
            <p>
              Discover inspiring destinations, shape unforgettable itineraries,
              and stay in control of your budget with a planner made for real
              travel life.
            </p>

            <form
              className="hero-search"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="field field-inline">
                <MapPinned size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search Bali, Paris, Tokyo..."
                  aria-label="Search destination"
                />
              </div>
              <Link to="/destinations" className="primary-btn">
                Explore trips
              </Link>
            </form>

            <div className="hero-metrics">
              <div>
                <strong>45K+</strong>
                <span>trips saved</span>
              </div>
              <div>
                <strong>12</strong>
                <span>dreamy destinations</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>traveller rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card card-one">
              <span className="eyebrow">This week</span>
              <h4>Greek islands</h4>
              <p>7 nights · from $980</p>
            </div>
            <div className="floating-card card-two">
              <Star size={16} />
              <span>Top rated</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container">
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Featured escapes</span>
              <h2>Curated for your next good story.</h2>
            </div>
            <Link to="/destinations" className="secondary-btn">
              See all destinations
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="destination-grid">
            {results.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isFavourite={favourites.includes(destination.id)}
                onToggleFavourite={(id) => dispatch(toggleFavourite(id))}
              />
            ))}
          </div>
        </section>

        <section className="section-block categories-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Travel styles</span>
              <h2>Find the rhythm that suits your mood.</h2>
            </div>
          </div>

          <div className="category-grid">
            {categoryCards.map((category) => (
              <div
                key={category.title}
                className="category-card"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="category-overlay" />
                <div className="category-card__content">
                  <span>{category.type}</span>
                  <h3>{category.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block planner-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>Plan with ease, not friction.</h2>
            </div>
          </div>

          <div className="steps-grid">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="step-card">
                <div className="step-badge">0{index + 1}</div>
                <div className="step-icon">
                  <Icon size={18} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-banner">
          <div>
            <span className="eyebrow eyebrow-light">Ready when you are</span>
            <h2>Build your next unforgettable trip.</h2>
          </div>
          <Link to="/trips/new" className="primary-btn inverse-btn">
            Start planning
            <TrendingUp size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
}

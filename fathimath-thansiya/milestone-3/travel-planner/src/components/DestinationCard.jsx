import { ArrowRight, Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

export default function DestinationCard({
  destination,
  isFavourite,
  onToggleFavourite,
}) {
  return (
    <article className="destination-card">
      <div className="destination-card__image-wrap">
        <img src={destination.image} alt={destination.name} loading="lazy" />
        <button
          type="button"
          className={`icon-btn favourite-btn ${isFavourite ? "active" : ""}`}
          onClick={() => onToggleFavourite(destination.id)}
          aria-label={
            isFavourite
              ? `Remove ${destination.name} from favourites`
              : `Add ${destination.name} to favourites`
          }
        >
          <Heart size={16} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="destination-card__body">
        <div className="destination-card__meta">
          <span className="pill">{destination.type}</span>
          <span className="rating">
            <Star size={14} fill="currentColor" />
            {destination.travelStyle}
          </span>
        </div>

        <h3>{destination.name}</h3>
        <div className="location-row">
          <MapPin size={14} />
          <span>
            {destination.country} · {destination.countryCode}
          </span>
        </div>

        <p>{destination.description}</p>

        <div className="destination-card__footer">
          <div>
            <span className="label">From</span>
            <strong>{formatCurrency(destination.dailyBudget, "USD")}</strong>
            <span className="muted">/ day</span>
          </div>

          <Link
            to={`/destinations/${destination.id}`}
            className="secondary-btn"
          >
            View
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DestinationCard from "../components/DestinationCard";
import EmptyState from "../components/EmptyState";
import { toggleFavourite } from "../features/destinations/destinationSlice";

export default function Favourites() {
  const dispatch = useDispatch();
  const destinations = useSelector((state) => state.destinations.all);
  const favourites = useSelector((state) => state.destinations.favourites);
  const savedDestinations = destinations.filter((destination) =>
    favourites.includes(destination.id),
  );

  if (savedDestinations.length === 0) {
    return (
      <div className="page-shell">
        <div className="container section-space">
          <EmptyState
            title="Your saved trips are waiting"
            description="Save a few destinations you love and they’ll appear here for easy planning."
            actionLabel="Find inspiration"
            actionTo="/destinations"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Favourites</span>
            <h1>Saved for later.</h1>
          </div>
          <Link to="/destinations" className="secondary-btn">
            Discover more
          </Link>
        </div>

        <div className="destination-grid">
          {savedDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isFavourite={true}
              onToggleFavourite={(id) => dispatch(toggleFavourite(id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

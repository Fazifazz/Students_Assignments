import { CalendarDays, MapPinned, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteTrip } from "../features/trips/tripSlice";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateRange } from "../utils/dateUtils";

export default function MyTrips() {
  const dispatch = useDispatch();
  const trips = useSelector((state) => state.trips.trips);
  const destinations = useSelector((state) => state.destinations.all);

  if (trips.length === 0) {
    return (
      <div className="page-shell">
        <div className="container section-space">
          <EmptyState
            title="No trips planned yet"
            description="Start by choosing a destination and building a trip around your travel style."
            actionLabel="Plan a trip"
            actionTo="/trips/new"
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
            <span className="eyebrow">My trips</span>
            <h1>Your upcoming escapes.</h1>
          </div>
          <Link to="/trips/new" className="primary-btn">
            <Plus size={16} />
            New trip
          </Link>
        </div>

        <div className="trip-list">
          {trips.map((trip) => {
            const destination =
              destinations.find((item) => item.id === trip.destinationId) ||
              destinations[0];

            return (
              <article key={trip.id} className="trip-card">
                <img src={destination.image} alt={destination.name} />
                <div className="trip-card__content">
                  <div className="trip-card__heading">
                    <div>
                      <span className="eyebrow">{trip.travelStyle}</span>
                      <h3>{destination.name}</h3>
                    </div>
                    <div className="trip-card__price">
                      {formatCurrency(trip.budget || 0, trip.currency || "USD")}
                    </div>
                  </div>

                  <div className="trip-meta-row">
                    <span>
                      <CalendarDays size={14} />{" "}
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </span>
                    <span>
                      <MapPinned size={14} /> {trip.travellers} travellers
                    </span>
                  </div>

                  <p>
                    {trip.notes ||
                      "A crafted trip built for discovery and comfort."}
                  </p>

                  <div className="trip-actions">
                    <Link to={`/trips/${trip.id}`} className="secondary-btn">
                      View trip
                    </Link>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => dispatch(deleteTrip(trip.id))}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeDollarSign,
  CalendarClock,
  Globe,
  Heart,
  Mail,
  MapPin,
  PhoneCall,
  PlaneTakeoff,
  Star,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  fetchCountryDetails,
  toggleFavourite,
} from "../features/destinations/destinationSlice";
import { fetchWeatherForDestination } from "../features/weather/weatherSlice";
import WeatherCard from "../components/WeatherCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import { formatCurrency } from "../utils/formatCurrency";

export default function DestinationDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const destinations = useSelector((state) => state.destinations.all);
  const favourites = useSelector((state) => state.destinations.favourites);
  const countryInfo = useSelector((state) => state.destinations.countryInfo);
  const weatherByDestination = useSelector(
    (state) => state.weather.byDestination,
  );
  const loadingWeather = useSelector(
    (state) => state.weather.loadingByDestination,
  );
  const errorWeather = useSelector((state) => state.weather.errorByDestination);

  const destination = useMemo(
    () => destinations.find((item) => item.id === id),
    [destinations, id],
  );

  useEffect(() => {
    if (!destination) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(fetchCountryDetails(destination.country));
    dispatch(
      fetchWeatherForDestination({
        id: destination.id,
        latitude: destination.latitude,
        longitude: destination.longitude,
      }),
    );
  }, [destination, dispatch]);

  if (!destination) {
    return (
      <div className="page-shell">
        <div className="container section-space">
          <ErrorState
            title="Destination not found"
            message="The destination you selected is no longer available."
          />
        </div>
      </div>
    );
  }

  const destinationCountry = countryInfo[destination.country] || null;
  const weather = weatherByDestination[destination.id];

  return (
    <div className="page-shell">
      <div className="container section-space detail-page">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="detail-hero">
          <img src={destination.image} alt={destination.name} />
          <div className="detail-hero__content">
            <span className="eyebrow eyebrow-light">{destination.type}</span>
            <h1>{destination.name}</h1>
            <div className="detail-meta">
              <span>
                <MapPin size={14} /> {destination.country}
              </span>
              <span>
                <Star size={14} /> {destination.travelStyle}
              </span>
            </div>
            <p>{destination.detailedDescription}</p>

            <div className="detail-cta-row">
              <button
                type="button"
                className="primary-btn"
                onClick={() => dispatch(toggleFavourite(destination.id))}
              >
                <Heart
                  size={16}
                  fill={
                    favourites.includes(destination.id)
                      ? "currentColor"
                      : "none"
                  }
                />
                {favourites.includes(destination.id)
                  ? "Saved"
                  : "Save to favourites"}
              </button>
              <Link
                to={`/trips/new?destination=${destination.id}`}
                className="secondary-btn"
              >
                <PlaneTakeoff size={16} />
                Create trip
              </Link>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <section className="detail-panel">
            <div className="section-heading compact-heading">
              <div>
                <span className="eyebrow">Overview</span>
                <h2>Why travellers love it</h2>
              </div>
            </div>
            <p>{destination.detailedDescription}</p>

            <div className="quick-stats">
              <div>
                <BadgeDollarSign size={18} />
                <span>Estimated daily cost</span>
                <strong>
                  {formatCurrency(destination.dailyBudget, "USD")}
                </strong>
              </div>
              <div>
                <CalendarClock size={18} />
                <span>Best season</span>
                <strong>Spring & Autumn</strong>
              </div>
            </div>

            <div className="info-columns">
              <div>
                <h3>Popular attractions</h3>
                <ul className="bullet-list">
                  {destination.attractions.map((attraction) => (
                    <li key={attraction}>{attraction}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Suggested activities</h3>
                <ul className="bullet-list">
                  {destination.activities.map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <aside className="detail-panel sidebar-panel">
            <span className="eyebrow">Country details</span>
            {destinationCountry ? (
              <div className="country-card">
                <img
                  src={destinationCountry.flags?.png}
                  alt={`${destination.country} flag`}
                />
                <div>
                  <strong>{destination.country}</strong>
                  <p>
                    {destinationCountry.capital?.[0] || destination.capital}
                  </p>
                  <p>{destinationCountry.region || destination.region}</p>
                </div>
              </div>
            ) : (
              <p>Country details are unavailable at the moment.</p>
            )}

            {destination.contact && (
              <div className="contact-block">
                <span className="eyebrow">Travel desk</span>
                <ul className="contact-list">
                  {destination.contact.phone && (
                    <li>
                      <PhoneCall size={15} />
                      {destination.contact.phone}
                    </li>
                  )}
                  {destination.contact.email && (
                    <li>
                      <Mail size={15} />
                      {destination.contact.email}
                    </li>
                  )}
                  {destination.contact.website && (
                    <li>
                      <Globe size={15} />
                      <a
                        href={destination.contact.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit website
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {loadingWeather[destination.id] ? (
              <LoadingSpinner label="Loading weather" />
            ) : (
              <WeatherCard
                weather={weather}
                loading={false}
                error={errorWeather[destination.id]}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

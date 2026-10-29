import EventImage from "./EventImage.jsx";

const categoryClasses = {
  Music: "category--music",
  Technology: "category--technology",
  Workshop: "category--workshop",
  Sports: "category--sports",
};

export default function EventCard({ event, onBook, onViewDetails }) {
  return (
    <article className="event-card">
      <div className="event-image-wrap">
        <button
          className="event-image-button"
          type="button"
          aria-label={`View details for ${event.name}`}
          onClick={() => onViewDetails(event)}
        >
          <EventImage
            src={event.image}
            alt={event.imageAlt}
            className="event-image"
          />
        </button>
        <span className={`category-pill ${categoryClasses[event.category]}`}>
          {event.category}
        </span>
        <span className={`image-spark image-spark--${event.accent}`} aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="event-info">
        <p className="event-date">{event.date}</p>
        <h3>
          <button
            className="event-title-button"
            type="button"
            onClick={() => onViewDetails(event)}
          >
            {event.name}
          </button>
        </h3>
        <p className="event-location">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 6.7c0 3.4-5 7.3-5 7.3S3 10.1 3 6.7a5 5 0 1 1 10 0Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="6.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          {event.location}
        </p>
        <div className="event-card-footer">
          <span className="price">
            <strong>${event.price}</strong> <span>/ person</span>
          </span>
          <button
            className="card-book-button"
            type="button"
            onClick={() => onBook(event)}
            aria-label={`Book Now for ${event.name}`}
          >
            Book Now <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </article>
  );
}

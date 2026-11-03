import { useState } from "react";
import EventImage from "./EventImage.jsx";

export default function EventDetailsSection({ event, onBack, onBook }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const gallery = event.images?.length
    ? event.images
    : [{ src: event.image, alt: event.imageAlt }];
  const activeImage = gallery[selectedImage] ?? gallery[0];
  const eventDay = event.date.split(" · ")[0];

  return (
    <section
      className="event-details-section page-shell"
      aria-labelledby="event-details-title"
    >
      <button className="details-back-link" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to Events
      </button>

      <div className="details-layout">
        <div className="details-gallery">
          <div className="details-main-image">
            <EventImage
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              className="details-main-photo"
              loading="eager"
            />
            <span className={`category-pill category--${event.category.toLowerCase()}`}>
              {event.category}
            </span>
          </div>
          <div className="details-thumbnails" aria-label={`${event.name} image gallery`}>
            {gallery.map((image, index) => (
              <button
                className={`details-thumbnail${selectedImage === index ? " details-thumbnail--active" : ""}`}
                key={image.src}
                type="button"
                aria-label={`Show image ${index + 1} of ${gallery.length}: ${image.alt}`}
                aria-pressed={selectedImage === index}
                onClick={() => setSelectedImage(index)}
              >
                <EventImage
                  key={`${image.src}-thumbnail`}
                  src={image.src}
                  alt=""
                  className="details-thumbnail-photo"
                />
              </button>
            ))}
          </div>
          {activeImage.credit && (
            <p className="details-image-credit">
              Photo:{" "}
              <a href={activeImage.creditUrl} target="_blank" rel="noreferrer">
                {activeImage.credit}
              </a>
            </p>
          )}
        </div>

        <div className="details-copy">
          <p className="eyebrow">A LITTLE MORE ABOUT THIS EVENT</p>
          <h1 id="event-details-title">{event.name}</h1>
          <p className="details-description">{event.description}</p>

          <dl className="details-facts">
            <div>
              <dt>Date</dt>
              <dd>{eventDay}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{event.time}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{event.venue}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{event.city}</dd>
            </div>
            <div>
              <dt>Ticket price</dt>
              <dd>${event.price} per person</dd>
            </div>
          </dl>

          <button
            className="button button--primary details-book-button"
            type="button"
            onClick={() => onBook(event)}
          >
            Book Now <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}

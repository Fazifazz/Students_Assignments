import EventImage from "./EventImage.jsx";

export default function MyBookingsSection({ bookings, events, onReturnToEvents }) {
  const eventsById = new Map(events.map((event) => [event.id, event]));

  return (
    <section
      className="events-section my-bookings-section page-shell"
      id="my-bookings"
      aria-labelledby="bookings-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR GOOD PLANS</p>
          <h2 id="bookings-title">
            My <span>Bookings</span>
          </h2>
        </div>
        <button className="text-link bookings-return-link" type="button" onClick={onReturnToEvents}>
          <span aria-hidden="true">←</span> Back to events
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-results">
          <span className="empty-results-icon" aria-hidden="true">
            ♡
          </span>
          <h3>No bookings yet</h3>
          <p>Your booked events will show up here. Find a good plan to get started.</p>
          <button className="clear-filters" type="button" onClick={onReturnToEvents}>
            Explore events
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const event = eventsById.get(booking.eventId);

            return (
              <article className="booking-card" key={booking.id}>
                {event && (
                  <EventImage
                    className="booking-card-image"
                    src={event.images?.[0]?.src ?? event.image}
                    alt={event.imageAlt}
                  />
                )}
                <div className="booking-card-content">
                  <div className="booking-card-heading">
                    <div>
                      <p className="event-date">{booking.eventDate}</p>
                      <h3>{booking.eventName}</h3>
                    </div>
                  </div>

                  <div className="booking-details">
                    <p>
                      <span>Venue</span>
                      <strong>{booking.venue}</strong>
                    </p>
                    <p>
                      <span>Attendee</span>
                      <strong>{booking.attendeeName}</strong>
                    </p>
                    <p>
                      <span>Tickets</span>
                      <strong>
                        {booking.quantity} {booking.quantity === 1 ? "ticket" : "tickets"}
                      </strong>
                    </p>
                    <p>
                      <span>Total price</span>
                      <strong>${Number(booking.totalPrice).toFixed(2)}</strong>
                    </p>
                  </div>

                  <p className="booking-card-reference">
                    Booking reference <strong>{booking.bookingReference}</strong>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

import { useEffect, useRef, useState } from "react";

const MAX_TICKETS = 10;

export default function BookingModal({ event, onClose, onBookingCreated }) {
  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);
  const totalPrice = event.price * Number(quantity);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    nameInputRef.current?.focus();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  function handleSubmit(submitEvent) {
    submitEvent.preventDefault();

    const nextErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      nextErrors.name = "Enter your name.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    const ticketCount = Number(quantity);
    if (!Number.isInteger(ticketCount) || ticketCount < 1 || ticketCount > MAX_TICKETS) {
      nextErrors.quantity = "Choose between 1 and 10 tickets.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const bookingReference = `EE-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    const newBooking = {
      id: bookingReference,
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      venue: event.location,
      attendeeName: trimmedName,
      email: trimmedEmail,
      quantity: ticketCount,
      totalPrice: event.price * ticketCount,
      bookingReference,
      bookedAt: new Date().toISOString(),
    };

    try {
      onBookingCreated(newBooking);
      setBooking(newBooking);
    } catch (error) {
      console.error("Could not save EventEase booking.", error);
      setErrors({
        submit: "We couldn’t save this booking. Please check browser storage and try again.",
      });
    }
  }

  return (
    <dialog
      className="booking-dialog"
      ref={dialogRef}
      aria-labelledby="booking-title"
      onCancel={(cancelEvent) => {
        cancelEvent.preventDefault();
        onClose();
      }}
      onClick={(clickEvent) => {
        if (clickEvent.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <button
        className="booking-close"
        type="button"
        aria-label="Close booking form"
        onClick={onClose}
      >
        ×
      </button>

      {booking ? (
        <section className="booking-confirmation" aria-live="polite">
          <span className="confirmation-mark" aria-hidden="true">
            ✓
          </span>
          <p className="eyebrow">BOOKING CONFIRMED</p>
          <h2 id="booking-title">You’re on the list, {booking.attendeeName}!</h2>
          <p>
            Your booking for <strong>{event.name}</strong> is ready.
          </p>
          <div className="confirmation-summary">
            <span>
              {booking.quantity} {booking.quantity === 1 ? "ticket" : "tickets"}
            </span>
            <strong>${booking.totalPrice.toFixed(2)}</strong>
          </div>
          <p className="booking-reference">
            Booking reference: <strong>{booking.bookingReference}</strong>
          </p>
          <p className="booking-disclaimer">
            This is a sample confirmation only. No real ticket has been reserved.
          </p>
          <button className="booking-submit" type="button" onClick={onClose}>
            Return to events
          </button>
        </section>
      ) : (
        <>
          <p className="eyebrow">YOUR NEXT GOOD PLAN</p>
          <h2 id="booking-title">Book your spot</h2>
          <div className="booking-event-summary">
            <h3>{event.name}</h3>
            <p>{event.date}</p>
            <p>{event.location}</p>
            <p className="booking-ticket-price">${event.price} per ticket</p>
          </div>

          <form className="booking-form" onSubmit={handleSubmit} noValidate>
            <div className="booking-field">
              <label htmlFor="booking-name">Your name</label>
              <input
                ref={nameInputRef}
                id="booking-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "booking-name-error" : undefined}
              />
              {errors.name && (
                <span className="booking-error" id="booking-name-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="booking-field">
              <label htmlFor="booking-email">Email address</label>
              <input
                id="booking-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "booking-email-error" : undefined}
              />
              {errors.email && (
                <span className="booking-error" id="booking-email-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="booking-field">
              <label htmlFor="booking-quantity">Ticket quantity</label>
              <select
                id="booking-quantity"
                name="quantity"
                value={quantity}
                onChange={(inputEvent) => setQuantity(inputEvent.target.value)}
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? "booking-quantity-error" : undefined}
              >
                {Array.from({ length: MAX_TICKETS }, (_, index) => index + 1).map(
                  (ticketCount) => (
                    <option key={ticketCount} value={ticketCount}>
                      {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"}
                    </option>
                  ),
                )}
              </select>
              {errors.quantity && (
                <span className="booking-error" id="booking-quantity-error">
                  {errors.quantity}
                </span>
              )}
            </div>

            <div className="booking-total" aria-live="polite">
              <span>Total</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
            <button className="booking-submit" type="submit">
              Confirm booking
            </button>
            <p className="booking-disclaimer">
              This sample site does not reserve a real ticket or process a payment.
            </p>
            {errors.submit && (
              <p className="booking-error" role="alert">
                {errors.submit}
              </p>
            )}
          </form>
        </>
      )}
    </dialog>
  );
}

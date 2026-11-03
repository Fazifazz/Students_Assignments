import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import EventsSection from "./components/EventsSection.jsx";
import MyBookingsSection from "./components/MyBookingsSection.jsx";
import EventDetailsSection from "./components/EventDetailsSection.jsx";
import BookingModal from "./components/BookingModal.jsx";
import Footer from "./components/Footer.jsx";
import { events } from "./data/events.js";

const BOOKINGS_STORAGE_KEY = "eventease-bookings";

function getScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function loadBookings() {
  try {
    const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!savedBookings) {
      return [];
    }

    const parsedBookings = JSON.parse(savedBookings);
    if (!Array.isArray(parsedBookings)) {
      throw new Error("Saved bookings must be a list.");
    }

    return parsedBookings;
  } catch (error) {
    console.error("Could not load EventEase bookings from LocalStorage.", error);
    return [];
  }
}

export default function App() {
  const [bookings, setBookings] = useState(loadBookings);
  const [activeView, setActiveView] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingEvent, setBookingEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  function saveBooking(booking) {
    const updatedBookings = [...bookings, booking];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  }

  return (
    <>
      <Navbar activeView={activeView} onNavigate={setActiveView} />
      <main>
        <div hidden={activeView !== "events"}>
          <Hero />
          <EventsSection
            events={events}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onBookEvent={setBookingEvent}
            onViewDetails={(event) => {
              setSelectedEvent(event);
              setActiveView("details");
              window.scrollTo({ top: 0, behavior: getScrollBehavior() });
            }}
          />
        </div>
        {activeView === "details" && selectedEvent && (
          <EventDetailsSection
            key={selectedEvent.id}
            event={selectedEvent}
            onBack={() => {
              setActiveView("events");
              window.scrollTo({ top: 0, behavior: getScrollBehavior() });
            }}
            onBook={setBookingEvent}
          />
        )}
        {activeView === "bookings" && (
          <MyBookingsSection
            bookings={bookings}
            events={events}
            onReturnToEvents={() => setActiveView("events")}
          />
        )}
      </main>
      {bookingEvent && (
        <BookingModal
          event={bookingEvent}
          onClose={() => setBookingEvent(null)}
          onBookingCreated={saveBooking}
        />
      )}
      <Footer
        activeView={activeView}
        onNavigate={setActiveView}
        onCategorySelect={setSelectedCategory}
      />
    </>
  );
}

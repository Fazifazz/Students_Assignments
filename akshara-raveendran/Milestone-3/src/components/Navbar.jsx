import { useEffect, useState } from "react";

export default function Navbar({ activeView, onNavigate }) {
  const [activeSection, setActiveSection] = useState("discover");

  function getScrollBehavior() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
  }

  useEffect(() => {
    if (activeView !== "events") {
      return undefined;
    }

    function updateActiveSection() {
      const sections = ["discover", "events", "about"];
      let currentSection = sections[0];

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && section.getBoundingClientRect().top <= 140) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [activeView]);

  function navigate(event, view) {
    event.preventDefault();
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
  }

  function navigateToSection(event, sectionId) {
    event.preventDefault();

    if (activeView !== "events") {
      onNavigate("events");
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: getScrollBehavior(),
        });
      }, 0);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: getScrollBehavior(),
    });
  }

  return (
    <header className="site-header" id="home">
      <nav className="navbar page-shell" aria-label="Main navigation">
        <a
          className="brand"
          href="#home"
          aria-label="EventEase home"
          onClick={(event) => navigate(event, "events")}
        >
          <span className="brand-mark" aria-hidden="true">
            e
          </span>
          <span>event<span className="brand-accent">ease</span></span>
        </a>

        <div className="nav-links">
          <a
            className={`nav-link${activeView === "events" && activeSection === "discover" ? " nav-link--active" : ""}`}
            href="#discover"
            onClick={(event) => navigateToSection(event, "discover")}
            aria-current={activeView === "events" && activeSection === "discover" ? "location" : undefined}
          >
            Discover
          </a>
          <a
            className={`nav-link${activeView === "events" && activeSection === "events" ? " nav-link--active" : ""}`}
            href="#events"
            onClick={(event) => navigateToSection(event, "events")}
            aria-current={activeView === "events" && activeSection === "events" ? "location" : undefined}
          >
            Events
          </a>
          <a
            className={`nav-link nav-link--bookings${activeView === "bookings" ? " nav-link--active" : ""}`}
            href="#my-bookings"
            onClick={(event) => navigate(event, "bookings")}
            aria-current={activeView === "bookings" ? "page" : undefined}
          >
            My Bookings
          </a>
          <a
            className={`nav-link${activeView === "events" && activeSection === "about" ? " nav-link--active" : ""}`}
            href="#about"
            onClick={(event) => navigateToSection(event, "about")}
            aria-current={activeView === "events" && activeSection === "about" ? "location" : undefined}
          >
            About
          </a>
        </div>

        <a
          className="nav-cta"
          href="#events"
          onClick={(event) => navigateToSection(event, "events")}
        >
          Explore events <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}

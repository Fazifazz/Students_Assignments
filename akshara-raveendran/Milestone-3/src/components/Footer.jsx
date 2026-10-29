import { useEffect, useState } from "react";
import "./Footer.css";

const categories = ["Music", "Technology", "Workshop", "Sports"];

function getScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

const socialLinks = [
  {
    name: "Instagram",
    label: "Instagram (official link not configured)",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle className="social-icon-dot" cx="17.5" cy="6.8" r="1" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    label: "TikTok (official link not configured)",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 3v11.2a4.1 4.1 0 1 1-3.2-4V7a7.3 7.3 0 1 0 6.4 7.2V9.5a9 9 0 0 0 4.2 1.1V7.3A5.5 5.5 0 0 1 16.8 3H14Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    label: "Facebook (official link not configured)",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" />
      </svg>
    ),
  },
];

export default function Footer({
  activeView,
  onNavigate,
  onCategorySelect,
}) {
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [isNewsletterSuccess, setIsNewsletterSuccess] = useState(false);
  const [successVersion, setSuccessVersion] = useState(0);

  useEffect(() => {
    if (!isNewsletterSuccess) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNewsletterMessage("");
      setIsNewsletterSuccess(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [isNewsletterSuccess, successVersion]);

  function navigate(event, view) {
    event.preventDefault();
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
  }

  function selectCategory(event, category) {
    event.preventDefault();
    onCategorySelect(category);
    onNavigate("events");
    window.setTimeout(() => {
      document.getElementById("events")?.scrollIntoView({
        behavior: getScrollBehavior(),
      });
    }, 0);
  }

  function handleNewsletterSubmit(event) {
    event.preventDefault();
    setNewsletterMessage("");
    setIsNewsletterSuccess(false);
    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setNewsletterMessage("Enter a valid email address to continue.");
      return;
    }

    setEmail("");
    setIsNewsletterSuccess(true);
    setNewsletterMessage("Thanks for Subscribing!");
    setSuccessVersion((version) => version + 1);
  }

  return (
    <footer className="site-footer" id="about">
      <div className="footer-main page-shell">
        <section className="footer-brand-column" aria-label="About EventEase">
          <a
            className="brand brand--footer"
            href="#home"
            aria-label="EventEase home"
            onClick={(event) => navigate(event, "events")}
          >
            <span className="brand-mark" aria-hidden="true">
              e
            </span>
            <span>
              event<span className="brand-accent">ease</span>
            </span>
          </a>
          <h2>Make room for something good.</h2>
          <p>
            Discover experiences worth leaving home for, from live music and
            creative workshops to technology events and sports.
          </p>
          <div className="footer-socials" id="social-links" aria-label="Social media">
            {socialLinks.map((social) => (
              <a
                className="footer-social-link"
                href="#social-links"
                key={social.name}
                aria-label={social.label}
                title={`${social.name}: official link not configured`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </section>

        <nav className="footer-link-column" aria-label="Quick links">
          <h3>Quick links</h3>
          <a
            className={activeView === "events" ? "footer-link--active" : ""}
            href="#events"
            onClick={(event) => navigate(event, "events")}
          >
            Discover
          </a>
          <a href="#events" onClick={(event) => navigate(event, "events")}>
            Events
          </a>
          <a
            className={activeView === "bookings" ? "footer-link--active" : ""}
            href="#my-bookings"
            onClick={(event) => navigate(event, "bookings")}
          >
            My Bookings
          </a>
          <a href="#about">About</a>
        </nav>

        <nav className="footer-link-column" aria-label="Explore categories">
          <h3>Explore categories</h3>
          {categories.map((category) => (
            <a
              href="#events"
              key={category}
              onClick={(event) => selectCategory(event, category)}
            >
              {category}
            </a>
          ))}
        </nav>

        <section className="footer-newsletter" aria-labelledby="newsletter-title">
          <p className="footer-eyebrow">THE OCCASIONAL GOOD THING</p>
          <h3 id="newsletter-title">Good plans, straight to your inbox.</h3>
          <p className="footer-newsletter-description">
            A little inspiration for your next night out.
          </p>
          <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit} noValidate>
            <label className="footer-visually-hidden" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Your email address"
              value={email}
              aria-invalid={Boolean(newsletterMessage && !isNewsletterSuccess)}
              aria-describedby={newsletterMessage ? "newsletter-message" : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setNewsletterMessage("");
                setIsNewsletterSuccess(false);
              }}
            />
            <button type="submit">Subscribe</button>
          </form>
          <p
            className={`footer-newsletter-message${isNewsletterSuccess ? " footer-newsletter-message--success" : ""}`}
            id="newsletter-message"
            role="status"
            aria-live="polite"
          >
            {newsletterMessage}
          </p>
        </section>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner page-shell">
          <span>© {new Date().getFullYear()} EventEase</span>
          <span className="footer-bottom-message">
            Made for real people and real moments.
          </span>
          <a className="back-to-top" href="#home">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

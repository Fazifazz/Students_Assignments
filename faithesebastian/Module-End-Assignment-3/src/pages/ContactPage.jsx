import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitMessage(event) {
    event.preventDefault();
    const endpoint = import.meta.env.VITE_CONTACT_API_URL;

    if (!endpoint) {
      setStatus(
        "The message form is ready, but ShopNest support is not connected yet. Please try again later.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;
    const message = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    setSubmitting(true);
    setStatus("");
    try {
      await axios.post(endpoint, message);
      form.reset();
      setStatus("Thanks for getting in touch. Your message has been sent.");
    } catch (error) {
      console.error("Unable to submit the ShopNest contact message.", error);
      setStatus(
        "We couldn’t send your message right now. Please try again later.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container page-section contact-page">
      <div className="contact-layout">
        <div className="contact-intro">
          <span className="eyebrow contact-eyebrow">We’re here to help</span>
          <h1>Contact ShopNest</h1>
          <p>
            Have a question about a product or your shopping experience? Send
            us a message and we’ll be happy to help.
          </p>
          <p className="contact-back-link">
            Looking for something? <Link to="/products">Browse our products</Link>.
          </p>
        </div>
        <form className="contact-form" onSubmit={submitMessage}>
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
          />

          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />

          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            maxLength={150}
          />

          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows="6"
            required
            maxLength={5000}
          />

          <button
            className="button button-primary contact-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Send Message"}
          </button>
          <p className="contact-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

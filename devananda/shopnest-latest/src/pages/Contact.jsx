
import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <main className="page-container contact-page">
      <h1>Contact ShopNest</h1>
      <p>Have a question? Send us a message.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" required />
        </label>

        <label>
          Email
          <input name="email" type="email" required />
        </label>

        <label>
          Message
          <textarea name="message" rows="5" required />
        </label>

        <button type="submit" className="button">Send Message</button>
      </form>

      {submitted && <p>Your message has been submitted in this demo.</p>}

      <div className="contact-info">
        <p>Email: support@shopnest.com</p>
        <p>Phone: +91 9876212916</p>
        <p>Location: Haripad, Kerala</p>
      </div>
    </main>
  );
}
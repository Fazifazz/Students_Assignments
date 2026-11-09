function Contact() {
  return (
    <div className="contact-page">

      <h1>Contact Us</h1>

      <p>
        Have questions? We'd love to hear from you.
      </p>

      <form className="contact-form">

        <div>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Write your message..."
            rows="5"
            required
          />
        </div>

        <button type="submit">
          Send Message
        </button>

      </form>

    </div>
  );
}

export default Contact;
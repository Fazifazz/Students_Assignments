
function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Thank you! Your message has been submitted.");
    event.target.reset();
  };

  return (
    <section className="container py-5">

      <div className="section-heading">
        <p className="section-eyebrow">WE ARE HERE TO HELP</p>
        <h2>
          Contact <span className="head-span">Us</span>
        </h2>
        <p className="section-description">
          Have a question? Get in touch with our team.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7">

          <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">

            <div className="mb-3">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Write your message..."
                required
              ></textarea>
            </div>

            <button type="submit" className="add-cart-btn">
              Send Message
            </button>

          </form>
        </div>
      </div>

    </section>
  );
}

export default Contact;

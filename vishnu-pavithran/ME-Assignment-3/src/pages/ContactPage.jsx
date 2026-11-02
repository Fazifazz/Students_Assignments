import { useState } from "react";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }

  return (
    <main className="container contact-page py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <div className="contact-card">
            <h1 className="section-title mb-3">Contact Us</h1>
            <p className="text-muted mb-4">
              Have a question? Fill out the form below.
            </p>

            {submitted && (
              <div className="alert alert-success" role="status">
                Your form was submitted successfully in this session. It has not
                been sent to an email address.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    className="form-control"
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    className="form-control"
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    className="form-control"
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="contact-message"
                    name="message"
                    rows="6"
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" type="submit">
                    Submit Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;

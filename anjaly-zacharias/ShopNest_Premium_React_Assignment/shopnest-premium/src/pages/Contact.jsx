import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "Product enquiry", message: "" });
  const { showToast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    showToast("Thank you — your demo message has been validated.");
    setForm({ name: "", email: "", topic: "Product enquiry", message: "" });
  };

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  return (
    <section className="container section-space contact-page">
      <div className="row g-5">
        <div className="col-lg-5 contact-intro"><span className="eyebrow">WE’RE HERE TO HELP</span><h1>Good service<br /><em>starts with listening.</em></h1><p>Questions about the collection or need help finding the right item? Send a note using the form.</p><div className="contact-detail"><i className="bi bi-envelope"></i><div><strong>Email support</strong><span>hello@shopnest.example</span></div></div><div className="contact-detail"><i className="bi bi-clock"></i><div><strong>Support hours</strong><span>Monday–Friday · 9:00 AM–5:00 PM</span></div></div><p className="contact-demo-note">This is a frontend demo. The form validates input locally and does not send an email.</p></div>
        <div className="col-lg-7"><form className="contact-form" onSubmit={handleSubmit}><span className="eyebrow">CONTACT FORM</span><h2>How can we help?</h2>
          <div className="row g-3 mt-2"><div className="col-md-6"><label htmlFor="name" className="form-label">Your name</label><input id="name" name="name" className="form-control" required value={form.name} onChange={update} placeholder="Enter your name" /></div><div className="col-md-6"><label htmlFor="email" className="form-label">Email address</label><input id="email" name="email" type="email" className="form-control" required value={form.email} onChange={update} placeholder="you@example.com" /></div>
          <div className="col-12"><label htmlFor="topic" className="form-label">What is this about?</label><select id="topic" name="topic" className="form-select" value={form.topic} onChange={update}><option>Product enquiry</option><option>Order support</option><option>Returns and exchanges</option><option>Feedback</option></select></div>
          <div className="col-12"><label htmlFor="message" className="form-label">Your message</label><textarea id="message" name="message" rows="5" className="form-control" required minLength="10" value={form.message} onChange={update} placeholder="Tell us how we can help…"></textarea></div>
          <div className="col-12 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"><small className="text-muted">Fields marked as required must be completed.</small><button className="btn btn-dark rounded-pill px-4 py-3" type="submit">Send message <i className="bi bi-arrow-up-right ms-2"></i></button></div></div>
        </form></div>
      </div>
    </section>
  );
}
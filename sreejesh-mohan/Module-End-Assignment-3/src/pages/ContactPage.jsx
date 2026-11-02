import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page section-padding">
      <div className="container">
        {/* Header */}
        <div className="contact-header text-center">
          <span className="section-eyebrow">Customer Support</span>
          <h1 className="page-heading">We'd Love to Hear from You</h1>
          <p className="page-subheading">
            Have questions regarding products, order tracking, or returns? Reach out to
            our dedicated support team anytime.
          </p>
        </div>

        {/* Content Grid: Form + Info cards */}
        <div className="contact-layout-grid">
          {/* Left: Contact Form */}
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p className="form-subtext">
              Fill out the form below and we'll reply within 24 business hours.
            </p>

            {submitted ? (
              <div className="contact-success-box">
                <CheckCircle2 size={44} className="success-icon" />
                <h3>Message Received!</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>. Our support team has received
                  your message regarding "<em>{formData.subject || 'General Inquiry'}</em>"
                  and will respond to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  className="btn-primary-cta"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Sreejesh Mohan"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Your Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="sreejesh@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder="e.g. Order Tracking / Product Question"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    placeholder="How can our customer service assist you today?"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn-send-message">
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact Information & FAQ Quick links */}
          <div className="contact-info-column">
            <div className="contact-info-card">
              <h3>Direct Contact Details</h3>
              <ul className="info-list">
                <li className="info-item">
                  <div className="info-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4>Email Support</h4>
                    <p>support@shopnest.store</p>
                    <small>Response within 2-4 hours</small>
                  </div>
                </li>

                <li className="info-item">
                  <div className="info-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4>Customer Hotline</h4>
                    <p>+91 (800) 456-7890</p>
                    <small>Toll-free across India</small>
                  </div>
                </li>

                <li className="info-item">
                  <div className="info-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4>Headquarters</h4>
                    <p>ShopNest Retail Hub, Cyber City, Kerala, India</p>
                  </div>
                </li>

                <li className="info-item">
                  <div className="info-icon">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4>Working Hours</h4>
                    <p>Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick FAQ summary */}
            <div className="quick-faq-card">
              <div className="faq-card-header">
                <HelpCircle size={20} className="faq-icon" />
                <h3>Frequently Asked</h3>
              </div>
              <div className="faq-snippet">
                <h4>How long does delivery take?</h4>
                <p>Standard delivery takes 2-4 business days across all major metropolitan cities.</p>
              </div>
              <div className="faq-snippet">
                <h4>What is the return period?</h4>
                <p>We provide a 14-day hassle-free return window on all unused items in original packaging.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

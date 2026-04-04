import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ 
    fullName: '', 
    email: '', 
    subject: 'General Inquiry', 
    message: '' 
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    // In a real app, you would send this data to your backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ fullName: '', email: '', subject: 'General Inquiry', message: '' });
    }, 5000);
  };

  return (
    <div className="contact-section">
      <div className="contact-container">
        <div className="contact-card">
          <h1 className="contact-title">Get in Touch with EventSphere</h1>
          <p className="contact-subtitle">Have questions, feedback, or collaboration ideas? We'd love to hear from you.</p>
          
          {submitted ? (
            <div className="success-message">
              <h3>Your message has been sent successfully!</h3>
              <p>We'll get back to you soon!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Event Support">Event Support</option>
                <option value="Partnership">Partnership</option>
                <option value="Feedback">Feedback</option>
              </select>
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
              <button type="submit" className="contact-btn">Send Message</button>
            </form>
          )}
        </div>
        
        <div className="contact-info-card">
          <div className="contact-info">
            <h2>Direct Contact</h2>
            <p><span className="icon">📧</span> Email: demo@eventsphere.com</p>
            <p><span className="icon">☎️</span> Phone: +91-XXXXXXXXXX</p>
            <p><span className="icon">🏢</span> Office: 123 Event Street, Tech Park, Jaipur</p>
            
            <div className="map-container">
              <h3>Find Us</h3>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5965188506905!2d77.59792937473503!3d12.93559661681632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15c8f5a6b0f7%3A0x5f4adbdbab8bd80f!2sKoramangala%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1687345970780!5m2!1sen!2sin" 
                width="100%" 
                height="250" 
                style={{ border: 0, borderRadius: '8px', marginTop: '15px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="EventSphere Office Location"
              ></iframe>
            </div>
          </div>
          
          <div className="social-links">
            <h2>Connect With Us</h2>
            <div className="social-icons">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <span className="icon">💼</span> LinkedIn
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <span className="icon">📸</span> Instagram
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <span className="icon">🐦</span> Twitter
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <span className="icon">📘</span> Facebook
              </a>
            </div>
          </div>
          
          <div className="help-center">
            <h2>Need Help?</h2>
            <Link to="/faq" className="faq-button">Check FAQs</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

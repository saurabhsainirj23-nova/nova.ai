import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="footer-logo">Event<span>Sphere</span></h2>
          <p className="footer-tagline">Connecting moments. Celebrating experiences.</p>
        </div>
        
        <div className="footer-links">
          <Link to="/home">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQs</Link>
        </div>
        
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">📘</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">🐦</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">📸</a>
          <a href="mailto:support@eventsphere.com" title="Email">✉️</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EventSphere. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;

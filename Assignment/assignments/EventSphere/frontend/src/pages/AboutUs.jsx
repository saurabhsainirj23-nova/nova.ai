import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About EventSphere</h1>
          <p>Connecting people through memorable experiences since 2023</p>
        </div>
      </section>

      <section className="about-mission">
        <div className="about-section-container">
          <h2>Our Mission</h2>
          <p>
            At EventSphere, we believe in the power of events to bring people together, spark innovation, 
            and create lasting memories. Our mission is to provide a seamless platform that connects event 
            organizers with attendees, making the process of discovering, creating, and managing events 
            as effortless as possible.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-section-container">
          <h2>Our Story</h2>
          <div className="story-content">
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1470&q=80" alt="Team collaboration" />
            </div>
            <div className="story-text">
              <p>
                EventSphere was founded in 2023 by a group of passionate event enthusiasts who recognized 
                the need for a more intuitive and comprehensive event management platform. What started as 
                a small project has grown into a thriving community of organizers and attendees.
              </p>
              <p>
                Our journey began with a simple idea: to eliminate the barriers between great events and 
                the people who want to attend them. Today, we're proud to have helped thousands of events 
                come to life, connecting people from all walks of life through shared experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="about-section-container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Community First</h3>
              <p>We believe in the power of community and strive to foster connections that transcend our platform.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>We continuously evolve our platform to meet the changing needs of event organizers and attendees.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3>Trust & Safety</h3>
              <p>We prioritize creating a secure environment where users can confidently participate in events.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Inclusivity</h3>
              <p>We're committed to making events accessible to everyone, regardless of background or ability.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="about-section-container">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=687&q=80" alt="CEO" />
              </div>
              <h3>Alex Johnson</h3>
              <p className="member-role">CEO & Co-Founder</p>
              <p>With over 15 years in event management, Alex brings vision and leadership to EventSphere.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=688&q=80" alt="CTO" />
              </div>
              <h3>Sarah Chen</h3>
              <p className="member-role">CTO & Co-Founder</p>
              <p>Sarah's technical expertise ensures our platform remains cutting-edge and user-friendly.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=687&q=80" alt="COO" />
              </div>
              <h3>Michael Rivera</h3>
              <p className="member-role">COO</p>
              <p>Michael oversees operations, ensuring smooth experiences for all EventSphere users.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=761&q=80" alt="CMO" />
              </div>
              <h3>Priya Patel</h3>
              <p className="member-role">CMO</p>
              <p>Priya leads our marketing efforts, helping connect events with the right audiences.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="about-section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Events Hosted</p>
            </div>
            <div className="stat-item">
              <h3>50,000+</h3>
              <p>Happy Attendees</p>
            </div>
            <div className="stat-item">
              <h3>1,000+</h3>
              <p>Event Organizers</p>
            </div>
            <div className="stat-item">
              <h3>100+</h3>
              <p>Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-section-container">
          <h2>Join the EventSphere Community</h2>
          <p>Whether you're looking to host an event or discover new experiences, we're here to help.</p>
          <div className="cta-buttons">
            <Link to="/events" className="cta-button primary">Explore Events</Link>
            <Link to="/contact" className="cta-button secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
import React from 'react';
import './CardStyles.css';

const RegisteredEvents = () => {
  const registered = [
    { name: 'Cybersecurity Basics', status: 'Confirmed' },
    { name: 'Web3 Meetup', status: 'Pending' },
  ];

  return (
    <div className="card">
      <h2>✅ Registered Events</h2>
      <ul className="event-list">
        {registered.map((event, i) => (
          <li key={i}>
            <span>{event.name}</span>
            <span className={`status ${event.status.toLowerCase()}`}>
              {event.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisteredEvents;

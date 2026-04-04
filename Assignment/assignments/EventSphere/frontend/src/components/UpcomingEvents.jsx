import React from 'react';
import './CardStyles.css';

const UpcomingEvents = () => {
  const upcoming = [
    { name: 'AI & ML Workshop', date: 'Aug 1, 2025' },
    { name: 'Hackathon 2025', date: 'Aug 10, 2025' },
  ];

  return (
    <div className="card">
      <h2>📅 Upcoming Events</h2>
      <ul className="event-list">
        {upcoming.map((event, i) => (
          <li key={i}>
            <span>{event.name}</span>
            <span className="event-date">{event.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
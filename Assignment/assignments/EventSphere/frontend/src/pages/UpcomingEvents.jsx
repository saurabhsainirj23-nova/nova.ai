import React from 'react';

const UpcomingEvents = ({ events }) => (
  <div className="upcoming-events">
    <h2>Upcoming Events</h2>
    <ul>
      {events.map(event => (
        <li key={event.id}>
          <strong>{event.title}</strong> - {event.date} ({event.location})
          {event.isRegistered && <span style={{ color: 'green' }}> ✔ Registered</span>}
        </li>
      ))}
    </ul>
  </div>
);

export default UpcomingEvents;

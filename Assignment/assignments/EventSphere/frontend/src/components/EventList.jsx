import React from 'react';
import events from '../data/events.json';

const EventList = () => {
  return (
    <div>
      <h2>All Events</h2>
      {events.map((event, index) => (
        <div key={index}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{new Date(event.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;

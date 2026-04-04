import Event from '../models/Event.js';
import User from '../models/User.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEvent = async (req, res) => {
  try {
    // Add the creator (admin) to the event data
    const eventData = {
      ...req.body,
      creator: req.user.id // This comes from the auth middleware
    };
    
    // If event has seating, initialize available seats
    if (eventData.hasSeating && eventData.seatingCapacity > 0) {
      // Generate available seats based on rows and columns
      // For example, if seatingCapacity is 100, we can have 10 rows with 10 seats each
      const rows = Math.ceil(Math.sqrt(eventData.seatingCapacity));
      const seatsPerRow = Math.ceil(eventData.seatingCapacity / rows);
      
      const availableSeats = [];
      for (let row = 0; row < rows; row++) {
        const rowLabel = String.fromCharCode(65 + row); // A, B, C, ...
        for (let seat = 1; seat <= seatsPerRow; seat++) {
          if (availableSeats.length < eventData.seatingCapacity) {
            availableSeats.push(`${rowLabel}${seat}`);
          }
        }
      }
      
      eventData.availableSeats = availableSeats;
    }
    
    const newEvent = new Event(eventData);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Create event error:', err);
    res.status(400).json({ message: 'Invalid event data', error: err.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Find the event
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already registered - convert ObjectIds to strings for comparison
    const isAlreadyRegistered = event.attendees.some(attendeeId => 
      attendeeId.toString() === userId.toString()
    );
    
    if (isAlreadyRegistered) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }
    
    // Check if event is at capacity
    if (event.capacity && event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }
    
    // Add user to event attendees
    event.attendees.push(userId);
    await event.save();
    
    res.status(200).json({ message: 'Registration successful', event });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find events where user is registered
    const events = await Event.find({ attendees: userId });
    
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching user events:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Seat management controllers

// Get available seats for an event
export const getEventSeats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (!event.hasSeating) {
      return res.status(400).json({ message: 'This event does not have assigned seating' });
    }
    
    res.status(200).json({
      hasSeating: event.hasSeating,
      seatingCapacity: event.seatingCapacity,
      availableSeats: event.availableSeats,
      reservedSeats: event.reservedSeats
    });
  } catch (err) {
    console.error('Error fetching event seats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reserve seats for an event
export const reserveSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seats } = req.body;
    
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Valid seats array is required' });
    }
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (!event.hasSeating) {
      return res.status(400).json({ message: 'This event does not have assigned seating' });
    }
    
    // Check if all requested seats are available
    const unavailableSeats = seats.filter(seat => !event.availableSeats.includes(seat));
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are not available', 
        unavailableSeats 
      });
    }
    
    // Update available and reserved seats
    event.availableSeats = event.availableSeats.filter(seat => !seats.includes(seat));
    event.reservedSeats = [...event.reservedSeats, ...seats];
    
    await event.save();
    
    res.status(200).json({ 
      message: 'Seats reserved successfully',
      reservedSeats: seats,
      availableSeats: event.availableSeats,
      reservedSeatsTotal: event.reservedSeats
    });
  } catch (err) {
    console.error('Error reserving seats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Release reserved seats
export const releaseSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seats } = req.body;
    
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Valid seats array is required' });
    }
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (!event.hasSeating) {
      return res.status(400).json({ message: 'This event does not have assigned seating' });
    }
    
    // Check if all requested seats are currently reserved
    const notReservedSeats = seats.filter(seat => !event.reservedSeats.includes(seat));
    
    if (notReservedSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are not currently reserved', 
        notReservedSeats 
      });
    }
    
    // Update available and reserved seats
    event.reservedSeats = event.reservedSeats.filter(seat => !seats.includes(seat));
    event.availableSeats = [...event.availableSeats, ...seats];
    
    await event.save();
    
    res.status(200).json({ 
      message: 'Seats released successfully',
      releasedSeats: seats,
      availableSeats: event.availableSeats,
      reservedSeatsTotal: event.reservedSeats
    });
  } catch (err) {
    console.error('Error releasing seats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin-specific controllers

// Update an event (admin only)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('Update event error:', err);
    res.status(400).json({ message: 'Invalid event data', error: err.message });
  }
};

// Delete an event (admin only)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete the event
    const deletedEvent = await Event.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get event statistics (admin only)
export const getEventStats = async (req, res) => {
  try {
    // Get total events count
    const totalEvents = await Event.countDocuments();
    
    // Get upcoming events (events with date greater than today)
    const upcomingEvents = await Event.countDocuments({ date: { $gt: new Date() } });
    
    // Get total registered attendees across all events
    const events = await Event.find();
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees.length, 0);
    
    // Get events at full capacity
    const fullCapacityEvents = events.filter(event => 
      event.capacity && event.attendees.length >= event.capacity
    ).length;
    
    res.status(200).json({
      totalEvents,
      upcomingEvents,
      totalAttendees,
      fullCapacityEvents
    });
  } catch (err) {
    console.error('Event stats error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

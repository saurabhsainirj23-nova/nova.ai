import Registration from '../models/Registration.js';

export const registerUserToEvent = async (req, res) => {
  try {
    const { userId, eventId, ticketType, quantity, totalAmount, paymentMethod, attendeeDetails, specialRequests, selectedSeats } = req.body;
    
    // Check if user is already registered for this event
    const existingRegistration = await Registration.findOne({ userId, eventId });
    if (existingRegistration) {
      return res.status(409).json({ message: 'You have already registered for this event' });
    }
    
    // Generate a unique booking ID
    const bookingId = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const registration = new Registration({
      userId,
      eventId,
      ticketType,
      quantity,
      totalAmount,
      paymentMethod,
      bookingId,
      specialRequests,
      selectedSeats,
      attendeeDetails
    });
    
    await registration.save();
    res.status(201).json({ message: 'Registered successfully', registrationId: registration._id, bookingId });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const checkUserRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id; // Get user ID from auth middleware
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const registration = await Registration.findOne({ userId, eventId });
    
    if (registration) {
      return res.status(200).json({
        isRegistered: true,
        registrationDetails: {
          bookingId: registration.bookingId,
          ticketType: registration.ticketType,
          quantity: registration.quantity,
          selectedSeats: registration.selectedSeats
        }
      });
    }
    
    res.status(200).json({ isRegistered: false });
  } catch (err) {
    console.error('Check registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

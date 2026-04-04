import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Generate QR code for a booking ID
export const createQRCode = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
    
    // Check if the booking exists
    const registration = await Registration.findOne({ bookingId });
    
    if (!registration) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(bookingId, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300
    });
    
    res.status(200).json({
      message: 'QR code generated successfully',
      qrCode: qrCodeDataURL,
      bookingId
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).json({ message: 'Server error generating QR code', error: err.message });
  }
};

// Read QR code and verify ticket
export const readQRCode = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
    
    // Find the registration by booking ID
    const registration = await Registration.findOne({ bookingId })
      .populate('eventId')
      .populate('userId');
    
    if (!registration) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Return ticket details
    res.status(200).json({
      message: 'Ticket verified successfully',
      ticket: {
        bookingId: registration.bookingId,
        eventId: registration.eventId._id,
        eventTitle: registration.eventId.title,
        eventDate: registration.eventId.date,
        eventLocation: registration.eventId.location,
        ticketType: registration.ticketType,
        quantity: registration.quantity,
        selectedSeats: registration.selectedSeats || [],
        attendeeDetails: registration.attendeeDetails,
        paymentStatus: registration.paymentStatus
      }
    });
  } catch (err) {
    console.error('Error reading QR code:', err);
    res.status(500).json({ message: 'Server error reading QR code', error: err.message });
  }
};

// Register for event with ticket details
export const registerTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { 
      userId, 
      ticketType, 
      quantity, 
      totalAmount, 
      paymentMethod,
      specialRequests,
      selectedSeats,
      attendeeDetails 
    } = req.body;
    
    // Validate required fields
    if (!userId || !ticketType || !quantity || !totalAmount || !paymentMethod) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        errors: {
          ...(userId ? {} : { userId: 'User ID is required' }),
          ...(ticketType ? {} : { ticketType: 'Ticket type is required' }),
          ...(quantity ? {} : { quantity: 'Quantity is required' }),
          ...(totalAmount ? {} : { totalAmount: 'Total amount is required' }),
          ...(paymentMethod ? {} : { paymentMethod: 'Payment method is required' })
        }
      });
    }

    // Validate attendee details
    if (!attendeeDetails || !attendeeDetails.fullName || !attendeeDetails.email || !attendeeDetails.phone) {
      return res.status(400).json({ 
        message: 'Missing attendee details', 
        errors: {
          ...(attendeeDetails?.fullName ? {} : { fullName: 'Full name is required' }),
          ...(attendeeDetails?.email ? {} : { email: 'Email is required' }),
          ...(attendeeDetails?.phone ? {} : { phone: 'Phone number is required' })
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(attendeeDetails.email)) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        errors: { email: 'Please provide a valid email address' }
      });
    }
    
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if there are enough tickets available
    if (event.ticketsAvailable < quantity) {
      return res.status(400).json({ 
        message: 'Not enough tickets available',
        errors: { quantity: `Only ${event.ticketsAvailable} tickets available` }
      });
    }
    
    // Generate a unique booking ID
    const bookingId = `EVT-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Create new registration
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
      attendeeDetails,
      paymentStatus: 'completed' // For simplicity, we're setting it as completed
    });
    
    await registration.save();
    
    // Update available tickets count
    event.ticketsAvailable -= quantity;
    
    // If seats were selected and event has seating, update available seats
    if (selectedSeats && selectedSeats.length > 0 && event.hasSeating) {
      // Check if all selected seats are available
      const unavailableSeats = selectedSeats.filter(seat => !event.availableSeats.includes(seat));
      
      if (unavailableSeats.length > 0) {
        // Rollback the registration
        await Registration.findByIdAndDelete(registration._id);
        
        return res.status(400).json({ 
          message: 'Some selected seats are not available', 
          unavailableSeats 
        });
      }
      
      // Update available and reserved seats
      event.availableSeats = event.availableSeats.filter(seat => !selectedSeats.includes(seat));
      event.reservedSeats = [...event.reservedSeats, ...selectedSeats];
    }
    
    await event.save();
    
    res.status(201).json({ 
      message: 'Ticket registration successful', 
      registration,
      bookingId
    });
  } catch (err) {
    console.error('Ticket registration error:', err);
    
    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate booking detected' });
    }
    
    res.status(500).json({ message: 'Server error during ticket registration', error: err.message });
  }
};

// Get user's ticket registrations
export const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find registrations for this user and populate event details
    const registrations = await Registration.find({ userId })
      .populate('eventId')
      .sort({ createdAt: -1 });
    
    // Format the response to include seat information
    const formattedRegistrations = registrations.map(registration => ({
      ...registration.toObject(),
      selectedSeats: registration.selectedSeats || [],
      hasSeating: registration.eventId?.hasSeating || false
    }));
    
    res.status(200).json(formattedRegistrations);
  } catch (err) {
    console.error('Error fetching user tickets:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get ticket by booking ID
export const getTicketByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const registration = await Registration.findOne({ bookingId })
      .populate('eventId')
      .populate('userId', 'name email');
    
    if (!registration) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Format the response to include seat information
    const formattedTicket = {
      ...registration.toObject(),
      selectedSeats: registration.selectedSeats || [],
      hasSeating: registration.eventId.hasSeating || false
    };
    
    res.status(200).json(formattedTicket);
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
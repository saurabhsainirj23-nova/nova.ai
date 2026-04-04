import express from 'express';
import { 
  registerTicket, 
  getUserTickets, 
  getTicketByBookingId,
  createQRCode,
  readQRCode
  // createTicket  // <-- Comment this out until fixed
} from '../controllers/ticketController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new ticket (admin/dashboard)
// router.post('/create', authenticate, createTicket);  // <-- Comment this out until fixed

// Register for an event
router.post('/:eventId/register', registerTicket);

// Get user's tickets
router.get('/user/:userId', getUserTickets);

// Get ticket by booking ID
router.get('/booking/:bookingId', getTicketByBookingId);

// Generate QR code for a booking ID
router.get('/qr-code/:bookingId', createQRCode);

// Read QR code and verify ticket
router.post('/read-qr-code', readQRCode);

export default router;
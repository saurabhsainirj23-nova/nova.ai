import express from 'express';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  registerForEvent, 
  getUserEvents,
  updateEvent,
  deleteEvent,
  getEventStats,
  getEventSeats,
  reserveSeats,
  releaseSeats
} from '../controllers/eventController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/:id/register', authenticate, registerForEvent);
router.get('/user/:userId', authenticate, getUserEvents);

// Seat management
router.get('/:id/seats', getEventSeats);
router.post('/:id/seats/reserve', authenticate, reserveSeats);
router.post('/:id/seats/release', authenticate, releaseSeats);

// Admin routes
router.post('/', authenticate, isAdmin, createEvent);
router.put('/:id', authenticate, isAdmin, updateEvent);
router.delete('/:id', authenticate, isAdmin, deleteEvent);
router.get('/admin/stats', authenticate, isAdmin, getEventStats);

// ✅ Add your custom event registration test route here
router.post('/register-event', (req, res) => {
  const { name, email, phone, eventName } = req.body;
  console.log('New Registration:', req.body);
  res.status(200).json({ success: true, message: 'Registration received!' });
});

export default router;

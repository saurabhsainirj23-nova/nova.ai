import express from 'express';
import { registerUserToEvent, checkUserRegistration } from '../controllers/registerController.js';
const router = express.Router();

router.post('/', registerUserToEvent);
router.get('/check/:eventId', checkUserRegistration);

export default router;
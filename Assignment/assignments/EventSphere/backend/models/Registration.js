import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketType: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  bookingId: { type: String, unique: true },
  specialRequests: { type: String },
  selectedSeats: { type: [String] },
  attendeeDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  }
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);
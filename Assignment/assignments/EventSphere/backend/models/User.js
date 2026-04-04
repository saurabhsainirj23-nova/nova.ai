import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String },
  location: { type: String },
  bio: { type: String },
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
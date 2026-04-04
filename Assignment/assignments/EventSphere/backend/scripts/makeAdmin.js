// Script to update a user's role to admin
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for admin update'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Function to update user role to admin
async function makeUserAdmin(email) {
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`✅ User ${user.name} (${user.email}) has been updated to admin role`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating user role:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address as an argument');
  console.log('Usage: node makeAdmin.js user@example.com');
  process.exit(1);
}

// Execute the function
makeUserAdmin(email);
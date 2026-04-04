// Script to check a user's role
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for user role check'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Function to check user role
async function checkUserRole(email) {
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    console.log(`User Information:`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- ID: ${user._id}`);
    process.exit(0);
  } catch (error) {
    console.error('Error checking user role:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address as an argument');
  console.log('Usage: node checkUserRole.js user@example.com');
  process.exit(1);
}

// Execute the function
checkUserRole(email);
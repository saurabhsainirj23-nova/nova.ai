// Script to update a user's role to admin (CommonJS version)
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Define User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  password: String,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
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
    console.log('Current user data:', user);
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
  console.log('Usage: node makeAdminCJS.js user@example.com');
  process.exit(1);
}

// Execute the function
makeUserAdmin(email);
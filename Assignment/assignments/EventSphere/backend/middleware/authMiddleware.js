import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Extract user ID from token without requiring authentication
export const extractUserId = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    // Don't fail on invalid token, just proceed without user
    req.user = null;
    next();
  }
};

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token, access denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with the decoded ID and include role information
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ msg: 'User not found' });
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};

// Middleware to check if user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ msg: 'Authentication required' });
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (err) {
    console.error('Admin authorization error:', err.message);
    res.status(500).json({ msg: 'Server error during authorization check' });
  }
};

// Middleware to handle errors gracefully
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Customize error responses based on error type
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      msg: 'Validation error', 
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ msg: 'Duplicate key error' });
  }
  
  res.status(500).json({ msg: 'Server error', error: err.message });
};
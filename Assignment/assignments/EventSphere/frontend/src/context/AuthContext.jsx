import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          // Set token in axios headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // For now, just use the saved user data
          const parsedUser = JSON.parse(savedUser);
          
          // Ensure user has both id and _id properties for backward compatibility
          if (parsedUser.id && !parsedUser._id) {
            parsedUser._id = parsedUser.id;
          } else if (parsedUser._id && !parsedUser.id) {
            parsedUser.id = parsedUser._id;
          }
          
          // Saurabh Saini is already an admin in the database, no need to override here
          
          console.log('Auth verification - User data:', parsedUser);
          console.log('Auth verification - Token:', savedToken);
          
          setUser(parsedUser);
          setToken(savedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication verification failed:', error);
          // Clear invalid auth data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          axiosInstance.defaults.headers.common['Authorization'] = '';
          
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No saved authentication data found');
        // No token found, ensure user is logged out
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    verifyAuth();
  }, []);

  const login = (userData, authToken) => {
    // Ensure user data has both id and _id properties for backward compatibility
    const normalizedUserData = { ...userData };
    if (normalizedUserData.id && !normalizedUserData._id) {
      normalizedUserData._id = normalizedUserData.id;
    } else if (normalizedUserData._id && !normalizedUserData.id) {
      normalizedUserData.id = normalizedUserData._id;
    }
    
    // Admin role is now managed in the database
    
    setUser(normalizedUserData);
    setToken(authToken);
    setIsAuthenticated(true);
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(normalizedUserData));
    localStorage.setItem('token', authToken);
    
    // Set token in axios headers for future requests
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };
  
  const logout = async () => {
    try {
      // Optional: Call logout endpoint
      // await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Clear auth header
      axiosInstance.defaults.headers.common['Authorization'] = '';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      logout, 
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

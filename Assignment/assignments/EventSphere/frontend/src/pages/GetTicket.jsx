import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GetTicket.css';
import { registerForEvent, fetchEventById, fetchUserRegisteredEvents, checkEventRegistration } from '../api/eventApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GetTicket = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Extract eventId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get('event');
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname + location.search));
      return;
    }
    
    // Check for data from BasicRegistration
    const basicRegData = sessionStorage.getItem('basicRegistrationData');
    if (basicRegData) {
      try {
        const parsedData = JSON.parse(basicRegData);
        setForm(parsedData);
        // Clear the session storage after retrieving the data
        sessionStorage.removeItem('basicRegistrationData');
      } catch (error) {
        console.error('Error parsing basic registration data:', error);
      }
    }
    
    // Load event details and check registration status
    const loadEventAndCheckRegistration = async () => {
      if (!eventId || !user) return;
      
      try {
        setLoading(true);
        // First, check if user is already registered using the API
        const registrationStatus = await checkEventRegistration(eventId);
        
        // If already registered, show notification and redirect to ticket page
        if (registrationStatus.isRegistered) {
          setIsAlreadyRegistered(true);
          toast.info("You are already registered for this event", {
            onClose: () => navigate(`/ticket-registration?event=${eventId}`)
          });
          return;
        }
        
        // If not registered, load event details
        const eventData = await fetchEventById(eventId);
        setEvent(eventData);
        setIsAlreadyRegistered(false);
        
        // Pre-fill form with user data if available
        if (user) {
          setForm(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || ''
          }));
        }
      } catch (err) {
        console.error('Failed to load event:', err);
        setMessage('Failed to load event details');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadEventAndCheckRegistration();
  }, [eventId, isAuthenticated, user, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventId || !user) {
      setSuccess(false);
      setMessage('Missing event information or user not logged in');
      return;
    }
    
    if (isAlreadyRegistered) {
      // Show notification and redirect to ticket page instead of showing error message
      toast.info("You are already registered for this event", {
        onClose: () => navigate(`/ticket-registration?event=${eventId}`)
      });
      return;
    }
    
    try {
      setLoading(true);
      const registrationData = {
        userId: user._id || user.id,
        ...form
      };
      
      const response = await registerForEvent(eventId, registrationData);
      setSuccess(true);
      setMessage('Registration successful! You are now registered for this event.');
      
      // Redirect to ticket registration page after successful registration
      setTimeout(() => {
        navigate(`/ticket-registration?event=${eventId}`);
      }, 2000);
    } catch (err) {
      setSuccess(false);
      
      // Check for token expiration
      if (err.response?.status === 401 && err.response?.data?.message === 'jwt expired') {
        setMessage('Your session has expired. Please log in again.');
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        }, 2000);
      } else {
        // Handle other errors
        setMessage(err.response?.data?.message || 'Failed to register for event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="register-section">
        <div className="register-card loading">
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="register-section">
        <div className="register-card error">
          <h2>Event Not Found</h2>
          <p>The event you're trying to register for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/events')} className="back-btn">Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-section">
      <div className="register-card">
        <h2 className="register-title">Get Ticket for Event 🎉</h2>
        
        <div className="event-summary">
          <h3>{event.title}</h3>
          <p><span>📅 Date:</span> {new Date(event.date).toLocaleDateString()}</p>
          <p><span>📍 Location:</span> {event.location}</p>
        </div>
        
        {isAlreadyRegistered ? (
          <div className="already-registered">
            <p className="register-message success">You're already registered for this event!</p>
            <div className="ticket-actions">
              <button onClick={() => navigate(`/dashboard?tab=tickets`)} className="register-btn">
                View All Tickets
              </button>
              <button onClick={() => navigate(`/ticket-details?event=${eventId}`)} className="register-btn primary">
                View This Ticket
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button 
              type="submit" 
              className="register-btn" 
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Get Ticket'}
            </button>
          </form>
        )}
        
        {message && !isAlreadyRegistered && (
          <p className={`register-message ${success ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        
        <button onClick={() => navigate('/events')} className="back-btn secondary">
          Back to Events
        </button>
      </div>
    </div>
  );
};

export default GetTicket;

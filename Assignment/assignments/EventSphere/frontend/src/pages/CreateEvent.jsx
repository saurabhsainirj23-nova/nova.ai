import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api/eventApi';
import { useAuth } from '../context/AuthContext';
import './CreateEvent.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends, FaImage, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [adminCheck, setAdminCheck] = useState({
    checked: false,
    isAdmin: false
  });
  
  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (isAuthenticated && user) {
      console.log('User role check:', user.role);
      setAdminCheck({
        checked: true,
        isAdmin: user.role === 'admin'
      });
      
      if (user.role !== 'admin') {
        setError('You need admin privileges to create events');
      }
    }
  }, [isAuthenticated, user]);
  
  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: user?.name || '',
    capacity: '',
    category: '',
    image: null
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  const categories = [
    'Technology',
    'Business',
    'Education',
    'Entertainment',
    'Health',
    'Sports',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just store the file object
      setForm(prev => ({ ...prev, image: file }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.date) errors.date = 'Date is required';
    if (!form.time) errors.time = 'Time is required';
    if (!form.location.trim()) errors.location = 'Location is required';
    if (!form.organizer.trim()) errors.organizer = 'Organizer is required';
    if (form.capacity && (isNaN(form.capacity) || parseInt(form.capacity) <= 0)) {
      errors.capacity = 'Capacity must be a positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Check if user has admin privileges
    if (!adminCheck.isAdmin) {
      setError('You need admin privileges to create events');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Combine date and time
      const dateTime = new Date(`${form.date}T${form.time}`);
      
      // Prepare event data
      const eventData = {
        title: form.title,
        description: form.description,
        date: dateTime.toISOString(),
        location: form.location,
        organizer: form.organizer,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        category: form.category || 'Other',
        ticketsAvailable: form.capacity ? parseInt(form.capacity) : undefined
      };
      
      console.log('Creating event with data:', eventData);
      console.log('User auth status:', { isAuthenticated, role: user?.role });
      
      // In a real app, you would upload the image to a storage service
      // and store the URL in the eventData
      
      const createdEvent = await createEvent(eventData);
      
      setSuccess(true);
      
      // Redirect to the event details page after a short delay
      setTimeout(() => {
        navigate(`/events/${createdEvent._id}`);
      }, 2000);
    } catch (err) {
      console.error('Failed to create event:', err);
      
      // Check for token expiration
      if (err.response?.status === 401 && err.response?.data?.message === 'jwt expired') {
        setError('Your session has expired. Please log in again.');
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate(`/login?redirect=${encodeURIComponent('/create-event')}`);
        }, 2000);
      } else {
        // Handle other errors
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create event. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <div className="create-event-card">
        <h1 className="create-event-title">Create New Event 🎉</h1>
        
        {!adminCheck.checked ? (
          <div className="loading-message">Checking permissions...</div>
        ) : !adminCheck.isAdmin ? (
          <div className="error-message admin-error">
            <FaExclamationTriangle />
            <h3>Admin Access Required</h3>
            <p>You need administrator privileges to create events.</p>
            <button onClick={() => navigate('/events')} className="btn btn-primary mt-3">
              Back to Events
            </button>
          </div>
        ) : success ? (
          <div className="success-message">
            <FaCheck className="success-icon" />
            <h3>Event Created Successfully!</h3>
            <p>Redirecting to event details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="create-event-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="title">Event Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter a catchy title"
                className={formErrors.title ? 'error' : ''}
                disabled={loading}
              />
              {formErrors.title && <div className="field-error">{formErrors.title}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your event"
                rows="4"
                className={formErrors.description ? 'error' : ''}
                disabled={loading}
              ></textarea>
              {formErrors.description && <div className="field-error">{formErrors.description}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date"><FaCalendarAlt /> Date*</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={formErrors.date ? 'error' : ''}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
                {formErrors.date && <div className="field-error">{formErrors.date}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Time*</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={formErrors.time ? 'error' : ''}
                  disabled={loading}
                />
                {formErrors.time && <div className="field-error">{formErrors.time}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="location"><FaMapMarkerAlt /> Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Where will the event be held?"
                className={formErrors.location ? 'error' : ''}
                disabled={loading}
              />
              {formErrors.location && <div className="field-error">{formErrors.location}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="organizer">Organizer*</label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  placeholder="Who is organizing this event?"
                  className={formErrors.organizer ? 'error' : ''}
                  disabled={loading}
                />
                {formErrors.organizer && <div className="field-error">{formErrors.organizer}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="capacity"><FaUserFriends /> Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Max attendees (optional)"
                  className={formErrors.capacity ? 'error' : ''}
                  disabled={loading}
                  min="1"
                />
                {formErrors.capacity && <div className="field-error">{formErrors.capacity}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select a category (optional)</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="image"><FaImage /> Event Image</label>
              <div className="image-upload-container">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Event preview" />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={removeImage}
                      disabled={loading}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      disabled={loading}
                    />
                    <label htmlFor="image" className="upload-label">
                      <FaImage />
                      <span>Upload Image</span>
                    </label>
                  </div>
                )}
              </div>
              <p className="image-hint">Recommended size: 1200 x 600 pixels</p>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="create-btn"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
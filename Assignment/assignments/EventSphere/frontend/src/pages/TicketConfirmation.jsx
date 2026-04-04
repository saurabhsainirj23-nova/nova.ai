import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { fetchEventById } from '../api/eventApi';
import { useAuth } from '../context/AuthContext';
import QRCode from 'react-qr-code';
import './TicketConfirmation.css';

const TicketConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState(null);
  const [event, setEvent] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/ticket-confirmation/${bookingId}` } });
      return;
    }
    
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Check if this is a demo booking ID
        if (bookingId && bookingId.startsWith('DEMO-')) {
          // Create mock ticket data for demo purposes
          const mockTicket = {
            bookingId: bookingId,
            eventId: 'demo-event-id',
            ticketQuantity: 1,
            totalAmount: 1500,
            paymentStatus: 'completed',
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '9876543210',
            specialRequirements: ''
          };
          
          // Create mock event data
          const mockEvent = {
            _id: 'demo-event-id',
            title: 'AI Hacking',
            date: new Date('2025-09-26T05:00:00'),
            location: 'Jaipur',
            organizer: 'AI Impact India',
            description: 'A demo event for testing purposes',
            capacity: 100,
            price: 1500,
            ticketTypes: [
              { type: 'Standard', price: 1500 },
              { type: 'VIP', price: 3000 }
            ]
          };
          
          setTicket(mockTicket);
          setEvent(mockEvent);
          
          // For demo bookings, we'll create a mock QR code data
          setQrCodeData(JSON.stringify({
            bookingId: bookingId,
            eventId: 'demo-event-id',
            attendee: mockTicket.name,
            ticketQuantity: mockTicket.ticketQuantity
          }));
        } else {
          try {
            // Fetch real ticket data
            const ticketResponse = await axiosInstance.get(`/api/tickets/${bookingId}`);
            const ticketData = ticketResponse.data;
            setTicket(ticketData);
            
            // Fetch event details
            const eventData = await fetchEventById(ticketData.eventId);
            setEvent(eventData);
            
            // Generate QR code data
            const qrData = JSON.stringify({
              bookingId: ticketData.bookingId,
              eventId: ticketData.eventId,
              attendee: ticketData.name,
              ticketQuantity: ticketData.ticketQuantity
            });
            setQrCodeData(qrData);
          } catch (apiError) {
            console.error('API error:', apiError);
            // If API fails, use mock data for development
            const mockTicket = {
              bookingId: bookingId,
              eventId: 'api-error-event-id',
              ticketQuantity: 1,
              totalAmount: 1500,
              paymentStatus: 'completed',
              name: 'Test User',
              email: 'test@example.com',
              phone: '9876543210',
              specialRequirements: ''
            };
            
            const mockEvent = {
              _id: 'api-error-event-id',
              title: 'Event (API Unavailable)',
              date: new Date().toISOString(),
              location: 'Event Venue',
              price: 1500,
              image: null
            };
            
            setTicket(mockTicket);
            setEvent(mockEvent);
            
            setQrCodeData(JSON.stringify({
              bookingId: bookingId,
              eventId: 'api-error-event-id',
              attendee: mockTicket.name,
              ticketQuantity: mockTicket.ticketQuantity
            }));
            
            // Only set error if not in development mode
            if (process.env.NODE_ENV === 'production') {
              setError('Failed to load ticket details. Please try again later.');
            }
          } finally {
            setLoading(false);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setError('Failed to load ticket details. Please check your booking ID.');
        setLoading(false);
      }
    };
    
    if (bookingId && isAuthenticated) {
      fetchTicketDetails();
    }
  }, [bookingId, isAuthenticated, navigate]);
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const ticketRef = useRef(null);

  const handleDownloadTicket = () => {
    if (!ticket || !event) return;
    
    // Create a simple HTML representation of the ticket
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Event Ticket - ${event.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .ticket { max-width: 800px; margin: 0 auto; border: 2px solid #3498db; border-radius: 10px; overflow: hidden; }
          .ticket-header { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 20px; }
          .ticket-body { padding: 20px; }
          .event-details { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ddd; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .label { font-weight: bold; }
          .qr-placeholder { width: 150px; height: 150px; border: 1px solid #ddd; margin: 20px auto; display: flex; align-items: center; justify-content: center; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <h1>Ticket Confirmation</h1>
            <div>Booking ID: ${ticket.bookingId}</div>
          </div>
          
          <div class="ticket-body">
            <div class="event-details">
              <h2>${event.title}</h2>
              <p>${formatDate(event.date)}</p>
              <p>${event.location}</p>
            </div>
            
            <div class="detail-row">
              <span class="label">Ticket Type:</span>
              <span>${ticket.ticketType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Quantity:</span>
              <span>${ticket.quantity}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Amount:</span>
              <span>₹${ticket.totalAmount}</span>
            </div>
            <div class="detail-row">
              <span class="label">Attendee:</span>
              <span>${ticket.attendeeDetails.fullName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span>${ticket.attendeeDetails.email}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span>${ticket.attendeeDetails.phone}</span>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <div class="qr-placeholder">QR Code: ${ticket.bookingId}</div>
              <p>Scan this QR code at the event entrance</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Create a Blob from the HTML content
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '-')}-Ticket-${ticket.bookingId}.html`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
  };
  
  return (
    <div className="ticket-confirmation-container">
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your ticket...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <div className="error-icon">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      ) : (
        <>
          <div className="ticket-header">
            <h1>Ticket Confirmed!</h1>
            <p>Your booking has been confirmed. Below are your ticket details.</p>
          </div>
          
          <div className="ticket-card">
            <div className="event-details">
              <h2>{event?.title || 'Event'}</h2>
              <div className="event-meta">
                <p>
                  <i className="fas fa-calendar"></i>
                  {event?.date ? new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Date TBD'}
                </p>
                <p>
                  <i className="fas fa-clock"></i>
                  {event?.time || 'Time TBD'}
                </p>
                <p>
                  <i className="fas fa-map-marker-alt"></i>
                  {event?.location || 'Location TBD'}
                </p>
              </div>
            </div>
            
            <div className="ticket-details">
              <div className="ticket-info">
                <div className="info-row">
                  <span>Booking ID:</span>
                  <span>{ticket?.bookingId}</span>
                </div>
                <div className="info-row">
                  <span>Quantity:</span>
                  <span>{ticket?.ticketQuantity}</span>
                </div>
                <div className="info-row">
                  <span>Amount Paid:</span>
                  <span>${ticket?.totalAmount}</span>
                </div>
                <div className="info-row">
                  <span>Payment Status:</span>
                  <span className={`status ${ticket?.paymentStatus}`}>
                    {ticket?.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="attendee-info">
                <h3>Attendee Information</h3>
                <div className="info-row">
                  <span>Name:</span>
                  <span>{ticket?.name}</span>
                </div>
                <div className="info-row">
                  <span>Email:</span>
                  <span>{ticket?.email}</span>
                </div>
                <div className="info-row">
                  <span>Phone:</span>
                  <span>{ticket?.phone}</span>
                </div>
                {ticket?.specialRequirements && (
                  <div className="info-row">
                    <span>Special Requests:</span>
                    <span>{ticket?.specialRequirements}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="qr-code-section">
              <h3>Scan for Entry</h3>
              <div className="qr-code">
                {qrCodeData ? (
                  <QRCode value={qrCodeData} size={150} />
                ) : (
                  <div className="qr-placeholder">QR Code not available</div>
                )}
              </div>
              <p className="qr-note">Please show this QR code at the venue entrance</p>
            </div>
          </div>
          
          <div className="ticket-actions">
            <button className="btn-secondary" onClick={() => window.print()}>
              <i className="fas fa-print"></i> Print Ticket
            </button>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketConfirmation;
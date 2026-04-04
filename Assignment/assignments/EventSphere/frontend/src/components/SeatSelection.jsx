import React, { useState, useEffect } from 'react';
import './SeatSelection.css';
import axiosInstance from '../api/axiosInstance';

const SeatSelection = ({ eventId, availableSeats, onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventSeats, setEventSeats] = useState(null);

  // Number of rows and columns for the seat map
  const ROWS = 10;
  const COLS = 10;

  useEffect(() => {
    // Fetch event seats from the backend if available
    const fetchEventSeats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/events/${eventId}/seats`);
        setEventSeats(response.data);
        setError(null);
      } catch (err) {
        console.log('Using fallback seat data - could not fetch from API');
        // Silently fall back to available seats prop
      } finally {
        generateSeatMap();
        setLoading(false);
      }
    };

    fetchEventSeats();
  }, [eventId, availableSeats, generateSeatMap]);

const generateSeatMap = React.useCallback(() => {
  // Create a 2D array representing the seat map
  const newSeatMap = [];
  let seatNumber = 1;
  
  // Use event seats data if available, otherwise fall back to availableSeats prop
  const seatsData = eventSeats?.availableSeats || availableSeats || [];
  const reservedSeats = eventSeats?.reservedSeats || [];
  
  for (let row = 0; row < ROWS; row++) {
    const rowSeats = [];
    for (let col = 0; col < COLS; col++) {
      const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}`;
      
      // Check if this seat is available
      const isAvailable = seatsData.includes(seatLabel) && !reservedSeats.includes(seatLabel);
      
      rowSeats.push({
        id: seatNumber,
        row: String.fromCharCode(65 + row), // Convert to letter (A, B, C, ...)
        col: col + 1,
        label: seatLabel,
        isAvailable,
        isSelected: false
      });
      
      seatNumber++;
    }
    newSeatMap.push(rowSeats);
  }
  
  setSeatMap(newSeatMap);
}, [eventSeats, availableSeats, ROWS, COLS]);

  const handleSeatClick = (seat) => {
    if (!seat.isAvailable) return;
    
    // Toggle seat selection
    const updatedSeatMap = seatMap.map(row => {
      return row.map(s => {
        if (s.id === seat.id) {
          return { ...s, isSelected: !s.isSelected };
        }
        return s;
      });
    });
    
    setSeatMap(updatedSeatMap);
    
    // Update selected seats
    const updatedSelectedSeats = updatedSeatMap
      .flat()
      .filter(s => s.isSelected)
      .map(s => s.label);
    
    setSelectedSeats(updatedSelectedSeats);
    
    // Notify parent component
    onSeatSelect(updatedSelectedSeats);
  };

  if (loading) return <div className="loading">Loading seat map...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="seat-selection-container">
      <h3>Select Your Seats</h3>
      
      <div className="seat-map">
        {seatMap.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
            {row.map((seat) => (
              <div
                key={seat.id}
                className={`seat ${!seat.isAvailable ? 'unavailable' : ''} ${seat.isSelected ? 'selected' : ''}`}
                onClick={() => handleSeatClick(seat)}
                title={`${seat.row}${seat.col} ${!seat.isAvailable ? '(Not Available)' : ''}`}
              >
                {seat.col}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-sample available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample unavailable"></div>
          <span>Unavailable</span>
        </div>
      </div>
      
      <div className="selected-seats-summary">
        <h4>Selected Seats: {selectedSeats.length}</h4>
        <div className="selected-seats-list">
          {selectedSeats.length > 0 ? (
            selectedSeats.map(seat => (
              <span key={seat} className="selected-seat-label">{seat}</span>
            ))
          ) : (
            <span className="no-seats-selected">No seats selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
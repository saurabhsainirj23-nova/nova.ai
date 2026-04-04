import React, { useState, useEffect } from 'react';
import { FaFilter, FaSort, FaSearch, FaTimes } from 'react-icons/fa';
import './EventFilters.css';

const EventFilters = ({ events, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateRange: 'all',
    priceRange: 'all',
    location: '',
    sortBy: 'date-asc'
  });
  
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  // Get unique categories from events
  const categories = [...new Set(events.map(event => event.category).filter(Boolean))];
  
  // Get unique locations from events
  const locations = [...new Set(events.map(event => event.location).filter(Boolean))];
  
  useEffect(() => {
    applyFilters();
  }, [filters, events]);
  
  const applyFilters = () => {
    let result = [...events];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(event => 
        event.title?.toLowerCase().includes(searchTerm) || 
        event.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(event => event.category === filters.category);
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        switch (filters.dateRange) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'week':
            return eventDate >= today && eventDate <= nextWeek;
          case 'month':
            return eventDate >= today && eventDate <= nextMonth;
          default:
            return true;
        }
      });
    }
    
    // Apply price range filter
    if (filters.priceRange !== 'all') {
      result = result.filter(event => {
        const price = parseFloat(event.price || 0);
        switch (filters.priceRange) {
          case 'free':
            return price === 0;
          case 'paid':
            return price > 0;
          case 'under-50':
            return price > 0 && price < 50;
          case 'over-50':
            return price >= 50;
          default:
            return true;
        }
      });
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(event => event.location === filters.location);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'price-asc':
          return (parseFloat(a.price || 0) - parseFloat(b.price || 0));
        case 'price-desc':
          return (parseFloat(b.price || 0) - parseFloat(a.price || 0));
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
    
    setFilteredEvents(result);
    onFilterChange(result);
  };
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      dateRange: 'all',
      priceRange: 'all',
      location: '',
      sortBy: 'date-asc'
    });
  };
  
  return (
    <div className="event-filters-container">
      <div className="filters-header">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-row">
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Date Range</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Price Range</label>
              <select 
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="under-50">Under $50</option>
                <option value="over-50">$50 & Above</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Location</label>
              <select 
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="date-asc">Date (Earliest First)</option>
                <option value="date-desc">Date (Latest First)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
          
          <div className="filters-actions">
            <button className="reset-btn" onClick={resetFilters}>
              <FaTimes /> Reset Filters
            </button>
            <div className="results-count">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link to="/" style={{
        backgroundColor: '#1976d2',
        color: '#fff',
        padding: '10px 20px',
        textDecoration: 'none',
        borderRadius: '4px'
      }}>
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;

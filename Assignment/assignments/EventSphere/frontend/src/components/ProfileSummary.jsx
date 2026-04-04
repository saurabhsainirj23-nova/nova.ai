import React from 'react';
import './CardStyles.css';

const ProfileSummary = () => {
  const user = {
    name: 'Saurabh Saini',
    collegeId: 'CS2025A01',
    email: 'saurabh@example.com',
  };

  return (
    <div className="card">
      <h2>👤 Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>College ID:</strong> {user.collegeId}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default ProfileSummary;

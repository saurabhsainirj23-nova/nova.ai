import React from 'react';

const ProfileSummary = ({ user }) => (
  <div className="profile-summary">
    <h2>Profile</h2>
    <p><strong>Name:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
  </div>
);
export default ProfileSummary;
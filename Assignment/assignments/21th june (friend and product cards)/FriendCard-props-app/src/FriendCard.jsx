// src/FriendCard.jsx
import React from 'react';
import './App.css';

function FriendCard(props) {
  return (
    <div className="friend-card">
      <img src={props.image} alt={props.name} className="friend-image" />
      <h2>{props.name}</h2>
      <p><strong>Hobby:</strong> {props.hobby}</p>
      <p><em>"{props.quote}"</em></p>
      <p><strong>Contact:</strong> {props.contact}</p>
    </div>
  );
}

export default FriendCard;

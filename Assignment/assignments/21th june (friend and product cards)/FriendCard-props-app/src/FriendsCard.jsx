// src/FriendsCard.jsx
import React from 'react';
import FriendCard from './FriendCard';
import { Data } from './Data';

function FriendsCard() {
  return (
    <>
      {Data.map((friend, index) => (
        <FriendCard
          key={index}
          name={friend.name}
          image={friend.image}
          hobby={friend.hobby}
          quote={friend.quote}
          contact={friend.contact}
        />
      ))}
    </>
  );
}

export default FriendsCard;

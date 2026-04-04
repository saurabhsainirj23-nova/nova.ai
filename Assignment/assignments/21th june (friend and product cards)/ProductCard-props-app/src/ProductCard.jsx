import React from 'react'
import './App.css'

function ProductCard(props) {
  return (
    <div className="product-card">
      <img src={props.image} alt={props.name} className="product-image" />
      <h2>{props.name}</h2>
      <p><b>Price:</b> ₹{props.price}</p>
      <p>{props.description}</p>
      <p><b>Status:</b> {props.stock}</p>
    </div>
  );
}

export default ProductCard
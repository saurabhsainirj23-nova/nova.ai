<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Cart</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    header {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    header img {
      width: 50px;
      margin-right: 20px;
    }
    h1 {
      font-size: 24px;
      color: #333;
      margin: 0;
    }
    nav {
      background-color: #28a745;
      padding: 10px 20px;
    }
    nav a {
      color: white;
      text-decoration: none;
      font-size: 18px;
      padding: 10px;
    }
    nav a:hover {
      background-color: #218838;
      border-radius: 5px;
    }
    .cart-container {
      width: 80%;
      margin: 20px auto;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: center;
    }
    th {
      background-color: #f2f2f2;
    }
    input[type="number"] {
      width: 50px;
      text-align: center;
    }
    .remove-btn {
      background: red;
      color: white;
      border: none;
      padding: 5px;
      cursor: pointer;
      border-radius: 5px;
    }
    .total-price {
      font-size: 18px;
      text-align: right;
      margin-top: 10px;
    }
    .delivery-charge {
      color: red;
      font-size: 14px;
      text-align: right;
    }
    .order-form {
      margin-top: 20px;
      display: none;
    }
    .order-form input, .order-form select {
      width: 100%;
      padding: 10px;
      margin: 5px 0;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .order-btn {
      display: block;
      width: 100%;
      background: #28a745;
      color: white;
      text-align: center;
      padding: 10px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 10px;
    }
  </style>
  <script>
    // Load cart from localStorage (or initialize as empty array)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
      const cartContainer = document.getElementById('cart-items');
      cartContainer.innerHTML = '';
      let total = 0;
      
      if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty. <a href="index.php">Start Shopping</a></p>';
        document.getElementById('final-price').innerHTML = '';
        document.getElementById('delivery-charge').innerText = '';
        document.querySelector('.order-form').style.display = 'none';
        return;
      }
      
      // Show order form when items exist
      document.querySelector('.order-form').style.display = 'block';
      
      // Create table with headers including an Image column
      let table = document.createElement('table');
      table.innerHTML = `
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price (₹)</th>
          <th>Quantity</th>
          <th>Remove</th>
        </tr>
      `;
      
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        let row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="${item.image}" alt="${item.name}" width="50"></td>
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td>
            <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
          </td>
          <td>
            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
          </td>
        `;
        table.appendChild(row);
      });
      
      cartContainer.appendChild(table);
      
      let deliveryCharge = total < 180 ? 11 : 0;
      document.getElementById('final-price').innerHTML = `Total: ₹${total + deliveryCharge}`;
      document.getElementById('delivery-charge').innerText = deliveryCharge > 0 ? 'Delivery charges are applicable for orders less than ₹180 (₹11 added)' : '';
    }

    function updateQuantity(index, value) {
      value = Math.max(1, parseInt(value) || 1);
      cart[index].quantity = value;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    }

    function removeItem(index) {
      if (confirm("Are you sure you want to remove this item?")) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
      }
    }

    function placeOrder() {
      let username = document.getElementById('username').value.trim();
      let phone = document.getElementById('password').value.trim(); // Using 'password' input for phone number
      let deliveryPlace = document.getElementById('delivery-place').value;
      let preciseLocation = document.getElementById('precise-location').value.trim();
      
      if (!username || !phone || !deliveryPlace || !preciseLocation) {
        alert("Please fill all fields before placing the order.");
        return;
      }
      
      let total = 0;
      cart.forEach(item => total += item.price * item.quantity);
      let deliveryCharge = total < 180 ? 11 : 0;
      let finalPrice = total + deliveryCharge;
      
      // Prepare order data to be sent to the server
      let orderData = {
        username: username,
        password: phone,
        delivery_place: deliveryPlace,
        precise_location: preciseLocation,
        items: cart,  // Note: The image field is included in localStorage but will not be used in the order submission.
        total_price: finalPrice
      };
      
      fetch('submit_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(data.message);
          localStorage.removeItem('cart');
          window.location.href = 'index.php';
        } else {
          alert("Error placing order: " + data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error placing order");
      });
    }

    window.onload = updateCart;
  </script>
</head>
<body>
  <header>
    <img src="Amity_University_logo.png" alt="Logo">
    <h1>Website Name</h1>
  </header>
  <nav>
    <a href="index.php">Back to Shopping</a>
  </nav>
  <div class="cart-container">
    <h2>My Cart</h2>
    <div id="cart-items"></div>
    <p class="delivery-charge" id="delivery-charge"></p>
    <p class="total-price" id="final-price"></p>
    <div class="order-form">
      <h3>Order Details</h3>
      <input type="text" id="username" placeholder="Username" required>
      <input type="tel" id="password" placeholder="Phone" required>
      <select id="delivery-place" required>
        <option value="" disabled selected>Choose</option>
        <option value="A Block">A Block</option>
        <option value="B Block">B Block</option>
        <option value="C Block">C Block</option>
        <option value="D Block">D Block</option>
        <option value="E Block">E Block</option>
        <option value="Hostel H-1">Hostel H-1</option>
        <option value="Hostel H-2">Hostel H-2</option>
        <option value="Hostel H-3">Hostel H-3</option>
        <option value="Hostel H-4">Hostel H-4</option>
        <option value="Hostel H-5">Hostel H-5</option>
      </select>
      <input type="text" id="precise-location" placeholder="Room: e.g., cr42, Lt42, room number 402" required>
      <button class="order-btn" onclick="placeOrder()">Place Order</button>
    </div>
  </div>
</body>
</html>

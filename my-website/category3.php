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
    <title>Website Name</title>
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
            display: flex;
            justify-content: space-between;
            align-items: center;
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
        .container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .card {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            text-align: center;
            padding: 15px;
        }
        .card img {
            width: 100px;
            height: 100px;
        }
        .card h3, .card p {
            margin: 10px 0;
            font-size: 18px;
            color: #333;
        }
        .card button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            border-radius: 5px;
        }
        .card button:hover {
            background-color: #218838;
        }
        .cart-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            width: 50%;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            text-align: center;
            position: fixed;
            z-index: 1000;
        }
        .cart-modal img {
            width: 100px;
            height: 100px;
        }
        .cart-modal input {
            width: 50px;
            text-align: center;
        }
        .cart-modal button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            border-radius: 5px;
            margin-top: 10px;
        }
        .cart-modal .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: red;
            color: white;
            border: none;
            padding: 5px;
            cursor: pointer;
            border-radius: 50%;
        }
        .warning-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            width: 300px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            text-align: center;
        }
	.footer {
    background-color: #121212; /* Dark background */
    color: white;
    padding: 20px 0;
    font-family: Arial, sans-serif;
}

.footer-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    text-align: left;
}

.footer-section {
    width: 30%;
    margin-bottom: 20px;
}

.footer-section h3 {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
}

.footer-section p {
    font-size: 14px;
}

.footer-section ul {
    list-style-type: none;
    padding: 0;
}

.footer-section ul li {
    margin-bottom: 10px;
}

.footer-section ul li a {
    text-decoration: none;
    color: white;
    font-size: 14px;
}

.footer-section ul li a:hover {
    color: #00bcd4; /* Light blue hover effect */
}

.social-links {
    display: flex;
    gap: 10px;
}

.social-links a {
    text-decoration: none;
    color: white;
    font-size: 16px;
}

.social-links a:hover {
    color: #00bcd4;
}

.footer-bottom {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
}
@media (max-width: 768px) {
nav {
                flex-direction: column;
            }
            nav a {
                padding: 8px;
                font-size: 16px;
            }
            .container {
                padding: 10px;
            }
	    .footer-container {
        flex-direction: column;
        align-items: center;
    }

    .footer-section {
        width: 80%;
        text-align: center;
    }

    .social-links {
        justify-content: center;
    }
}

    </style>
    <script>
        function openCartModal(image, name, price) {
            document.getElementById('cartModal').style.display = 'block';
            document.getElementById('modalImage').src = image;
            document.getElementById('modalName').innerText = name;
            document.getElementById('modalPrice').innerText = 'Price: ₹' + price;
            document.getElementById('quantity').value = 1;
            updateTotal(price);
            document.body.style.overflow = 'hidden'; // Disable scrolling
        }
        function updateTotal(price) {
            let quantity = parseInt(document.getElementById('quantity').value) || 1;
            if (quantity < 1) {
                document.getElementById('quantity').value = 1;
                quantity = 1;
            }
            document.getElementById('totalPrice').innerText = 'Total: ₹' + (price * quantity);
        }
	function addToCart() {
            let image = document.getElementById('modalImage').src;
            let name = document.getElementById('modalName').innerText;
            let price = parseInt(document.getElementById('modalPrice').innerText.split('₹')[1]);
            let quantity = parseInt(document.getElementById('quantity').value);
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ image, name, price, quantity });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            closeCartModal();
        }
        function closeCartModal() {
            document.getElementById('cartModal').style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
        function closeWarningModal(action) {
            document.getElementById('warningModal').style.display = 'none';
            if (action === 'no') {
                document.getElementById('cartModal').style.display = 'none';
                document.body.style.overflow = 'auto'; // Enable scrolling
            }
        }
    </script>
</head>
<body>
    <header>
        <img src="Amity_University_logo.png" alt="Logo">
        <h1>Website Name</h1>
    </header>
    <nav>
        <a href="index.php">Back</a>
        <a href="mycart.php">My Cart</a>
    </nav>
    <div class="container">
        <div class="card">
            <img src="cold_drinks.png" alt="Snacks">
            <h3>Coca Cola(0.5L)</h3>
            <p>₹40</p>
            <button onclick="openCartModal('cold_drinks.png', 'Coca Cola(0.5L)', 40)">Add to Cart</button>
        </div>
	<div class="card">
            <img src="cold_drinks.png" alt="Snacks">
            <h3>Fanta (0.5L)</h3>
            <p>₹40</p>
            <button onclick="openCartModal('cold_drinks.png', 'Fanta (0.5L)', 40)">Add to Cart</button>
        </div>
	<div class="card">
            <img src="cold_drinks.png" alt="Snacks">
            <h3>Thumbs up (0.5L)</h3>
            <p>₹40</p>
            <button onclick="openCartModal('cold_drinks.png', 'Thumbs up (0.5L)', 40)">Add to Cart</button>
        </div>
	<div class="card">
            <img src="cold_drinks.png" alt="Snacks">
            <h3>Red Bull(0.3L)</h3>
            <p>₹60</p>
            <button onclick="openCartModal('cold_drinks.png', 'Red Bull (0.3L)', 60)">Add to Cart</button>
        </div>
	<div class="card">
            <img src="cold_drinks.png" alt="Snacks">
            <h3>Nimbooz(0.3L)</h3>
            <p>₹50</p>
            <button onclick="openCartModal('cold_drinks.png', 'Nimbooz (0.3L)', 50)">Add to Cart</button>
        </div>

    </div>
    <div id="cartModal" class="cart-modal">
        <button class="close-btn" onclick="closeCartModal()">X</button>
        <img id="modalImage" src="" alt="Item Image">
        <h3 id="modalName"></h3>
        <p id="modalPrice"></p>
        <input type="number" id="quantity" min="1" value="1" oninput="updateTotal(parseInt(document.getElementById('modalPrice').innerText.split('₹')[1]))">
        <p id="totalPrice"></p>
        <button onclick="addToCart()">Add to Cart</button>
    </div>
<footer class="footer">
    <div class="footer-container">
        <div class="footer-section">
            <h3>About Us</h3>
            <p>We are a platform where students and teachers can buy and sell departmental store items. A one-stop solution for academic shopping.</p>
        </div>
        <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="home.php">Home</a></li>
                <li><a href="index.php">Shop</a></li>
                <li><a href="index.php">Categories</a></li>
                <li><a href="contactus.php">Contact Us</a></li>
		<li><a href="services.php">Our Services</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Follow Us</h3>
            <ul class="social-links">
                <li><a href="https://www.facebook.com/share/1A9YhuJXhm/">Facebook</a></li>
                <li><a href="https://x.com/AmiCommerce?t=i1D6SifnnCEOnvUt4mN-EA&s=08">Twitter</a></li>
                <li><a href="https://www.instagram.com/amicommerce?igsh=enF5bDRjajBraW0y">Instagram</a></li>
		<li><a href="https://chat.whatsapp.com/J9mV9U3RD7fLFA3G42D42z">Whatsapp</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2025 Department Store Project. All Rights Reserved.</p>
    </div>
</footer>

</body>
</html>

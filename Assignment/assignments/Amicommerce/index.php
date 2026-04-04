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
        /* General Styles */
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
        /* Navigation Bar */
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
        /* Grid Layout for Div Elements */
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
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card img {
            width: 100%;
            height: auto;
	    
        }
        .card .card-content {
            padding: 15px;
            text-align: center;
        }
        .card:hover {
            transform: scale(1.05);
            box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.2);
        }
        .card h3 {
            margin: 10px 0;
            font-size: 18px;
            color: #333;
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
        /* Responsive Design */
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
        function redirectToPage(page) {
            window.location.href = page;
        }
    </script>
</head>
<body>

    <!-- Header Section -->
    <header>
        <img src="Amity_University_logo.png" alt="Logo">
        <h1>Website Name</h1>
    </header>

    <!-- Navigation Bar -->
    <nav>
        <a href="home.php">Home</a>
	<a href="orderhistory1.php">My Orders</a>
        <a href="mycart.php">My Cart</a>
    </nav>
    <h3>Click a category to view products in it:-</h3>
    <!-- Content Section -->
    <div class="container">
        <!-- Card 1 -->
        <div class="card" onclick="redirectToPage('category1.php')">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHpvAX1VwMBvaHesEosoJAZf6Ye2bDGzoYCQ&s" alt="Category 1" style="position: relative;
	    margin-left: 25%; height: 70%; width: 50%;">
            <div class="card-content">
                <h3>Ice Creams</h3>
            </div>
        </div>
        <!-- Card 2 -->
        <div class="card" onclick="redirectToPage('category2.php')">
            <img src="snacks.png" alt="Category 2" style="position: relative;
	    margin-left: 20%; height: 70%; width: 60%;">
            <div class="card-content">
                <h3>Snacks</h3>
            </div>
        </div>
        <!-- Card 3 -->
        <div class="card" onclick="redirectToPage('category3.php')">
            <img src="cold_drinks.png" alt="Category 3" style="position: relative;
	    margin-left: 20%; height: 70%; width: 60%;">
            <div class="card-content">
                <h3>Cold Drinks</h3>
            </div>
        </div>
        <!-- Card 4 -->
        <div class="card" onclick="redirectToPage('category4.php')">
            <img src="chocolates.png" alt="Category 4" style="position: relative;
	    margin-left: 20%; height: 70%; width: 60%;">
            <div class="card-content">
                <h3>Chocolates</h3>
            </div>
        </div>
        <!-- Card 5 -->
        <div class="card" onclick="redirectToPage('category5.php')">
            <img src="https://sslimages.shoppersstop.com/sys-master/images/h67/h91/30199487201310/4706729_UNMAPPED.jpg_2000Wx3000H" alt="Category 5" style="position: relative;
	    margin-left: 20%; height: 70%; width: 60%;">
            <div class="card-content">
                <h3>Perfumes</h3>
            </div>
        </div>
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

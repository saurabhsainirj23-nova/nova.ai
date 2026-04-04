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
    <title>Contact Us - Amity Services</title>
    <style>
        /* Global Styles */
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
        /* Navigation Styles */
        nav {
            background-color: #28a745;
            padding: 10px 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        nav a {
            color: white;
            text-decoration: none;
            font-size: 18px;
            padding: 10px;
            margin-right: 20px;
        }
        nav a:hover {
            background-color: #218838;
            border-radius: 5px;
        }
        /* Content Styles */
        .content {
            width: 80%;
            margin: 20px auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .content h2 {
            color: #28a745;
        }
        .content p {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
        }

        /* Footer Styles */
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
        @media screen and (max-width: 768px) {
            header {
                flex-direction: column;
                align-items: flex-start;
            }
            nav {
                flex-direction: column;
                align-items: center;
            }
            nav a {
                margin-right: 0;
                margin-bottom: 10px;
                text-align: center;
            }
            .content {
                width: 90%;
                padding: 15px;
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

        @media screen and (max-width: 480px) {
            h1 {
                font-size: 20px;
            }
            .content h2 {
                font-size: 22px;
            }
            nav a {
                font-size: 16px;
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
</head>
<body>
    <header>
        <img src="Amity_University_logo.png" alt="Logo">
        <h1>Amity Services</h1>
    </header>
    <nav>
        <a href="index.php">Back to Shopping</a>
        <a href="services.php">Services</a>
    </nav>
    <div class="content">
        <h2>Contact Us</h2>
        <p>As we are a part of Amity University Jaipur, Rajasthan, we are excited to provide services to you. Feel free to contact us with any queries you may have. We are always looking forward to hearing from you!</p>
        <p>First of all, we promise to provide you with the best services possible, so there should be no need to contact us. But don't worry, we still have email support for you. You can drop us an email at <strong>amicommerceservices@gmail.com</strong>, and we will get back to you within 2 working days.</p>
        <p>We value your feedback and are here to assist you in any way possible.</p>
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

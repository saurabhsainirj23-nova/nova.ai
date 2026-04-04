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
  <!-- Ensures the page scales correctly on small devices -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Animated Paragraph</title>
  <style>
    /* Basic styling for the body */
    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    
    /* Paragraph styling with animation */
    .animated-paragraph {
      font-size: 1.5em;
      color: #333;
      opacity: 0;
      animation: fadeIn 2s ease-in-out forwards;
    }

    /* Keyframes for fade-in effect */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Responsive adjustments for small devices */
    @media screen and (max-width: 600px) {
      .animated-paragraph {
        font-size: 1.2em;
      }
    }
  </style>
</head>
<body>
  <p class="animated-paragraph">
    Don't share your username to anyone for your security. In case, you have shared your username to someone, you can email us at <strong>amicommerceservices@gmail.com</strong> to delete your account, so you can create new account by another username. Remember, username is a unique thing, don't share it. Always remember your Password, in case you forget, request for your account deletion and register again.<br><a href="signup.php">back to sign up</a>
  </p>
</body>
</html>

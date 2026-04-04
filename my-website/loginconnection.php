<?php
session_start();

// Database credentials
$host   = 'localhost';
$dbUser = 'root';      // Adjust if necessary
$dbPass = '';          // Adjust if necessary
$dbName = 'test';      // Your database name

// Create a new MySQLi connection
$conn = new mysqli($host, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Check if the form has been submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and sanitize POST data
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    if (empty($username) || empty($password)) {
        echo 'Please enter both username and password.';
    } else {
        // Prepare SQL to check for matching username and password
        $sql = 'SELECT * FROM registrationsignup WHERE username = ? AND password = ?';
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            die('Prepare failed: ' . $conn->error);
        }
        
        // Bind parameters and execute
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows === 1) {
            // Credentials are correct, start a session
            $_SESSION['username'] = $username;
            echo 'Login successful. Welcome, ' . htmlspecialchars($username) . '!';
            
            // Redirect to another page (e.g., index.html or dashboard.php)
            header('Location: index.php');
            exit();
        } else {
            // Invalid credentials
            echo 'Invalid username or password.';
        }
        
        $stmt->close();
    }
}

$conn->close();
?>

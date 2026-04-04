<?php
// submit_order.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Retrieve JSON data from the request body
$data = file_get_contents('php://input');
$order = json_decode($data, true);

if (!$order) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON data"]);
    exit;
}

// Extract order details from the JSON payload
$username         = $order['username'];
$phone            = $order['password']; // Phone number provided as 'password'
$delivery_place   = $order['delivery_place'];
$precise_location = $order['precise_location'];
$total_order_price= $order['total_price'];
$order_date       = date('Y-m-d H:i:s'); // Current date & time

// Database connection parameters – adjust as necessary
$dsn    = "mysql:host=localhost;dbname=test;charset=utf8mb4";
$dbUser = "root";
$dbPass = "";

try {
    // Create a PDO connection
    $pdo = new PDO($dsn, $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Verify that the username and phone number exist in registrationsignup table
    $checkStmt = $pdo->prepare("SELECT * FROM registrationsignup WHERE username = ? AND phone = ?");
    $checkStmt->execute([$username, $phone]);
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or phone number. Order cannot be placed."]);
        exit;
    }
    
    // Prepare INSERT statement for the orders table
    $insertStmt = $pdo->prepare("
        INSERT INTO orders (username, phone, delivery_place, precise_location, item_name, price, quantity, total_price, order_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    // Loop through each item in the cart and insert as a separate order record
    foreach ($order['items'] as $item) {
        $itemName  = $item['name'];
        $itemPrice = $item['price'];
        $quantity  = $item['quantity'];
        $itemTotal = $itemPrice * $quantity; // Total for this item
        
        $insertStmt->execute([
            $username,
            $phone,
            $delivery_place,
            $precise_location,
            $itemName,
            $itemPrice,
            $quantity,
            $itemTotal,
            $order_date
        ]);
    }
    
    echo json_encode(["message" => "Order placed successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>

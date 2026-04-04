<?php
// update_delivery_status.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['order_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing order ID']);
        exit;
    }
    
    $orderId = $_POST['order_id'];
    
    // Database connection parameters
    $dsn = "mysql:host=localhost;dbname=test;charset=utf8mb4";
    $dbUser = "root";
    $dbPass = "";
    
    try {
        $pdo = new PDO($dsn, $dbUser, $dbPass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Update the delivery_status column to 'delivered' for the given order ID
        $stmt = $pdo->prepare("UPDATE orders SET delivery_status = 'delivered' WHERE id = ?");
        $stmt->execute([$orderId]);
        
        echo json_encode(['message' => 'Order marked as delivered successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>

<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    // If not logged in, redirect to the login page
    header('Location: login.html');
    exit();
}

$username = $_SESSION['username'];

// Database connection parameters
$dsn    = "mysql:host=localhost;dbname=test;charset=utf8mb4";
$dbUser = "root";      // Update if needed
$dbPass = "";          // Update if needed

try {
    // Create a PDO connection
    $pdo = new PDO($dsn, $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Retrieve all orders for the logged-in user, ordered by order_date (most recent first)
    $stmt = $pdo->prepare("SELECT delivery_place, precise_location, items, total_price, order_date FROM orders WHERE username = ? ORDER BY order_date DESC");
    $stmt->execute([$username]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order History</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
    }
    h1 {
      text-align: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: #fff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px 15px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      text-decoration: none;
      color: #007bff;
    }
    .back-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <a class="back-link" href="index.html">&larr; Back to Shopping</a>
  <h1>Order History for <?php echo htmlspecialchars($username); ?></h1>
  <?php if(count($orders) > 0): ?>
    <table>
      <thead>
        <tr>
          <th>Order Date</th>
          <th>Delivery Place</th>
          <th>Precise Location</th>
          <th>Items</th>
          <th>Total Price (₹)</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach($orders as $order): ?>
          <tr>
            <td><?php echo htmlspecialchars($order['order_date']); ?></td>
            <td><?php echo htmlspecialchars($order['delivery_place']); ?></td>
            <td><?php echo htmlspecialchars($order['precise_location']); ?></td>
            <td><?php echo htmlspecialchars($order['items']); ?></td>
            <td><?php echo htmlspecialchars($order['total_price']); ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php else: ?>
    <p>No orders found.</p>
  <?php endif; ?>
</body>
</html>

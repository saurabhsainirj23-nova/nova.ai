<?php
// ordersdisplay.php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$dsn = "mysql:host=localhost;dbname=test;charset=utf8mb4";
$dbUser = "root";
$dbPass = "";

try {
    // Create PDO connection
    $pdo = new PDO($dsn, $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Fetch orders from the orders table and join with registrationsignup to get the role.
$stmt = $pdo->prepare("
    SELECT orders.*, registrationsignup.role 
    FROM orders 
    LEFT JOIN registrationsignup 
        ON orders.username = registrationsignup.username 
        AND orders.phone = registrationsignup.phone 
    ORDER BY order_date DESC
");
$stmt->execute();
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Orders List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        table {
            width: 90%;
            margin: 20px auto;
            border-collapse: collapse;
            background: #fff;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .update-btn {
            background-color: #28a745;
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
        }
        .update-btn:hover {
            background-color: #218838;
        }
    </style>
    <script>
        // This function sends an AJAX request to update the delivery status.
        function markDelivered(orderId) {
            if (!confirm('Mark this order as delivered?')) return;
            fetch('update_delivery_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'order_id=' + encodeURIComponent(orderId)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    // Reload the page to reflect the updated status
                    location.reload();
                } else {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    </script>
</head>
<body>
    <h1>Orders List</h1>
    <table>
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Delivery Place</th>
            <th>Precise Location</th>
            <th>Item Name</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
            <th>Total Price (₹)</th>
            <th>Order Date</th>
            <th>Delivery Status</th>
            <th>Action</th>
        </tr>
        <?php if (!empty($orders)): ?>
            <?php foreach ($orders as $order): ?>
                <tr>
                    <td><?php echo htmlspecialchars($order['id']); ?></td>
                    <td><?php echo htmlspecialchars($order['username']); ?></td>
                    <td><?php echo htmlspecialchars($order['phone']); ?></td>
                    <td><?php echo htmlspecialchars($order['role']); ?></td>
                    <td><?php echo htmlspecialchars($order['delivery_place']); ?></td>
                    <td><?php echo htmlspecialchars($order['precise_location']); ?></td>
                    <td><?php echo htmlspecialchars($order['item_name']); ?></td>
                    <td><?php echo htmlspecialchars($order['price']); ?></td>
                    <td><?php echo htmlspecialchars($order['quantity']); ?></td>
                    <td><?php echo htmlspecialchars($order['total_price']); ?></td>
                    <td><?php echo htmlspecialchars($order['order_date']); ?></td>
                    <td><?php echo htmlspecialchars($order['delivery_status']); ?></td>
                    <td>
                        <?php if ($order['delivery_status'] === 'not delivered'): ?>
                            <button class="update-btn" onclick="markDelivered(<?php echo $order['id']; ?>)">Delivered</button>
                        <?php else: ?>
                            Delivered
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="13">No orders found.</td>
            </tr>
        <?php endif; ?>
    </table>
</body>
</html>

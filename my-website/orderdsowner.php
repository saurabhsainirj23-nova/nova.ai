<?php
// dsowner.php

// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection parameters
$dsn = "mysql:host=localhost;dbname=test;charset=utf8mb4";
$dbUser = "root";      // Update if necessary
$dbPass = "";          // Update if necessary

try {
    // Create a PDO connection
    $pdo = new PDO($dsn, $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Retrieve distinct usernames from the orders table (i.e., every user who has ordered something)
$stmt = $pdo->query("SELECT DISTINCT username FROM orders ORDER BY username");
$usernames = $stmt->fetchAll(PDO::FETCH_COLUMN);
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>All Users Orders</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
        }
        .container {
            width: 90%;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        h1, h2, h3 {
            text-align: center;
            color: #333;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
            vertical-align: top;
        }
        .table th {
            background: #f2f2f2;
        }
        img {
            max-width: 150px;
            height: auto;
        }
        .order-item {
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .order-item img {
            max-width: 80px;
            height: auto;
            display: block;
            margin: auto;
        }
    </style>
</head>
<body>
    <h1>All Users Orders</h1>
    <?php
    if (empty($usernames)) {
        echo "<p>No orders found.</p>";
    } else {
        // Loop through every user who has placed an order
        foreach ($usernames as $username) {
            // Query the registrationsignup table for this user's details
            $stmtUser = $pdo->prepare("SELECT username, email, phone, role, idcard FROM registrationsignup WHERE username = ?");
            $stmtUser->execute([$username]);
            $userData = $stmtUser->fetch(PDO::FETCH_ASSOC);
            
            // Query the orders table for orders made by this user
            $stmtOrders = $pdo->prepare("SELECT delivery_place, precise_location, items, total_price, order_date FROM orders WHERE username = ? ORDER BY order_date DESC");
            $stmtOrders->execute([$username]);
            $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);
            ?>
            <div class="container">
                <h2>User: <?php echo htmlspecialchars($username); ?></h2>
                <?php if ($userData): ?>
                    <table class="table">
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>ID Card</th>
                        </tr>
                        <tr>
                            <td><?php echo htmlspecialchars($userData['username']); ?></td>
                            <td><?php echo htmlspecialchars($userData['email']); ?></td>
                            <td><?php echo htmlspecialchars($userData['phone']); ?></td>
                            <td><?php echo htmlspecialchars($userData['role']); ?></td>
                            <td>
                                <?php if (!empty($userData['idcard'])): 
                                    $imgData = base64_encode($userData['idcard']);
                                ?>
                                    <img src="data:image/jpeg;base64,<?php echo $imgData; ?>" alt="ID Card">
                                <?php else: ?>
                                    No image available
                                <?php endif; ?>
                            </td>
                        </tr>
                    </table>
                <?php else: ?>
                    <p>User details not found in registrationsignup table.</p>
                <?php endif; ?>
                
                <h3>Orders for <?php echo htmlspecialchars($username); ?></h3>
                <?php if (!empty($orders)): ?>
                    <table class="table">
                        <tr>
                            <th>Delivery Place</th>
                            <th>Precise Location</th>
                            <th>Items</th>
                            <th>Total Price (₹)</th>
                            <th>Order Date</th>
                        </tr>
                        <?php foreach ($orders as $order): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($order['delivery_place']); ?></td>
                                <td><?php echo htmlspecialchars($order['precise_location']); ?></td>
                                <td>
                                    <?php 
                                    // Decode the JSON data stored in 'items'
                                    $itemsArray = json_decode($order['items'], true);
                                    if (is_array($itemsArray)):
                                        foreach ($itemsArray as $item):
                                    ?>
                                    <div class="order-item">
                                        <?php if (isset($item['image'])): ?>
                                            <img src="<?php echo htmlspecialchars($item['image']); ?>" alt="<?php echo htmlspecialchars($item['name']); ?>">
                                        <?php endif; ?>
                                        <strong><?php echo htmlspecialchars($item['name']); ?></strong><br>
                                        Unit Price: ₹<?php echo htmlspecialchars($item['price']); ?><br>
                                        Quantity: <?php echo htmlspecialchars($item['quantity']); ?><br>
                                        Total: ₹<?php echo htmlspecialchars($item['price'] * $item['quantity']); ?>
                                    </div>
                                    <?php
                                        endforeach;
                                    else:
                                        echo "No items available";
                                    endif;
                                    ?>
                                </td>
                                <td><?php echo htmlspecialchars($order['total_price']); ?></td>
                                <td><?php echo htmlspecialchars($order['order_date']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </table>
                <?php else: ?>
                    <p>No orders found for this user.</p>
                <?php endif; ?>
            </div>
            <?php
        }
    }
    ?>
</body>
</html>

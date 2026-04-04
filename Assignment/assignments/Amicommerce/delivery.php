<?php
// view_pending_orders.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection
$dsn = "mysql:host=localhost;dbname=test;charset=utf8mb4";
$dbUser = "root";
$dbPass = "";

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// ✅ Update delivery status when button clicked
if (isset($_POST['deliver'])) {
    $orderId = $_POST['order_id'];
    $stmt = $pdo->prepare("UPDATE orders SET delivery_status = 'delivered' WHERE id = ?");
    $stmt->execute([$orderId]);
    echo "<script>alert('Order marked as delivered successfully!'); window.location='view_pending_orders.php';</script>";
    exit;
}

// ✅ Fetch pending orders with user details
$sql = "
    SELECT 
        o.id AS order_id,
        o.username,
        o.phone AS order_phone,
        o.delivery_place,
        o.precise_location,
        o.item_name,
        o.price,
        o.quantity,
        o.total_price,
        o.order_date,
        o.delivery_status,
        r.address AS user_address,
        r.email AS user_email,
        r.phone AS user_phone
    FROM orders o
    JOIN registrationsignup r ON o.username = r.username
    WHERE o.delivery_status = 'pending'
    ORDER BY o.order_date DESC
";

$stmt = $pdo->query($sql);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pending Orders</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: #f5f7fa;
        margin: 0;
        padding: 40px;
    }
    h2 {
        text-align: center;
        color: #333;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    th, td {
        padding: 12px 15px;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }
    th {
        background: #007bff;
        color: white;
    }
    tr:hover {
        background-color: #f1f1f1;
    }
    button {
        background: #28a745;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
    }
    button:hover {
        background: #218838;
    }
</style>
</head>
<body>

<h2>📦 Pending Orders</h2>

<table>
    <tr>
        <th>Order ID</th>
        <th>Username</th>
        <th>User Email</th>
        <th>User Phone</th>
        <th>Address</th>
        <th>Delivery Place</th>
        <th>Precise Location</th>
        <th>Item Name</th>
        <th>Price (₹)</th>
        <th>Quantity</th>
        <th>Total Price (₹)</th>
        <th>Status</th>
        <th>Order Date</th>
        <th>Action</th>
    </tr>

    <?php if (count($orders) > 0): ?>
        <?php foreach ($orders as $order): ?>
        <tr>
            <td><?= htmlspecialchars($order['order_id']) ?></td>
            <td><?= htmlspecialchars($order['username']) ?></td>
            <td><?= htmlspecialchars($order['user_email']) ?></td>
            <td><?= htmlspecialchars($order['user_phone']) ?></td>
            <td><?= htmlspecialchars($order['user_address']) ?></td>
            <td><?= htmlspecialchars($order['delivery_place']) ?></td>
            <td><?= htmlspecialchars($order['precise_location']) ?></td>
            <td><?= htmlspecialchars($order['item_name']) ?></td>
            <td><?= htmlspecialchars($order['price']) ?></td>
            <td><?= htmlspecialchars($order['quantity']) ?></td>
            <td><?= htmlspecialchars($order['total_price']) ?></td>
            <td style="color:orange; font-weight:bold;"><?= htmlspecialchars($order['delivery_status']) ?></td>
            <td><?= htmlspecialchars($order['order_date']) ?></td>
            <td>
                <form method="POST">
                    <input type="hidden" name="order_id" value="<?= $order['order_id'] ?>">
                    <button type="submit" name="deliver">Mark Delivered</button>
                </form>
            </td>
        </tr>
        <?php endforeach; ?>
    <?php else: ?>
        <tr><td colspan="14">✅ No pending orders found</td></tr>
    <?php endif; ?>
</table>

</body>
</html>

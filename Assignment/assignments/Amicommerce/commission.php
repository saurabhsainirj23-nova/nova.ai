<?php
// commission.php

// Database connection parameters – update these with your actual database details
$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "test";

// Create connection
$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to group orders by username and order_date, summing up the total_price,
// and exclude those users with role 'faculty' in registrationsignup table.
$sql = "SELECT o.username, o.order_date, SUM(o.total_price) AS final_price 
        FROM orders o
        INNER JOIN registrationsignup r ON o.username = r.username
        WHERE r.role != 'faculty'
        GROUP BY o.username, o.order_date 
        ORDER BY o.order_date DESC";
$result = $conn->query($sql);

$rows = [];
$total_commission = 0;

// Process each grouped record
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $final_price = $row['final_price'];
        // Calculate commission based on final price rules:
        // If final price is less than 180, commission is 1.
        // If final price is between 180 (inclusive) and less than 500, commission is 1% of final price.
        // If final price is 500 or more, commission is 2% of final price.
        if ($final_price < 180) {
            $commission = 1;
        } elseif ($final_price < 500) {
            $commission = $final_price * 0.01;
        } else {
            $commission = $final_price * 0.02;
        }
        // Accumulate total commission and add commission value to the current row
        $total_commission += $commission;
        $row['commission'] = $commission;
        $rows[] = $row;
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Commission Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        h2 {
            text-align: center;
            margin-top: 20px;
        }
        table {
            border-collapse: collapse;
            width: 80%;
            margin: 20px auto;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: center;
        }
        th {
            background-color: #eee;
        }
    </style>
</head>
<body>
    <!-- Display the total commission above the table -->
    <h2>Total commission to be paid: <?php echo number_format($total_commission, 2); ?></h2>
    
    <table>
        <tr>
            <th>Username</th>
            <th>Final Price</th>
            <th>Commission</th>
            <th>Order Date</th>
        </tr>
        <?php if (!empty($rows)): ?>
            <?php foreach ($rows as $r): ?>
                <tr>
                    <td><?php echo htmlspecialchars($r['username']); ?></td>
                    <td><?php echo number_format($r['final_price'], 2); ?></td>
                    <td><?php echo number_format($r['commission'], 2); ?></td>
                    <td><?php echo htmlspecialchars($r['order_date']); ?></td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="4">No records found</td>
            </tr>
        <?php endif; ?>
    </table>
</body>
</html>

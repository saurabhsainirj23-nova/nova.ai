<?php
// Enable error reporting for debugging
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

// Prepare and execute the SQL statement
try {
    $stmt = $pdo->prepare("SELECT * FROM registrationsignup");
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Query failed: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Database Display (Larger Images)</title>
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
            border-collapse: collapse;
            width: 90%;
            margin: 0 auto;
            background: #fff;
        }
        th, td {
            border: 1px solid #bbb;
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        /* Updated CSS for larger images */
        img {
            max-width: 300px; /* Increase this value as needed */
            height: auto;
        }
    </style>
</head>
<body>
    <h1>Registration Signup Data (Using PDO)</h1>
    <table>
        <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Role</th>
            <th>ID Card</th>
        </tr>
        <?php if (!empty($records)): ?>
            <?php foreach ($records as $record): ?>
                <tr>
                    <td><?php echo htmlspecialchars($record['username']); ?></td>
                    <td><?php echo htmlspecialchars($record['password']); ?></td>
                    <td><?php echo htmlspecialchars($record['email']); ?></td>
                    <td><?php echo htmlspecialchars($record['address']); ?></td>
                    <td><?php echo htmlspecialchars($record['phone']); ?></td>
                    <td><?php echo htmlspecialchars($record['role']); ?></td>
                    <td>
                        <?php if (!empty($record['idcard'])): 
                            // Base64 encode the binary image data for display.
                            $imgData = base64_encode($record['idcard']);
                        ?>
                            <img style="max-width: 100%;
    height: auto;" src="data:image/jpeg;base64,<?php echo $imgData; ?>" alt="ID Card">
                        <?php else: ?>
                            No image available
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="7">No records found</td>
            </tr>
        <?php endif; ?>
    </table>
</body>
</html>

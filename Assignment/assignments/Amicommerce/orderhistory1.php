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

// If the user is already logged in, display order history
if (isset($_SESSION['username'])) {
    $username = $_SESSION['username'];

    // Prepare SQL to fetch the order history for the logged-in user.
    // The query now selects delivery_status as well.
    $orderSql = 'SELECT username, phone, delivery_place, precise_location, item_name, price, quantity, total_price, order_date, delivery_status FROM orders WHERE username = ?';
    $orderStmt = $conn->prepare($orderSql);
    if ($orderStmt === false) {
        die('Prepare failed for orders: ' . $conn->error);
    }
    $orderStmt->bind_param('s', $username);
    $orderStmt->execute();
    $result = $orderStmt->get_result();
    ?>
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your Order History</title>
      <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
            text-align: left;
        }
      </style>
    </head>
    <body>
      <h2>Welcome, <?php echo htmlspecialchars($username); ?>!</h2>
      <a href="index.php">Back to shopping</a>
      <h3>Your Order History</h3>
      <?php
      if ($result->num_rows > 0) {
          echo '<table>';
          echo '<tr>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Delivery Place</th>
                  <th>Precise Location</th>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                  <th>Delivery Status</th>
                </tr>';
          while ($row = $result->fetch_assoc()) {
              echo '<tr>';
              echo '<td>' . htmlspecialchars($row['username']) . '</td>';
              echo '<td>' . htmlspecialchars($row['phone']) . '</td>';
              echo '<td>' . htmlspecialchars($row['delivery_place']) . '</td>';
              echo '<td>' . htmlspecialchars($row['precise_location']) . '</td>';
              echo '<td>' . htmlspecialchars($row['item_name']) . '</td>';
              echo '<td>' . htmlspecialchars($row['price']) . '</td>';
              echo '<td>' . htmlspecialchars($row['quantity']) . '</td>';
              echo '<td>' . htmlspecialchars($row['total_price']) . '</td>';
              echo '<td>' . htmlspecialchars($row['order_date']) . '</td>';
              echo '<td>' . htmlspecialchars($row['delivery_status']) . '</td>';
              echo '</tr>';
          }
          echo '</table>';
      } else {
          echo '<p>You have no orders.</p>';
      }
      ?>
    </body>
    </html>
    <?php
    $orderStmt->close();
    $conn->close();
    exit(); // End the script so that the login form below is not displayed.
}

// Process login submission if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and sanitize POST data
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    if (empty($username) || empty($password)) {
        $error = 'Please enter both username and password.';
    } else {
        // Prepare SQL to check for matching username and password in registrationsignup
        $sql = 'SELECT * FROM registrationsignup WHERE username = ? AND password = ?';
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            die('Prepare failed: ' . $conn->error);
        }
        
        // Bind parameters and execute the query
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows === 1) {
            // Credentials are correct – store the username in session
            $_SESSION['username'] = $username;
            // Redirect to the same page so that the order history is displayed instead of the login form
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit();
        } else {
            // Invalid credentials: set the error message to be displayed below
            $error = 'Invalid username or password.';
        }
        $stmt->close();
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Login</title>
</head>
<body>
  <h2>Login</h2>
  <?php
  if (isset($error)) {
      echo '<p style="color:red;">' . htmlspecialchars($error) . '</p>';
  }
  ?>
  <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
    <label for="username">Username:</label>
    <input type="text" name="username" id="username" required /><br/><br/>
    <label for="password">Password:</label>
    <input type="password" name="password" id="password" required /><br/><br/>
    <input type="submit" value="Login" />
  </form>
</body>
</html>

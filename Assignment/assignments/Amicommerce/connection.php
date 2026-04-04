<?php
// Database credentials
$host   = "localhost";
$dbUser = "root";      // Adjust if necessary
$dbPass = "";          // Adjust if necessary
$dbName = "test";

// Create a new MySQLi connection
$conn = new mysqli($host, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve text fields from POST data
$username = $_POST['username'];
$password = $_POST['password'];  // For security, consider hashing this!
$email    = $_POST['email'];
$address  = $_POST['address'];
$phone    = $_POST['phone'];
$role     = $_POST['role'];

// Process the uploaded file for idcard (BLOB)
// Check if a file was uploaded and that there were no errors
$idcardData = null;
if (isset($_FILES['id-card']) && $_FILES['id-card']['error'] === UPLOAD_ERR_OK) {
    $idcardData = file_get_contents($_FILES['id-card']['tmp_name']);
}

// --- First Check: Exact Duplicate of All Text Fields ---
$exactSql = "SELECT * FROM registrationsignup 
             WHERE username = ? 
               AND password = ? 
               AND email = ? 
               AND address = ? 
               AND phone = ? 
               AND role = ?";
$exactStmt = $conn->prepare($exactSql);
if ($exactStmt === false) {
    die("Prepare failed: " . $conn->error);
}
$exactStmt->bind_param("ssssss", $username, $password, $email, $address, $phone, $role);
$exactStmt->execute();
$exactResult = $exactStmt->get_result();

if ($exactResult->num_rows > 0) {
    // An exact record exists: all fields are identical.
    echo "You already have an account, please login.";
    $exactStmt->close();
    $conn->close();
    exit();
}
$exactStmt->close();

// --- Second Check: Username Uniqueness ---
$usernameSql = "SELECT username FROM registrationsignup WHERE username = ?";
$usernameStmt = $conn->prepare($usernameSql);
if ($usernameStmt === false) {
    die("Prepare failed: " . $conn->error);
}
$usernameStmt->bind_param("s", $username);
$usernameStmt->execute();
$usernameResult = $usernameStmt->get_result();

if ($usernameResult->num_rows > 0) {
    // Username already exists.
    echo "Username is not available, please choose another username.";
    $usernameStmt->close();
    $conn->close();
    exit();
}
$usernameStmt->close();

// --- Insert the new record ---
$insertSql = "INSERT INTO registrationsignup (username, password, email, address, phone, role, idcard)
              VALUES (?, ?, ?, ?, ?, ?, ?)";
$insertStmt = $conn->prepare($insertSql);
if ($insertStmt === false) {
    die("Prepare failed: " . $conn->error);
}

// Bind the parameters. "ssssssb" represents six strings and one blob.
$null = NULL;  // Placeholder for blob data
$insertStmt->bind_param("ssssssb", $username, $password, $email, $address, $phone, $role, $null);

// For the BLOB parameter (idcard), if file data exists, send it using send_long_data().
// The parameter index for the BLOB is 6 (0-based index).
if ($idcardData !== null) {
    $insertStmt->send_long_data(6, $idcardData);
}

if ($insertStmt->execute()) {
    echo "Record inserted successfully.";
} else {
    echo "Error: " . $insertStmt->error;
}

$insertStmt->close();
$conn->close();
?>

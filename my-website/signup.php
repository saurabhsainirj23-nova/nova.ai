<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f4f4f4;
      margin: 0;
    }
    .container {
      text-align: center;
    }
    .signup-box {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      width: 350px;
    }
    table {
      width: 100%;
    }
    td {
      padding: 8px;
    }
    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .submit-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    button {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 5px;
    }
    button:hover {
      background: #218838;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    @media (max-width: 400px) {
      .signup-box {
        width: 90%;
      }
    }
  </style>
  <script>
    function validateForm() {
      let username = document.getElementById('username').value;
      let password = document.getElementById('password').value;
      let retypePassword = document.getElementById('retype-password').value;
      let email = document.getElementById('email').value;
      let address = document.getElementById('address').value;
      let phone = document.getElementById('phone').value;
      let role = document.querySelector('input[name="role"]:checked');
      let idCard = document.getElementById('id-card').value;
      
      if (!username || !password || !retypePassword || !email || !address || !phone || !role || !idCard) {
        alert("All fields are required");
        return false;
      }
      if (password !== retypePassword) {
        alert("Passwords do not match");
        return false;
      }
      return true;
    }
  </script>
</head>
<body>
  <div class="container">
    <img src="Amity_University_logo.png" alt="Website Logo" width="100" style="position:relative; margin-top:28%;">
    <h1>Website Name</h1>
    <div class="signup-box">
      <!-- Notice the form attributes: action, method, and enctype -->
      <form action="connection.php" method="post" enctype="multipart/form-data" onsubmit="return validateForm()">
        <h2>Sign Up</h2>
        <table>
          <tr>
            <td>Username:</td>
            <td><input type="text" id="username" name="username"></td>
          </tr>
          <tr>
            <td>Password:</td>
            <td><input type="password" id="password" name="password"></td>
          </tr>
          <tr>
            <td>Retype Password:</td>
            <td><input type="password" id="retype-password" name="retype-password"></td>
          </tr>
          <tr>
            <td>Email:</td>
            <td><input type="email" id="email" name="email"></td>
          </tr>
          <tr>
            <td>Address:</td>
            <td><input type="text" id="address" name="address"></td>
          </tr>
          <tr>
            <td>Phone:</td>
            <td><input type="tel" id="phone" name="phone"></td>
          </tr>
          <tr>
            <td>Role:</td>
            <td>
              <input type="radio" name="role" value="student"> Student<br>
              <input type="radio" name="role" value="faculty"> Faculty
            </td>
          </tr>
          <tr>
            <td>ID Card:</td>
            <td><input type="file" id="id-card" name="id-card"></td>
          </tr>
        </table>
        <div class="submit-section">
          <button type="submit">Submit</button>
          <span>Already have an account? <a href="login.php">Log in</a></span>
        </div><br>
	Before registering, 
	<a href="security.php">read this</a>
      </form>
    </div>
  </div>
</body>
</html>

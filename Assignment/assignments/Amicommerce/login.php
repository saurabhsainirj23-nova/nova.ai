<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log In</title>
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
        input {
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
</head>
<body>
    <div class="container">
        <img src="Amity_University_logo.png" alt="Website Logo" width="100" style="margin-top:10%;">
        <h1>Website Name</h1>
        <div class="signup-box">
            <form method="post" action="loginconnection.php">
                <table>
                    <tr>
                        <td>Username:</td>
                        <td><input type="text" id="username" name="username" required></td>
                    </tr>
                    <tr>
                        <td>Password:</td>
                        <td><input type="password" id="password" name="password" required></td>
                    </tr>
                </table>
                <div class="submit-section">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>

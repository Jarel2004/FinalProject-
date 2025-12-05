<?php
// ============================================
// LOG IN PAGE - PASSWORD LOGIN (NO OTP)
// ============================================

require_once __DIR__ . "/config/db.php";

// Start session
initSession();

// Redirect if already logged in
if (isLoggedIn()) {
    header("Location: index.php");
    exit;
}

$errors = [];
$previousEmail = "";

// ---------------------------------------------
// HANDLE LOGIN SUBMISSION
// ---------------------------------------------
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = trim($_POST["email"] ?? "");
    $password = trim($_POST["password"] ?? "");
    $previousEmail = $email;

    // Validate
    if (empty($email)) $errors[] = "Email is required.";
    if (empty($password)) $errors[] = "Password is required.";

    if (empty($errors)) {

        $conn = getDBConnection();

        if ($conn) {

            // Check if email exists
            $stmt = $conn->prepare("
                SELECT user_id, first_name, last_name, email, password_hash, status
                FROM users 
                WHERE email = ?
            ");
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $result = $stmt->get_result();

            if ($result->num_rows === 1) {

                $user = $result->fetch_assoc();

                if ($user["status"] !== "active") {
                    $errors[] = "Your account is not active.";
                }
                else if (!password_verify($password, $user["password_hash"])) {
                    $errors[] = "Incorrect password.";
                }
                else {
                    // SUCCESS — Log user in
                    setUserSession(
                        $user["user_id"],
                        $user["email"],
                        $user["first_name"],
                        $user["last_name"]
                    );

                    // Update last login
                    $update = $conn->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?");
                    $update->bind_param("i", $user["user_id"]);
                    $update->execute();
                    $update->close();

                    header("Location: index.php?welcome=1");
                    exit;
                }
            } 
            else {
                $errors[] = "No account found with that email.";
            }

            $stmt->close();
            closeDBConnection($conn);

        } else {
            $errors[] = "Database connection failed.";
        }
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karu-mata - Log In</title>

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #efefef, #dcdcdc);
            min-height: 100vh;
            display: flex; justify-content: center; align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            width: 100%;
            max-width: 900px;
            padding: 60px;
            border-radius: 14px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 70px;
            box-shadow: 0px 10px 35px rgba(0,0,0,0.12);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 25px;
        }

        .logo-text {
            font-size: 32px;
            color: #d32f2f;
            font-weight: 800;
        }

        .logo-icon img {
            width: 55px; height: 55px;
            border-radius: 50%;
            border: 3px solid #d32f2f;
        }

        h1 { font-size: 34px; color: #333; margin-bottom: 15px; }
        .subtitle { color: #666; margin-bottom: 25px; line-height: 1.5; }

        .form-group { margin-bottom: 25px; }
        label { font-size: 14px; font-weight: 600; margin-bottom: 6px; display: block; }

        input {
            width: 100%; padding: 12px;
            border: 1px solid #ccc; border-radius: 6px;
            font-size: 15px;
        }
        input:focus { border-color: #d32f2f; outline: none; }

        .login-btn {
            background: #d32f2f;
            color: white;
            padding: 12px 35px;
            border: none;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
        }
        .login-btn:hover { background: #b71c1c; }

        .error-box {
            background: #ffebee;
            border: 1px solid #e57373;
            color: #c62828;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .create-account-btn {
            display: block;
            margin-top: 20px;
            color: #d32f2f;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
        }
        .create-account-btn:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .container { grid-template-columns: 1fr; padding: 40px; gap: 40px; }
        }
    </style>
</head>

<body>

<div class="container">

    <!-- LEFT SECTION -->
    <div>
        <div class="logo">
            <span class="logo-text">Karu-mata</span>
            <div class="logo-icon">
                <img src="../src/logg.png" alt="Logo">
            </div>
        </div>

        <h1>Log In</h1>
        <p class="subtitle">
            Enter your email and password to access your account.
        </p>
    </div>

    <!-- RIGHT SECTION -->
    <div>
        <?php if (!empty($errors)): ?>
        <div class="error-box">
            <?php foreach ($errors as $e): ?>
                <div><?= htmlspecialchars($e); ?></div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <form method="POST" action="log-in.php">
            
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" required
                       placeholder="Enter your email"
                       value="<?= htmlspecialchars($previousEmail); ?>">
            </div>

            <div class="form-group">
                <label>Password *</label>
                <input type="password" name="password" required placeholder="Enter your password">
            </div>

            <button type="submit" class="login-btn">Log In</button>

            <a href="sign-up.php" class="create-account-btn">Create Account</a>
        </form>

    </div>

</div>

</body>
</html>

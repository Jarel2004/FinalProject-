<?php
// ============================================
// LOG IN PAGE - PHP HANDLER
// ============================================

require_once __DIR__ . "/config/db.php";

// Start session
initSession();

// If already logged in → go to homepage
if (isLoggedIn()) {
    header("Location: index.php");
    exit;
}

// ---------------------------------------------
// HANDLE FORM SUBMISSION
// ---------------------------------------------
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = filter_var($_POST["email"] ?? "", FILTER_SANITIZE_EMAIL);
    $errors = [];

    // Basic validation
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address.";
    }

    if (empty($errors)) {
        $conn = getDBConnection();

        if ($conn) {
            // Check if email exists
            $stmt = $conn->prepare("
                SELECT user_id, first_name, last_name 
                FROM users 
                WHERE email = ? AND status = 'active'
            ");
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $result = $stmt->get_result();

            if ($result->num_rows > 0) {

                $user = $result->fetch_assoc();

                // Generate OTP
                $otp = generateOTP();
                $otpExpires = date("Y-m-d H:i:s", strtotime("+10 minutes"));

                // Update OTP in DB
                $update = $conn->prepare("
                    UPDATE users 
                    SET otp_code = ?, otp_expires = ? 
                    WHERE email = ?
                ");
                $update->bind_param("sss", $otp, $otpExpires, $email);
                $update->execute();
                $update->close();

                // Send OTP
                $subject = "Your Karu-mata Login OTP";
                $message = "
                    <html>
                    <body>
                        <h2>Karu-mata Login</h2>
                        <p>Hello {$user["first_name"]},</p>
                        <p>Your One-Time Password (OTP) is:</p>
                        <h1 style='color:#d32f2f;'>$otp</h1>
                        <p>This code is valid for 10 minutes.</p>
                        <p>If this wasn’t you, please ignore this email.</p>
                    </body>
                    </html>
                ";

                sendEmail($email, $subject, $message);

                // Store session for verification
                $_SESSION["pending_email"] = $email;

                // DEVELOPMENT ONLY (remove in production)
                $_SESSION["pending_otp"] = $otp;

                // Redirect to OTP verification
                header("Location: verify-otp.php?email=" . urlencode($email));
                exit;

            } else {
                $errors[] = "No account found with this email.";
            }

            $stmt->close();
            closeDBConnection($conn);

        } else {
            $errors[] = "Database connection failed.";
        }
    }

    // Save errors & previously entered email
    if (!empty($errors)) {
        $_SESSION["login_errors"] = $errors;
        $_SESSION["login_email"] = $email;
    }
}

// Retrieve any stored errors + saved email
$errors = $_SESSION["login_errors"] ?? [];
$previousEmail = $_SESSION["login_email"] ?? "";
unset($_SESSION["login_errors"], $_SESSION["login_email"]);
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

        .terms { margin-top: 25px; font-size: 14px; color: #777; }
        .terms a { color: #d32f2f; font-weight: 600; text-decoration: none; }

        .form-group { margin-bottom: 25px; }
        label { font-size: 14px; font-weight: 600; margin-bottom: 6px; display: block; }
        input {
            width: 100%; padding: 12px;
            border: 1px solid #ccc; border-radius: 6px;
            font-size: 15px;
        }
        input:focus { border-color: #d32f2f; outline: none; }

        .actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 35px;
        }

        .create-account-btn {
            color: #d32f2f; font-weight: 600;
            text-decoration: none;
        }
        .create-account-btn:hover { text-decoration: underline; }

        .login-btn {
            background: #d32f2f;
            color: white;
            padding: 12px 35px;
            border: none;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
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
        <p class="subtitle">A One-Time Password (OTP) will be sent to your email.</p>

        <p class="terms">
            By continuing, you agree to our 
            <a href="#">Terms</a> & <a href="#">Privacy Policy</a>
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
                <label>Email <span style="color:#d32f2f">*</span></label>
                <input type="email" name="email" required placeholder="Enter your email"
                       value="<?= htmlspecialchars($previousEmail); ?>">
            </div>

            <div class="actions">
                <a href="sign-up.php" class="create-account-btn">Create Account</a>
                <button type="submit" class="login-btn">Send OTP</button>
            </div>
        </form>

    </div>

</div>

</body>
</html>

<?php
// ============================================
// LOG IN PAGE - PHP HANDLER
// ============================================

require_once 'config/db.php';

// Initialize session
initSession();

// If user is already logged in, redirect to index
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    
    $errors = [];
    
    // Validation
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address';
    }
    
    // If no errors, proceed with login
    if (empty($errors)) {
        $conn = getDBConnection();
        
        if ($conn) {
            // Check if user exists
            $stmt = $conn->prepare("SELECT user_id, first_name, last_name, is_verified FROM users WHERE email = ? AND status = 'active'");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                
                // Generate OTP
                $otp = generateOTP();
                $otpExpires = date('Y-m-d H:i:s', strtotime('+10 minutes'));
                
                // Update OTP in database
                $updateStmt = $conn->prepare("UPDATE users SET otp_code = ?, otp_expires = ? WHERE email = ?");
                $updateStmt->bind_param("sss", $otp, $otpExpires, $email);
                $updateStmt->execute();
                $updateStmt->close();
                
                // Send OTP email
                $subject = "Your Karu-mata Login OTP";
                $message = "
                    <html>
                    <body>
                        <h2>Karu-mata Login</h2>
                        <p>Hello {$user['first_name']},</p>
                        <p>Your OTP code is: <strong>$otp</strong></p>
                        <p>This code will expire in 10 minutes.</p>
                        <p>If you didn't request this code, please ignore this email.</p>
                    </body>
                    </html>
                ";
                
                sendEmail($email, $subject, $message);
                
                // Store email in session for OTP verification
                $_SESSION['pending_email'] = $email;
                $_SESSION['pending_otp'] = $otp; // For development only
                
                // Redirect to OTP verification
                header('Location: verify-otp.php?email=' . urlencode($email));
                exit;
            } else {
                $errors[] = 'No account found with this email address';
            }
            
            $stmt->close();
            closeDBConnection($conn);
        } else {
            $errors[] = 'Database connection failed';
        }
    }
    
    // Store errors in session
    if (!empty($errors)) {
        $_SESSION['login_errors'] = $errors;
        $_SESSION['login_email'] = $email;
    }
}

// Get errors from session
$errors = $_SESSION['login_errors'] ?? [];
$savedEmail = $_SESSION['login_email'] ?? '';
unset($_SESSION['login_errors'], $_SESSION['login_email']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karu-mata - Log in</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            padding: 60px;
            max-width: 900px;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 40px;
        }

        .logo-text {
            color: #d32f2f;
            font-size: 32px;
            font-weight: 700;
        }

        .logo-icon {
            width: 45px;
            height: 45px;
            background: #d32f2f;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
        }

        .logo-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        h1 {
            font-size: 36px;
            color: #333;
            margin-bottom: 20px;
        }

        .subtitle {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .terms {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-top: 30px;
        }

        .terms a {
            color: #d32f2f;
            text-decoration: none;
            font-weight: 500;
        }

        .terms a:hover {
            text-decoration: underline;
        }

        .form-group {
            margin-bottom: 30px;
        }

        label {
            display: block;
            color: #333;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
        }

        label .required {
            color: #d32f2f;
        }

        input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
            background: white;
        }

        input:focus {
            outline: none;
            border-color: #d32f2f;
        }

        input::placeholder {
            color: #999;
        }

        .actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 40px;
        }

        .create-account-btn {
            background: none;
            border: none;
            color: #d32f2f;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            padding: 8px;
        }

        .create-account-btn:hover {
            text-decoration: underline;
        }

        .login-btn {
            background: #d32f2f;
            color: white;
            border: none;
            padding: 14px 40px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s, transform 0.1s;
        }

        .login-btn:hover {
            background: #b71c1c;
        }

        .login-btn:active {
            transform: scale(0.98);
        }

        .error-box {
            background: #ffebee;
            border: 1px solid #ef5350;
            color: #c62828;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
                padding: 40px 30px;
                gap: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-section">
            <div class="logo">
                <span class="logo-text">Karu-mata</span>
                <div class="logo-icon"><img src="src/karumata.png" alt="Logo"></div>
            </div>
            
            <h1>Log in</h1>
            
            <p class="subtitle">
                A one-time password (OTP) will be sent to your email to verify your identity.
            </p>
            
            <div class="terms">
                By continuing you agree to our <a href="#">Terms & Conditions</a> and <a href="#">Privacy Notice</a>
            </div>
        </div>
        
        <div class="right-section">
            <?php if (!empty($errors)): ?>
                <div class="error-box">
                    <?php foreach ($errors as $error): ?>
                        <div><?php echo htmlspecialchars($error); ?></div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="log-in.php">
                <div class="form-group">
                    <label>Email<span class="required">*</span></label>
                    <input type="email" name="email" placeholder="Enter your email" required value="<?php echo htmlspecialchars($savedEmail); ?>">
                </div>
                
                <div class="actions">
                    <a href="sign-up.php" class="create-account-btn">Create Account</a>
                    <button type="submit" class="login-btn">Log in</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
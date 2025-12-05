<?php
// ============================================
// SIGN UP PAGE - PASSWORD ACCOUNT CREATION
// ============================================

require_once __DIR__ . "/config/db.php";

// Start session
initSession();

$errors = [];
$success = "";

// ---------------------------------------------
// HANDLE SIGN-UP FORM
// ---------------------------------------------
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $first = trim($_POST["first_name"] ?? "");
    $last = trim($_POST["last_name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $mobile = trim($_POST["mobile"] ?? "");
    $birth_month = $_POST["birth_month"] ?? null;
    $birth_day = $_POST["birth_day"] ?? null;
    $password = trim($_POST["password"] ?? "");
    $confirm = trim($_POST["confirm_password"] ?? "");

    // Basic validation
    if (empty($first)) $errors[] = "First name is required.";
    if (empty($last)) $errors[] = "Last name is required.";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email address.";
    if (empty($mobile)) $errors[] = "Mobile number is required.";
    if (empty($password)) $errors[] = "Password is required.";
    if ($password !== $confirm) $errors[] = "Passwords do not match.";
    if (!ctype_digit($birth_month) || $birth_month < 1 || $birth_month > 12) $errors[] = "Invalid birth month.";
    if (!ctype_digit($birth_day) || $birth_day < 1 || $birth_day > 31) $errors[] = "Invalid birth day.";

    if (empty($errors)) {

        $conn = getDBConnection();

        if ($conn) {

            // Check if email already exists
            $check = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
            $check->bind_param("s", $email);
            $check->execute();
            $res = $check->get_result();

            if ($res->num_rows > 0) {
                $errors[] = "This email is already registered.";
            } else {

                // Insert new user
                $hash = password_hash($password, PASSWORD_DEFAULT);

                $stmt = $conn->prepare("
                    INSERT INTO users (first_name, last_name, email, mobile, birth_month, birth_day, password_hash, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
                ");
                $stmt->bind_param("ssssiss", 
                    $first, 
                    $last, 
                    $email, 
                    $mobile, 
                    $birth_month, 
                    $birth_day, 
                    $hash
                );

                if ($stmt->execute()) {
                    // Success
                    $_SESSION["signup_success"] = "Account created! You can now log in.";
                    header("Location: log-in.php");
                    exit;
                } else {
                    $errors[] = "Something went wrong. Please try again.";
                }

                $stmt->close();
            }

            $check->close();
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
    <title>Karu-mata - Sign Up</title>

    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            background:#f3f3f3;
            font-family:'Segoe UI',sans-serif;
            display:flex; justify-content:center; align-items:center;
            min-height:100vh;
            padding:20px;
        }
        .container {
            background:white;
            padding:45px;
            width:100%; max-width:480px;
            border-radius:10px;
            box-shadow:0 0 10px rgba(0,0,0,0.1);
        }
        h2 { margin-bottom:18px; color:#333; text-align:center; }
        .form-group { margin-bottom:18px; }
        label { font-weight:600; margin-bottom:5px; display:block; }
        input, select {
            width:100%; padding:12px;
            border:1px solid #ccc; border-radius:6px;
            font-size:15px;
        }
        input:focus, select:focus {
            border-color:#d32f2f;
            outline:none;
        }
        .signup-btn {
            width:100%; padding:14px;
            background:#d32f2f; color:white;
            border:none; border-radius:6px;
            cursor:pointer; font-size:16px;
            margin-top:10px;
        }
        .signup-btn:hover { background:#b71c1c; }
        .link {
            margin-top:15px;
            display:block;
            text-align:center;
            color:#d32f2f;
            text-decoration:none;
            font-weight:600;
        }
        .error-box {
            background:#ffebee;
            border:1px solid #e57373;
            color:#c62828;
            padding:12px;
            border-radius:6px;
            margin-bottom:20px;
            font-size:14px;
        }
    </style>
</head>
<body>

<div class="container">

    <h2>Create Account</h2>

    <?php if (!empty($errors)): ?>
    <div class="error-box">
        <?php foreach ($errors as $e): ?>
            • <?= htmlspecialchars($e); ?><br>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <form action="sign-up.php" method="POST">

        <div class="form-group">
            <label>First Name *</label>
            <input type="text" name="first_name" required>
        </div>

        <div class="form-group">
            <label>Last Name *</label>
            <input type="text" name="last_name" required>
        </div>

        <div class="form-group">
            <label>Email *</label>
            <input type="email" name="email" required>
        </div>

        <div class="form-group">
            <label>Mobile Number *</label>
            <input type="text" name="mobile" required>
        </div>

        <div class="form-group">
            <label>Birthday *</label>
            <div style="display:flex; gap:10px;">
                <select name="birth_month" required>
                    <option value="">Month</option>
                    <?php for ($m = 1; $m <= 12; $m++): ?>
                        <option value="<?= $m ?>"><?= $m ?></option>
                    <?php endfor; ?>
                </select>
                <select name="birth_day" required>
                    <option value="">Day</option>
                    <?php for ($d = 1; $d <= 31; $d++): ?>
                        <option value="<?= $d ?>"><?= $d ?></option>
                    <?php endfor; ?>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label>Password *</label>
            <input type="password" name="password" required>
        </div>

        <div class="form-group">
            <label>Confirm Password *</label>
            <input type="password" name="confirm_password" required>
        </div>

        <button type="submit" class="signup-btn">Create Account</button>

        <a href="log-in.php" class="link">Already have an account? Log In</a>

    </form>

</div>

</body>
</html>

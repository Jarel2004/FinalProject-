<?php
// ============================================
// RESEND OTP HANDLER
// ============================================

require_once 'config/db.php';

// Initialize session
initSession();

// Get email from query parameter
$email = $_GET['email'] ?? '';

if (empty($email)) {
    header('Location: log-in.php');
    exit;
}

$conn = getDBConnection();
if (!$conn) {
    $_SESSION['otp_errors'] = ['Database connection failed'];
    header('Location: verify-otp.php?email=' . urlencode($email));
    exit;
}

// Check if user exists
$stmt = $conn->prepare("SELECT user_id, first_name FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Generate new OTP
    $otp = generateOTP();
    $otpExpires = date('Y-m-d H:i:s', strtotime('+10 minutes'));
    
    // Update OTP in database
    $updateStmt = $conn->prepare("UPDATE users SET otp_code = ?, otp_expires = ? WHERE email = ?");
    $updateStmt->bind_param("sss", $otp, $otpExpires, $email);
    
    if ($updateStmt->execute()) {
        // Send OTP email
        $subject = "Your New Karu-mata OTP Code";
        $message = "
            <html>
            <body>
                <h2>Karu-mata OTP Resent</h2>
                <p>Hello {$user['first_name']},</p>
                <p>Your new OTP code is: <strong>$otp</strong></p>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </body>
            </html>
        ";
        
        sendEmail($email, $subject, $message);
        
        // Store new OTP in session (development only)
        $_SESSION['pending_otp'] = $otp;
        
        // Set success message
        $_SESSION['otp_success'] = 'A new OTP has been sent to your email';
    } else {
        $_SESSION['otp_errors'] = ['Failed to resend OTP. Please try again.'];
    }
    
    $updateStmt->close();
} else {
    $_SESSION['otp_errors'] = ['User not found'];
}

$stmt->close();
closeDBConnection($conn);

// Redirect back to OTP verification page
header('Location: verify-otp.php?email=' . urlencode($email));
exit;
?>
<?php
// ============================================
// DATABASE CONFIGURATION
// ============================================

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'karumata_restaurant');

// Create connection
function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        // Set charset to utf8mb4
        $conn->set_charset("utf8mb4");
        
        return $conn;
    } catch (Exception $e) {
        error_log($e->getMessage());
        return null;
    }
}

// Close connection
function closeDBConnection($conn) {
    if ($conn) {
        $conn->close();
    }
}

// Sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Generate random OTP
function generateOTP($length = 6) {
    return str_pad(random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
}

// Send email (you'll need to configure this with your email provider)
function sendEmail($to, $subject, $message) {
    // For production, use PHPMailer or similar library
    // This is a basic example
    $headers = "From: noreply@karumata.com\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    return mail($to, $subject, $message, $headers);
}

// Generate order number
function generateOrderNumber() {
    return 'KFD' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
}

// JSON response helper
function jsonResponse($success, $message = '', $data = null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Start session if not started
function initSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

// Check if user is logged in
function isLoggedIn() {
    initSession();
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Get current user ID
function getCurrentUserId() {
    initSession();
    return $_SESSION['user_id'] ?? null;
}

// Set user session
function setUserSession($userId, $email, $firstName, $lastName) {
    initSession();
    $_SESSION['user_id'] = $userId;
    $_SESSION['email'] = $email;
    $_SESSION['first_name'] = $firstName;
    $_SESSION['last_name'] = $lastName;
    $_SESSION['logged_in'] = true;
}

// Clear user session
function clearUserSession() {
    initSession();
    session_unset();
    session_destroy();
}

// Error logging
function logError($message, $file = '', $line = '') {
    $logMessage = date('Y-m-d H:i:s') . " - ";
    if ($file) {
        $logMessage .= "File: $file - ";
    }
    if ($line) {
        $logMessage .= "Line: $line - ";
    }
    $logMessage .= $message . "\n";
    
    error_log($logMessage, 3, __DIR__ . '/../logs/error.log');
}
?>
<?php
// FINALPROJECT/php/config.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = "localhost";
$user = "root";
$pass = "";
$db = "kfoods_db";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Set timezone if needed
date_default_timezone_set('Asia/Manila');   
?>
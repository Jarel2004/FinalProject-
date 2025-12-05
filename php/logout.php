<?php
// ============================================
// LOGOUT HANDLER
// ============================================

require_once __DIR__ . "/config/db.php";

// Start session
initSession();

// Clear user session completely
clearUserSession();

// Redirect to login page
header("Location: log-in.php?logout=1");
exit;

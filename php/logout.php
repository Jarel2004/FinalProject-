<?php
// ============================================
// LOGOUT HANDLER
// ============================================

require_once 'config/db.php';

// Initialize session
initSession();

// Clear user session
clearUserSession();

// Redirect to login page
header('Location: log-in.php?logout=1');
exit;
?>
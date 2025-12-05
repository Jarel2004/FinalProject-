<?php
require_once __DIR__ . "/config/db.php";

$conn = getDBConnection();

if ($conn) {
    echo "<h1 style='color:green;'>SUCCESS: Database Connected!</h1>";
} else {
    echo "<h1 style='color:red;'>FAILED: Database Not Connected!</h1>";
}
?>

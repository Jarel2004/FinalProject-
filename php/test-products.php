<?php
require_once __DIR__ . "/config/db.php";

$conn = getDBConnection();

$result = $conn->query("SELECT name, price FROM products LIMIT 5");

if ($result && $result->num_rows > 0) {
    echo "<h3 style='color:green;'>Products Loaded Successfully:</h3>";
    while ($row = $result->fetch_assoc()) {
        echo $row['name'] . " — ₱" . $row['price'] . "<br>";
    }
} else {
    echo "<h3 style='color:red;'>No products found or query failed.</h3>";
}
?>

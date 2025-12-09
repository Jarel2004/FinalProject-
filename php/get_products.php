<?php
// FINALPROJECT/php/get_products.php
require "config.php";

header('Content-Type: application/json');

$category = $_GET['category'] ?? 'all';

if ($category === 'all') {
    $sql = "SELECT * FROM products";
    $stmt = $conn->prepare($sql);
} else if ($category === 'best-seller') {
    $sql = "SELECT * FROM products WHERE is_best_seller = 1";
    $stmt = $conn->prepare($sql);
} else {
    $sql = "SELECT * FROM products WHERE category = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $category);
}

$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = [
        'id' => $row['product_id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'price' => floatval($row['price']),
        'category' => $row['category'],
        'image' => $row['image'],
        'isBestSeller' => boolval($row['is_best_seller'])
    ];
}

echo json_encode($products);
?>
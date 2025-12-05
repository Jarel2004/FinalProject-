<?php
// File: includes/functions.php
require_once 'config.php';

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function getUserInfo() {
    global $conn;
    if (isLoggedIn()) {
        $user_id = $_SESSION['user_id'];
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }
    return null;
}

function getCartCount() {
    global $conn;
    if (isLoggedIn()) {
        $user_id = $_SESSION['user_id'];
        $stmt = $conn->prepare("SELECT SUM(quantity) as total FROM cart WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row['total'] ?? 0;
    }
    return 0;
}

function getProducts($category = 'all') {
    global $conn;
    
    if ($category == 'all') {
        $stmt = $conn->prepare("SELECT * FROM products ORDER BY category, name");
    } else {
        $stmt = $conn->prepare("SELECT * FROM products WHERE category = ? ORDER BY name");
        $stmt->bind_param("s", $category);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $products = [];
    
    while ($row = $result->fetch_assoc()) {
        // Get addons for each product
        $addons_stmt = $conn->prepare("SELECT * FROM addons WHERE product_id = ?");
        $addons_stmt->bind_param("i", $row['id']);
        $addons_stmt->execute();
        $addons_result = $addons_stmt->get_result();
        $addons = [];
        
        while ($addon = $addons_result->fetch_assoc()) {
            $addons[] = $addon;
        }
        $row['addons'] = $addons;
        $products[] = $row;
    }
    
    return $products;
}

function generateOrderNumber() {
    return 'KARU-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));
}
?>
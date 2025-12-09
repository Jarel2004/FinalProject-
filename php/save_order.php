<?php
// FINALPROJECT/php/save_order.php
session_start();
require "config.php";

header('Content-Type: application/json');

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["status" => "ERROR", "message" => "User not logged in"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$required = ["address", "subtotal", "delivery_fee", "service_fee", "total", "items"];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["status" => "ERROR", "message" => "Missing field: $field"]);
        exit();
    }
}

$user_id = $_SESSION["user_id"];
$address = mysqli_real_escape_string($conn, $data["address"]);
$subtotal = floatval($data["subtotal"]);
$delivery_fee = floatval($data["delivery_fee"]);
$service_fee = floatval($data["service_fee"]);
$total = floatval($data["total"]);
$items = $data["items"];

// Begin transaction
$conn->begin_transaction();

try {
    // Insert main order
    $order = $conn->prepare("INSERT INTO orders (user_id, address, subtotal, delivery_fee, service_fee, total_amount) VALUES (?, ?, ?, ?, ?, ?)");
    $order->bind_param("isdddd", $user_id, $address, $subtotal, $delivery_fee, $service_fee, $total);
    
    if (!$order->execute()) {
        throw new Exception("Failed to create order: " . $conn->error);
    }
    
    $order_id = $conn->insert_id;

    // Insert each item
    foreach ($items as $item) {
        $prod_id = intval($item["id"]);
        $qty = intval($item["quantity"]);
        $price = floatval($item["price"]);

        $insertItem = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_each) VALUES (?, ?, ?, ?)");
        $insertItem->bind_param("iiid", $order_id, $prod_id, $qty, $price);
        
        if (!$insertItem->execute()) {
            throw new Exception("Failed to add order item: " . $conn->error);
        }

        $order_item_id = $conn->insert_id;

        // Addons
        if (isset($item["addons"]) && is_array($item["addons"])) {
            foreach ($item["addons"] as $addon) {
                $name = mysqli_real_escape_string($conn, $addon["name"]);
                $priceAddon = floatval($addon["price"]);

                $insertAddon = $conn->prepare("INSERT INTO order_addons (order_item_id, addon_name, addon_price) VALUES (?, ?, ?)");
                $insertAddon->bind_param("isd", $order_item_id, $name, $priceAddon);
                
                if (!$insertAddon->execute()) {
                    throw new Exception("Failed to add order addon: " . $conn->error);
                }
            }
        }
    }

    $conn->commit();
    
    // Clear cart after successful order
    echo json_encode([
        "status" => "SUCCESS", 
        "order_id" => $order_id,
        "message" => "Order placed successfully!"
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "ERROR", "message" => $e->getMessage()]);
}
?>
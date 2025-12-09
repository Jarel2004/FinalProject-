<?php
session_start();
require "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $_SESSION["user_id"] ?? null;
require "config.php";

$data = json_decode(file_get_contents("php://input"), true);
// In save_order.php
$address = mysqli_real_escape_string($conn, $data["address"] ?? '');
$subtotal = floatval($data["subtotal"] ?? 0);
// ... validate other fields
$user_id = $_SESSION["user_id"] ?? null;
$address = $data["address"];
$subtotal = $data["subtotal"];
$delivery_fee = $data["delivery_fee"];
$service_fee = $data["service_fee"];
$total = $data["total"];
$items = $data["items"];

// Insert main order
$order = $conn->prepare("INSERT INTO orders (user_id, address, subtotal, delivery_fee, service_fee, total_amount) VALUES (?, ?, ?, ?, ?, ?)");
$order->bind_param("isdddd", $user_id, $address, $subtotal, $delivery_fee, $service_fee, $total);
$order->execute();

$order_id = $conn->insert_id;

// Insert each item
foreach ($items as $item) {

    $prod_id = $item["id"];
    $qty = $item["quantity"];
    $price = $item["price"];

    $insertItem = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_each) VALUES (?, ?, ?, ?)");
    $insertItem->bind_param("iiid", $order_id, $prod_id, $qty, $price);
    $insertItem->execute();

    $order_item_id = $conn->insert_id;

    // Addons
    foreach ($item["addons"] as $addon) {
        $name = $addon["name"];
        $priceAddon = $addon["price"];

        $insertAddon = $conn->prepare("INSERT INTO order_addons (order_item_id, addon_name, addon_price) VALUES (?, ?, ?)");
        $insertAddon->bind_param("isd", $order_item_id, $name, $priceAddon);
        $insertAddon->execute();
    }
}

echo json_encode(["status" => "SUCCESS", "order_id" => $order_id]);
if (!$user_id) {
    echo json_encode(["status" => "ERROR", "message" => "User not logged in"]);
    exit();
}
?>

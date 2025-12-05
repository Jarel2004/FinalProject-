<?php
// ============================================
// CART PAGE BACKEND HANDLER
// ============================================

// Load database + session utilities
require_once __DIR__ . "/config/db.php";

// Start session
initSession();

// Check logged-in user
$user = null;
if (isLoggedIn()) {
    $conn = getDBConnection();
    if ($conn) {
        $userId = getCurrentUserId();
        $stmt = $conn->prepare("SELECT first_name, last_name, email FROM users WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
        }
        $stmt->close();
        closeDBConnection($conn);
    }
}



// ============================================
// CHECKOUT PROCESS
// ============================================

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'checkout') {
    header('Content-Type: application/json');

    $cartData = json_decode($_POST['cart_data'] ?? '[]', true);
    $deliveryAddress = sanitizeInput($_POST['delivery_address'] ?? '');

    if (empty($cartData)) {
        jsonResponse(false, "Cart is empty.");
    }

    if (empty($deliveryAddress)) {
        jsonResponse(false, "Please enter a delivery address.");
    }

    $conn = getDBConnection();
    if (!$conn) {
        jsonResponse(false, "Failed to connect to database.");
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Compute totals
        $subtotal = 0;
        foreach ($cartData as $item) {
            $subtotal += ($item["price"] ?? 0) * ($item["quantity"] ?? 1);
        }

        $deliveryFee = 50;
        $serviceFee = 20;
        $totalAmount = $subtotal + $deliveryFee + $serviceFee;

        // Create order number
        $orderNumber = generateOrderNumber();

        $userId = getCurrentUserId();
        $guestEmail = $user ? null : "guest@kfoods.com";

        // Insert order
        $stmt = $conn->prepare("
            INSERT INTO orders (
                order_number, user_id, guest_email, delivery_address,
                subtotal, delivery_fee, service_fee, total_amount,
                payment_method, payment_status, order_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'cash', 'pending', 'confirmed')
        ");

        $stmt->bind_param(
            "sissdddd",
            $orderNumber,
            $userId,
            $guestEmail,
            $deliveryAddress,
            $subtotal,
            $deliveryFee,
            $serviceFee,
            $totalAmount
        );

        $stmt->execute();
        $orderId = $stmt->insert_id;
        $stmt->close();



        // Insert items
        foreach ($cartData as $item) {
            $productId = $item["id"];
            $productName = $item["name"];
            $productPrice = $item["price"];
            $quantity = $item["quantity"];
            $itemSubtotal = $productPrice * $quantity;

            $stmt = $conn->prepare("
                INSERT INTO order_items 
                (order_id, product_id, product_name, product_price, quantity, subtotal)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->bind_param(
                "iisdid",
                $orderId,
                $productId,
                $productName,
                $productPrice,
                $quantity,
                $itemSubtotal
            );

            $stmt->execute();
            $orderItemId = $stmt->insert_id;
            $stmt->close();


            // Addons
            if (!empty($item["addons"])) {
                foreach ($item["addons"] as $addon) {
                    $addonName = $addon["name"];
                    $addonPrice = $addon["price"];

                    $stmt = $conn->prepare("
                        INSERT INTO order_item_addons 
                        (order_item_id, addon_name, addon_price)
                        VALUES (?, ?, ?)
                    ");
                    $stmt->bind_param("isd", $orderItemId, $addonName, $addonPrice);
                    $stmt->execute();
                    $stmt->close();
                }
            }


            // Update product order count
            $conn->query("
                UPDATE products 
                SET order_count = order_count + {$quantity}
                WHERE product_id = {$productId}
            ");
        }



        // Commit order
        $conn->commit();



        // Send email (if logged in)
        if ($user) {
            $subject = "Your Order Confirmation - $orderNumber";
            $message = "
                <html>
                <body>
                    <h2>Order Confirmed!</h2>
                    <p>Hello {$user['first_name']},</p>
                    <p>Your order is now being prepared.</p>
                    <p><strong>Order Number:</strong> $orderNumber</p>
                    <p><strong>Total Paid:</strong> ₱" . number_format($totalAmount, 2) . "</p>
                    <p>Thank you for ordering from Karu-mata!</p>
                </body>
                </html>
            ";

            sendEmail($user["email"], $subject, $message);
        }



        // Response
        echo json_encode([
            "success" => true,
            "message" => "Order placed successfully!",
            "order_number" => $orderNumber,
            "total_amount" => $totalAmount
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        logError("Checkout error: " . $e->getMessage(), __FILE__, __LINE__);
        jsonResponse(false, "Checkout failed. Try again.");
    }

    closeDBConnection($conn);
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karu-mata - Your Cart</title>

    <link rel="stylesheet" href="../cart/cart.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

<!-- ==========================
          HEADER
========================== -->
<header>
    <div class="logo">
        <img src="../src/logg.png" class="brand-logo" alt="Karu-mata Logo" />
        <h1>Karu-mata</h1>
    </div>

    <div class="nav-icons">
        <div class="restaurant-info">
            <div class="info-item"><i class="fas fa-clock"></i>Open: 10AM – 9PM</div>
            <div class="info-item"><i class="fas fa-bolt"></i>15–20 min meals</div>
            <div class="info-item"><i class="fas fa-motorcycle"></i>Delivery available</div>
        </div>

        <div class="btns">
            <a href="index.php" class="back-to-menu-btn">
                <i class="fas fa-arrow-left"></i>Back to Menu
            </a>

            <button id="profile-toggle" class="profile-circle">
                <i class="fas fa-user"></i>
            </button>
        </div>
    </div>
</header>



<!-- ==========================
          MAIN CART CONTENT
========================== -->
<div class="container main-container">
    <div class="cart-page-section">
        <h2 class="section-title"><i class="fas fa-shopping-cart"></i>Your Shopping Cart</h2>

        <div class="cart-page-container">

            <!-- CART ITEMS -->
            <div class="cart-items-container">

                <div class="cart-items-header">
                    <h3>Items in Your Cart</h3>
                    <div class="cart-count-badge" id="cart-page-count">0 items</div>
                </div>

                <div id="cart-page-items" class="cart-items-list">
                    <div class="empty-cart">
                        <i class="fas fa-shopping-basket"></i>
                        <p>Your cart is empty</p>
                        <p>Add something delicious!</p>
                    </div>
                </div>

            </div>



            <!-- CART SUMMARY -->
            <div class="cart-summary">

                <h3 class="summary-header"><i class="fas fa-receipt"></i> Order Summary</h3>

                <div class="summary-details">
                    <div class="summary-row"><span>Subtotal</span> <span id="cart-subtotal">₱0</span></div>
                    <div class="summary-row"><span>Delivery Fee</span> <span id="delivery-fee">₱50</span></div>
                    <div class="summary-row"><span>Service Fee</span> <span id="service-fee">₱20</span></div>
                    <div class="summary-row total"><span>Total</span> <span id="cart-total-amount">₱0</span></div>
                </div>

                <div class="delivery-info">
                    <div class="info-box">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h4>Delivery Address</h4>
                            <p id="delivery-address">No address set yet</p>
                        </div>
                    </div>
                </div>

                <div class="cart-actions">
                    <button class="cart-btn checkout-btn" id="checkout-page-btn">
                        <i class="fas fa-check-circle"></i> Proceed to Checkout
                    </button>

                    <button class="cart-btn clear-cart-btn" id="clear-cart-page-btn">
                        <i class="fas fa-trash-alt"></i> Clear Cart
                    </button>

                    <a href="index.php" class="cart-btn continue-shopping-btn">
                        <i class="fas fa-utensils"></i> Continue Shopping
                    </a>
                </div>

            </div>

        </div>
    </div>
</div>



<!-- ==========================
          PROFILE SIDEBAR
========================== -->
<div id="profile-sidebar" class="profile-sidebar">
    <div class="profile-header">
        <div class="profile-avatar"><i class="fas fa-user-circle"></i></div>

        <div class="profile-info">
            <?php if ($user): ?>
                <h3 class="profile-name">Hello, <?= htmlspecialchars($user["first_name"]); ?>!</h3>
                <p class="profile-email"><?= htmlspecialchars($user["email"]); ?></p>
            <?php else: ?>
                <h3 class="profile-name">Welcome, Guest!</h3>
                <p class="profile-email">guest@kfoods.com</p>
                <button class="login-btn" onclick="window.location.href='log-in.php'">
                    Sign In / Register
                </button>
            <?php endif; ?>
        </div>

        <button class="close-profile">&times;</button>
    </div>

    <div class="profile-content">
        <div class="profile-section">
            <h4><i class="fas fa-map-marker-alt"></i> Delivery Location</h4>
            <p class="current-address">No address set yet</p>
            <button class="manage-address-btn"><i class="fas fa-edit"></i> Manage</button>
        </div>

        <div class="profile-section">
            <h4><i class="fas fa-history"></i> Order History</h4>
            <div id="order-history-list"></div>
        </div>
    </div>

    <?php if ($user): ?>
    <div class="profile-footer">
        <button class="logout-btn" onclick="window.location.href='logout.php'">
            <i class="fas fa-sign-out-alt"></i> Log Out
        </button>
    </div>
    <?php endif; ?>
</div>



<!-- ADDRESS MODAL -->
<div id="addressModal" class="address-modal">
    <div class="address-modal-content">
        <h2>Manage Address</h2>

        <label>Street</label>
        <input id="addrStreet" type="text">

        <label>Barangay</label>
        <input id="addrBarangay" type="text">

        <label>City</label>
        <input id="addrCity" type="text">

        <label>ZIP Code</label>
        <input id="addrZip" type="text">

        <button class="save-address-btn">Save</button>
        <button class="close-address-btn">Close</button>
    </div>
</div>



<!-- ==========================
          JS GLOBAL VARS
========================== -->
<script>
    const isLoggedIn = <?= isLoggedIn() ? 'true' : 'false'; ?>;
    const currentUser = <?= $user ? json_encode($user) : 'null'; ?>;
</script>

<!-- CART LOGIC -->
<script src="../cart/cart.js"></script>

</body>
</html>

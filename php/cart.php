<?php
// ============================================
// CART PAGE - PHP HANDLER
// ============================================

require_once 'config/db.php';

// Initialize session
initSession();

// Get user information if logged in
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

// Handle checkout
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'checkout') {
    header('Content-Type: application/json');
    
    $cartData = json_decode($_POST['cart_data'] ?? '[]', true);
    $deliveryAddress = sanitizeInput($_POST['delivery_address'] ?? '');
    
    if (empty($cartData)) {
        echo json_encode(['success' => false, 'message' => 'Cart is empty']);
        exit;
    }
    
    if (empty($deliveryAddress)) {
        echo json_encode(['success' => false, 'message' => 'Please set a delivery address']);
        exit;
    }
    
    $conn = getDBConnection();
    if (!$conn) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Calculate totals
        $subtotal = 0;
        foreach ($cartData as $item) {
            $subtotal += ($item['price'] ?? 0) * ($item['quantity'] ?? 1);
        }
        
        $deliveryFee = 50.00;
        $serviceFee = 20.00;
        $totalAmount = $subtotal + $deliveryFee + $serviceFee;
        
        // Generate order number
        $orderNumber = generateOrderNumber();
        
        // Insert order
        $userId = getCurrentUserId();
        $guestEmail = $user ? null : 'guest@kfoods.com';
        
        $stmt = $conn->prepare("INSERT INTO orders (order_number, user_id, guest_email, delivery_address, subtotal, delivery_fee, service_fee, total_amount, payment_status, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'confirmed')");
        $stmt->bind_param("sissdddd", $orderNumber, $userId, $guestEmail, $deliveryAddress, $subtotal, $deliveryFee, $serviceFee, $totalAmount);
        $stmt->execute();
        $orderId = $conn->insert_id;
        $stmt->close();
        
        // Insert order items
        foreach ($cartData as $item) {
            $productId = $item['id'];
            $productName = $item['name'];
            $productPrice = $item['price'] ?? 0;
            $quantity = $item['quantity'] ?? 1;
            $itemSubtotal = $productPrice * $quantity;
            
            $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("iisdid", $orderId, $productId, $productName, $productPrice, $quantity, $itemSubtotal);
            $stmt->execute();
            $orderItemId = $conn->insert_id;
            $stmt->close();
            
            // Insert addons if any
            if (isset($item['addons']) && is_array($item['addons'])) {
                foreach ($item['addons'] as $addon) {
                    $addonName = $addon['name'];
                    $addonPrice = $addon['price'];
                    
                    $stmt = $conn->prepare("INSERT INTO order_item_addons (order_item_id, addon_name, addon_price) VALUES (?, ?, ?)");
                    $stmt->bind_param("isd", $orderItemId, $addonName, $addonPrice);
                    $stmt->execute();
                    $stmt->close();
                }
            }
            
            // Update product order count
            $conn->query("UPDATE products SET order_count = order_count + $quantity WHERE product_id = $productId");
        }
        
        // Commit transaction
        $conn->commit();
        
        // Send confirmation email if user is logged in
        if ($user) {
            $subject = "Order Confirmation - " . $orderNumber;
            $message = "
                <html>
                <body>
                    <h2>Order Confirmation</h2>
                    <p>Hello {$user['first_name']},</p>
                    <p>Your order has been confirmed!</p>
                    <p><strong>Order Number:</strong> $orderNumber</p>
                    <p><strong>Total Amount:</strong> ₱" . number_format($totalAmount, 2) . "</p>
                    <p>We'll prepare your order and deliver it soon.</p>
                    <p>Thank you for choosing Karu-mata!</p>
                </body>
                </html>
            ";
            sendEmail($user['email'], $subject, $message);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Order placed successfully',
            'order_number' => $orderNumber,
            'total' => $totalAmount
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        logError('Checkout failed: ' . $e->getMessage(), __FILE__, __LINE__);
        echo json_encode(['success' => false, 'message' => 'Order failed. Please try again.']);
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
    <title>K-Foods Restaurant - Your Cart</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="cart.css">
</head>
<body>
    <header>
        <div class="logo">
            <img src="logg.png" class="brand-logo" alt="Karu-mata Logo" />
            <h1>Karu-mata</h1>
        </div>

        <div class="nav-icons">
            <div class="restaurant-info">
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>Open: 10:00 AM – 9:00 PM</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-bolt"></i>
                    <span>Meals ready in 15-20 minutes</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-motorcycle"></i>
                    <span>Delivery available</span>
                </div>
            </div>

            <div class="btns">
                <a href="index.php" class="back-to-menu-btn">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back to Menu</span>
                </a>

                <button id="profile-toggle" class="profile-circle">
                    <i class="fas fa-user"></i>
                </button>
            </div>
        </div>
    </header>
    
    <div class="container main-container">
        <div class="cart-page-section">
            <h2 class="section-title"><i class="fas fa-shopping-cart"></i>Your Shopping Cart</h2>
            
            <div class="cart-page-container">
                <div class="cart-items-container">
                    <div class="cart-items-header">
                        <h3>Items in Your Cart</h3>
                        <div class="cart-count-badge" id="cart-page-count">0 items</div>
                    </div>
                    
                    <div class="cart-items-list" id="cart-page-items">
                        <div class="empty-cart">
                            <i class="fas fa-shopping-basket"></i>
                            <p>Your cart is empty</p>
                            <p>Add some delicious Korean food from our menu!</p>
                        </div>
                    </div>
                </div>
                
                <div class="cart-summary">
                    <div class="summary-header">
                        <h3><i class="fas fa-receipt"></i> Order Summary</h3>
                    </div>
                    
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span id="cart-subtotal">₱0</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery Fee</span>
                            <span id="delivery-fee">₱50</span>
                        </div>
                        <div class="summary-row">
                            <span>Service Fee</span>
                            <span id="service-fee">₱20</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total Amount</span>
                            <span id="cart-total-amount">₱0</span>
                        </div>
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

    <div id="toast" class="toast"></div>

    <div class="footer">
        <div class="container">
            <p>© 2023 K-Foods Restaurant. All rights reserved.</p>
            <p>Experience authentic Korean flavors made with passion and tradition.</p>
        </div>
    </div>

    <!-- ORDER CONFIRMATION MODAL -->
    <div id="order-modal" class="order-modal">
        <div class="order-modal-content">
            <button class="close-modal">&times;</button>
            <h2>Order Confirmed!</h2>
            <p>Your order has been placed successfully.</p>
            <p style="font-size:14px; color:#555; margin-top:-5px;">
                ✓ Check your email for order confirmation.
            </p>
            <h3>Order Number: <span id="order-number"></span></h3>
            <div class="order-items-list" id="order-items-list"></div>
            <h3>Total: <span id="order-total-price"></span></h3>
            <button class="close-btn">Close</button>
        </div>
    </div>

    <!-- PROFILE SIDEBAR -->
    <div id="profile-sidebar" class="profile-sidebar">
        <div class="profile-header">
            <div class="profile-avatar">
                <i class="fas fa-user-circle"></i>
            </div>

            <div class="profile-info">
                <?php if ($user): ?>
                    <h3 class="profile-name">Welcome, <?php echo htmlspecialchars($user['first_name']); ?>!</h3>
                    <p class="profile-email"><?php echo htmlspecialchars($user['email']); ?></p>
                <?php else: ?>
                    <h3 class="profile-name">Welcome, Guest!</h3>
                    <p class="profile-email">guest@kfoods.com</p>
                    <button class="login-btn" onclick="window.location.href='log-in.php'">Sign In / Register</button>
                <?php endif; ?>
            </div>

            <button class="close-profile">&times;</button>
        </div>

        <div class="profile-content">
            <div class="profile-section">
                <h4><i class="fas fa-map-marker-alt"></i> Delivery Location</h4>
                <p class="current-address">No address set yet</p>
                <button class="manage-address-btn">
                    <i class="fas fa-edit"></i> Manage Addresses
                </button>
            </div>

            <div class="profile-section">
                <h4><i class="fas fa-history"></i> Order History</h4>
                <div id="order-history-list">
                    <!-- Injected by JS -->
                </div>
            </div>
        </div>

        <div class="profile-footer">
            <?php if ($user): ?>
                <button class="logout-btn" onclick="window.location.href='logout.php'">
                    <i class="fas fa-sign-out-alt"></i> Log Out
                </button>
            <?php endif; ?>
        </div>
    </div>

    <!-- ADDRESS MODAL -->
    <div id="addressModal" class="address-modal">
        <div class="address-modal-content">
            <h2>Manage Address</h2>
            <label>Street</label>
            <input type="text" id="addrStreet" placeholder="Street / House No.">
            <label>Barangay</label>
            <input type="text" id="addrBarangay" placeholder="Barangay">
            <label>City</label>
            <input type="text" id="addrCity" placeholder="City">
            <label>ZIP Code</label>
            <input type="text" id="addrZip" placeholder="ZIP">
            <button class="save-address-btn">Save Address</button>
            <button class="close-address-btn">Close</button>
        </div>
    </div>

    <script>
        const isLoggedIn = <?php echo isLoggedIn() ? 'true' : 'false'; ?>;
        const currentUser = <?php echo $user ? json_encode($user) : 'null'; ?>;
    </script>
    <script src="cart.js"></script>
</body>
</html>
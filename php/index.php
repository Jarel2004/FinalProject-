<?php
// ============================================
// INDEX PAGE - PHP HANDLER
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

// Get products from database
$conn = getDBConnection();
$products = [];
if ($conn) {
    $result = $conn->query("SELECT product_id as id, name, price, description, category, image_url as image, rating, review_count as reviews, order_count as orders, spicy_level as spicy, tags, is_bestseller FROM products WHERE is_available = TRUE ORDER BY is_bestseller DESC, product_id ASC");
    while ($row = $result->fetch_assoc()) {
        $row['tags'] = json_decode($row['tags'], true);
        $row['reviews'] = number_format($row['reviews']);
        $row['orders'] = number_format($row['orders']) . '+';
        $products[] = $row;
    }
    
    // Get addons for each product
    foreach ($products as &$product) {
        $stmt = $conn->prepare("SELECT name, description, price FROM addons WHERE product_id = ? AND is_available = TRUE");
        $stmt->bind_param("i", $product['id']);
        $stmt->execute();
        $addonsResult = $stmt->get_result();
        $product['addons'] = [];
        while ($addon = $addonsResult->fetch_assoc()) {
            $product['addons'][] = $addon;
        }
        $stmt->close();
    }
    
    closeDBConnection($conn);
}

// Check for welcome message
$showWelcome = isset($_GET['welcome']) && $_GET['welcome'] == '1';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K-Foods Restaurant - Korean Delights</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <header>
        <div class="logo">
            <img src="logg.png" class="brand-logo" />
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
                <button id="cart-button" class="cart-circle" onclick="window.location.href='cart.php'">
                    <i class="fas fa-shopping-bag"></i>
                    <span id="cart-count">0</span>
                </button>

                <button id="profile-toggle" class="profile-circle">
                    <i class="fas fa-user"></i>
                </button>
            </div>
        </div>
    </header>

    <div class="main-container">
        <div class="filter-section">
            <h2 class="filter-title"><i class="fas fa-filter"></i> Filter by Category</h2>

            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="best">Best Sellers</button>
                <button class="filter-btn" data-filter="sushi">Sushi</button>
                <button class="filter-btn" data-filter="sizzling">Sizzling</button>
            </div>
        </div>

        <div class="content-wrapper">
            <div class="products-section">
                <h2 class="section-title"><i class="fas fa-store"></i> Korean Delights</h2>

                <div class="products-grid" id="products-grid">
                    <!-- Products will be inserted by JavaScript -->
                </div>
            </div>
        </div>
    </div>

    <footer>
        <p>© 2023 K-Foods Restaurant. All rights reserved.</p>
        <p>Experience authentic Korean flavors made with passion and tradition.</p>
    </footer>

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
                <div id="order-history-container">
                    <!-- Will be populated by JavaScript -->
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
        // Pass PHP products to JavaScript
        const products = <?php echo json_encode($products); ?>;
        const isLoggedIn = <?php echo isLoggedIn() ? 'true' : 'false'; ?>;
        const currentUser = <?php echo $user ? json_encode($user) : 'null'; ?>;
        
        <?php if ($showWelcome && $user): ?>
            setTimeout(() => {
                showToast('Welcome back, <?php echo htmlspecialchars($user['first_name']); ?>!');
            }, 500);
        <?php endif; ?>
    </script>
    <script src="app.js"></script>
</body>
</html>
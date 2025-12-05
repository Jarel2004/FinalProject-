<?php
// ============================================
// INDEX PAGE - MAIN LANDING & PRODUCT LIST
// ============================================

require_once __DIR__ . "/config/db.php";

// Start session
initSession();

// ---------------------------------------------
// FETCH LOGGED-IN USER
// ---------------------------------------------
$user = null;
if (isLoggedIn()) {
    $conn = getDBConnection();
    if ($conn) {
        $userId = getCurrentUserId();
        $stmt = $conn->prepare("
            SELECT first_name, last_name, email 
            FROM users 
            WHERE user_id = ?
        ");
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

// ---------------------------------------------
// FETCH PRODUCTS + ADDONS
// ---------------------------------------------
$conn = getDBConnection();
$products = [];

if ($conn) {
    // Fetch products
    $result = $conn->query("
        SELECT 
            product_id AS id,
            name,
            price,
            description,
            category,
            image_url AS image,
            rating,
            review_count AS reviews,
            order_count AS orders,
            spicy_level AS spicy,
            tags,
            is_bestseller
        FROM products
        WHERE is_available = TRUE
        ORDER BY is_bestseller DESC, product_id ASC
    ");

    while ($row = $result->fetch_assoc()) {
        $row["tags"] = json_decode($row["tags"], true);

        $row["reviews"] = number_format($row["reviews"]);
        $row["orders"] = number_format($row["orders"]) . "+";

        $products[] = $row;
    }

    // Fetch addons for each product
    foreach ($products as &$p) {
        $stmt = $conn->prepare("
            SELECT name, description, price 
            FROM addons 
            WHERE product_id = ? AND is_available = TRUE
        ");
        $stmt->bind_param("i", $p["id"]);
        $stmt->execute();
        $addonsData = $stmt->get_result();

        $p["addons"] = [];
        while ($a = $addonsData->fetch_assoc()) {
            $p["addons"][] = $a;
        }

        $stmt->close();
    }

    closeDBConnection($conn);
}

$showWelcome = isset($_GET["welcome"]) && $_GET["welcome"] == "1";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karu-mata | Korean Delights</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../style.css"> 
    <!-- style.css is inside FinalProject-/style.css -->
</head>

<body>

<!-- ============================================
                 HEADER
=============================================== -->
<header>
    <div class="logo">
        <img src="../src/logg.png" class="brand-logo" alt="Karu-mata Logo">
        <h1>Karu-mata</h1>
    </div>

    <div class="nav-icons">

        <div class="restaurant-info">
            <div class="info-item"><i class="fas fa-clock"></i>10AM – 9PM</div>
            <div class="info-item"><i class="fas fa-bolt"></i>15–20 min meals</div>
            <div class="info-item"><i class="fas fa-motorcycle"></i>Delivery available</div>
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




<!-- ============================================
               MAIN CONTENT
=============================================== -->
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
                <!-- Filled by app.js -->
            </div>
        </div>
    </div>

</div>




<!-- ============================================
                    FOOTER
=============================================== -->
<footer>
    <p>© 2025 Karu-mata Restaurant. All rights reserved.</p>
    <p>Authentic Korean flavors crafted with passion.</p>
</footer>




<!-- ============================================
              PROFILE SIDEBAR
=============================================== -->
<div id="profile-sidebar" class="profile-sidebar">

    <div class="profile-header">
        <div class="profile-avatar"><i class="fas fa-user-circle"></i></div>

        <div class="profile-info">
            <?php if ($user): ?>
                <h3 class="profile-name">Welcome, <?= htmlspecialchars($user["first_name"]); ?>!</h3>
                <p class="profile-email"><?= htmlspecialchars($user["email"]); ?></p>
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
            <h4><i class="fas fa-map-marker-alt"></i> Delivery Address</h4>
            <p class="current-address">No address set yet</p>
            <button class="manage-address-btn"><i class="fas fa-edit"></i> Manage</button>
        </div>

        <div class="profile-section">
            <h4><i class="fas fa-history"></i> Order History</h4>
            <div id="order-history-container"></div>
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




<!-- ============================================
              ADDRESS MODAL
=============================================== -->
<div id="addressModal" class="address-modal">
    <div class="address-modal-content">
        <h2>Manage Address</h2>

        <label>Street</label>
        <input type="text" id="addrStreet">

        <label>Barangay</label>
        <input type="text" id="addrBarangay">

        <label>City</label>
        <input type="text" id="addrCity">

        <label>ZIP Code</label>
        <input type="text" id="addrZip">

        <button class="save-address-btn">Save</button>
        <button class="close-address-btn">Close</button>
    </div>
</div>




<!-- ============================================
              PASS SERVER DATA TO JS
=============================================== -->
<script>
    const products = <?= json_encode($products); ?>;
    const isLoggedIn = <?= isLoggedIn() ? "true" : "false"; ?>;
    const currentUser = <?= $user ? json_encode($user) : "null"; ?>;

    <?php if ($showWelcome && $user): ?>
        setTimeout(() => {
            showToast("Welcome back, <?= htmlspecialchars($user["first_name"]); ?>!");
        }, 500);
    <?php endif; ?>
</script>

<script src="../app.js"></script>

</body>
</html>

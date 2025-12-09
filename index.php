<?php
require "php/config.php";

$isLoggedIn = isset($_SESSION["user_id"]);
$username = $isLoggedIn ? $_SESSION["user_name"] : "Guest";
$email = $isLoggedIn ? $_SESSION["user_email"] : "guest@kfoods.com";

// Load user address if logged in
$address = "No address set yet";

if ($isLoggedIn) {
    $stmt = $conn->prepare("SELECT address FROM users WHERE id = ?");
    $stmt->bind_param("i", $_SESSION["user_id"]);
    $stmt->execute();
    $stmt->bind_result($addr);
    $stmt->fetch();

    if (!empty($addr)) {
        $address = $addr;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>K-Foods Restaurant - Korean Delights</title>

    <!-- ICONS + CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>

    <header>
        <div class="logo">
            <img src="cart/karumata.png" class="brand-logo" />
            <h1>Karu-mata</h1>
        </div>

        <!-- RIGHT SIDE ICONS -->
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

            <!-- Cart Button -->
            <div class="btns">
                <button id="cart-button" class="cart-circle" onclick="window.location.href='cart.php'">
                    <i class="fas fa-shopping-bag"></i>
                    <span id="cart-count">0</span>
                </button>

                <!-- Profile Button -->
                <button id="profile-toggle" class="profile-circle">
                    <i class="fas fa-user"></i>
                </button>
            </div>

        </div>

    </header>

   <!-- FILTER SECTION -->
    <div class="main-container">
        <div class="filter-section">
            <h2 class="filter-title"><i class="fas fa-filter"></i> Filter by Category</h2>

            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" name="best-seller" data-filter="best-seller">Best Sellers</button>

                <button class="filter-btn" name="sushi" data-filter="sushi">Sushi</button>
                <button class="filter-btn" name="sizzling" data-filter="sizzling">Sizzling</button>
            </div>

        </div>

        <!-- PRODUCT SECTION -->
        <div class="content-wrapper">
            <div class="products-section">
                <h2 class="section-title"><i class="fas fa-store"></i> Korean Delights</h2>

                <div class="products-grid" id="products-grid">
                    <!-- JS inserts product cards here -->
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
            <h3 class="profile-name">Welcome, <?php echo $username; ?>!</h3>
            <p class="profile-email"><?php echo $email; ?></p>

            <?php if (!$isLoggedIn): ?>
                <button class="login-btn" onclick="window.location.href='log-in.php'">Sign In / Register</button>
            <?php endif; ?>

            <?php if ($isLoggedIn): ?>
                <button class="logout-btn" onclick="window.location.href='php/logout.php'">
                    <i class="fas fa-sign-out-alt"></i> Log Out
                </button>
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
            <div id="order-history-list"></div>
        </div>

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

<!-- JS SCRIPTS -->
<script src="assets/js/products.js"></script>
<script src="assets/js/script.js"></script>

</body>
</html>

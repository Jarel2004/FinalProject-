<?php
// File: index.php
require_once 'includes/config.php';
require_once 'includes/functions.php';

$user = getUserInfo();
$cart_count = getCartCount();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karu-mata - Korean Delights</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <header>
        <div class="logo">
            <img src="/assets/images/logo.png" class="brand-logo" alt="Karu-mata Logo">
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
                    <span id="cart-count"><?php echo $cart_count; ?></span>
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
                <button class="filter-btn" data-filter="best">Best Sellers</button>
                <button class="filter-btn" data-filter="sushi">Sushi</button>
                <button class="filter-btn" data-filter="sizzling">Sizzling</button>
            </div>
        </div>

        <!-- PRODUCT SECTION -->
        <div class="content-wrapper">
            <div class="products-section">
                <h2 class="section-title"><i class="fas fa-store"></i> Korean Delights</h2>
                <div class="products-grid" id="products-grid">
                    <!-- Products will be loaded via JavaScript -->
                </div>
            </div>
        </div>
    </div>

    <footer>
        <p>© <?php echo date('Y'); ?> Karu-mata Restaurant. All rights reserved.</p>
        <p>Experience authentic Korean flavors made with passion and tradition.</p>
    </footer>

    <!-- LOGIN MODAL (Shows when user is not logged in) -->
    <div id="login-modal" class="modal-backdrop" style="display: none;">
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <div class="modal-title">Sign In Required</div>
                <button class="modal-close" onclick="closeLoginModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Please sign in to add items to your cart.</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="login.php" class="btn btn-primary" style="margin-right: 10px;">Sign In</a>
                    <a href="signup.php" class="btn btn-secondary">Sign Up</a>
                </div>
            </div>
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
                    <p class="profile-email">Sign in to access features</p>
                    <button class="login-btn" onclick="window.location.href='login.php'">Sign In / Register</button>
                <?php endif; ?>
            </div>
            <button class="close-profile">&times;</button>
        </div>

        <div class="profile-content">
            <?php if ($user): ?>
                <div class="profile-section">
                    <h4><i class="fas fa-map-marker-alt"></i> Delivery Location</h4>
                    <p class="current-address">
                        <?php echo $user['address'] ? htmlspecialchars($user['address']) : 'No address set'; ?>
                    </p>
                    <button class="manage-address-btn" onclick="openAddressModal()">
                        <i class="fas fa-edit"></i> Manage Address
                    </button>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-history"></i> Order History</h4>
                    <div id="order-history">
                        <!-- Order history will be loaded via JavaScript -->
                    </div>
                </div>
            <?php endif; ?>
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
    <div id="address-modal" class="address-modal">
        <div class="address-modal-content">
            <h2>Update Address</h2>
            <form id="address-form">
                <label>Street</label>
                <input type="text" id="addrStreet" placeholder="Street / House No." required>
                
                <label>Barangay</label>
                <input type="text" id="addrBarangay" placeholder="Barangay" required>
                
                <label>City</label>
                <input type="text" id="addrCity" placeholder="City" required>
                
                <label>ZIP Code</label>
                <input type="text" id="addrZip" placeholder="ZIP" required>
                
                <button type="submit" class="save-address-btn">Save Address</button>
                <button type="button" class="close-address-btn" onclick="closeAddressModal()">Close</button>
            </form>
        </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div id="toast" class="toast"></div>

    <script>
        // User login status
        const isLoggedIn = <?php echo isLoggedIn() ? 'true' : 'false'; ?>;
        const userId = <?php echo isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'null'; ?>;
    </script>
    <script src="assets/js/app.js"></script>
</body>
</html>
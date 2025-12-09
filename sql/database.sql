-- ============================================================
-- DATABASE INITIALIZATION
-- ============================================================

CREATE DATABASE IF NOT EXISTS kfoods_db;
USE kfoods_db;

-- ============================================================
-- USERS TABLE  (login / signup)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    address VARCHAR(300) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Make sure to add this if the table already exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(300) DEFAULT NULL AFTER mobile;
-- ============================================================
-- PRODUCTS TABLE  (menu items)
-- ============================================================

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image VARCHAR(200),
    is_best_seller TINYINT(1) DEFAULT 0
);


-- FINALPROJECT/sql/database.sql (Updated Products Section)
-- ============================================================
-- PRODUCTS TABLE (menu items)
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
    product_id INT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image VARCHAR(200),
    is_best_seller TINYINT(1) DEFAULT 0
);

-- ============================================================
-- INSERT SUSHI PRODUCTS
-- ============================================================

INSERT INTO products (product_id, name, description, price, category, image, is_best_seller) VALUES
(1, 'Chicken Roll', 'Delicious chicken sushi roll with special sauce', 145.00, 'sushi', 'sushi_chicken_roll.jpg', 0),
(2, 'Hot Roll', 'Spicy sushi roll with assorted fillings', 149.00, 'sushi', 'sushi_hot_roll.jpg', 0),
(3, 'Softshell Mango', 'Softshell crab with fresh mango slices', 149.00, 'sushi', 'sushi_softshell_mango.jpg', 1),
(4, 'Mango Sushi', 'Fresh mango with sushi rice and seafood', 69.00, 'sushi', 'sushi_mango.jpg', 0),
(5, 'Onigiri', 'Traditional Japanese rice ball with various fillings', 120.00, 'sushi', 'sushi_onigiri.jpg', 0),
(6, 'Kimbap', 'Korean rice rolls with vegetables and meat', 89.00, 'sushi', 'sushi_kimbap.jpg', 1);

-- ============================================================
-- INSERT SIZZLING PRODUCTS
-- ============================================================

INSERT INTO products (product_id, name, description, price, category, image, is_best_seller) VALUES
(7, 'Pork Sisig', 'Sizzling pork sisig with egg and calamansi', 129.00, 'sizzling', 'sizzling_pork_sisig.jpg', 1),
(8, 'Pepper Steak', 'Sizzling pepper steak with vegetables', 129.00, 'sizzling', 'sizzling_pepper_steak.jpg', 0),
(9, 'Kimchi Pork', 'Sizzling pork with kimchi and spices', 129.00, 'sizzling', 'sizzling_kimchi_pork.jpg', 0),
(10, 'Teriyaki', 'Sizzling teriyaki chicken with sauce', 129.00, 'sizzling', 'sizzling_teriyaki.jpg', 0),
(11, 'Tonkatsu', 'Sizzling breaded pork cutlet with sauce', 129.00, 'sizzling', 'sizzling_tonkatsu.jpg', 0),
(12, 'Spicy Garlic Shrimp', 'Sizzling shrimp in spicy garlic sauce', 129.00, 'sizzling', 'sizzling_garlic_shrimp.jpg', 1);

-- ============================================================
-- INSERT BEST SELLER PRODUCTS
-- ============================================================

INSERT INTO products (product_id, name, description, price, category, image, is_best_seller) VALUES
(13, 'POKEBOWL', 'Fresh poke bowl with tuna, salmon, and toppings', 129.00, 'best-seller', 'best_pokebowl.jpg', 1),
(14, 'BIBIMBAP', 'Korean mixed rice with vegetables and meat', 129.00, 'best-seller', 'best_bibimbap.jpg', 1),
(15, 'Stirfried Fishcake sweet & spicy', 'Korean fishcake stir-fried in sweet & spicy sauce', 100.00, 'best-seller', 'best_fishcake.jpg', 1),
(16, 'Porkchop w/rice & salad', 'Grilled porkchop served with rice and fresh salad', 79.00, 'best-seller', 'best_porkchop.jpg', 1),
(17, 'Hot & spicy chicken w/drinks', 'Korean-style spicy chicken served with drinks', 110.00, 'best-seller', 'best_spicy_chicken.jpg', 1);

-- Note: Some sushi items are also marked as best sellers (is_best_seller = 1)
-- Update existing records to mark them as best sellers
UPDATE products SET is_best_seller = 1 WHERE product_id IN (3, 6, 7, 12);
-- ============================================================
-- ADDONS TABLE  (for each product)
-- ============================================================

CREATE TABLE addons (
    addon_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(150),
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE
);

-- ============================================================
-- ORDERS TABLE  (main order)
-- ============================================================

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    address VARCHAR(300) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 50,
    service_fee DECIMAL(10,2) DEFAULT 20,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- ============================================================
-- ORDER ITEMS TABLE  (items inside an order)
-- ============================================================

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_each DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE
);

-- ============================================================
-- ORDER ADDONS TABLE  (addons per order item)
-- ============================================================

CREATE TABLE order_addons (
    oa_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    addon_name VARCHAR(150) NOT NULL,
    addon_price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id)
        ON DELETE CASCADE
);

-- ============================================================
-- OPTIONAL: Insert sample admin user
-- password = "admin123"
-- ============================================================

INSERT INTO users (first_name, last_name, email, password, mobile)
VALUES ('Admin', 'Account', 'admin@kfoods.com', 
        '$2y$10$Jfj3ONh7l1kSZp2PpQlfre5aQkzY0aBSg1XWloZzv7bU07kE1Zu12', 
        '0000000000');
-- Add to users table in database.sql:


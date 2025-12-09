-- ============================================================
-- DATABASE INITIALIZATION
-- ============================================================

CREATE DATABASE IF NOT EXISTS kfoods_db;
USE kfoods_db;

-- ============================================================
-- USERS TABLE  (login / signup)
-- ============================================================

-- In database.sql, update users table:
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
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
ALTER TABLE users ADD COLUMN address VARCHAR(300) AFTER mobile;

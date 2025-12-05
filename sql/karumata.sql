-- File: sql/karumata.sql
CREATE DATABASE IF NOT EXISTS karumata_db;
USE karumata_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category ENUM('sushi', 'sizzling', 'best') NOT NULL,
    image_url VARCHAR(255),
    is_bestseller BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 4.5,
    tags TEXT
);

-- Addons table
CREATE TABLE addons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    addons TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE,
    user_id INT,
    total_amount DECIMAL(10,2),
    status ENUM('pending', 'processing', 'delivered', 'cancelled') DEFAULT 'pending',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    addons TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample products
INSERT INTO products (name, description, price, category, is_bestseller, tags) VALUES
-- SUSHI
('Chicken Roll', 'Crispy chicken roll wrapped in sushi rice', 145.00, 'sushi', 0, '🍗 Chicken, ⏱ 10-15 mins'),
('Hot Roll', 'Spicy shrimp tempura sushi roll', 149.00, 'sushi', 0, '🌶️ Spicy, 🍤 Shrimp'),
('Softshell Mango', 'Softshell crab with mango sushi', 149.00, 'sushi', 0, '🦀 Crispy, 🥭 Sweet'),
('Mango Sushi', 'Sweet and fresh mango sushi', 69.00, 'sushi', 0, '🥭 Tropical, 🥑 Vegetarian'),
('Onigiri', 'Japanese rice ball wrapped in nori', 120.00, 'sushi', 0, '🍙 Portable, ⏱ 5-10 mins'),
('Kimbap', 'Korean-style maki rolls', 89.00, 'sushi', 0, '🇰🇷 Korean, ⏱ 10-15 mins'),

-- SIZZLING
('Pork Sisig', 'Sizzling pork sisig topped with egg', 129.00, 'sizzling', 0, '🔥 Sizzling, 🌶️ Spicy'),
('Pepper Steak', 'Beef steak cooked with pepper sauce', 129.00, 'sizzling', 0, '🥩 Steak, 🍛 Creamy'),
('Kimchi Pork', 'Sizzling pork cooked with kimchi', 129.00, 'sizzling', 0, '🇰🇷 Korean, 🌶️ Spicy'),
('Teriyaki', 'Sweet glazed teriyaki meat', 129.00, 'sizzling', 0, '🇯🇵 Japanese, 🍯 Sweet'),
('Tonkatsu', 'Breaded fried pork cutlet', 129.00, 'sizzling', 0, '🇯🇵 Japanese, 🍖 Crispy'),
('Spicy Garlic Shrimp', 'Shrimp cooked in spicy garlic butter', 129.00, 'sizzling', 0, '🦐 Shrimp, 🌶️ Spicy'),

-- BEST SELLER
('Pokebowl', 'Hawaiian bowl with fresh toppings', 129.00, 'best', 1, '🔥 Bestseller, 🥗 Fresh'),
('Bibimbap', 'Korean mixed rice bowl with vegetables', 129.00, 'best', 1, '🔥 Bestseller, 🇰🇷 Korean'),
('Stirfried Fishcake', 'Korean stirfried eomuk in spicy sauce', 100.00, 'best', 1, '🌶️ Spicy, ⏱ 15-20 mins'),
('Porkchop w/ rice & salad', 'Grilled porkchop with rice and salad', 79.00, 'best', 1, '🍖 Grilled, ⏱ 25-35 mins'),
('Hot & spicy chicken w/ drinks', 'Spicy chicken meal with drinks', 110.00, 'best', 1, '🍗 Chicken, 🌶️ Spicy');
// ============================================
// CART.JS - UPDATED VERSION
// ============================================

// Load products from localStorage (shared with main page)
// Fallback to default products if not found
const products = JSON.parse(localStorage.getItem('kfoods-products')) || [
    {
        id: 1,
        name: "Bibimbap",
        price: 129,
        description: "Korean mixed rice bowl with vegetables, egg, and gochujang.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-bowl-rice"
    },
    {
        id: 2,
        name: "Pokebowl",
        price: 129,
        description: "Hawaiian bowl with fresh toppings.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-bowl-food"
    },
    {
        id: 3,
        name: "Stirfried Fishcake (Sweet & Spicy)",
        price: 100,
        description: "Korean stirfried eomuk in spicy sauce.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-fish"
    },
    {
        id: 4,
        name: "Porkchop w/ rice & salad",
        price: 79,
        description: "Grilled porkchop with rice and salad.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-drumstick-bite"
    },
    {
        id: 5,
        name: "Hot & spicy chicken w/ drinks",
        price: 110,
        description: "Spicy chicken meal with drinks.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-pepper-hot"
    },
    {
        id: 6,
        name: "Chicken Roll Sushi",
        price: 145,
        description: "Crispy chicken roll wrapped in sushi rice.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 7,
        name: "Hot Roll Sushi",
        price: 149,
        description: "Spicy shrimp tempura sushi roll.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 8,
        name: "Softshell Mango Sushi",
        price: 149,
        description: "Softshell crab with mango sushi.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 9,
        name: "Mango Sushi",
        price: 69,
        description: "Sweet and fresh mango sushi.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 10,
        name: "Onigiri",
        price: 120,
        description: "Japanese rice ball wrapped in nori.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 11,
        name: "Kimbap",
        price: 89,
        description: "Korean-style maki rolls.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 12,
        name: "Pork Sisig",
        price: 129,
        description: "Sizzling pork sisig topped with egg.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-fire"
    },
    {
        id: 13,
        name: "Pepper Steak",
        price: 129,
        description: "Beef steak cooked with pepper sauce.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-steak"
    },
    {
        id: 14,
        name: "Kimchi Pork",
        price: 129,
        description: "Sizzling pork cooked with kimchi.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-fire"
    },
    {
        id: 15,
        name: "Teriyaki",
        price: 129,
        description: "Sweet glazed teriyaki meat.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-bowl-food"
    },
    {
        id: 16,
        name: "Tonkatsu",
        price: 129,
        description: "Breaded fried pork cutlet.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-cutlet"
    },
    {
        id: 17,
        name: "Spicy Garlic Shrimp",
        price: 129,
        description: "Shrimp cooked in spicy garlic butter.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-shrimp"
    }
];

// Load cart from localStorage (shared with main page)
let cart = JSON.parse(localStorage.getItem('kfoods-cart')) || [];

// DOM Elements
const cartPageItems = document.getElementById('cart-page-items');
const cartPageCount = document.getElementById('cart-page-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotalAmount = document.getElementById('cart-total-amount');
const deliveryAddress = document.getElementById('delivery-address');
const checkoutPageBtn = document.getElementById('checkout-page-btn');
const clearCartPageBtn = document.getElementById('clear-cart-page-btn');
const orderItemsList = document.getElementById('order-items-list');
const orderTotalPrice = document.getElementById('order-total-price');
const orderNumber = document.getElementById('order-number');
const modal = document.getElementById('order-modal');
const closeModalBtn = document.querySelector('.close-modal');
const closeBtn = document.querySelector('.close-btn');
const trackOrderBtn = document.querySelector('.track-order-btn');

// Initialize cart page
function initCartPage() {
    console.log("Initializing cart page...");
    console.log("Products loaded:", products.length);
    console.log("Cart items loaded:", cart.length);
    console.log("Cart contents:", cart);
    
    updateCartPage();
    loadDeliveryAddress();
    setupEventListeners();
    console.log("Cart page initialized successfully!");
}

// Update cart page display
function updateCartPage() {
    console.log("Updating cart page, items:", cart);
    console.log("Available products:", products.length);
    
    // Calculate total items in cart
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    cartPageCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    
    // Display empty cart or cart items
    if (cart.length === 0) {
        cartPageItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <p>Add some delicious Korean food from our menu!</p>
            </div>
        `;
    } else {
        cartPageItems.innerHTML = '';
        
        cart.forEach(item => {
            // Find product details from products array
            const product = products.find(p => p.id === item.id) || item;
            
            // Calculate price (use item price if available, otherwise use product price)
            const itemPrice = item.price || product.price || 0;
            const itemQuantity = item.quantity || 1;
            const itemName = item.name || product.name || "Unknown Item";
            
            // Create cart item element
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-page-item';
            cartItemElement.innerHTML = `
                <div class="cart-page-item-info">
                    <h4>${itemName}</h4>
                    <p>P${itemPrice} each</p>
                    ${item.addons && item.addons.length > 0 ? 
                        `<small>Add-ons: ${item.addons.map(a => a.name).join(', ')}</small>` : 
                        ''}
                </div>
                <div class="cart-page-item-controls">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${itemQuantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    <button class="remove-item-btn" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-page-item-total">
                    P${itemPrice * itemQuantity}
                </div>
            `;
            cartPageItems.appendChild(cartItemElement);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateCartQuantity(productId, -1);
            });
        });
        
        document.querySelectorAll('.increase-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateCartQuantity(productId, 1);
            });
        });
        
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => {
        const itemPrice = item.price || products.find(p => p.id === item.id)?.price || 0;
        const itemQuantity = item.quantity || 1;
        return total + (itemPrice * itemQuantity);
    }, 0);
    
    const deliveryFee = 50;
    const serviceFee = 20;
    const total = subtotal + deliveryFee + serviceFee;
    
    // Update display
    cartSubtotal.textContent = `P${subtotal}`;
    cartTotalAmount.textContent = `P${total}`;
    
    // Save cart to localStorage (shared with main page)
    localStorage.setItem('kfoods-cart', JSON.stringify(cart));
    
    console.log("Cart updated. Subtotal:", subtotal, "Total:", total);
}

// Update item quantity in cart
function updateCartQuantity(productId, change) {
    console.log(`Updating quantity for product ${productId} by ${change}`);
    
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) {
        console.error(`Product with ID ${productId} not found in cart!`);
        return;
    }
    
    // Initialize quantity if not present
    if (!cart[itemIndex].quantity) {
        cart[itemIndex].quantity = 1;
    }
    
    // Update quantity
    cart[itemIndex].quantity += change;
    
    // Remove item if quantity reaches 0 or below
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    updateCartPage();
}

// Remove item from cart
function removeFromCart(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        cart = cart.filter(item => item.id !== productId);
        updateCartPage();
        console.log(`Item ${productId} removed from cart`);
    }
}

// Load delivery address from localStorage
function loadDeliveryAddress() {
    const addresses = JSON.parse(localStorage.getItem('kfoods-addresses')) || [];
    const defaultAddress = addresses.find(addr => addr.isDefault);
    
    if (defaultAddress) {
        deliveryAddress.textContent = `${defaultAddress.street}, ${defaultAddress.city} ${defaultAddress.zip}`;
    } else {
        deliveryAddress.textContent = 'No address set yet';
    }
    
    console.log("Delivery address loaded:", deliveryAddress.textContent);
}

// Setup event listeners
function setupEventListeners() {
    // Checkout button
    checkoutPageBtn.addEventListener('click', function() {
        console.log("Checkout button clicked");
        
        if (cart.length === 0) {
            alert('Your cart is empty. Add some items before checking out!');
            return;
        }
        
        const addresses = JSON.parse(localStorage.getItem('kfoods-addresses')) || [];
        const defaultAddress = addresses.find(addr => addr.isDefault);
        
        if (!defaultAddress) {
            alert('Please set a delivery address first. You can add one from your profile.');
            return;
        }
        
        showOrderConfirmation();
    });
    
    // Clear cart button
    clearCartPageBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is already empty!');
            return;
        }
        
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            updateCartPage();
            alert('Cart cleared!');
            console.log("Cart cleared");
        }
    });
    
    // Modal close buttons
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Track order button
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', function() {
            alert('Order tracking feature would be implemented here!\n\nYour order is being prepared and will be ready soon.');
        });
    }
    
    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeModal();
        }
    });
    
    console.log("Event listeners setup complete");
}

// Show order confirmation modal
function showOrderConfirmation() {
    console.log("Showing order confirmation");
    
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    orderNumber.textContent = orderNum;
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => {
        const itemPrice = item.price || products.find(p => p.id === item.id)?.price || 0;
        const itemQuantity = item.quantity || 1;
        return total + (itemPrice * itemQuantity);
    }, 0);
    
    const deliveryFee = 50;
    const serviceFee = 20;
    const total = subtotal + deliveryFee + serviceFee;
    
    orderTotalPrice.textContent = `P${total}`;
    
    // Display order items
    orderItemsList.innerHTML = '';
    cart.forEach((item, index) => {
        const product = products.find(p => p.id === item.id) || item;
        const itemPrice = item.price || product.price || 0;
        const itemQuantity = item.quantity || 1;
        const itemName = item.name || product.name || "Unknown Item";
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.style.animationDelay = `${(index + 1) * 0.1}s`;
        orderItem.innerHTML = `
            <div class="item-name">${itemName}</div>
            <div class="item-details">
                <div class="item-quantity">${itemQuantity}x</div>
                <div class="item-price">P${itemPrice * itemQuantity}</div>
            </div>
        `;
        orderItemsList.appendChild(orderItem);
    });
    
    // Show modal
    if (modal) {
        modal.style.display = 'flex';
    }
    
    // Save transaction and clear cart
    saveTransaction([...cart]);
    cart = [];
    updateCartPage();
    
    console.log("Order confirmed. Order number:", orderNum);
}

// Close modal
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        console.log("Modal closed");
    }
}

// Save transaction to localStorage
function saveTransaction(orderData) {
    const transactions = JSON.parse(localStorage.getItem('kfoods-transactions')) || [];
    
    // Calculate transaction total
    const subtotal = orderData.reduce((total, item) => {
        const itemPrice = item.price || products.find(p => p.id === item.id)?.price || 0;
        const itemQuantity = item.quantity || 1;
        return total + (itemPrice * itemQuantity);
    }, 0);
    
    const transaction = {
        id: 'KFD' + Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        items: [...orderData],
        subtotal: subtotal,
        deliveryFee: 50,
        serviceFee: 20,
        total: subtotal + 70, // Add fees
        status: 'completed'
    };
    
    transactions.unshift(transaction);
    localStorage.setItem('kfoods-transactions', JSON.stringify(transactions));
    
    console.log("Transaction saved:", transaction.id);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCartPage);

// Also update cart count on page if cart count element exists (for consistency)
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count badge if exists on this page
    const cartCountBadge = document.getElementById('cart-count');
    if (cartCountBadge) {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountBadge.textContent = totalItems;
    }
});
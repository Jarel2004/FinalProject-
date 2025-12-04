const products = [
    {
        id: 1,
        name: "Kimchi",
        price: 120,
        description: "Fermented spicy cabbage",
        category: "side",
        bestSeller: true,
        icon: "fas fa-pepper-hot"
    },
    {
        id: 2,
        name: "Bibimbap",
        price: 150,
        description: "Korean mixed rice bowl",
        category: "meal",
        bestSeller: true,
        icon: "fas fa-bowl-rice"
    },
    {
        id: 3,
        name: "Korean Fried Chicken",
        price: 180,
        description: "Sweet crispy chicken",
        category: "meal",
        bestSeller: true,
        icon: "fas fa-drumstick-bite"
    },
    {
        id: 4,
        name: "Tteokbokki",
        price: 140,
        description: "Spicy rice cakes",
        category: "snack",
        bestSeller: true,
        icon: "fas fa-mortar-pestle"
    },
    {
        id: 5,
        name: "Bulgogi",
        price: 200,
        description: "Marinated beef barbecue",
        category: "meal",
        bestSeller: false,
        icon: "fas fa-fire"
    },
    {
        id: 6,
        name: "Japchae",
        price: 160,
        description: "Stir-fried glass noodles",
        category: "side",
        bestSeller: false,
        icon: "fas fa-utensil-spoon"
    }
];

let cart = JSON.parse(localStorage.getItem('kfoods-cart')) || [];

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

function initCartPage() {
    console.log("Initializing cart page...");
    updateCartPage();
    loadDeliveryAddress();
    setupEventListeners();
    console.log("Cart page initialized successfully!");
}

function updateCartPage() {
    console.log("Updating cart page, items:", cart);
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartPageCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    
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
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-page-item';
            cartItemElement.innerHTML = `
                <div class="cart-page-item-info">
                    <h4>${item.name}</h4>
                    <p>P${item.price} each</p>
                </div>
                <div class="cart-page-item-controls">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    <button class="remove-item-btn" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-page-item-total">
                    P${item.price * item.quantity}
                </div>
            `;
            cartPageItems.appendChild(cartItemElement);
        });
        
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
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const serviceFee = 20;
    const total = subtotal + deliveryFee + serviceFee;
    
    cartSubtotal.textContent = `P${subtotal}`;
    cartTotalAmount.textContent = `P${total}`;
    
    localStorage.setItem('kfoods-cart', JSON.stringify(cart));
}

function updateCartQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) {
        console.error(`Product with ID ${productId} not found in cart!`);
        return;
    }
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    updateCartPage();
}

function removeFromCart(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        cart = cart.filter(item => item.id !== productId);
        updateCartPage();
    }
}

function loadDeliveryAddress() {
    const addresses = JSON.parse(localStorage.getItem('kfoods-addresses')) || [];
    const defaultAddress = addresses.find(addr => addr.isDefault);
    
    if (defaultAddress) {
        deliveryAddress.textContent = `${defaultAddress.street}, ${defaultAddress.city} ${defaultAddress.zip}`;
    } else {
        deliveryAddress.textContent = 'No address set yet';
    }
}

function setupEventListeners() {
    checkoutPageBtn.addEventListener('click', function() {
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
    
    clearCartPageBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is already empty!');
            return;
        }
        
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            updateCartPage();
            alert('Cart cleared!');
        }
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    trackOrderBtn.addEventListener('click', function() {
        alert('Order tracking feature would be implemented here!\n\nYour order is being prepared and will be ready soon.');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

function showOrderConfirmation() {
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    orderNumber.textContent = orderNum;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const serviceFee = 20;
    const total = subtotal + deliveryFee + serviceFee;
    
    orderTotalPrice.textContent = `P${total}`;
    
    orderItemsList.innerHTML = '';
    cart.forEach((item, index) => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.style.animationDelay = `${(index + 1) * 0.1}s`;
        orderItem.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-details">
                <div class="item-quantity">${item.quantity}x</div>
                <div class="item-price">P${item.price * item.quantity}</div>
            </div>
        `;
        orderItemsList.appendChild(orderItem);
    });
    
    modal.style.display = 'flex';
    
    saveTransaction([...cart]);
    cart = [];
    updateCartPage();
}

function closeModal() {
    modal.style.display = 'none';
}

function saveTransaction(orderData) {
    const transactions = JSON.parse(localStorage.getItem('kfoods-transactions')) || [];
    const transaction = {
        id: 'KFD' + Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        items: [...orderData],
        total: orderData.reduce((total, item) => total + (item.price * item.quantity), 0) + 70, // Add fees
        status: 'completed'
    };
    
    transactions.unshift(transaction);
    localStorage.setItem('kfoods-transactions', JSON.stringify(transactions));
}

document.addEventListener('DOMContentLoaded', initCartPage);
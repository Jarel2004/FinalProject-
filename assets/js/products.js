// assets/js/products.js
document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cartCount = document.getElementById('cart-count');
    
    // Sample products data (in real app, fetch from database)
    const products = [
        // SUSHI
        { id: 1, name: 'Chicken Roll', price: 145, category: 'sushi', image: 'placeholder.jpg', isBestSeller: false, description: 'Delicious chicken sushi roll with special sauce' },
        { id: 2, name: 'Hot Roll', price: 149, category: 'sushi', image: 'placeholder.jpg', isBestSeller: false, description: 'Spicy sushi roll with assorted fillings' },
        { id: 3, name: 'Softshell Mango', price: 149, category: 'sushi', image: 'placeholder.jpg', isBestSeller: true, description: 'Softshell crab with fresh mango slices' },
        { id: 4, name: 'Mango Sushi', price: 69, category: 'sushi', image: 'placeholder.jpg', isBestSeller: false, description: 'Fresh mango with sushi rice and seafood' },
        { id: 5, name: 'Onigiri', price: 120, category: 'sushi', image: 'placeholder.jpg', isBestSeller: false, description: 'Traditional Japanese rice ball with various fillings' },
        { id: 6, name: 'Kimbap', price: 89, category: 'sushi', image: 'placeholder.jpg', isBestSeller: true, description: 'Korean rice rolls with vegetables and meat' },
        
        // SIZZLING
        { id: 7, name: 'Pork Sisig', price: 129, category: 'sizzling', image: 'placeholder.jpg', isBestSeller: true, description: 'Sizzling pork sisig with egg and calamansi' },
        { id: 8, name: 'Pepper Steak', price: 129, category: 'sizzling', image: 'placeholder.jpg', isBestSeller: false, description: 'Sizzling pepper steak with vegetables' },
        { id: 9, name: 'Kimchi Pork', price: 129, category: 'sizzling', image: 'placeholder.jpg', isBestSeller: false, description: 'Sizzling pork with kimchi and spices' },
        { id: 10, name: 'Teriyaki', price: 129, category: 'sizzling', image: 'placeholder.jpg', isBestSeller: false, description: 'Sizzling teriyaki chicken with sauce' },
        { id: 11, name: 'Tonkatsu', price: 129, category: 'sizzling', image: 'placeholder.jpg', isBestSeller: false, description: 'Sizzling breaded pork cutlet with sauce' },
        { id: 12, name: 'Spicy Garlic Shrimp', price: 129, category: 'sizzling', image: 'placeholder.jpg', isBestSeller: true, description: 'Sizzling shrimp in spicy garlic sauce' },
        
        // BEST SELLERS
        { id: 13, name: 'POKEBOWL', price: 129, category: 'best-seller', image: 'placeholder.jpg', isBestSeller: true, description: 'Fresh poke bowl with tuna, salmon, and toppings' },
        { id: 14, name: 'BIBIMBAP', price: 129, category: 'best-seller', image: 'placeholder.jpg', isBestSeller: true, description: 'Korean mixed rice with vegetables and meat' },
        { id: 15, name: 'Stirfried Fishcake sweet & spicy', price: 100, category: 'best-seller', image: 'placeholder.jpg', isBestSeller: true, description: 'Korean fishcake stir-fried in sweet & spicy sauce' },
        { id: 16, name: 'Porkchop w/rice & salad', price: 79, category: 'best-seller', image: 'placeholder.jpg', isBestSeller: true, description: 'Grilled porkchop served with rice and fresh salad' },
        { id: 17, name: 'Hot & spicy chicken w/drinks', price: 110, category: 'best-seller', image: 'placeholder.jpg', isBestSeller: true, description: 'Korean-style spicy chicken served with drinks' }
    ];

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Render products
    function renderProducts(filter = 'all') {
        productsGrid.innerHTML = '';
        
        let filteredProducts = products;
        
        if (filter === 'best-seller') {
            filteredProducts = products.filter(p => p.isBestSeller);
        } else if (filter !== 'all') {
            filteredProducts = products.filter(p => p.category === filter);
        }
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Add best seller badge if applicable
            const bestSellerBadge = product.isBestSeller ? 
                '<div class="best-seller-badge"><i class="fas fa-crown"></i> Best Seller</div>' : '';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="assets/images/${product.image}" alt="${product.name}">
                    ${bestSellerBadge}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">P${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add event listeners to add-to-cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }

    // Add to cart function
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                addons: []
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showToast(`${product.name} added to cart!`);
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const filter = this.getAttribute('data-filter');
            renderProducts(filter);
        });
    });

    // Toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Add CSS for toast animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .best-seller-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #FFD700;
            color: #333;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Initial render
    renderProducts();
    updateCartCount();
});
// ===========================
// PRODUCT DATA
// ===========================
const products = [
    {
        id: 1,
        name: "Bibimbap",
        price: 150,
        category: "best",
        image: "src/Bibimbap.jpeg",
        description: "A colorful and comforting Korean rice bowl topped with seasoned vegetables, marinated beef, fried egg, and spicy gochujang sauce.",
        rating: 4.8,
        reviews: "1.2k",
        orders: "1.9k+",
        tags: ["🔥 Bestseller", "⏱ 20–30 mins", "🏷 Free utensils"],
        spicy: true,
        addons: [
            { name: "Extra Rice", description: "White rice", price: 20 },
            { name: "Extra Egg", description: "Sunny side up", price: 25 },
            { name: "Extra Cheese", description: "Mozzarella", price: 30 },
            { name: "Kimchi Side", description: "100g portion", price: 40 },
            { name: "Iced Tea", description: "Regular glass", price: 35 }
        ]
    },
    {
        id: 2,
        name: "Chicken Roll Sushi",
        price: 140,
        category: "sushi",
        image: "src/Chicken_Roll.jpeg",
        description: "Crispy fried chicken strips wrapped with fresh cucumber, avocado, and sushi rice in a seaweed roll, drizzled with special sauce.",
        rating: 4.6,
        reviews: "850",
        orders: "1.4k+",
        tags: ["🍣 Japanese", "⏱ 10–15 mins", "🍗 Chicken"],
        spicy: false,
        addons: [
            { name: "Extra Chicken", description: "100g", price: 40 },
            { name: "Extra Avocado", description: "Fresh slices", price: 25 },
            { name: "Spicy Mayo", description: "Extra serving", price: 15 },
            { name: "Miso Soup", description: "Regular bowl", price: 30 }
        ]
    },
    {
        id: 3,
        name: "H&S Chicken",
        price: 180,
        category: "fried",
        image: "src/H&S_Chicken.jpeg",
        description: "Crispy fried chicken tossed in a special Honey & Soy glaze, creating the perfect balance of sweet and savory flavors with a satisfying crunch.",
        rating: 4.7,
        reviews: "950",
        orders: "1.6k+",
        tags: ["🍗 Chicken", "⏱ 25–35 mins", "🍯 Sweet & Savory"],
        spicy: false,
        addons: [
            { name: "Extra Rice", description: "White rice", price: 20 },
            { name: "Extra Chicken", description: "2 pieces", price: 60 },
            { name: "Coleslaw", description: "Fresh salad", price: 25 },
            { name: "Soft Drinks", description: "330ml can", price: 30 }
        ]
    },
    {
        id: 4,
        name: "Hot Roll Sushi",
        price: 120,
        category: "sushi",
        image: "src/Hot_Roll.jpeg",
        description: "Spicy tempura shrimp and fresh vegetables rolled in warm sushi rice, topped with spicy mayo and crunchy tempura flakes for a delicious fusion experience.",
        rating: 4.5,
        reviews: "780",
        orders: "1.2k+",
        tags: ["🌶️ Spicy", "⏱ 10–15 mins", "🍤 Shrimp"],
        spicy: true,
        addons: [
            { name: "Extra Shrimp", description: "3 pieces", price: 50 },
            { name: "Spicy Level", description: "Extra spicy", price: 10 },
            { name: "Tempura Flakes", description: "Extra crunchy", price: 15 },
            { name: "Green Tea", description: "Hot/Cold", price: 25 }
        ]
    },
    {
        id: 5,
        name: "Mango Sushi",
        price: 130,
        category: "sushi",
        image: "src/Mango.jpeg",
        description: "Fresh ripe mango slices paired with creamy avocado and sushi rice, wrapped in seaweed for a sweet and refreshing tropical sushi experience.",
        rating: 4.4,
        reviews: "720",
        orders: "1.1k+",
        tags: ["🥭 Tropical", "⏱ 10–15 mins", "🥑 Vegetarian"],
        spicy: false,
        addons: [
            { name: "Extra Mango", description: "Fresh slices", price: 30 },
            { name: "Extra Avocado", description: "Creamy", price: 25 },
            { name: "Coconut Flakes", description: "Topping", price: 15 },
            { name: "Tropical Juice", description: "Mango/Pineapple", price: 35 }
        ]
    },
    {
        id: 6,
        name: "Onigiri Sushi",
        price: 160,
        category: "sushi",
        image: "src/Onigiri.jpeg",
        description: "Traditional Japanese rice balls filled with savory ingredients like salmon, tuna, or pickled plum, wrapped in crispy nori seaweed for a portable snack.",
        rating: 4.3,
        reviews: "680",
        orders: "980+",
        tags: ["🍙 Portable", "⏱ 5–10 mins", "🥢 Traditional"],
        spicy: false,
        addons: [
            { name: "Extra Onigiri", description: "1 piece", price: 45 },
            { name: "Soy Sauce Pack", description: "Premium", price: 10 },
            { name: "Seaweed Sheets", description: "Extra", price: 15 },
            { name: "Japanese Tea", description: "Hot", price: 25 }
        ]
    },
    {
        id: 7,
        name: "PokeBowl",
        price: 160,
        category: "healthy",
        image: "src/PokeBowl.jpeg",
        description: "Hawaiian-inspired bowl featuring fresh raw fish (tuna or salmon) over sushi rice with colorful vegetables, seaweed, and signature poke sauce.",
        rating: 4.7,
        reviews: "920",
        orders: "1.5k+",
        tags: ["🐟 Fresh", "⏱ 15–20 mins", "🥗 Healthy"],
        spicy: false,
        addons: [
            { name: "Extra Fish", description: "Tuna/Salmon", price: 50 },
            { name: "Extra Avocado", description: "Fresh slices", price: 25 },
            { name: "Seaweed Salad", description: "Additional", price: 20 },
            { name: "Wasabi", description: "Fresh", price: 15 }
        ]
    },
    {
        id: 8,
        name: "Porkchop",
        price: 160,
        category: "meat",
        image: "src/Porkchop.jpeg",
        description: "Juicy grilled pork chop marinated in a special blend of spices, served with steaming rice, fresh vegetables, and a side of gravy.",
        rating: 4.6,
        reviews: "890",
        orders: "1.3k+",
        tags: ["🍖 Grilled", "⏱ 25–35 mins", "🔥 Bestseller"],
        spicy: false,
        addons: [
            { name: "Extra Pork", description: "100g", price: 55 },
            { name: "Extra Gravy", description: "Special sauce", price: 15 },
            { name: "Mashed Potatoes", description: "Creamy", price: 30 },
            { name: "Corn & Carrots", description: "Steamed", price: 20 }
        ]
    },
    {
        id: 9,
        name: "Softshell Mango Sushi",
        price: 160,
        category: "sushi",
        image: "src/Softshell_Mango.jpeg",
        description: "Crispy soft-shell crab combined with sweet mango slices, avocado, and sushi rice, creating a perfect harmony of textures and flavors.",
        rating: 4.5,
        reviews: "750",
        orders: "1.1k+",
        tags: ["🦀 Crispy", "⏱ 15–20 mins", "🥭 Sweet"],
        spicy: false,
        addons: [
            { name: "Extra Crab", description: "Soft-shell", price: 60 },
            { name: "Extra Mango", description: "Fresh slices", price: 25 },
            { name: "Eel Sauce", description: "Drizzle", price: 15 },
            { name: "Sesame Seeds", description: "Toasted", price: 10 }
        ]
    },
    {
        id: 10,
        name: "Stirfried Fishcake",
        price: 160,
        category: "korean",
        image: "src/Stirfried_Fishcake.jpeg",
        description: "Savory Korean fish cakes stir-fried with colorful vegetables in a sweet and spicy sauce, a popular street food dish served hot.",
        rating: 4.4,
        reviews: "710",
        orders: "1.0k+",
        tags: ["🌶️ Spicy", "⏱ 15–20 mins", "🇰🇷 Korean"],
        spicy: true,
        addons: [
            { name: "Extra Fishcake", description: "100g", price: 40 },
            { name: "Spicy Level", description: "Adjustable", price: 0 },
            { name: "Rice Cakes", description: "Tteokbokki style", price: 35 },
            { name: "Kimchi", description: "Side dish", price: 25 }
        ]
    }

    
    

];

// ===========================
// RENDER PRODUCTS
// ===========================
function renderProducts(filter = "all") {
    const grid = document.getElementById("products-grid");
    const filteredProducts = filter === "all" 
        ? products 
        : products.filter(p => p.category === filter);

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}">
                ${product.spicy ? '<span class="spicy-badge">🌶️ Spicy</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description.substring(0, 60)}...</p>
                <div class="product-footer">
                    <span class="product-price">₱${product.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="event.stopPropagation(); openProductModal(${product.id})">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// ===========================
// FILTER FUNCTIONALITY
// ===========================
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.filter);
    });
});

// ===========================
// MODAL FUNCTIONALITY
// ===========================
let currentProduct = null;
let modalQuantity = 1;

function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    modalQuantity = 1;

    // Create modal HTML
    const modalHTML = `
        <div id="productModalBackdrop" class="modal-backdrop show" onclick="closeProductModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <div class="modal-title">${currentProduct.name}</div>
                    <button class="modal-close" onclick="closeProductModal()">&times;</button>
                </div>
                
                <div class="modal-image">
                    <img src="${currentProduct.image}" alt="${currentProduct.name}">
                </div>

                <div class="modal-sub">
                    ${currentProduct.description}
                </div>

                <div class="modal-rating">
                    <span class="rating-star">★</span>
                    <span>${currentProduct.rating} (${currentProduct.reviews} reviews)</span>
                    <span>•</span>
                    <span>${currentProduct.orders} orders this week</span>
                </div>

                <div class="modal-quantity-section">
                    <span class="qty-label">Quantity</span>
                    <div class="qty-box">
                        <button class="qty-btn" onclick="changeModalQty(-1)">−</button>
                        <input type="number" id="modalQtyInput" class="qty-input" value="1" min="1" readonly />
                        <button class="qty-btn" onclick="changeModalQty(1)">+</button>
                    </div>
                </div>

                <div>
                    <div class="modal-section-title">Base</div>
                    <div style="font-size:13px; display:flex; justify-content:space-between;">
                        <span>${currentProduct.name} (₱${currentProduct.price.toFixed(2)}) × <span id="modalQtyLabel">1</span></span>
                        <strong id="modalBaseTotal">₱${currentProduct.price.toFixed(2)}</strong>
                    </div>
                </div>

                <div>
                    <div class="modal-section-title" style="margin-top:12px;">Add-ons</div>
                    <ul class="addons-list" id="addonsList">
                        ${currentProduct.addons.map((addon, index) => `
                            <li class="addons-item">
                                <label>
                                    <input type="checkbox" class="addon-checkbox" data-index="${index}" data-name="${addon.name}" data-price="${addon.price}" onchange="updateModalTotal()" />
                                    ${addon.name}
                                    <small>${addon.description}</small>
                                </label>
                                <span>+ ₱${addon.price}</span>
                            </li>
                        `).join("")}
                    </ul>
                </div>

                <div class="modal-footer">
                    <div>
                        <div class="total-label">Total to pay</div>
                        <div class="total-value" id="modalTotal">₱${currentProduct.price.toFixed(2)}</div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="closeProductModal()">Cancel</button>
                        <button class="btn btn-primary" style="font-size:13px;" onclick="confirmAddToCart()">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById("productModalBackdrop");
    if (existingModal) existingModal.remove();

    // Add modal to body
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    document.body.style.overflow = "hidden";
}

function closeProductModal(event) {
    if (event && event.target.id !== "productModalBackdrop") return;
    
    const modal = document.getElementById("productModalBackdrop");
    if (modal) modal.remove();
    document.body.style.overflow = "";
    currentProduct = null;
}

function changeModalQty(delta) {
    const input = document.getElementById("modalQtyInput");
    modalQuantity = Math.max(1, modalQuantity + delta);
    input.value = modalQuantity;
    updateModalTotal();
}

function updateModalTotal() {
    if (!currentProduct) return;

    const modalQtyLabel = document.getElementById("modalQtyLabel");
    const modalBaseTotal = document.getElementById("modalBaseTotal");
    const modalTotal = document.getElementById("modalTotal");

    let addonsTotal = 0;
    document.querySelectorAll(".addon-checkbox:checked").forEach(checkbox => {
        addonsTotal += parseFloat(checkbox.dataset.price);
    });

    const perUnit = currentProduct.price + addonsTotal;
    const total = perUnit * modalQuantity;

    modalQtyLabel.textContent = modalQuantity;
    modalBaseTotal.textContent = `₱${(currentProduct.price * modalQuantity).toFixed(2)}`;
    modalTotal.textContent = `₱${total.toFixed(2)}`;
}

// ===========================
// CART FUNCTIONALITY
// ===========================
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

function showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
}

function confirmAddToCart() {
    if (!currentProduct) return;

    let selectedAddons = [];
    let addonsTotal = 0;
    
    document.querySelectorAll(".addon-checkbox:checked").forEach(checkbox => {
        const price = parseFloat(checkbox.dataset.price);
        const name = checkbox.dataset.name;
        addonsTotal += price;
        selectedAddons.push({ name, price });
    });

    const perUnit = currentProduct.price + addonsTotal;
    const totalAmount = perUnit * modalQuantity;

    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === currentProduct.id);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += modalQuantity;
        cart[existingIndex].addons = selectedAddons;
        cart[existingIndex].price = perUnit;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: perUnit,
            quantity: modalQuantity,
            image: currentProduct.image,
            addons: selectedAddons
        });
    }

    saveCart(cart);
    updateCartCount();
    closeProductModal();
    showToast("✅ Successfully Added to Cart");
}

// ===========================
// CART BUTTON FUNCTIONALITY
// ===========================
document.getElementById("cart-button").addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) {
        alert("Your cart is empty.");
        return;
    }
    let message = "Cart items:\n\n";
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} – ₱${(item.price * item.quantity).toFixed(2)}\n`;
        if (item.addons && item.addons.length > 0) {
            message += `  Add-ons: ${item.addons.map(a => a.name).join(", ")}\n`;
        }
    });
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ₱${total.toFixed(2)}`;
    alert(message);
});

// ===========================
// PROFILE SIDEBAR
// ===========================
document.getElementById("profile-toggle").addEventListener("click", () => {
    document.getElementById("profile-sidebar").classList.add("active");
});

document.querySelector(".close-profile").addEventListener("click", () => {
    document.getElementById("profile-sidebar").classList.remove("active");
});

// ===========================
// INITIALIZE
// ===========================
renderProducts();
updateCartCount();
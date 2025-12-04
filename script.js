// ===========================
// PRODUCT DATA
// ===========================
const products = [
    {
        id: 1,
        name: "Bibimbap",
        price: 150,
        category: "best",
        image: "https://i.imgur.com/1R5U1oJ.jpeg",
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
        name: "Kimchi Fried Rice",
        price: 140,
        category: "best",
        image: "https://i.imgur.com/9xHZK5L.jpeg",
        description: "Savory fried rice made with kimchi, vegetables, and topped with a fried egg. A perfect comfort food.",
        rating: 4.7,
        reviews: "980",
        orders: "1.5k+",
        tags: ["🔥 Bestseller", "⏱ 15–25 mins", "🌶 Spicy"],
        spicy: true,
        addons: [
            { name: "Extra Rice", description: "White rice", price: 20 },
            { name: "Extra Egg", description: "Sunny side up", price: 25 },
            { name: "Extra Kimchi", description: "50g portion", price: 30 },
            { name: "Iced Tea", description: "Regular glass", price: 35 }
        ]
    },
    {
        id: 3,
        name: "Bulgogi",
        price: 180,
        category: "sizzling",
        image: "https://i.imgur.com/7KxR3pM.jpeg",
        description: "Thinly sliced marinated beef grilled to perfection, served with rice and vegetables.",
        rating: 4.9,
        reviews: "1.5k",
        orders: "2.1k+",
        tags: ["⭐ Premium", "⏱ 25–35 mins", "🥩 Grilled"],
        spicy: false,
        addons: [
            { name: "Extra Rice", description: "White rice", price: 20 },
            { name: "Extra Meat", description: "100g beef", price: 60 },
            { name: "Soup", description: "Miso soup", price: 40 },
            { name: "Iced Tea", description: "Regular glass", price: 35 }
        ]
    },
    {
        id: 4,
        name: "Kimbap Roll",
        price: 120,
        category: "sushi",
        image: "https://i.imgur.com/2YtF8nQ.jpeg",
        description: "Korean seaweed rice roll filled with vegetables, egg, and meat. Perfect for snacking.",
        rating: 4.6,
        reviews: "850",
        orders: "1.2k+",
        tags: ["🍱 Light meal", "⏱ 10–15 mins", "🥒 Fresh"],
        spicy: false,
        addons: [
            { name: "Extra Roll", description: "4 pieces", price: 50 },
            { name: "Soy Sauce", description: "Premium", price: 10 },
            { name: "Wasabi", description: "Fresh", price: 15 },
            { name: "Iced Tea", description: "Regular glass", price: 35 }
        ]
    },
    {
        id: 5,
        name: "Tteokbokki",
        price: 130,
        category: "best",
        image: "https://i.imgur.com/5LmP9nK.jpeg",
        description: "Spicy Korean rice cakes in sweet and spicy gochujang sauce. A street food favorite.",
        rating: 4.8,
        reviews: "1.1k",
        orders: "1.8k+",
        tags: ["🔥 Bestseller", "⏱ 15–20 mins", "🌶 Very Spicy"],
        spicy: true,
        addons: [
            { name: "Extra Rice Cakes", description: "100g", price: 30 },
            { name: "Boiled Egg", description: "1 piece", price: 20 },
            { name: "Fish Cake", description: "3 pieces", price: 25 },
            { name: "Iced Tea", description: "Regular glass", price: 35 }
        ]
    },
    {
        id: 6,
        name: "Japchae",
        price: 160,
        category: "sizzling",
        image: "https://i.imgur.com/8mN4vPl.jpeg",
        description: "Stir-fried glass noodles with vegetables and beef in a savory-sweet sauce.",
        rating: 4.7,
        reviews: "920",
        orders: "1.3k+",
        tags: ["🍜 Noodles", "⏱ 20–30 mins", "🥕 Veggie-rich"],
        spicy: false,
        addons: [
            { name: "Extra Noodles", description: "100g", price: 35 },
            { name: "Extra Vegetables", description: "Mixed", price: 25 },
            { name: "Extra Meat", description: "50g beef", price: 45 },
            { name: "Iced Tea", description: "Regular glass", price: 35 }
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

<<<<<<< HEAD
document.getElementById("cart-button").addEventListener("click", function() {
    window.location.href = "cart/cart.html";
});

=======
// ===========================
// INITIALIZE
// ===========================
renderProducts();
updateCartCount();
>>>>>>> 6ae103179c4d4f57676dc4d2761207921c43ebbe

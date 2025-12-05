// ============================================
// APP.JS - MAIN JAVASCRIPT FOR INDEX PAGE
// ============================================

// Global variables
let currentProduct = null;
let modalQuantity = 1;

// ===========================
// CART MANAGEMENT
// ===========================
function getCart() {
    return JSON.parse(localStorage.getItem("kfoods-cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("kfoods-cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountEl.textContent = totalItems || 0;
    }
}

// ===========================
// RENDER PRODUCTS
// ===========================
function renderProducts(filter = "all") {
    const grid = document.getElementById("products-grid");
    if (!grid) {
        console.error("Products grid not found!");
        return;
    }
    
    grid.innerHTML = "";

    const filtered = products.filter(p => {
        if (filter === "all") return true;
        return p.category === filter || (p.is_bestseller && filter === "best");
    });

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.style.cursor = "pointer";
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 80)}...</p>
                <div class="product-footer">
                    <div class="product-price">₱${parseFloat(product.price).toFixed(2)}</div>
                    <button class="add-btn" onclick="event.stopPropagation(); openProductModal(${product.id})">
                        + Add
                    </button>
                </div>
            </div>
        `;
        
        card.addEventListener("click", function() {
            openProductModal(product.id);
        });
        
        grid.appendChild(card);
    });
}

// ===========================
// PRODUCT MODAL
// ===========================
function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) {
        console.error("Product not found!");
        return;
    }

    modalQuantity = 1;

    const existingModal = document.getElementById("productModalBackdrop");
    if (existingModal) {
        existingModal.remove();
    }

    const tagsHTML = Array.isArray(currentProduct.tags) 
        ? currentProduct.tags.map(tag => `<span class="info-tag">${tag}</span>`).join('')
        : '';

    const addonsHTML = Array.isArray(currentProduct.addons)
        ? currentProduct.addons.map((addon, index) => `
            <li class="addons-item">
                <label>
                    <input type="checkbox" class="addon-checkbox" data-index="${index}" onchange="updateModalTotal()">
                    ${addon.name}
                    <small>${addon.description}</small>
                </label>
                <span>+ ₱${addon.price}</span>
            </li>
        `).join('')
        : '<li>No add-ons available</li>';

    const modalHTML = `
        <div id="productModalBackdrop" class="modal-backdrop show">
            <div class="modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <div class="modal-title">${currentProduct.name}</div>
                    <button class="modal-close" onclick="closeProductModal()">&times;</button>
                </div>
                
                <div class="modal-sub">
                    ${currentProduct.spicy}
                </div>
                
                <div style="margin-bottom: 12px;">
                    <span style="color: #ffb000; font-size: 16px;">★</span>
                    <span style="font-size: 13px; color: #777;">${currentProduct.rating} (${currentProduct.reviews} reviews)</span>
                    <span style="font-size: 13px; color: #777;"> • </span>
                    <span style="font-size: 13px; color: #777;">${currentProduct.orders} orders this week</span>
                </div>
                
                <div style="font-size: 22px; font-weight: 700; color: #d32f2f; margin-bottom: 12px;">
                    ₱${parseFloat(currentProduct.price).toFixed(2)}
                </div>
                
                <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 12px;">
                    ${currentProduct.description}
                </p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
                    ${tagsHTML}
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding: 12px; background: #f9f9f9; border-radius: 12px;">
                    <span style="font-size: 14px; font-weight: 500; color: #333;">Quantity</span>
                    <div class="qty-box">
                        <button class="qty-btn" onclick="changeModalQty(-1)">−</button>
                        <input type="number" id="modalQtyInput" class="qty-input" value="1" min="1" readonly>
                        <button class="qty-btn" onclick="changeModalQty(1)">+</button>
                    </div>
                </div>

                <div>
                    <div class="modal-section-title">Add-ons (Optional)</div>
                    <ul class="addons-list" id="modalAddonsList">
                        ${addonsHTML}
                    </ul>
                </div>
                
                <div class="modal-footer">
                    <div>
                        <div class="total-label">Total to pay</div>
                        <div class="total-value" id="modalTotalPrice">₱${parseFloat(currentProduct.price).toFixed(2)}</div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="closeProductModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="confirmAddToCart()">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById("productModalBackdrop").addEventListener("click", function(e) {
        if (e.target.id === "productModalBackdrop") {
            closeProductModal();
        }
    });

    document.body.style.overflow = "hidden";
    updateModalTotal();
}

function closeProductModal() {
    const backdrop = document.getElementById("productModalBackdrop");
    if (backdrop) {
        backdrop.classList.remove("show");
        setTimeout(() => {
            backdrop.remove();
        }, 300);
        document.body.style.overflow = "auto";
    }
}

function changeModalQty(delta) {
    modalQuantity = Math.max(1, modalQuantity + delta);
    const qtyInput = document.getElementById("modalQtyInput");
    if (qtyInput) {
        qtyInput.value = modalQuantity;
    }
    updateModalTotal();
}

function updateModalTotal() {
    if (!currentProduct) return;

    let addonsTotal = 0;
    const checkboxes = document.querySelectorAll(".addon-checkbox");
    checkboxes.forEach(cb => {
        if (cb.checked) {
            const index = parseInt(cb.dataset.index);
            if (currentProduct.addons && currentProduct.addons[index]) {
                addonsTotal += parseFloat(currentProduct.addons[index].price);
            }
        }
    });

    const perUnit = parseFloat(currentProduct.price) + addonsTotal;
    const total = perUnit * modalQuantity;
    
    const totalEl = document.getElementById("modalTotalPrice");
    if (totalEl) {
        totalEl.textContent = `₱${total.toFixed(2)}`;
    }
}

function confirmAddToCart() {
    if (!currentProduct) {
        console.error("No current product selected!");
        return;
    }

    let selectedAddons = [];
    let addonsTotal = 0;
    const checkboxes = document.querySelectorAll(".addon-checkbox");
    checkboxes.forEach(cb => {
        if (cb.checked) {
            const index = parseInt(cb.dataset.index);
            if (currentProduct.addons && currentProduct.addons[index]) {
                const addon = currentProduct.addons[index];
                addonsTotal += parseFloat(addon.price);
                selectedAddons.push({ name: addon.name, price: parseFloat(addon.price) });
            }
        }
    });

    const perUnit = parseFloat(currentProduct.price) + addonsTotal;

    const cart = getCart();
    const existingIndex = cart.findIndex(item => 
        item.id === currentProduct.id && 
        JSON.stringify(item.addons) === JSON.stringify(selectedAddons)
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + modalQuantity;
    } else {
        const cartItem = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: perUnit,
            quantity: modalQuantity,
            addons: selectedAddons,
            basePrice: parseFloat(currentProduct.price)
        };
        cart.push(cartItem);
    }

    saveCart(cart);
    updateCartCount();
    closeProductModal();
    showToast("✅ Successfully Added to Cart!");
}

function showToast(message) {
    let toast = document.getElementById("toastNotification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toastNotification";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
}

// ===========================
// FILTER FUNCTIONALITY
// ===========================
function initializeFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            filterBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            renderProducts(this.dataset.filter);
        });
    });
}

// ===========================
// PROFILE SIDEBAR
// ===========================
function initializeProfileSidebar() {
    const profileToggle = document.getElementById("profile-toggle");
    const profileSidebar = document.getElementById("profile-sidebar");
    const closeProfile = document.querySelector(".close-profile");

    if (profileToggle && profileSidebar) {
        profileToggle.addEventListener("click", function(e) {
            e.stopPropagation();
            profileSidebar.classList.add("open");
            loadOrderHistory();
        });
    }

    if (closeProfile && profileSidebar) {
        closeProfile.addEventListener("click", function() {
            profileSidebar.classList.remove("open");
        });
    }

    document.addEventListener("click", function(e) {
        if (profileSidebar && !profileSidebar.contains(e.target) && 
            profileToggle && !profileToggle.contains(e.target)) {
            profileSidebar.classList.remove("open");
        }
    });
}

function loadOrderHistory() {
    const container = document.getElementById("order-history-container");
    if (!container) return;
    
    const transactions = JSON.parse(localStorage.getItem("kfoods-transactions") || "[]");
    
    if (transactions.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 14px;">No previous orders.</p>';
    } else {
        container.innerHTML = transactions.slice(0, 5).map(t => `
            <div class="order-item">
                <p>Order #${t.id} – ${t.items.length} item(s)</p>
                <span>₱${t.total}</span>
            </div>
        `).join("");
    }
}

// ===========================
// ADDRESS MANAGEMENT
// ===========================
function initializeAddressManagement() {
    const manageBtn = document.querySelector(".manage-address-btn");
    const addressModal = document.getElementById("addressModal");
    const saveBtn = document.querySelector(".save-address-btn");
    const closeBtn = document.querySelector(".close-address-btn");
    const currentAddress = document.querySelector(".current-address");

    if (!manageBtn || !addressModal) return;

    // Load saved address
    const savedAddress = localStorage.getItem("kfoods-address");
    if (savedAddress && currentAddress) {
        currentAddress.textContent = savedAddress;
    }

    manageBtn.addEventListener("click", () => {
        addressModal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        addressModal.style.display = "none";
    });

    saveBtn.addEventListener("click", () => {
        const street = document.getElementById("addrStreet").value;
        const brgy = document.getElementById("addrBarangay").value;
        const city = document.getElementById("addrCity").value;
        const zip = document.getElementById("addrZip").value;

        if (!street || !brgy || !city || !zip) {
            alert("Please fill in all address fields");
            return;
        }

        const address = `${street}, ${brgy}, ${city} ${zip}`;
        localStorage.setItem("kfoods-address", address);

        if (currentAddress) {
            currentAddress.textContent = address;
        }

        addressModal.style.display = "none";
        showToast("✓ Address Saved!");
    });
}

// ===========================
// INITIALIZE ON PAGE LOAD
// ===========================
document.addEventListener("DOMContentLoaded", function() {
    console.log("Page loaded, initializing...");
    
    if (typeof products !== 'undefined' && products.length > 0) {
        renderProducts();
        updateCartCount();
        initializeFilters();
        initializeProfileSidebar();
        initializeAddressManagement();
        
        console.log("Initialization complete!");
    } else {
        console.error("Products not loaded from PHP!");
    }
});
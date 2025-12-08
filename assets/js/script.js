/* ======================================================
   LOCAL STORAGE HELPERS
====================================================== */

function getCart() {
    return JSON.parse(localStorage.getItem("kfoods-cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("kfoods-cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((n, i) => n + i.quantity, 0);
    document.getElementById("cart-count").textContent = total;
}

/* ======================================================
   SAVE PRODUCTS FOR CART PAGE
====================================================== */
function saveProductsToStorage() {
    const productsForCart = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        category: p.category[0],
        bestSeller: p.category.includes("best")
    }));

    localStorage.setItem("kfoods-products", JSON.stringify(productsForCart));
}

/* ======================================================
   PRODUCT MODAL
====================================================== */

let currentProduct = null;
let modalQuantity = 1;

function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    modalQuantity = 1;

    const modalHTML = `
    <div id="productModalBackdrop" class="modal-backdrop show">
        <div class="modal">
            <div class="modal-header">
                <div class="modal-title">${currentProduct.name}</div>
                <button class="modal-close" onclick="closeProductModal()">&times;</button>
            </div>

            <div class="modal-sub">${currentProduct.spicy}</div>

            <div style="margin-bottom: 12px;">
                <span style="color:#ffb000;">★</span>
                ${currentProduct.rating} • ${currentProduct.reviews} reviews
            </div>

            <div class="price-display">₱${currentProduct.price}</div>

            <p>${currentProduct.description}</p>

            <div class="qty-box">
                <button onclick="changeModalQty(-1)">-</button>
                <input id="modalQtyInput" value="1" readonly>
                <button onclick="changeModalQty(1)">+</button>
            </div>

            <h4>Add-ons</h4>
            <ul class="addons-list">
                ${currentProduct.addons.map((a, i) => `
                    <li>
                        <label>
                            <input type="checkbox" class="addon-checkbox" data-index="${i}">
                            ${a.name} (+₱${a.price})
                        </label>
                    </li>
                `).join("")}
            </ul>

            <div class="modal-footer">
                <div>
                    <div>Total</div>
                    <div id="modalTotalPrice">₱${currentProduct.price}</div>
                </div>

                <button class="btn-primary" onclick="confirmAddToCart()">Add to Cart</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    updateModalTotal();
}

function closeProductModal() {
    document.getElementById("productModalBackdrop").remove();
}

function changeModalQty(amount) {
    modalQuantity = Math.max(1, modalQuantity + amount);
    document.getElementById("modalQtyInput").value = modalQuantity;
    updateModalTotal();
}

function updateModalTotal() {
    const addons = document.querySelectorAll(".addon-checkbox");
    let addonTotal = 0;

    addons.forEach(cb => {
        if (cb.checked) {
            const a = currentProduct.addons[cb.dataset.index];
            addonTotal += a.price;
        }
    });

    const total = (currentProduct.price + addonTotal) * modalQuantity;
    document.getElementById("modalTotalPrice").textContent = "₱" + total;
}

/* ======================================================
   CONFIRM ADD TO CART
====================================================== */
function confirmAddToCart() {
    const addons = [];
    document.querySelectorAll(".addon-checkbox:checked").forEach(cb => {
        const a = currentProduct.addons[cb.dataset.index];
        addons.push({ name: a.name, price: a.price });
    });

    const cart = getCart();

    cart.push({
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: modalQuantity,
        addons
    });

    saveCart(cart);
    updateCartCount();
    closeProductModal();
    showToast("Added to cart!");
}

/* ======================================================
   FILTER BUTTONS
====================================================== */
function initializeFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderProducts(btn.dataset.filter);
        });
    });
}

/* ======================================================
   PROFILE SIDEBAR
====================================================== */
function initializeProfileSidebar() {
    const toggle = document.getElementById("profile-toggle");
    const sidebar = document.getElementById("profile-sidebar");
    const closeBtn = document.querySelector(".close-profile");

    if (!toggle || !sidebar) return;

    toggle.addEventListener("click", e => {
        e.stopPropagation();
        sidebar.classList.add("open");
    });

    if (closeBtn)
        closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));

    document.addEventListener("click", e => {
        if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
            sidebar.classList.remove("open");
        }
    });
}

/* ======================================================
   ADDRESS MODAL
====================================================== */
function initializeAddressModal() {
    const btn = document.querySelector(".manage-address-btn");
    const modal = document.getElementById("addressModal");
    const exit = document.querySelector(".close-address-btn");
    const save = document.querySelector(".save-address-btn");

    if (!btn) return;

    btn.addEventListener("click", () => modal.classList.add("active"));
    exit.addEventListener("click", () => modal.classList.remove("active"));

    save.addEventListener("click", () => {
        const finalAddress = `${addrStreet.value}, ${addrBarangay.value}, ${addrCity.value} ${addrZip.value}`;
        localStorage.setItem("kfoods-address", finalAddress);

        document.querySelector(".current-address").textContent = finalAddress;
        modal.classList.remove("active");
        showToast("Address saved!");
    });
}

/* ======================================================
   TOAST POPUP
====================================================== */
function showToast(msg) {
    let toast = document.getElementById("toastNotification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toastNotification";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ======================================================
   INIT
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
    saveProductsToStorage();
    updateCartCount();
    initializeFilters();
    initializeProfileSidebar();
    initializeAddressModal();
});

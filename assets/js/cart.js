/* ======================================================
   CLEAN & FIXED CART.JS
   Fully compatible with cart.html  (no HTML changes required)
=========================================================*/

// Load products saved from index page (fallback if missing)
const products = JSON.parse(localStorage.getItem("kfoods-products") || "[]");

// Load existing cart
let cart = JSON.parse(localStorage.getItem("kfoods-cart") || "[]");

// DOM ELEMENTS
const cartPageItems    = document.getElementById("cart-page-items");
const cartPageCount    = document.getElementById("cart-page-count");
const cartSubtotal     = document.getElementById("cart-subtotal");
const cartTotalAmount  = document.getElementById("cart-total-amount");
const deliveryAddress  = document.getElementById("delivery-address");
const checkoutPageBtn  = document.getElementById("checkout-page-btn");
const clearCartPageBtn = document.getElementById("clear-cart-page-btn");
const orderItemsList   = document.getElementById("order-items-list");
const orderTotalPrice  = document.getElementById("order-total-price");
const orderNumber      = document.getElementById("order-number");
const modal            = document.getElementById("order-modal");
const closeModalBtn    = document.querySelector(".close-modal");
const closeBtn         = document.querySelector(".close-btn");

/* ======================================================
   INIT CART PAGE
=========================================================*/
function initCartPage() {
    updateCartPage();
    loadDeliveryAddress();
    loadOrderHistory();
    setupCartButtonEvents();
    setupProfileSidebar();
    setupAddressModal();
}

/* ======================================================
   RENDER CART
=========================================================*/
function updateCartPage() {
    const totalItems = cart.reduce((t, item) => t + (item.quantity || 1), 0);
    cartPageCount.textContent = `${totalItems} item${totalItems !== 1 ? "s" : ""}`;

    if (cart.length === 0) {
        cartPageItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <p>Add some delicious Korean food from our menu!</p>
            </div>`;
        cartSubtotal.textContent = "";
        document.getElementById("delivery-fee").textContent = "";
        document.getElementById("service-fee").textContent = "";
        cartTotalAmount.textContent = "";
        return;
    }

    cartPageItems.innerHTML = "";

    cart.forEach(item => {
        const itemPrice = item.price || 0;
        const itemQty   = item.quantity || 1;

        const row = document.createElement("div");
        row.className = "cart-page-item";
        row.innerHTML = `
            <div class="cart-page-item-info">
                <h4>${item.name}</h4>
                <p>P${itemPrice} each</p>
                ${
                    item.addons?.length
                        ? `<small>Add-ons: ${item.addons.map(a => a.name).join(", ")}</small>`
                        : ""
                }
            </div>

            <div class="cart-page-item-controls">
                <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                <span class="cart-item-quantity">${itemQty}</span>
                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="cart-page-item-total">
                P${itemPrice * itemQty}
            </div>
        `;
        cartPageItems.appendChild(row);
    });

    attachCartItemEvents();
    updateTotals();
}

/* ======================================================
   UPDATE TOTAL
=========================================================*/
function updateTotals() {
    const subtotal = cart.reduce((t, item) => t + item.price * item.quantity, 0);
    const deliveryFee = 50;
    const serviceFee  = 20;
    const total       = subtotal + deliveryFee + serviceFee;

    cartSubtotal.textContent = `P${subtotal}`;
    document.getElementById("delivery-fee").textContent = `P${deliveryFee}`;
    document.getElementById("service-fee").textContent  = `P${serviceFee}`;
    cartTotalAmount.textContent = `P${total}`;
}

/* ======================================================
   MODIFY CART
=========================================================*/
function attachCartItemEvents() {
    document.querySelectorAll(".decrease-btn").forEach(btn =>
        btn.addEventListener("click", () => updateCartQuantity(btn.dataset.id, -1))
    );
    document.querySelectorAll(".increase-btn").forEach(btn =>
        btn.addEventListener("click", () => updateCartQuantity(btn.dataset.id, 1))
    );
    document.querySelectorAll(".remove-item-btn").forEach(btn =>
        btn.addEventListener("click", () => removeFromCart(btn.dataset.id))
    );
}

function updateCartQuantity(id, change) {
    const index = cart.findIndex(i => i.id == id);
    if (index === -1) return;

    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);

    saveCart();
    updateCartPage();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id != id);
    saveCart();
    updateCartPage();
    showToast("Item removed!");
}

function saveCart() {
    localStorage.setItem("kfoods-cart", JSON.stringify(cart));
}

/* ======================================================
   CHECKOUT FUNCTION
=========================================================*/
function setupCartButtonEvents() {
    if (checkoutPageBtn) {
        checkoutPageBtn.addEventListener("click", () => {
            if (!cart.length) return alert("Your cart is empty!");

            if (!localStorage.getItem("kfoods-address")) {
                showToast("Set your delivery address first.");
                return;
            }

            showOrderConfirmation();
        });
    }

    if (clearCartPageBtn) {
        clearCartPageBtn.addEventListener("click", () => {
            cart = [];
            saveCart();
            updateCartPage();
            showToast("Cart cleared!");
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (closeBtn)      closeBtn.addEventListener("click", closeModal);
}

function showOrderConfirmation() {
    const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
    const total = subtotal + 70;

    orderNumber.textContent = Math.floor(10000 + Math.random() * 90000);
    orderTotalPrice.textContent = `P${total}`;

    orderItemsList.innerHTML = cart
        .map(i => `
            <div>
                ${i.quantity}x ${i.name} — P${i.price * i.quantity}
            </div>
        `)
        .join("");

    saveTransaction();
    modal.style.display = "flex";

    cart = [];
    saveCart();
    updateCartPage();
}

function closeModal() {
    modal.style.display = "none";
}

/* ======================================================
   ORDER HISTORY STORAGE
=========================================================*/
function saveTransaction() {
    const tx = JSON.parse(localStorage.getItem("kfoods-transactions") || "[]");

    tx.unshift({
        id: "KFD" + Date.now().toString().slice(-6),
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((t, i) => t + i.price * i.quantity, 0) + 70
    });

    localStorage.setItem("kfoods-transactions", JSON.stringify(tx));
}

function loadOrderHistory() {
    const box = document.getElementById("order-history-list");
    const tx = JSON.parse(localStorage.getItem("kfoods-transactions") || "[]");

    if (!box) return;

    box.innerHTML =
        tx.length === 0
            ? "<p>No previous orders.</p>"
            : tx
                  .map(
                      t => `
                <div class="order-item">
                    <p><strong>Order #${t.id}</strong></p>
                    <p>${t.items.length} items</p>
                    <p>Total: P${t.total}</p>
                </div>
            `
                  )
                  .join("");
}

/* ======================================================
   DELIVERY ADDRESS
=========================================================*/
function loadDeliveryAddress() {
    deliveryAddress.textContent =
        localStorage.getItem("kfoods-address") || "No address set yet";
}

/* ======================================================
   PROFILE SIDEBAR (FULLY FIXED)
=========================================================*/
function setupProfileSidebar() {
    const toggle   = document.getElementById("profile-toggle");
    const sidebar  = document.getElementById("profile-sidebar");
    const closeBtn = document.querySelector(".close-profile");

    if (!toggle || !sidebar) return;

    // OPEN
    toggle.addEventListener("click", e => {
        e.stopPropagation();
        sidebar.classList.add("open");
    });

    // CLOSE via X button
    if (closeBtn) {
        closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));
    }

    // CLICK OUTSIDE
    document.addEventListener("click", e => {
        if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
            sidebar.classList.remove("open");
        }
    });
}

/* ======================================================
   ADDRESS MODAL (CART PAGE)
=========================================================*/
function setupAddressModal() {
    const manageBtn = document.querySelector(".manage-address-btn");
    const addressModal = document.getElementById("addressModal");
    const saveBtn = document.querySelector(".save-address-btn");
    const closeBtn = document.querySelector(".close-address-btn");

    if (!manageBtn || !addressModal) return;

    manageBtn.addEventListener("click", () => {
        addressModal.classList.add("active");
    });

    if (closeBtn)
        closeBtn.addEventListener("click", () => {
            addressModal.classList.remove("active");
        });

    if (saveBtn)
        saveBtn.addEventListener("click", () => {
            const address = `${addrStreet.value}, ${addrBarangay.value}, ${addrCity.value} ${addrZip.value}`;
            localStorage.setItem("kfoods-address", address);
            deliveryAddress.textContent = address;
            addressModal.classList.remove("active");
            showToast("Address saved!");
        });
}

/* ======================================================
   TOASTS
=========================================================*/
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ======================================================
   START SCRIPT
=========================================================*/
document.addEventListener("DOMContentLoaded", initCartPage);

fetch("php/save_order.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        address: deliveryAddress.textContent,
        subtotal,
        delivery_fee,
        service_fee,
        total,
        items: cart
    })
})
.then(res => res.json())
.then(data => {
    if (data.status === "SUCCESS") {
        console.log("Order saved!", data.order_id);
    }
});


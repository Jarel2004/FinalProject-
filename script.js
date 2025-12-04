
// =========================================================
// FILTER BUTTONS
// =========================================================
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.filter);
    });
});

// =========================================================
// MODAL / CART FUNCTIONS (unchanged from your code)
// =========================================================
// (Your modal and cart code stays the same — no need to modify)


// =========================================================
// INITIALIZE
// =========================================================
renderProducts();
updateCartCount();

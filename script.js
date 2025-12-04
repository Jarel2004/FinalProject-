// ===========================
// PRODUCT DATA
// ===========================
const products = [

    // ======================
    // BEST SELLERS
    // ======================
    {
        id: 1,
        name: "Bibimbap",
        price: 129,
        category: "best",
        image: "src/Bibimbap.jpeg",
        description: "Korean mixed rice bowl with vegetables, egg, and gochujang.",
        rating: 4.8,
        reviews: "1.2k",
        orders: "1.9k+",
        spicy: true,
        addons: []
    },
    {
        id: 2,
        name: "Pokebowl",
        price: 129,
        category: "best",
        image: "src/PokeBowl.jpeg",
        description: "Hawaiian bowl with fresh toppings.",
        rating: 4.7,
        reviews: "920",
        orders: "1.5k+",
        spicy: false,
        addons: []
    },
    {
        id: 3,
        name: "Stirfried Fishcake (Sweet & Spicy)",
        price: 100,
        category: "best",
        image: "src/Stirfried_Fishcake.jpeg",
        description: "Korean stirfried eomuk in spicy sauce.",
        rating: 4.5,
        reviews: "710",
        orders: "1.0k+",
        spicy: true,
        addons: []
    },
    {
        id: 4,
        name: "Porkchop w/ rice & salad",
        price: 79,
        category: "best",
        image: "src/Porkchop.jpeg",
        description: "Grilled porkchop with rice and salad.",
        rating: 4.4,
        reviews: "890",
        orders: "1.3k+",
        spicy: false,
        addons: []
    },
    {
        id: 5,
        name: "Hot & spicy chicken w/ drinks",
        price: 110,
        category: "best",
        image: "src/H&S_Chicken.jpeg",
        description: "Spicy chicken meal with drinks.",
        rating: 4.7,
        reviews: "950",
        orders: "1.6k+",
        spicy: true,
        addons: []
    },

    // ======================
    // SUSHI
    // ======================
    {
        id: 6,
        name: "Chicken Roll Sushi",
        price: 145,
        category: "sushi",
        image: "src/Chicken_Roll.jpeg",
        description: "Crispy chicken roll wrapped in sushi rice.",
        spicy: false,
        addons: []
    },
    {
        id: 7,
        name: "Hot Roll Sushi",
        price: 149,
        category: "sushi",
        image: "src/Hot_Roll.jpeg",
        description: "Spicy shrimp tempura sushi roll.",
        spicy: true,
        addons: []
    },
    {
        id: 8,
        name: "Softshell Mango Sushi",
        price: 149,
        category: "sushi",
        image: "src/Softshell_Mango.jpeg",
        description: "Softshell crab with mango sushi.",
        spicy: false,
        addons: []
    },
    {
        id: 9,
        name: "Mango Sushi",
        price: 69,
        category: "sushi",
        image: "src/Mango.jpeg",
        description: "Sweet and fresh mango sushi.",
        spicy: false,
        addons: []
    },
    {
        id: 10,
        name: "Onigiri",
        price: 120,
        category: "sushi",
        image: "src/Onigiri.jpeg",
        description: "Japanese rice ball wrapped in nori.",
        spicy: false,
        addons: []
    },
    {
        id: 11,
        name: "Kimbap",
        price: 89,
        category: "sushi",
        image: "src/Kimbap.jpeg",
        description: "Korean-style maki rolls.",
        spicy: false,
        addons: []
    },

    // ======================
    // SIZZLING
    // ======================
    {
        id: 12,
        name: "Pork Sisig",
        price: 129,
        category: "sizzling",
        image: "src/Sisig.jpeg",
        description: "Sizzling pork sisig topped with egg.",
        spicy: true,
        addons: []
    },
    {
        id: 13,
        name: "Pepper Steak",
        price: 129,
        category: "sizzling",
        image: "src/Pepper_Steak.jpeg",
        description: "Beef steak cooked with pepper sauce.",
        spicy: false,
        addons: []
    },
    {
        id: 14,
        name: "Kimchi Pork",
        price: 129,
        category: "sizzling",
        image: "src/Kimchi_Pork.jpeg",
        description: "Sizzling pork cooked with kimchi.",
        spicy: true,
        addons: []
    },
    {
        id: 15,
        name: "Teriyaki",
        price: 129,
        category: "sizzling",
        image: "src/Teriyaki.jpeg",
        description: "Sweet glazed teriyaki meat.",
        spicy: false,
        addons: []
    },
    {
        id: 16,
        name: "Tonkatsu",
        price: 129,
        category: "sizzling",
        image: "src/Tonkatsu.jpeg",
        description: "Breaded fried pork cutlet.",
        spicy: false,
        addons: []
    },
    {
        id: 17,
        name: "Spicy Garlic Shrimp",
        price: 129,
        category: "sizzling",
        image: "src/Garlic_Shrimp.jpeg",
        description: "Shrimp cooked in spicy garlic butter.",
        spicy: true,
        addons: []
    },

];

// =========================================================
// RENDER PRODUCTS
// =========================================================
function renderProducts(filter = "all") {
    const grid = document.getElementById("products-grid");

    const filtered = filter === "all"
        ? products
        : products.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">

            <div class="product-image-wrapper">
                <img src="${product.image}">
                ${product.spicy ? `<span class="spicy-badge">🌶️</span>` : ""}
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 50)}...</p>

                <div class="product-footer">
                    <span class="product-price">₱${product.price}</span>
                    <button class="add-btn"
                        onclick="event.stopPropagation(); openProductModal(${product.id})">
                        + Add
                    </button>
                </div>
            </div>

        </div>
    `).join("");
}

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

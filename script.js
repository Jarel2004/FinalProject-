// ==========================
// PRODUCT LIST
// ==========================
const products = [

    // ======================
    // BEST SELLERS
    // ======================
    {
        id: 1,
        name: "Pokebowl",
        price: 129,
        description: "Fresh Hawaiian-style poke",
        category: "best",
        bestSeller: true,
        image: "Pokebowl.jpeg"
    },
    {
        id: 2,
        name: "Bibimbap",
        price: 129,
        description: "Korean mixed rice bowl",
        category: "best",
        bestSeller: true,
        image: "Bibimbap.jpeg"
    },
    {
        id: 3,
        name: "Stirfried Fishcake",
        price: 100,
        description: "Sweet & spicy fishcake",
        category: "best",
        bestSeller: true,
        image:"Chicken_Roll.jpeg"
    },
    {
        id: 4,
        name: "Porkchop w/ rice & salad",
        price: 79,
        description: "Crispy porkchop meal",
        category: "best",
        bestSeller: true,
        image:"Porkchop.jpeg"
    },
    {
        id: 5,
        name: "Hot & Spicy Chicken + drink",
        price: 110,
        description: "Spicy chicken meal with drink",
        category: "best",
        bestSeller: true,
        image: "H&S_Chicken.jpeg"
    },

    // ======================
    // SUSHI
    // ======================
    {
        id: 6,
        name: "Chicken Roll",
        price: 145,
        description: "Savory chicken sushi roll",
        category: "sushi",
        bestSeller: false,
        image: "Chicken_Roll.jpeg"
    },
    {
        id: 7,
        name: "Hot Roll",
        price: 149,
        description: "Crispy spicy sushi roll",
        category: "sushi",
        bestSeller: false,
        image: "Hot_Roll.jpeg"
    },
    {
        id: 8,
        name: "Softshell Mango",
        price: 149,
        description: "Softshell crab + mango",
        category: "sushi",
        bestSeller: false,
        image: "Softshell_Mango.jpeg"
    },
    {
        id: 9,
        name: "Mango Sushi",
        price: 69,
        description: "Sweet mango sushi",
        category: "sushi",
        bestSeller: false,
        image: "Mango.jpeg"
    },
    {
        id: 10,
        name: "Onigiri",
        price: 120,
        description: "Japanese rice triangle",
        category: "sushi",
        bestSeller: false,
        image: "Onigiri.jpeg"
    },
   

    // ======================
    // SIZZLING
    // ======================
    {
        id: 11,
        name: "Pork Sisig",
        price: 129,
        description: "Filipino sizzling pork",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-fire"
    },
    {
        id: 12,
        name: "Pepper Steak",
        price: 129,
        description: "Sizzling black pepper beef",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-drumstick-bite"
    },
    {
        id: 13,
        name: "Kimchi Pork",
        price: 129,
        description: "Sizzling pork with kimchi",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-pepper-hot"
    },
    {
        id: 14,
        name: "Teriyaki",
        price: 129,
        description: "Sweet Japanese teriyaki flavor",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-bowl-food"
    },
    {
        id: 15,
        name: "Tonkatsu",
        price: 129,
        description: "Crispy fried pork cutlet",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-piggy-bank"
    },
    {
        id: 16,
        name: "Spicy Garlic Shrimp",
        price: 129,
        description: "Sizzling shrimp with spicy garlic",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-shrimp"
    }

];


// ==========================
// DOM ELEMENTS
// ==========================
const productsGrid = document.getElementById("products-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

// ==========================
// RENDER PRODUCTS  (NO ADD-TO-CART BUTTON)
// ==========================
function renderProducts(filter = "all") {
    productsGrid.innerHTML = "";

    let filtered = products;

    if (filter === "best") {
        filtered = products.filter(p => p.bestSeller);
    } else if (filter !== "all") {
        filtered = products.filter(p => p.category === filter);
    }

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">P${product.price}</div>
            </div>
        `;

        productsGrid.appendChild(card);
    });
}

// ==========================
// FILTER BUTTON CLICK
// ==========================
filterButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        filterButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        const filter = this.getAttribute("data-filter");
        renderProducts(filter);
    });
});

// Run on load
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});

// Open Profile Sidebar
document.getElementById("profile-toggle").addEventListener("click", () => {
    document.getElementById("profile-sidebar").classList.add("open");
});
// Open sidebar
document.getElementById("profile-toggle").addEventListener("click", () => {
    document.getElementById("profile-sidebar").classList.add("open");
});

// Close sidebar
document.querySelector(".close-profile").addEventListener("click", () => {
    document.getElementById("profile-sidebar").classList.remove("open");
});

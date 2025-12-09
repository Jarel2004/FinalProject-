// =====================================================
// PRODUCT DATA (updated, consistent categories)
// =====================================================

const products = [
     {
    id: 1,
    name: "Chicken Roll",
    category: ["sushi"],
    price: 145,
    image: "assets/src/Chicken_Roll.jpeg",
    rating: 4.5,
    reviews: 200,
    orders: 500,
    description: "Crispy chicken sushi roll.",
    tags: ["KR Korean", "🍣 Sushi"],
    spicy: "Not spicy",
    addons: []
  },
  {
    id: 2,
    name: "Hot Roll",
    category: ["sushi"],
    price: 149,
    image: "assets/src/Hot_Roll.jpeg",
    rating: 4.6,
    reviews: 210,
    orders: 520,
    description: "Deep-fried hot sushi roll.",
    tags: ["KR Korean", "🍤 Fried"],
    spicy: "Mild",
    addons: []
  },
  {
    id: 3,
    name: "Softshell Mango",
    category: ["sushi"],
    price: 149,
    image: "assets/src/Softshell_Mango.jpeg",
    rating: 4.7,
    reviews: 180,
    orders: 480,
    description: "Softshell crab roll with mango.",
    tags: ["KR Korean", "🍤 Crab"],
    spicy: "Not spicy",
    addons: []
  },
  {
    id: 4,
    name: "Mango Sushi",
    category: ["sushi"],
    price: 69,
    image: "assets/src/Mango.jpeg",
    rating: 4.3,
    reviews: 150,
    orders: 450,
    description: "Sweet and fresh mango sushi.",
    tags: ["Sweet", "Light meal"],
    spicy: "Not spicy",
    addons: []
  },
  {
    id: 5,
    name: "Onigiri",
    category: ["sushi"],
    price: 120,
    image: "assets/src/Onigiri.jpeg",
    rating: 4.4,
    reviews: 160,
    orders: 400,
    description: "Japanese rice ball with fillings.",
    tags: ["Japanese", "Rice"],
    spicy: "Not spicy",
    addons: []
  },
  {
    id: 6,
    name: "Bibimbap",
    category: ["sushi"],
    price: 89,
    image: "assets/src/Bibimbap.jpeg",
    rating: 4.4,
    reviews: 650,
    orders: 950,
    description: "Korean-style maki rolls with vegetables and seaweed.",
    tags: ["KR Korean", "⏱️ 10–15 mins", "🍙 Rice Rolls"],
    spicy: "Not spicy",
    addons: [
      { name: "Extra Kimbap", description: "4 pieces", price: 40 },
      { name: "Pickled Radish", description: "Danmuji", price: 15 },
      { name: "Korean Tea", description: "Boricha", price: 20 },
      { name: "Sesame Oil", description: "Dipping sauce", price: 10 }
    ]
  },

  // ============================
  // 🔥 SIZZLING
  // ============================
  {
    id: 7,
    name: "Pork Sisig",
    category: ["sizzling"],
    price: 129,
    image: "assets/src/Pork_Sisig.jpeg",
    rating: 4.6,
    reviews: 300,
    orders: 800,
    description: "Classic pork sisig sizzling plate.",
    tags: ["Filipino", "Sizzling"],
    spicy: "Mild",
    addons: []
  },
  {
    id: 8,
    name: "Pepper Steak",
    category: ["sizzling"],
    price: 129,
    image: "assets/src/PepperSteak.jpeg",
    rating: 4.5,
    reviews: 250,
    orders: 700,
    description: "Beef steak with pepper sauce.",
    tags: ["Beef", "Sizzling"],
    spicy: "Not spicy",
    addons: []
  },
  {
    id: 9,
    name: "Kimchi Pork",
    category: ["sizzling"],
    price: 129,
    image: "assets/src/Kimchi_Pork.jpeg",
    rating: 4.6,
    reviews: 270,
    orders: 730,
    description: "Pork cooked with Korean kimchi.",
    tags: ["KR Korean", "Spicy"],
    spicy: "Medium",
    addons: []
  },
  {
    id: 10,
    name: "Teriyaki",
    category: ["sizzling"],
    price: 129,
    image: "assets/src/TeriyakiSizzling.jpeg",
    rating: 4.5,
    reviews: 260,
    orders: 720,
    description: "Japanese-style sweet teriyaki dish.",
    tags: ["Japanese", "Sweet"],
    spicy: "Not spicy",
    addons: []
  },
  {
    id: 11,
    name: "Tonkatsu",
    category: ["sizzling"],
    price: 129,
    image: "assets/src/Porkchop.jpeg",
    rating: 4.5,
    reviews: 230,
    orders: 680,
    description: "Crispy pork cutlet with sauce.",
    tags: ["Japanese", "Fried"],
    spicy: "Not spicy",
    addons: []
  },
  {
    id: 12,
    name: "Spicy Garlic Shrimp",
    category: ["sizzling"],
    price: 129,
    image: "assets/src/SpicyGarlicShrimp.jpeg",
    rating: 4.7,
    reviews: 310,
    orders: 820,
    description: "Shrimp sautéed with spicy garlic sauce.",
    tags: ["Seafood", "Garlic", "Spicy"],
    spicy: "Hot",
    addons: []
  },

  // ============================
  // ⭐ BEST SELLER
  // ============================
  {
    id: 13,
    name: "Pokebowl",
    category: ["best-seller"],
    price: 129,
    image: "assets/src/Pokebowl.jpeg",
    rating: 4.8,
    reviews: 500,
    orders: 1200,
    description: "Hawaiian-style poke bowl.",
    tags: ["Fresh", "Healthy"],
    spicy: "Optional",
    addons: []
  },
  {
    id: 14,
    name: "Bibimbap",
    category: ["best-seller"],
    price: 129,
    image: "assets/src/Bibimbap.jpeg",
    rating: 4.8,
    reviews: 540,
    orders: 1300,
    description: "Korean mixed rice with vegetables and meat.",
    tags: ["KR Korean", "Rice bowl"],
    spicy: "Optional",
    addons: []
  },
  {
    id: 15,
    name: "Stirfried Fishcake Sweet & Spicy",
    category: ["best-seller"],
    price: 100,
    image: "assets/src/Stirfried_Fishcake.jpeg",
    rating: 4.6,
    reviews: 300,
    orders: 900,
    description: "Korean fishcake stir-fry with sweet & spicy sauce.",
    tags: ["KR Korean", "Sweet & Spicy"],
    spicy: "Medium",
    addons: []
  },
  {
    id: 16,
    name: "Porkchop w/ Rice & Salad",
    category: ["best-seller"],
    price: 79,
    image: "assets/src/Porkchop.jpeg",
    rating: 4.4,
    reviews: 250,
    orders: 850,
    description: "Seasoned porkchop served with rice and salad.",
    tags: ["Filipino", "Meal"],
    spicy: "Not spicy",
    addons: []
  },
  {
    id: 17,
    name: "Hot & Spicy Chicken w/ Drinks",
    category: ["best-seller"],
    price: 110,
    image: "assets/src/H&S_Chicken.jpeg",
    rating: 4.5,
    reviews: 320,
    orders: 910,
    description: "Spicy chicken meal with drink included.",
    tags: ["Chicken", "Spicy"],
    spicy: "Hot",
    addons: []
  }
];

    // You can add the rest of your items here exactly the same way...


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts(filter = "all") {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";

    const filtered = products.filter(p => filter === "all" || p.category.includes(filter));

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 70)}...</p>
                <div class="product-footer">
                    <div class="product-price">₱${product.price}</div>
                    <button class="add-btn" onclick="event.stopPropagation(); openProductModal(${product.id})">
                        + Add
                    </button>
                </div>
            </div>
        `;

        card.addEventListener("click", () => openProductModal(product.id));
        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});

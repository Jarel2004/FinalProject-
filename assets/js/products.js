// =====================================================
// PRODUCT DATA (updated, consistent categories)
// =====================================================

const products = [
    {
        id: 1,
        name: "Bibimbap",
        price: 129,
        category: ["best"],
        image: "src/Bibimbap.jpeg",
        rating: 4.8,
        reviews: 1200,
        orders: 1900,
        description: "A colorful Korean rice bowl with vegetables, beef, egg, and gochujang.",
        tags: ["🔥 Bestseller", "⏱ 20–30 mins", "🏷 Free utensils"],
        spicy: "🌶 Spicy · Korean Rice Bowl",
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
        name: "Poke Bowl",
        price: 129,
        category: ["best"],
        image: "src/PokeBowl.jpeg",
        rating: 4.7,
        reviews: 920,
        orders: 1500,
        description: "Savory fried rice with spicy kimchi, veggies, and fried egg.",
        tags: ["🌶 Spicy", "⏱ 15–20 mins", "🔥 Popular"],
        spicy: "🌶 Spicy · Fried Rice",
        addons: [
            { name: "Extra Kimchi", description: "Fermented cabbage", price: 30 },
            { name: "Extra Egg", description: "Sunny side up", price: 25 },
            { name: "Pork Belly", description: "Grilled slices", price: 50 }
        ]
    },

    {
        id: 3,
        name: "Stirfried Fishcake (Sweet & Spicy)",
        price: 100,
        category: ["best"],
        image: "src/Stirfried_Fishcake.jpeg",
        rating: 4.5,
        reviews: 710,
        orders: 1000,
        description: "Korean stirfried eomuk in spicy sauce.",
        tags: ["🌶️ Spicy", "⏱ 15–20 mins", "🇰🇷 Korean"],
        spicy: "🌶 Spicy · Korean Street Food",
        addons: [
            { name: "Extra Fishcake", description: "100g", price: 40 },
            { name: "Spicy Level", description: "Adjustable", price: 0 },
            { name: "Rice Cakes", description: "Tteokbokki style", price: 35 },
            { name: "Kimchi", description: "Side dish", price: 25 }
        ]
    },

    {
        id: 11,
        name: "Kimbap",
        category: ["sushi"],
        price: 89,
        image: "src/Kimbap.jpeg",
        rating: 4.4,
        reviews: 650,
        orders: 950,
        description: "Korean-style maki rolls with vegetables and seaweed.",
        tags: ["🇰🇷 Korean", "⏱ 10–15 mins", "🍱 Light meal"],
        spicy: "🇰🇷 Korean · Rice Rolls",
        addons: [
            { name: "Extra Kimbap", description: "4 pieces", price: 40 },
            { name: "Pickled Radish", description: "Danmuji", price: 15 },
            { name: "Korean Tea", description: "Boricha", price: 20 },
            { name: "Sesame Oil", description: "Dipping sauce", price: 10 }
        ]
    },

    // You can add the rest of your items here exactly the same way...
];

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

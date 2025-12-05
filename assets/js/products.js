// products.js - Shared product data for all pages
const products = [
    {
        id: 1,
        name: "Bibimbap",
        price: 129,
        description: "Korean mixed rice bowl with vegetables, egg, and gochujang.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-bowl-rice"
    },
    {
        id: 2,
        name: "Pokebowl",
        price: 129,
        description: "Hawaiian bowl with fresh toppings.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-bowl-food"
    },
    {
        id: 3,
        name: "Stirfried Fishcake (Sweet & Spicy)",
        price: 100,
        description: "Korean stirfried eomuk in spicy sauce.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-fish"
    },
    {
        id: 4,
        name: "Porkchop w/ rice & salad",
        price: 79,
        description: "Grilled porkchop with rice and salad.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-drumstick-bite"
    },
    {
        id: 5,
        name: "Hot & spicy chicken w/ drinks",
        price: 110,
        description: "Spicy chicken meal with drinks.",
        category: "best",
        bestSeller: true,
        icon: "fas fa-pepper-hot"
    },
    {
        id: 6,
        name: "Chicken Roll Sushi",
        price: 145,
        description: "Crispy chicken roll wrapped in sushi rice.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 7,
        name: "Hot Roll Sushi",
        price: 149,
        description: "Spicy shrimp tempura sushi roll.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 8,
        name: "Softshell Mango Sushi",
        price: 149,
        description: "Softshell crab with mango sushi.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 9,
        name: "Mango Sushi",
        price: 69,
        description: "Sweet and fresh mango sushi.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 10,
        name: "Onigiri",
        price: 120,
        description: "Japanese rice ball wrapped in nori.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 11,
        name: "Kimbap",
        price: 89,
        description: "Korean-style maki rolls.",
        category: "sushi",
        bestSeller: false,
        icon: "fas fa-sushi"
    },
    {
        id: 12,
        name: "Pork Sisig",
        price: 129,
        description: "Sizzling pork sisig topped with egg.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-fire"
    },
    {
        id: 13,
        name: "Pepper Steak",
        price: 129,
        description: "Beef steak cooked with pepper sauce.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-steak"
    },
    {
        id: 14,
        name: "Kimchi Pork",
        price: 129,
        description: "Sizzling pork cooked with kimchi.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-fire"
    },
    {
        id: 15,
        name: "Teriyaki",
        price: 129,
        description: "Sweet glazed teriyaki meat.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-bowl-food"
    },
    {
        id: 16,
        name: "Tonkatsu",
        price: 129,
        description: "Breaded fried pork cutlet.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-cutlet"
    },
    {
        id: 17,
        name: "Spicy Garlic Shrimp",
        price: 129,
        description: "Shrimp cooked in spicy garlic butter.",
        category: "sizzling",
        bestSeller: false,
        icon: "fas fa-shrimp"
    }
];

// Save to localStorage for cart page access
if (typeof window !== 'undefined') {
    localStorage.setItem('kfoods-products', JSON.stringify(products));
}
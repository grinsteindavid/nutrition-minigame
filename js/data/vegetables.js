/**
 * NutriChoice Vegetables Database
 * Contains nutritional information for 20 vegetables
 * All values are based on 100g serving size
 */

const vegetablesData = [
    {
        id: 1,
        name: "Broccoli",
        category: "vegetable",
        calories: 34,
        nutrients: {
            protein: 2.8,
            carbs: 6.6,
            fat: 0.4,
            fiber: 2.6,
            vitaminA: 3.1,
            vitaminC: 89.2,
            vitaminD: 0,
            vitaminE: 0.8,
            calcium: 4.7,
            iron: 0.7,
            potassium: 7.1,
            magnesium: 2.1,
            omega3: 0,
            antioxidants: 8
        },
        description: "Nutrient-dense cruciferous vegetable high in vitamins C and K. Broccoli contains compounds that may help prevent cancer and support detoxification.",
        image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Spinach",
        category: "vegetable",
        calories: 23,
        nutrients: {
            protein: 2.9,
            carbs: 3.6,
            fat: 0.4,
            fiber: 2.2,
            vitaminA: 46.9,
            vitaminC: 28.1,
            vitaminD: 0,
            vitaminE: 2.0,
            calcium: 9.9,
            iron: 2.7,
            potassium: 5.5,
            magnesium: 7.9,
            omega3: 0.1,
            antioxidants: 9
        },
        description: "Leafy green vegetable packed with iron, calcium, and antioxidants. Spinach supports bone health, improves eye health, and boosts immunity.",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Kale",
        category: "vegetable",
        calories: 49,
        nutrients: {
            protein: 4.3,
            carbs: 8.8,
            fat: 0.9,
            fiber: 3.6,
            vitaminA: 96.5,
            vitaminC: 120.0,
            vitaminD: 0,
            vitaminE: 1.5,
            calcium: 15.0,
            iron: 1.5,
            potassium: 4.5,
            magnesium: 3.4,
            omega3: 0.2,
            antioxidants: 10
        },
        description: "Superfood leafy green that's loaded with nutrients. Kale is one of the most nutrient-dense foods on the planet, supporting overall health.",
        image: "https://images.unsplash.com/photo-1610048899856-fb721d683cb4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Carrots",
        category: "vegetable",
        calories: 41,
        nutrients: {
            protein: 0.9,
            carbs: 9.6,
            fat: 0.2,
            fiber: 2.8,
            vitaminA: 104.1,
            vitaminC: 5.9,
            vitaminD: 0,
            vitaminE: 0.7,
            calcium: 3.3,
            iron: 0.3,
            potassium: 3.2,
            magnesium: 1.2,
            omega3: 0,
            antioxidants: 7
        },
        description: "Orange root vegetables exceptionally high in beta-carotene. Carrots promote eye health, support immune function, and provide antioxidant benefits.",
        image: "https://images.unsplash.com/photo-1598170845058-c2eec1a2f1f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Bell Peppers",
        category: "vegetable",
        calories: 30,
        nutrients: {
            protein: 1.0,
            carbs: 6.0,
            fat: 0.3,
            fiber: 2.1,
            vitaminA: 15.7,
            vitaminC: 127.7,
            vitaminD: 0,
            vitaminE: 0.4,
            calcium: 0.9,
            iron: 0.4,
            potassium: 2.1,
            magnesium: 1.0,
            omega3: 0,
            antioxidants: 8
        },
        description: "Colorful, crunchy vegetables with high vitamin C content. Bell peppers support skin health, boost immunity, and provide a variety of antioxidants.",
        image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Sweet Potato",
        category: "vegetable",
        calories: 86,
        nutrients: {
            protein: 1.6,
            carbs: 20,
            fat: 0.1,
            fiber: 3,
            vitaminA: 384,
            vitaminC: 33,
            vitaminD: 0,
            vitaminE: 4,
            calcium: 3,
            iron: 3,
            potassium: 14,
            magnesium: 6,
            omega3: 0,
            antioxidants: 8
        },
        description: "Starchy root vegetable with vibrant orange flesh rich in beta-carotene. Sweet potatoes support eye and gut health while providing steady energy.",
        image: "https://images.unsplash.com/photo-1596097635121-14b70a3ec63a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Tomatoes",
        category: "vegetable",
        calories: 18,
        nutrients: {
            protein: 0.9,
            carbs: 3.9,
            fat: 0.2,
            fiber: 1.2,
            vitaminA: 17,
            vitaminC: 21,
            vitaminD: 0,
            vitaminE: 4,
            calcium: 1,
            iron: 1,
            potassium: 6,
            magnesium: 2,
            omega3: 0,
            antioxidants: 9
        },
        description: "Juicy fruits botanically, but culinary vegetables rich in lycopene. Tomatoes support heart health and have cancer-fighting properties.",
        image: "https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Cauliflower",
        category: "vegetable",
        calories: 25,
        nutrients: {
            protein: 2,
            carbs: 5,
            fat: 0.3,
            fiber: 2.5,
            vitaminA: 0,
            vitaminC: 77,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 2,
            iron: 2,
            potassium: 9,
            magnesium: 3,
            omega3: 0,
            antioxidants: 7
        },
        description: "Versatile cruciferous vegetable with impressive nutrient content. Cauliflower supports detoxification and has anti-inflammatory properties.",
        image: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 9,
        name: "Cucumber",
        category: "vegetable",
        calories: 15,
        nutrients: {
            protein: 0.7,
            carbs: 3.6,
            fat: 0.1,
            fiber: 0.5,
            vitaminA: 2,
            vitaminC: 4,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 2,
            iron: 1,
            potassium: 4,
            magnesium: 3,
            omega3: 0,
            antioxidants: 3
        },
        description: "Refreshing vegetable with high water content. Cucumbers help with hydration, digestion, and have cooling anti-inflammatory properties.",
        image: "https://images.unsplash.com/photo-1568584711271-6c929fb49b60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 10,
        name: "Garlic",
        category: "vegetable",
        calories: 42,
        nutrients: {
            protein: 1.8,
            carbs: 9.1,
            fat: 0.2,
            fiber: 2.1,
            vitaminA: 0,
            vitaminC: 31,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 18,
            iron: 6,
            potassium: 12,
            magnesium: 7,
            omega3: 0,
            antioxidants: 9
        },
        description: "Potent herb with powerful medicinal properties. Garlic boosts immunity, reduces blood pressure, and has antimicrobial benefits.",
        image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    // Adding 10 more vegetables to reach 20 total
    {
        id: 11,
        name: "Asparagus",
        category: "vegetable",
        calories: 20,
        nutrients: {
            protein: 2.2,
            carbs: 3.9,
            fat: 0.1,
            fiber: 2.1,
            vitaminA: 15,
            vitaminC: 6,
            vitaminD: 0,
            vitaminE: 2,
            calcium: 2,
            iron: 2,
            potassium: 6,
            magnesium: 3,
            omega3: 0,
            antioxidants: 7
        },
        description: "Nutrient-dense spring vegetable with unique flavor. Asparagus supports digestive health, provides folate for cellular function, and acts as a natural diuretic.",
        image: "https://images.unsplash.com/photo-1605291545263-2c459ad9a75b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 12,
        name: "Brussels Sprouts",
        category: "vegetable",
        calories: 43,
        nutrients: {
            protein: 3.4,
            carbs: 9,
            fat: 0.3,
            fiber: 3.8,
            vitaminA: 15,
            vitaminC: 85,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 4,
            iron: 2,
            potassium: 8,
            magnesium: 4,
            omega3: 0,
            antioxidants: 9
        },
        description: "Mini cabbage-like cruciferous vegetables with sulfur compounds. Brussels sprouts support detoxification, reduce inflammation, and may protect against cancer.",
        image: "https://images.unsplash.com/photo-1438118907704-7718ee9a191a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 13,
        name: "Zucchini",
        category: "vegetable",
        calories: 17,
        nutrients: {
            protein: 1.2,
            carbs: 3.1,
            fat: 0.3,
            fiber: 1,
            vitaminA: 4,
            vitaminC: 29,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 2,
            iron: 1,
            potassium: 8,
            magnesium: 3,
            omega3: 0,
            antioxidants: 5
        },
        description: "Versatile summer squash with high water content. Zucchini supports healthy digestion, provides antioxidants, and has anti-inflammatory properties.",
        image: "https://images.unsplash.com/photo-1587334207259-abe503a57c1c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 14,
        name: "Onion",
        category: "vegetable",
        calories: 40,
        nutrients: {
            protein: 1.1,
            carbs: 9.3,
            fat: 0.1,
            fiber: 1.7,
            vitaminA: 0,
            vitaminC: 7,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 2,
            iron: 1,
            potassium: 3,
            magnesium: 2,
            omega3: 0,
            antioxidants: 7
        },
        description: "Pungent bulb vegetable rich in sulfur compounds. Onions have antibacterial properties, support heart health, and may help control blood sugar levels.",
        image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 15,
        name: "Mushrooms",
        category: "vegetable",
        calories: 22,
        nutrients: {
            protein: 3.1,
            carbs: 3.3,
            fat: 0.3,
            fiber: 1,
            vitaminA: 0,
            vitaminC: 2,
            vitaminD: 7,
            vitaminE: 0,
            calcium: 1,
            iron: 4,
            potassium: 9,
            magnesium: 2,
            omega3: 0,
            antioxidants: 6
        },
        description: "Fungi with unique nutritional profile and umami flavor. Mushrooms support immune function, provide vitamin D, and have anti-inflammatory properties.",
        image: "https://images.unsplash.com/photo-1552825896-a67eca653b49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 16,
        name: "Eggplant",
        category: "vegetable",
        calories: 25,
        nutrients: {
            protein: 1,
            carbs: 6,
            fat: 0.2,
            fiber: 3,
            vitaminA: 1,
            vitaminC: 3,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 1,
            iron: 1,
            potassium: 6,
            magnesium: 3,
            omega3: 0,
            antioxidants: 6
        },
        description: "Purple nightshade vegetable rich in anthocyanins. Eggplants support heart health, help regulate blood sugar, and have antioxidant properties.",
        image: "https://images.unsplash.com/photo-1640271443625-3276ed8f62b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 17,
        name: "Cabbage",
        category: "vegetable",
        calories: 25,
        nutrients: {
            protein: 1.3,
            carbs: 5.8,
            fat: 0.1,
            fiber: 2.5,
            vitaminA: 2,
            vitaminC: 36,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 4,
            iron: 1,
            potassium: 6,
            magnesium: 2,
            omega3: 0,
            antioxidants: 7
        },
        description: "Cruciferous vegetable with anti-inflammatory properties. Cabbage supports digestive health, may lower cholesterol, and helps with detoxification.",
        image: "https://images.unsplash.com/photo-1551898263-d0923fe533cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 18,
        name: "Beets",
        category: "vegetable",
        calories: 43,
        nutrients: {
            protein: 1.6,
            carbs: 10,
            fat: 0.2,
            fiber: 2.8,
            vitaminA: 1,
            vitaminC: 5,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 2,
            iron: 8,
            potassium: 10,
            magnesium: 3,
            omega3: 0,
            antioxidants: 8
        },
        description: "Colorful root vegetables rich in nitrates and betalains. Beets support heart health, improve exercise performance, and have anti-inflammatory benefits.",
        image: "https://images.unsplash.com/photo-1593105522588-3c5b83e47f96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 19,
        name: "Artichoke",
        category: "vegetable",
        calories: 47,
        nutrients: {
            protein: 3.3,
            carbs: 10.5,
            fat: 0.2,
            fiber: 5.4,
            vitaminA: 1,
            vitaminC: 12,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 4,
            iron: 3,
            potassium: 9,
            magnesium: 6,
            omega3: 0,
            antioxidants: 9
        },
        description: "Thistle-like vegetable with one of the highest antioxidant contents. Artichokes support liver health, aid digestion, and may help lower cholesterol.",
        image: "https://images.unsplash.com/photo-1548771272-8a79bcf73896?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 20,
        name: "Celery",
        category: "vegetable",
        calories: 16,
        nutrients: {
            protein: 0.7,
            carbs: 3,
            fat: 0.2,
            fiber: 1.6,
            vitaminA: 4,
            vitaminC: 3,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 4,
            iron: 1,
            potassium: 8,
            magnesium: 2,
            omega3: 0,
            antioxidants: 6
        },
        description: "Crunchy stalks with high water content and minimal calories. Celery has anti-inflammatory compounds, supports digestion, and may help reduce blood pressure.",
        image: "https://images.unsplash.com/photo-1594063596316-47f8bfcc5b62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    }
];

export default vegetablesData;

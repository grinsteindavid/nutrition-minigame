/**
 * NutriChoice Grains Database
 * Contains nutritional information for 20 grains
 * All values are based on 100g serving size
 */

const grainsData = [
    {
        id: 1,
        name: "Quinoa",
        category: "grain",
        calories: 368,
        nutrients: {
            protein: 14.1,
            carbs: 64.2,
            fat: 6.1,
            fiber: 7.0,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1.2,
            calcium: 4.7,
            iron: 4.6,
            potassium: 5.6,
            magnesium: 19.7,
            omega3: 0.2,
            antioxidants: 4
        },
        description: "Ancient grain that's actually a seed, containing all nine essential amino acids. Quinoa provides sustained energy and supports overall nutrition.",
        image: "./img/data-food/1-grain.jpg"
    },
    {
        id: 2,
        name: "Brown Rice",
        category: "grain",
        calories: 370,
        nutrients: {
            protein: 7.9,
            carbs: 77.2,
            fat: 2.9,
            fiber: 3.5,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1.2,
            calcium: 2.3,
            iron: 1.8,
            potassium: 2.5,
            magnesium: 11.3,
            omega3: 0.1,
            antioxidants: 3
        },
        description: "Whole grain with outer bran layer intact, providing more nutrients than white rice. Brown rice supports digestive health and provides steady energy.",
        image: "./img/data-food/2-grain.jpg"
    },
    {
        id: 3,
        name: "Oats",
        category: "grain",
        calories: 389,
        nutrients: {
            protein: 16.9,
            carbs: 66.3,
            fat: 6.9,
            fiber: 10.6,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0.4,
            calcium: 5.4,
            iron: 4.7,
            potassium: 4.3,
            magnesium: 17.7,
            omega3: 0.1,
            antioxidants: 5
        },
        description: "Whole grain rich in beta-glucan fiber. Oats help lower cholesterol, stabilize blood sugar, and promote feelings of fullness.",
        image: "./img/data-food/3-grain.jpg"
    },
    {
        id: 4,
        name: "Whole Wheat Bread",
        category: "grain",
        calories: 247,
        nutrients: {
            protein: 9.7,
            carbs: 46.7,
            fat: 3.4,
            fiber: 6.8,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 2,
            calcium: 7.2,
            iron: 2.7,
            potassium: 2.3,
            magnesium: 7.6,
            omega3: 0.1,
            antioxidants: 2
        },
        description: "Bread made from whole wheat flour containing all parts of the grain. Whole wheat bread provides more fiber and nutrients than refined bread.",
        image: "./img/data-food/4-grain.jpg"
    },
    {
        id: 5,
        name: "Barley",
        category: "grain",
        calories: 352,
        nutrients: {
            protein: 12.5,
            carbs: 73.5,
            fat: 2.3,
            fiber: 17.3,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0.6,
            calcium: 3.3,
            iron: 3.6,
            potassium: 4.5,
            magnesium: 13.3,
            omega3: 0.1,
            antioxidants: 4
        },
        description: "Ancient grain with a chewy texture and nutty flavor. Barley helps regulate blood sugar, reduce cholesterol, and support digestive health.",
        image: "./img/placeholder.png"
    },
    {
        id: 6,
        name: "Buckwheat",
        category: "grain",
        calories: 343,
        nutrients: {
            protein: 13.3,
            carbs: 71.5,
            fat: 3.4,
            fiber: 10.0,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 1.8,
            iron: 2.2,
            potassium: 4.6,
            magnesium: 23.1,
            omega3: 0.1,
            antioxidants: 6
        },
        description: "Despite its name, buckwheat is not wheat but a seed related to rhubarb. Buckwheat is gluten-free and rich in minerals and antioxidants.",
        image: "./img/data-food/6-grain.jpg"
    },
    {
        id: 7,
        name: "Corn",
        category: "grain",
        calories: 365,
        nutrients: {
            protein: 9.4,
            carbs: 74.3,
            fat: 4.7,
            fiber: 7.3,
            vitaminA: 9,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1.2,
            calcium: 0.7,
            iron: 2.7,
            potassium: 2.9,
            magnesium: 12.7,
            omega3: 0,
            antioxidants: 6
        },
        description: "Versatile grain that's technically a vegetable. Corn provides antioxidants lutein and zeaxanthin that support eye health and vision.",
        image: "./img/data-food/7-grain.jpg"
    },
    {
        id: 8,
        name: "Whole Grain Pasta",
        category: "grain",
        calories: 352,
        nutrients: {
            protein: 13.1,
            carbs: 71.4,
            fat: 2.5,
            fiber: 10.7,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 3.4,
            iron: 3.8,
            potassium: 2.8,
            magnesium: 5.3,
            omega3: 0,
            antioxidants: 2
        },
        description: "Pasta made from whole wheat flour with more fiber and nutrients than refined pasta. Whole grain pasta provides steady energy and better satiety.",
        image: "./img/placeholder.png"
    },
    {
        id: 9,
        name: "Bulgur",
        category: "grain",
        calories: 342,
        nutrients: {
            protein: 12.3,
            carbs: 75.9,
            fat: 1.3,
            fiber: 12.5,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 3.5,
            iron: 3.4,
            potassium: 4.1,
            magnesium: 16.4,
            omega3: 0,
            antioxidants: 3
        },
        description: "Parboiled cracked wheat that cooks quickly. Bulgur has a low glycemic index and supports digestive health with its fiber content.",
        image: "./img/data-food/9-grain.jpg"
    },
    {
        id: 10,
        name: "Millet",
        category: "grain",
        calories: 378,
        nutrients: {
            protein: 11.0,
            carbs: 72.8,
            fat: 4.2,
            fiber: 8.5,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0.1,
            calcium: 0.8,
            iron: 3.0,
            potassium: 2.3,
            magnesium: 11.4,
            omega3: 0,
            antioxidants: 3
        },
        description: "Small, gluten-free grain that's easily digestible. Millet can help lower blood sugar and cholesterol while providing protective antioxidants.",
        image: "./img/placeholder.png"
    },
    // Adding 10 more grains to reach 20 total
    {
        id: 11,
        name: "Amaranth",
        category: "grain",
        calories: 102,
        nutrients: {
            protein: 3.8,
            carbs: 18.7,
            fat: 1.6,
            fiber: 2.1,
            vitaminA: 0,
            vitaminC: 4,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 5,
            iron: 15,
            potassium: 10,
            magnesium: 16,
            omega3: 0,
            antioxidants: 4
        },
        description: "Ancient pseudograin with complete protein and high lysine content. Amaranth supports bone health, reduces inflammation, and helps repair tissues.",
        image: "./img/placeholder.png"
    },
    {
        id: 12,
        name: "Rye",
        category: "grain",
        calories: 83,
        nutrients: {
            protein: 2.3,
            carbs: 18.6,
            fat: 0.4,
            fiber: 3.7,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 3,
            iron: 3,
            potassium: 5,
            magnesium: 6,
            omega3: 0,
            antioxidants: 5
        },
        description: "Grain with high fiber content that keeps you feeling full longer. Rye has a lower glycemic index than wheat and may help with weight management.",
        image: "./img/placeholder.png"
    },
    {
        id: 13,
        name: "Farro",
        category: "grain",
        calories: 127,
        nutrients: {
            protein: 5.2,
            carbs: 26.6,
            fat: 0.9,
            fiber: 5.3,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 2,
            iron: 6,
            potassium: 4,
            magnesium: 5,
            omega3: 0,
            antioxidants: 3
        },
        description: "Ancient Mediterranean grain with nutty flavor and chewy texture. Farro is high in fiber and protein, supports heart health, and aids in digestion.",
        image: "./img/placeholder.png"
    },
    {
        id: 14,
        name: "Spelt",
        category: "grain",
        calories: 87,
        nutrients: {
            protein: 3.2,
            carbs: 17.1,
            fat: 0.6,
            fiber: 3.4,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 2,
            iron: 4,
            potassium: 6,
            magnesium: 9,
            omega3: 0,
            antioxidants: 4
        },
        description: "Ancient wheat variety with more nutrients and less gluten than modern wheat. Spelt supports immune function and helps with energy production.",
        image: "./img/placeholder.png"
    },
    {
        id: 15,
        name: "Teff",
        category: "grain",
        calories: 101,
        nutrients: {
            protein: 3.5,
            carbs: 20,
            fat: 0.7,
            fiber: 2.8,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 18,
            iron: 16,
            potassium: 8,
            magnesium: 18,
            omega3: 0,
            antioxidants: 4
        },
        description: "Tiny grain with high mineral content and resistant starch. Teff helps manage blood sugar, supports bone health, and aids in digestion.",
        image: "./img/placeholder.png"
    },
    {
        id: 16,
        name: "Wild Rice",
        category: "grain",
        calories: 101,
        nutrients: {
            protein: 4,
            carbs: 21,
            fat: 0.3,
            fiber: 2,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 1,
            iron: 2,
            potassium: 4,
            magnesium: 6,
            omega3: 0,
            antioxidants: 5
        },
        description: "Aquatic grass seed with more protein and fewer carbs than other rice varieties. Wild rice has antioxidant activity and supports heart health.",
        image: "./img/placeholder.png"
    },
    {
        id: 17,
        name: "Sorghum",
        category: "grain",
        calories: 112,
        nutrients: {
            protein: 3.3,
            carbs: 25.2,
            fat: 0.6,
            fiber: 2.7,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 2,
            iron: 5,
            potassium: 8,
            magnesium: 4,
            omega3: 0,
            antioxidants: 7
        },
        description: "Ancient grain that's naturally gluten-free with antioxidant properties. Sorghum helps maintain healthy gut microbiome and stabilizes blood sugar.",
        image: "./img/placeholder.png"
    },
    {
        id: 18,
        name: "Freekeh",
        category: "grain",
        calories: 114,
        nutrients: {
            protein: 4.3,
            carbs: 22.8,
            fat: 0.8,
            fiber: 4.5,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0,
            calcium: 3,
            iron: 7,
            potassium: 8,
            magnesium: 5,
            omega3: 0,
            antioxidants: 5
        },
        description: "Young green wheat that's harvested and roasted for a smoky flavor. Freekeh has more protein and fiber than mature wheat and supports eye health.",
        image: "./img/placeholder.png"
    },
    {
        id: 19,
        name: "Kamut",
        category: "grain",
        calories: 127,
        nutrients: {
            protein: 4.9,
            carbs: 26.6,
            fat: 0.7,
            fiber: 3.7,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 1,
            calcium: 1,
            iron: 4,
            potassium: 6,
            magnesium: 8,
            omega3: 0,
            antioxidants: 5
        },
        description: "Ancient wheat variety with larger grains and more nutrients. Kamut has anti-inflammatory properties and may be easier to digest than modern wheat.",
        image: "./img/placeholder.png"
    },
    {
        id: 20,
        name: "Rice Bran",
        category: "grain",
        calories: 96,
        nutrients: {
            protein: 4.1,
            carbs: 14.8,
            fat: 3.8,
            fiber: 5.4,
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 15,
            calcium: 2,
            iron: 12,
            potassium: 18,
            magnesium: 22,
            omega3: 1,
            antioxidants: 9
        },
        description: "Nutrient-rich outer layer of rice grain that's removed to make white rice. Rice bran contains antioxidants and may help lower cholesterol and blood pressure.",
        image: "./img/placeholder.png"
    }
];

export default grainsData;

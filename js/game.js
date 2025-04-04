/**
 * NutriChoice - Game Logic
 * Handles the core game mechanics for the nutrition minigame
 */

class NutritionGame {
    constructor() {
        this.selectedFoods = [];
        this.maxSelections = 3;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.initNutrientTargets();
        
        // Display high score
        document.getElementById('highScore').textContent = this.highScore;
    }

    /**
     * Initialize target values for different nutrients
     * These represent ideal daily intake percentages to be met
     */
    initNutrientTargets() {
        this.nutrientTargets = {
            protein: 50,         // 50g protein target
            carbs: 275,          // 275g carbs target
            fat: 78,             // 78g fat target
            fiber: 28,           // 28g fiber target
            vitaminA: 900,       // 900 μg RAE 
            vitaminC: 90,        // 90mg 
            vitaminD: 20,        // 20μg
            vitaminE: 15,        // 15mg
            calcium: 1200,       // 1200mg
            iron: 18,            // 18mg
            potassium: 4700,     // 4700mg
            magnesium: 420,      // 420mg
            omega3: 1.6,         // 1.6g
            antioxidants: 40     // Arbitrary scale for antioxidants
        };

        // Scaling factors for nutrient percentage calculations
        // These convert our 0-100 scale values in the food database to actual units
        this.nutrientScaleFactors = {
            protein: 0.5,
            carbs: 2.75,
            fat: 0.78,
            fiber: 0.28,
            vitaminA: 9,
            vitaminC: 0.9,
            vitaminD: 0.2,
            vitaminE: 0.15,
            calcium: 12,
            iron: 0.18,
            potassium: 47,
            magnesium: 4.2,
            omega3: 0.016,
            antioxidants: 0.4
        };
    }

    /**
     * Add a food to the selected foods list
     * @param {Object} food - Food object to add
     * @returns {Boolean} - Whether the food was successfully added
     */
    addFood(food) {
        if (this.selectedFoods.length >= this.maxSelections) {
            return false;
        }
        
        // Check if food is already selected - must match both ID AND category
        if (this.selectedFoods.some(f => f.id === food.id && f.category === food.category)) {
            return false;
        }
        
        this.selectedFoods.push(food);
        return true;
    }

    /**
     * Remove a food from the selected foods list
     * @param {Number} foodId - ID of food to remove
     * @param {String} category - Category of food to remove (optional)
     */
    removeFood(foodId, category) {
        if (category) {
            // If a category is provided, remove only the food with matching ID AND category
            this.selectedFoods = this.selectedFoods.filter(food => !(food.id === foodId && food.category === category));
        } else {
            // Backward compatibility: remove all foods with this ID (old behavior)
            this.selectedFoods = this.selectedFoods.filter(food => food.id !== foodId);
        }
    }

    /**
     * Calculate the nutritional score based on the selected foods
     * @returns {Object} - Results object with score, covered nutrients, missing nutrients, etc.
     */
    calculateScore() {
        if (this.selectedFoods.length === 0) {
            return {
                score: 0,
                coveredNutrients: [],
                missingNutrients: Object.keys(this.nutrientTargets),
                nutritionData: {}
            };
        }

        // Calculate the total nutrients from all selected foods
        const totalNutrients = {};
        Object.keys(this.nutrientTargets).forEach(nutrient => {
            totalNutrients[nutrient] = this.selectedFoods.reduce((total, food) => {
                return total + (food.nutrients[nutrient] * this.nutrientScaleFactors[nutrient]);
            }, 0);
        });

        // Calculate percentage of targets met, assuming this is one of three daily meals
        // We'll scale by a factor of 3 to make a more realistic score, but cap at 100%
        const percentageMet = {};
        const mealScaleFactor = 3; // Assuming 3 meals per day
        Object.keys(this.nutrientTargets).forEach(nutrient => {
            // Scale the percentage by the meal factor but cap at 100%
            percentageMet[nutrient] = Math.min(100, Math.round((totalNutrients[nutrient] / this.nutrientTargets[nutrient]) * 100 * mealScaleFactor));
        });

        // Determine covered and missing nutrients
        // We'll adjust the threshold to be more realistic for a single meal
        const coveredNutrients = [];
        const missingNutrients = [];
        const coverageThreshold = 30; // This threshold applies to the already-scaled percentages
        
        Object.keys(percentageMet).forEach(nutrient => {
            if (percentageMet[nutrient] >= coverageThreshold) {
                coveredNutrients.push({
                    name: nutrient,
                    percentage: percentageMet[nutrient]
                });
            } else {
                missingNutrients.push({
                    name: nutrient,
                    percentage: percentageMet[nutrient]
                });
            }
        });

        // Calculate overall score (average of all nutrient percentages)
        const overallScore = Math.round(
            Object.values(percentageMet).reduce((sum, value) => sum + value, 0) / 
            Object.keys(percentageMet).length
        );

        // Calculate macronutrient breakdown
        const totalCalories = this.selectedFoods.reduce((total, food) => total + food.calories, 0);
        
        // Calculate macros using the same percentage of daily recommended value approach 
        // and apply the same scaling as with other nutrients (assuming this is one meal of three)
        const macros = {
            protein: Math.min(100, Math.round((totalNutrients.protein / this.nutrientTargets.protein) * 100 * mealScaleFactor)),
            carbs: Math.min(100, Math.round((totalNutrients.carbs / this.nutrientTargets.carbs) * 100 * mealScaleFactor)),
            fat: Math.min(100, Math.round((totalNutrients.fat / this.nutrientTargets.fat) * 100 * mealScaleFactor)),
            fiber: Math.min(100, Math.round((totalNutrients.fiber / this.nutrientTargets.fiber) * 100 * mealScaleFactor))
        };
        
        // Also store traditional macronutrient ratios for reference (as % of calories)
        const macroRatios = {
            protein: Math.round((totalNutrients.protein * 4 / totalCalories) * 100),
            carbs: Math.round((totalNutrients.carbs * 4 / totalCalories) * 100),
            fat: Math.round((totalNutrients.fat * 9 / totalCalories) * 100)
        };

        // Update high score if needed
        if (overallScore > this.highScore) {
            this.highScore = overallScore;
            localStorage.setItem('highScore', this.highScore);
            document.getElementById('highScore').textContent = this.highScore;
        }

        return {
            score: overallScore,
            totalCalories: totalCalories,
            coveredNutrients: coveredNutrients,
            missingNutrients: missingNutrients,
            percentageMet: percentageMet,
            macros: macros,
            macroRatios: macroRatios
        };
    }

    /**
     * Get nutrient name in a more readable format
     * @param {String} nutrient - Nutrient key
     * @returns {String} - Formatted nutrient name
     */
    formatNutrientName(nutrient) {
        const nameMap = {
            'protein': 'Protein',
            'carbs': 'Carbohydrates',
            'fat': 'Fats',
            'fiber': 'Fiber',
            'vitaminA': 'Vitamin A',
            'vitaminC': 'Vitamin C',
            'vitaminD': 'Vitamin D',
            'vitaminE': 'Vitamin E',
            'calcium': 'Calcium',
            'iron': 'Iron',
            'potassium': 'Potassium',
            'magnesium': 'Magnesium',
            'omega3': 'Omega-3 Fatty Acids',
            'antioxidants': 'Antioxidants'
        };
        
        return nameMap[nutrient] || nutrient;
    }

    /**
     * Generate a message based on the nutrition score
     * @param {Number} score - The overall nutrition score
     * @returns {String} - A message about the nutrition score
     */
    getScoreMessage(score) {
        if (score >= 90) {
            return "Outstanding nutrition balance! You're a nutrition expert!";
        } else if (score >= 75) {
            return "Great job! Your meal has excellent nutritional value!";
        } else if (score >= 60) {
            return "Good choices! Your meal covers many essential nutrients.";
        } else if (score >= 40) {
            return "Not bad! You've got the basics covered, but there's room for improvement.";
        } else if (score >= 20) {
            return "You've made a start, but this meal is missing many nutrients.";
        } else {
            return "Your meal needs work. Try adding more variety of foods!";
        }
    }

    /**
     * Reset the game state
     */
    reset() {
        this.selectedFoods = [];
    }
}

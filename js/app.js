/**
 * NutriChoice - Main Application
 * Handles UI interactions and implements gameplay functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the nutrition game
    const game = new NutritionGame();
    
    // DOM elements
    const startGameBtn = document.getElementById('startGame');
    const instructionsSection = document.getElementById('instructions');
    const gameAreaSection = document.getElementById('gameArea');
    const resultsAreaSection = document.getElementById('resultsArea');
    const selectedFoodsContainer = document.getElementById('selectedFoods');
    const selectionCountElement = document.getElementById('selectionCount');
    const analyzeButton = document.getElementById('analyzeButton');
    const tryAgainButton = document.getElementById('tryAgainButton');
    const shareButton = document.getElementById('shareButton');
    const addToMealButton = document.getElementById('addToMealButton');
    
    // Check for shared meal parameters in the URL
    checkSharedMealParameters();
    
    // Initialize the UI
    initializeUI();
    
    /**
     * Initialize UI components and load food data
     */
    function initializeUI() {
        // Populate food grids
        populateFoodGrids();
        
        // Event listeners
        startGameBtn.addEventListener('click', startGame);
        analyzeButton.addEventListener('click', analyzeMeal);
        tryAgainButton.addEventListener('click', resetGame);
        shareButton.addEventListener('click', shareMeal);
        
        // Initialize tooltips and popovers if using Bootstrap's JavaScript components
        if (typeof bootstrap !== 'undefined') {
            const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
        }
    }
    
    /**
     * Start the game by showing the game area and hiding instructions
     */
    function startGame() {
        instructionsSection.classList.add('d-none');
        gameAreaSection.classList.remove('d-none');
        resultsAreaSection.classList.add('d-none');
    }
    
    /**
     * Populate the food grids with items from the food database
     */
    function populateFoodGrids() {
        // All foods grid
        const allFoodsGrid = document.getElementById('allFoodsGrid');
        populateGrid(allFoodsGrid, foodData);
        
        // Populate category-specific grids
        const categories = ['fruits', 'vegetables', 'proteins', 'grains', 'dairy'];
        const singularMap = {
            'fruits': 'fruit',
            'vegetables': 'vegetable',
            'proteins': 'protein',
            'grains': 'grain',
            'dairy': 'dairy'  // dairy is already singular in our database
        };
        
        categories.forEach(category => {
            const grid = document.getElementById(`${category}Grid`);
            const filteredFoods = foodData.filter(food => food.category === singularMap[category]);
            populateGrid(grid, filteredFoods);
        });
    }
    
    /**
     * Populate a grid with food items
     * @param {HTMLElement} grid - The grid element to populate
     * @param {Array} foods - Array of food objects
     */
    function populateGrid(grid, foods) {
        grid.innerHTML = '';
        
        foods.forEach(food => {
            const foodItem = document.createElement('div');
            foodItem.className = 'col-md-4 col-lg-3';
            foodItem.innerHTML = `
                <div class="food-item" data-food-id="${food.id}" data-food-category="${food.category}">
                    <img src="${food.image}" alt="${food.name}" class="food-image">
                    <div class="food-info">
                        <h3 class="food-name">${food.name}</h3>
                        <span class="food-category category-${food.category}">${food.category.charAt(0).toUpperCase() + food.category.slice(1)}</span>
                        <p class="food-calories"><i class="fas fa-fire"></i> ${food.calories} calories</p>
                    </div>
                </div>
            `;
            
            // Add click event for food selection
            const foodItemDiv = foodItem.querySelector('.food-item');
            foodItemDiv.addEventListener('click', () => showFoodInfo(food));
            
            grid.appendChild(foodItem);
        });
    }
    
    /**
     * Display detailed information about a food in a modal
     * @param {Object} food - The food object to display
     */
    function showFoodInfo(food) {
        const modalTitle = document.getElementById('foodInfoModalLabel');
        const modalBody = document.getElementById('foodInfoModalBody');
        
        modalTitle.textContent = food.name;
        
        // Create nutrient table with appropriate units
        let nutrientHtml = '';
        for (const [key, value] of Object.entries(food.nutrients)) {
            if (value > 0) {
                // Get the appropriate unit for each nutrient type
                let unitDisplay = '';
                
                // Macronutrients in grams
                if (['protein', 'carbs', 'fat', 'fiber', 'omega3'].includes(key)) {
                    unitDisplay = `${value}g`;
                } 
                // Vitamins and minerals as % of daily value
                else if (['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'calcium', 'iron', 'potassium', 'magnesium'].includes(key)) {
                    unitDisplay = `${value}% DV`;
                } 
                // Antioxidants on a 0-10 scale
                else if (key === 'antioxidants') {
                    unitDisplay = `${value}/10`;
                }
                // Default fallback
                else {
                    unitDisplay = value;
                }
                
                nutrientHtml += `
                    <tr>
                        <td>${game.formatNutrientName(key)}</td>
                        <td>${unitDisplay}</td>
                    </tr>
                `;
            }
        }
        
        modalBody.innerHTML = `
            <img src="${food.image}" alt="${food.name}" class="food-modal-image">
            <p>${food.description}</p>
            <h4>Nutrition Facts</h4>
            <p><strong>Calories:</strong> ${food.calories}</p>
            <table class="nutrient-table">
                <thead>
                    <tr>
                        <th>Nutrient</th>
                        <th>Value (per 100g serving)</th>
                    </tr>
                </thead>
                <tbody>
                    ${nutrientHtml}
                </tbody>
            </table>
        `;
        
        // Update add to meal button
        // Check both ID and category to properly identify selected foods across categories
        const isAlreadySelected = game.selectedFoods.some(f => f.id === food.id && f.category === food.category);
        const isFull = game.selectedFoods.length >= game.maxSelections;
        
        addToMealButton.disabled = isAlreadySelected || isFull;
        addToMealButton.textContent = isAlreadySelected ? 'Already in Meal' : 'Add to Meal';
        
        // Add event listener to add food to meal
        addToMealButton.onclick = () => {
            addFoodToMeal(food);
            const modal = bootstrap.Modal.getInstance(document.getElementById('foodInfoModal'));
            modal.hide();
        };
        
        // Show the modal
        const foodModal = new bootstrap.Modal(document.getElementById('foodInfoModal'));
        foodModal.show();
    }
    
    /**
     * Helper function to add a food to the UI
     * @param {Object} food - The food object to add to the UI
     */
    function addFoodToUI(food) {
        // Remove the empty selection message if it exists
        const emptySelection = selectedFoodsContainer.querySelector('.empty-selection');
        if (emptySelection) {
            selectedFoodsContainer.removeChild(emptySelection);
        }
        
        // Create food selection item
        const foodElement = document.createElement('div');
        foodElement.className = 'selected-food-item';
        foodElement.dataset.foodId = food.id;
        foodElement.dataset.foodCategory = food.category;
        
        foodElement.innerHTML = `
            <img src="${food.image}" alt="${food.name}" class="selected-food-image">
            <div class="selected-food-info">
                <h4 class="selected-food-name">${food.name}</h4>
                <span class="selected-food-category">${food.category.charAt(0).toUpperCase() + food.category.slice(1)}</span>
            </div>
            <button class="remove-food" aria-label="Remove ${food.name}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add event listener to remove button
        const removeBtn = foodElement.querySelector('.remove-food');
        removeBtn.addEventListener('click', () => removeFoodFromMeal(food.id, food.category));
        
        selectedFoodsContainer.appendChild(foodElement);
    }

    /**
     * Add a food to the meal selection
     * @param {Object} food - The food object to add
     */
    function addFoodToMeal(food) {
        console.log('Attempting to add food:', food.name, food.category, food.id);
        console.log('Current selections:', game.selectedFoods.length);
        
        if (game.addFood(food)) {
            console.log('Food added successfully');
            // Add food to UI
            addFoodToUI(food);
            
            // Update selection count and analyze button
            updateSelectionCount();
            
            // Add selection badge to food items
            updateFoodItemsSelection();
        } else {
            console.log('Failed to add food');
        }
    }
    
    /**
     * Remove a food from the meal selection
     * @param {Number} foodId - The ID of the food to remove
     * @param {String} category - The category of the food (optional)
     */
    function removeFoodFromMeal(foodId, category) {
        // Use the improved removeFood method with category information
        game.removeFood(foodId, category);
        
        // Remove the food element from the selection container
        // If category is provided, use a more specific selector
        let foodElement;
        if (category) {
            foodElement = selectedFoodsContainer.querySelector(`[data-food-id="${foodId}"][data-food-category="${category}"]`);
        } else {
            foodElement = selectedFoodsContainer.querySelector(`[data-food-id="${foodId}"]`);
        }
        
        if (foodElement) {
            selectedFoodsContainer.removeChild(foodElement);
        }
        
        // Add empty selection message if no foods are selected
        if (game.selectedFoods.length === 0) {
            const emptySelectionHtml = `
                <div class="empty-selection text-center">
                    <i class="fas fa-utensils fa-3x text-muted mb-3"></i>
                    <p>Your meal is empty. Select 3 food items to analyze.</p>
                </div>
            `;
            selectedFoodsContainer.innerHTML = emptySelectionHtml;
        }
        
        // Update selection count and analyze button
        updateSelectionCount();
        
        // Update food items selection
        updateFoodItemsSelection();
    }
    
    /**
     * Update the selection count and analyze button state
     */
    function updateSelectionCount() {
        selectionCountElement.textContent = game.selectedFoods.length;
        analyzeButton.disabled = game.selectedFoods.length !== game.maxSelections;
    }
    
    /**
     * Update the selection badges on food items
     */
    function updateFoodItemsSelection() {
        // Remove all selection badges and 'selected' class
        document.querySelectorAll('.selection-badge').forEach(badge => badge.remove());
        document.querySelectorAll('.food-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add badges to selected foods
        game.selectedFoods.forEach((food, index) => {
            // Create a composite selector that uniquely identifies each food
            // This ensures we don't select foods with the same ID in different categories
            const uniqueSelector = `.food-item[data-food-id="${food.id}"][data-food-category="${food.category}"]`;
            const foodItems = document.querySelectorAll(uniqueSelector);
            
            foodItems.forEach(item => {
                // Create a new badge each time to avoid duplicates
                const badge = document.createElement('div');
                badge.className = 'selection-badge';
                badge.textContent = index + 1;
                item.appendChild(badge);
                item.classList.add('selected');
            });
        });
    }
    
    /**
     * Analyze the meal and display the results
     */
    function analyzeMeal() {
        const results = game.calculateScore();
        
        // Display score and message
        document.getElementById('nutritionScore').textContent = results.score;
        document.getElementById('scoreMessage').textContent = game.getScoreMessage(results.score);
        document.getElementById('totalCalories').textContent = results.totalCalories;
        
        // Update share score
        document.getElementById('shareScore').textContent = results.score;
        document.getElementById('shareLink').value = `https://nutrichoice.example.com/share?score=${results.score}`;
        
        // Display covered nutrients
        const coveredNutrientsList = document.getElementById('coveredNutrients');
        coveredNutrientsList.innerHTML = '';
        
        results.coveredNutrients.sort((a, b) => b.percentage - a.percentage).forEach(nutrient => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${game.formatNutrientName(nutrient.name)}: 
                <strong>${nutrient.percentage}%</strong>
            `;
            coveredNutrientsList.appendChild(listItem);
        });
        
        // Display missing nutrients
        const missingNutrientsList = document.getElementById('missingNutrients');
        missingNutrientsList.innerHTML = '';
        
        results.missingNutrients.sort((a, b) => a.percentage - b.percentage).forEach(nutrient => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${game.formatNutrientName(nutrient.name)}: 
                <strong>${nutrient.percentage}%</strong>
            `;
            missingNutrientsList.appendChild(listItem);
        });
        
        // Update progress bars
        document.getElementById('proteinProgress').style.width = `${results.macros.protein}%`;
        document.getElementById('proteinProgress').setAttribute('aria-valuenow', results.macros.protein);
        
        document.getElementById('carbProgress').style.width = `${results.macros.carbs}%`;
        document.getElementById('carbProgress').setAttribute('aria-valuenow', results.macros.carbs);
        
        document.getElementById('fatProgress').style.width = `${results.macros.fat}%`;
        document.getElementById('fatProgress').setAttribute('aria-valuenow', results.macros.fat);
        
        document.getElementById('fiberProgress').style.width = `${results.macros.fiber}%`;
        document.getElementById('fiberProgress').setAttribute('aria-valuenow', results.macros.fiber);
        
        // Create nutrient chart
        createNutrientChart(results.percentageMet);
        
        // Show results area and hide game area
        gameAreaSection.classList.add('d-none');
        resultsAreaSection.classList.remove('d-none');
    }
    
    /**
     * Create a radar chart visualizing the nutrient coverage
     * @param {Object} percentageMet - Object with nutrient percentages
     */
    function createNutrientChart(percentageMet) {
        const ctx = document.getElementById('nutrientChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.nutrientChart instanceof Chart) {
            window.nutrientChart.destroy();
        }
        
        // Select key nutrients for the chart (avoid overcrowding)
        const keyNutrients = [
            'protein', 'carbs', 'fat', 'fiber', 'vitaminA', 'vitaminC',
            'calcium', 'iron', 'potassium', 'magnesium'
        ];
        
        const data = {
            labels: keyNutrients.map(nutrient => game.formatNutrientName(nutrient)),
            datasets: [{
                label: 'Nutrient Coverage (%)',
                data: keyNutrients.map(nutrient => percentageMet[nutrient]),
                fill: true,
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderColor: 'rgba(76, 175, 80, 1)',
                pointBackgroundColor: 'rgba(76, 175, 80, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(76, 175, 80, 1)'
            }]
        };
        
        const config = {
            type: 'radar',
            data: data,
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            },
        };
        
        window.nutrientChart = new Chart(ctx, config);
    }
    
    /**
     * Reset the game to play again
     */
    function resetGame() {
        game.reset();
        
        // Clear selected foods
        selectedFoodsContainer.innerHTML = `
            <div class="empty-selection text-center">
                <i class="fas fa-utensils fa-3x text-muted mb-3"></i>
                <p>Your meal is empty. Select 3 food items to analyze.</p>
            </div>
        `;
        
        // Reset selection count and button
        selectionCountElement.textContent = '0';
        analyzeButton.disabled = true;
        
        // Remove selection badges from food items
        document.querySelectorAll('.food-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelectorAll('.selection-badge').forEach(badge => badge.remove());
        
        // Show game area and hide results
        gameAreaSection.classList.remove('d-none');
        resultsAreaSection.classList.add('d-none');
    }
    
    /**
     * Check for shared meal parameters in the URL and load them if present
     */
    function checkSharedMealParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const foodsParam = urlParams.get('foods');
        
        // If no foods parameter is present, do nothing
        if (!foodsParam) return;
        
        // Parse the food IDs from the URL parameter
        const foodIds = foodsParam.split(',').map(id => parseInt(id));
        
        // Find the matching food objects
        const sharedFoods = foodIds.map(id => foodData.find(food => food.id === id)).filter(food => food);
        
        // If we have valid foods, load them
        if (sharedFoods.length > 0) {
            // Start the game to show the game area
            startGame();
            
            // Add each food to the meal
            sharedFoods.forEach(food => {
                if (game.addFood(food)) {
                    addFoodToUI(food);
                }
            });
            
            // Update UI to reflect selected foods
            updateSelectionCount();
            updateFoodItemsSelection();
            
            // If we have a full meal selection, show the analysis
            if (game.selectedFoods.length === game.maxSelections) {
                analyzeMeal();
            }
        }
    }
    
    /**
     * Share the meal results
     */
    function shareMeal() {
        // Get the nutrition score from the game
        const scoreResult = game.calculateScore();
        const score = Math.round(scoreResult.score);
        
        // Create a URL with food IDs as parameters
        const foodIds = game.selectedFoods.map(food => food.id).join(',');
        const shareUrl = new URL(window.location.href);
        shareUrl.search = '';  // Clear existing query parameters
        
        // Add food IDs and score as query parameters
        shareUrl.searchParams.append('foods', foodIds);
        shareUrl.searchParams.append('score', score);
        
        // Update share score in the modal
        document.getElementById('shareScore').textContent = score;
        
        // Update share link input
        const shareLinkInput = document.getElementById('shareLink');
        shareLinkInput.value = shareUrl.toString();
        
        // Show the share modal
        const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
        shareModal.show();
        
        // Set up copy link button
        const copyLinkButton = document.getElementById('copyLinkButton');
        copyLinkButton.onclick = () => {
            shareLinkInput.select();
            document.execCommand('copy');
            copyLinkButton.textContent = 'Copied!';
            setTimeout(() => {
                copyLinkButton.textContent = 'Copy';
            }, 2000);
        };
    }
});

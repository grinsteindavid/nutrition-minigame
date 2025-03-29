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
        categories.forEach(category => {
            const grid = document.getElementById(`${category}Grid`);
            const filteredFoods = foodData.filter(food => food.category === category.substring(0, category.length - 1));
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
                <div class="food-item" data-food-id="${food.id}">
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
        
        // Create nutrient table
        let nutrientHtml = '';
        for (const [key, value] of Object.entries(food.nutrients)) {
            if (value > 0) {
                nutrientHtml += `
                    <tr>
                        <td>${game.formatNutrientName(key)}</td>
                        <td>${value}</td>
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
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${nutrientHtml}
                </tbody>
            </table>
        `;
        
        // Update add to meal button
        const isAlreadySelected = game.selectedFoods.some(f => f.id === food.id);
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
     * Add a food to the meal selection
     * @param {Object} food - The food object to add
     */
    function addFoodToMeal(food) {
        if (game.addFood(food)) {
            // Remove the empty selection message if it exists
            const emptySelection = selectedFoodsContainer.querySelector('.empty-selection');
            if (emptySelection) {
                selectedFoodsContainer.removeChild(emptySelection);
            }
            
            // Create food selection item
            const foodElement = document.createElement('div');
            foodElement.className = 'selected-food-item';
            foodElement.dataset.foodId = food.id;
            
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
            removeBtn.addEventListener('click', () => removeFoodFromMeal(food.id));
            
            selectedFoodsContainer.appendChild(foodElement);
            
            // Update selection count and analyze button
            updateSelectionCount();
            
            // Add selection badge to food items
            updateFoodItemsSelection();
        }
    }
    
    /**
     * Remove a food from the meal selection
     * @param {Number} foodId - The ID of the food to remove
     */
    function removeFoodFromMeal(foodId) {
        game.removeFood(foodId);
        
        // Remove the food element from the selection container
        const foodElement = selectedFoodsContainer.querySelector(`[data-food-id="${foodId}"]`);
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
        // Remove all selection badges
        document.querySelectorAll('.selection-badge').forEach(badge => badge.remove());
        
        // Add badges to selected foods
        game.selectedFoods.forEach((food, index) => {
            const foodItems = document.querySelectorAll(`.food-item[data-food-id="${food.id}"]`);
            foodItems.forEach(item => {
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
     * Share the meal results
     */
    function shareMeal() {
        // Show the share modal
        const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
        shareModal.show();
        
        // Set up copy link button
        const copyLinkButton = document.getElementById('copyLinkButton');
        const shareLinkInput = document.getElementById('shareLink');
        
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

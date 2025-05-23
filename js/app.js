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
        // Clean up URL querystring when starting the game
        if (window.location.search) {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
        
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
                    <img src="${food.image}" alt="${food.name}" class="food-image" loading="lazy">
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
            <img src="${food.image}" alt="${food.name}" class="food-modal-image" loading="lazy">
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
            <img src="${food.image}" alt="${food.name}" class="selected-food-image" loading="lazy">
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
        
        // Update URL with selected foods (without score) to persist selection on page reload
        updateUrlWithSelectedFoods();
        
        // Display selected foods in results section
        displaySelectedFoodsInResults();
        
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
        
        // Re-initialize tooltips after content changes
        if (typeof bootstrap !== 'undefined') {
            const newTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            newTooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
        }
        
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
     * Create a visually enhanced radar chart visualizing the nutrient coverage
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
        
        // Define color theme - using solid colors instead of gradients for compatibility
        const primaryColor = 'rgba(65, 105, 225, 0.7)';
        const secondaryColor = 'rgba(255, 105, 180, 0.3)';
        
        // Define data categories and color-code them
        const macronutrients = ['Protein', 'Carbs', 'Fat', 'Fiber'];
        const vitamins = ['Vitamin A', 'Vitamin C'];
        const minerals = ['Calcium', 'Iron', 'Potassium', 'Magnesium'];
        
        // Format labels with category indicators
        const formattedLabels = keyNutrients.map(nutrient => {
            const name = game.formatNutrientName(nutrient);
            if (macronutrients.includes(name)) return `🍲 ${name}`;
            if (vitamins.includes(name)) return `🍊 ${name}`;
            if (minerals.includes(name)) return `⚡ ${name}`;
            return name;
        });
        
        // Get nutrient percentages and determine if each is at a good level
        const nutrientValues = keyNutrients.map(nutrient => percentageMet[nutrient]);
        
        // Create border color array that highlights nutrients based on percentages
        const pointBorderColors = nutrientValues.map(value => {
            if (value >= 80) return '#4CAF50'; // Good coverage
            if (value >= 40) return '#FFC107'; // Moderate coverage
            return '#F44336'; // Poor coverage
        });
        
        // Create point background colors
        const pointBackgroundColors = nutrientValues.map(value => {
            if (value >= 80) return 'rgba(76, 175, 80, 0.8)'; // Good coverage
            if (value >= 40) return 'rgba(255, 193, 7, 0.8)'; // Moderate coverage
            return 'rgba(244, 67, 54, 0.8)'; // Poor coverage
        });
        
        const data = {
            labels: formattedLabels,
            datasets: [{
                label: 'Nutrient Coverage (%)',
                data: nutrientValues,
                fill: true,
                backgroundColor: secondaryColor,
                borderColor: primaryColor,
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: pointBackgroundColors,
                pointBorderColor: pointBorderColors,
                pointBorderWidth: 2,
                pointHoverBackgroundColor: 'rgba(255, 255, 255, 0.9)',
                pointHoverBorderColor: primaryColor
            }]
        };
        
        // Create a reference line at 50% for better visual guidance
        const referenceDataset = {
            label: '50% Reference',
            data: Array(keyNutrients.length).fill(50),
            fill: false,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            pointHoverRadius: 0
        };
        
        // Add the reference dataset
        data.datasets.push(referenceDataset);
        
        const config = {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true,
                            color: 'rgba(255, 255, 255, 0.15)',
                            lineWidth: 1
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            display: false  // Hide numeric labels
                        },
                        pointLabels: {
                            color: '#333',
                            font: {
                                size: 13,
                                weight: 'bold',
                                family: '"Poppins", sans-serif'
                            },
                            padding: 10
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                                family: '"Poppins", sans-serif'
                            },
                            usePointStyle: true,
                            generateLabels: (chart) => {
                                // Only show legend for the main dataset
                                const datasets = chart.data.datasets;
                                return [{
                                    text: datasets[0].label,
                                    fillStyle: primaryColor,
                                    strokeStyle: primaryColor,
                                    lineWidth: 2,
                                    hidden: false
                                }];
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold',
                            family: '"Poppins", sans-serif'
                        },
                        bodyFont: {
                            size: 13,
                            family: '"Poppins", sans-serif'
                        },
                        padding: 10,
                        cornerRadius: 6,
                        displayColors: false,
                        callbacks: {
                            title: (tooltipItems) => {
                                return tooltipItems[0].label.replace(/^[🍲🍊⚡]\s/, '');
                            },
                            label: (context) => {
                                // Don't show tooltip for reference dataset
                                if (context.datasetIndex === 1) return null;
                                
                                const value = context.raw;
                                let status = '';
                                if (value >= 80) status = '✅ Good coverage';
                                else if (value >= 40) status = '⚠️ Moderate coverage';
                                else status = '❌ Poor coverage';
                                
                                return [`Value: ${value.toFixed(1)}%`, status, 'Click for nutrition tips'];
                            }
                        }
                    }
                },
                onClick: (e, elements) => {
                    if (elements && elements.length > 0 && elements[0].datasetIndex === 0) {
                        const index = elements[0].index;
                        const nutrient = keyNutrients[index].toLowerCase();
                        showNutrientTip(nutrient, formattedLabels[index]);
                    }
                }
            }
        };
        
        window.nutrientChart = new Chart(ctx, config);
    }
    
    /**
     * Display nutrition tips for the clicked nutrient
     * @param {string} nutrient - The nutrient identifier
     * @param {string} label - The formatted nutrient name
     */
    function showNutrientTip(nutrient, label) {
        // Remove emoji from label if present
        const cleanLabel = label.replace(/^[🍲🍊⚡]\s/, '');
        
        // Define tips for different nutrients
        const tips = {
            protein: ['Lean meats, poultry, fish, eggs, dairy, beans, and nuts are great protein sources',
                    'Distribute protein throughout the day for optimal muscle maintenance'],
            carbs: ['Focus on complex carbs like whole grains, fruits, and vegetables',
                   'Limit refined carbs like white bread, pasta, and sugary foods'],
            fat: ['Include healthy fats from avocados, nuts, olive oil, and fatty fish',
                 'Limit saturated fats from processed foods and fried items'],
            fiber: ['Increase intake of fruits, vegetables, whole grains, and legumes',
                  'Drink plenty of water when increasing fiber intake'],
            vitamina: ['Orange and yellow vegetables like carrots and sweet potatoes are rich in vitamin A',
                     'Leafy greens like spinach and kale are also excellent sources'],
            vitaminc: ['Citrus fruits, berries, peppers, and broccoli are high in vitamin C',
                     'Eat these foods raw when possible as vitamin C is heat-sensitive'],
            calcium: ['Dairy products, fortified plant milks, leafy greens, and nuts provide calcium',
                    'Vitamin D helps with calcium absorption, so get some sunlight too'],
            iron: ['Red meat, spinach, beans, and fortified cereals are good iron sources',
                 'Consume with vitamin C foods to improve absorption'],
            potassium: ['Bananas, potatoes, avocados, and leafy greens are high in potassium',
                      'Helps maintain healthy blood pressure and muscle function'],
            magnesium: ['Nuts, seeds, whole grains, and leafy greens provide magnesium',
                      'Important for energy production and muscle health']
        };
        
        // Get tips for the selected nutrient
        const nutrientKey = nutrient.toLowerCase().replace(/[^a-z]/g, '');
        const nutrientTips = tips[nutrientKey] || ['Focus on a varied diet to get this nutrient'];
        
        // Create and show a toast notification
        const toastHtml = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3" id="nutrientTipContainer">
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-primary text-white">
                        <strong class="me-auto">${cleanLabel} Tips</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <ul class="mb-0 ps-3">
                            ${nutrientTips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Remove any existing toast container
        const existingContainer = document.getElementById('nutrientTipContainer');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        // Add the new toast to the document
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = toastHtml;
        document.body.appendChild(tempDiv.firstElementChild);
        
        // Show the toast
        const toastEl = document.querySelector('.toast');
        const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 5000 });
        toast.show();
    }
    
    /**
     * Reset the game to play again
     */
    function resetGame() {
        // Clean up URL querystring when resetting the game
        if (window.location.search) {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
        
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
        
        // Note: We intentionally ignore the score parameter if present
        // The score will always be calculated based on the selected foods
        
        try {
            // Parse the foods data from the URL parameter - now includes category information
            // Format: id:category,id:category,id:category
            const foodSelections = foodsParam.split(',').map(item => {
                const [id, category] = item.split(':');
                return { id: parseInt(id), category };
            });
            
            // Find the matching food objects by both id and category
            const sharedFoods = foodSelections.map(selection => {
                return foodData.find(food => 
                    food.id === selection.id && 
                    food.category === selection.category
                );
            }).filter(food => food); // Remove any undefined entries
            
            // If we have valid foods, load them
            if (sharedFoods.length > 0) {
                // Start the game to show the game area - but don't clean the URL yet
                // We'll just show the game area but keep the URL parameters
                instructionsSection.classList.add('d-none');
                gameAreaSection.classList.remove('d-none');
                resultsAreaSection.classList.add('d-none');
                
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
        } catch (error) {
            console.error('Error parsing shared meal parameters:', error);
            // Fallback to old format (backwards compatibility)
            const foodIds = foodsParam.split(',').map(id => parseInt(id));
            const sharedFoods = foodIds.map(id => foodData.find(food => food.id === id)).filter(food => food);
            
            if (sharedFoods.length > 0) {
                // Show the game area without cleaning the URL yet
                instructionsSection.classList.add('d-none');
                gameAreaSection.classList.remove('d-none');
                resultsAreaSection.classList.add('d-none');
                
                sharedFoods.forEach(food => {
                    if (game.addFood(food)) {
                        addFoodToUI(food);
                    }
                });
                updateSelectionCount();
                updateFoodItemsSelection();
                
                if (game.selectedFoods.length === game.maxSelections) {
                    analyzeMeal();
                }
            }
        }
    }
    
    /**
     * Display selected foods in the results section
     */
    function displaySelectedFoodsInResults() {
        const selectedFoodsResults = document.getElementById('selectedFoodsResults');
        if (!selectedFoodsResults) return;
        
        selectedFoodsResults.innerHTML = '';
        
        // Create a row for the selected foods
        const foodsRow = document.createElement('div');
        foodsRow.className = 'row justify-content-center mb-3';
        
        // Add each food to the results view
        game.selectedFoods.forEach(food => {
            const foodCol = document.createElement('div');
            foodCol.className = 'col-md-4 col-sm-6 mb-3 text-center';
            
            foodCol.innerHTML = `
                <div class="results-food-item" data-food-id="${food.id}" data-food-category="${food.category}">
                    <img src="${food.image}" alt="${food.name}" class="results-food-image" loading="lazy">
                    <h4 class="results-food-name">${food.name}</h4>
                    <span class="results-food-category category-${food.category}">
                        ${food.category.charAt(0).toUpperCase() + food.category.slice(1)}
                    </span>
                    <p class="results-food-calories"><i class="fas fa-fire"></i> ${food.calories} calories</p>
                    <button class="btn btn-sm btn-outline-primary view-details-btn">View Details</button>
                </div>
            `;
            
            // Add click event to show food details
            const viewDetailsBtn = foodCol.querySelector('.view-details-btn');
            viewDetailsBtn.addEventListener('click', () => showFoodInfo(food));
            
            foodsRow.appendChild(foodCol);
        });
        
        selectedFoodsResults.appendChild(foodsRow);
    }

    /**
     * Also display selected foods in the share modal
     */
    function displaySelectedFoodsInShareModal() {
        const shareFoodsList = document.getElementById('shareFoodsList');
        if (!shareFoodsList) return;
        
        shareFoodsList.innerHTML = '';
        
        // Add each food to the share modal
        game.selectedFoods.forEach(food => {
            const foodItem = document.createElement('div');
            foodItem.className = 'share-food-item d-flex align-items-center mb-2';
            
            foodItem.innerHTML = `
                <img src="${food.image}" alt="${food.name}" class="share-food-image me-2" loading="lazy">
                <div>
                    <h5 class="mb-0">${food.name}</h5>
                    <span class="badge category-${food.category}">${food.category.charAt(0).toUpperCase() + food.category.slice(1)}</span>
                </div>
            `;
            
            shareFoodsList.appendChild(foodItem);
        });
    }

    /**
     * Update the URL with selected foods
     * This is used by both analyzeMeal and shareMeal functions
     */
    function updateUrlWithSelectedFoods() {
        // Create a URL with food data as parameters (including both ID and category)
        const foodParams = game.selectedFoods.map(food => `${food.id}:${food.category}`).join(',');
        const shareUrl = new URL(window.location.href);
        shareUrl.search = '';  // Clear existing query parameters
        
        // Add food data as query parameter (no score - it will be calculated)
        shareUrl.searchParams.append('foods', foodParams);
        
        // Update the browser URL without reloading the page
        window.history.replaceState({}, document.title, shareUrl);
    }

    /**
     * Share the meal results
     */
    function shareMeal() {
        // Get the nutrition score from the game
        const scoreResult = game.calculateScore();
        const score = Math.round(scoreResult.score);
        
        // Create a URL with food data as parameters (including both ID and category)
        const foodParams = game.selectedFoods.map(food => `${food.id}:${food.category}`).join(',');
        const shareUrl = new URL(window.location.href);
        shareUrl.search = '';  // Clear existing query parameters
        
        // Add only food data as query parameter (no score - it will be calculated)
        shareUrl.searchParams.append('foods', foodParams);
        
        // Update share score in the modal
        document.getElementById('shareScore').textContent = score;
        
        // Display selected foods in the share modal
        displaySelectedFoodsInShareModal();
        
        // Update share link input
        const shareLinkInput = document.getElementById('shareLink');
        shareLinkInput.value = shareUrl.toString();
        
        // Show the share modal
        const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
        shareModal.show();
        
        // Get full share URL and create title for social shares
        const fullShareUrl = shareUrl.toString();
        const shareTitle = `Check out my NutriChoice meal with a nutrition score of ${score}%!`;
        const shareText = `I created a meal with ${game.selectedFoods.map(f => f.name).join(', ')} and scored ${score}%! Can you beat my score?`;
        const shareImageUrl = game.selectedFoods[0]?.image || 'img/placeholder.png';
        
        // Set up copy link button
        const copyLinkButton = document.getElementById('copyLinkButton');
        copyLinkButton.onclick = () => {
            shareLinkInput.select();
            navigator.clipboard.writeText(shareLinkInput.value).catch(() => {
                // Fallback for older browsers
                document.execCommand('copy');
            });
            copyLinkButton.textContent = 'Copied!';
            setTimeout(() => {
                copyLinkButton.textContent = 'Copy';
            }, 2000);
        };
        
        // Set up social share buttons
        // Facebook
        document.getElementById('facebookShareBtn').onclick = () => {
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`;
            window.open(fbUrl, 'share-facebook', 'width=580,height=296');
        };
        
        // X (formerly Twitter)
        document.getElementById('twitterShareBtn').onclick = () => {
            const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullShareUrl)}`;
            window.open(xShareUrl, 'share-x', 'width=550,height=235');
        };
        
        // Pinterest
        document.getElementById('pinterestShareBtn').onclick = () => {
            const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fullShareUrl)}&media=${encodeURIComponent(shareImageUrl)}&description=${encodeURIComponent(shareTitle)}`;
            window.open(pinterestUrl, 'share-pinterest', 'width=750,height=550');
        };
        
        // WhatsApp
        document.getElementById('whatsappShareBtn').onclick = () => {
            const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
            const whatsappUrl = isDesktop 
                ? `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + fullShareUrl)}`
                : `whatsapp://send?text=${encodeURIComponent(shareText + ' ' + fullShareUrl)}`;
            window.open(whatsappUrl, '_blank');
        };
        
        // Email
        document.getElementById('emailShareBtn').onclick = () => {
            const subject = encodeURIComponent(shareTitle);
            const body = encodeURIComponent(`${shareText}

Check it out here: ${fullShareUrl}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        };
        
        // Native Share API (for mobile devices)
        const nativeShareBtn = document.getElementById('nativeShareBtn');
        if (navigator.share) {
            nativeShareBtn.style.display = 'block';
            nativeShareBtn.onclick = async () => {
                try {
                    await navigator.share({
                        title: shareTitle,
                        text: shareText,
                        url: fullShareUrl
                    });
                    console.log('Shared successfully');
                } catch (err) {
                    console.error('Share failed:', err);
                }
            };
        } else {
            nativeShareBtn.style.display = 'none';
        }
    }
});

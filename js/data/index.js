/**
 * NutriChoice Food Database Index
 * Centralizes access to all food category databases
 * All values are based on 100g serving size
 */

import fruitsData from './fruits.js';
import vegetablesData from './vegetables.js';
import proteinsData from './proteins.js';
import grainsData from './grains.js';
import dairyData from './dairy.js';

// Combined food data from all categories
const foodData = [
  ...fruitsData,
  ...vegetablesData,
  ...proteinsData,
  ...grainsData,
  ...dairyData
];

export {
  foodData,    // All food items combined
  fruitsData,   // Only fruits
  vegetablesData, // Only vegetables
  proteinsData, // Only protein sources
  grainsData,   // Only grains
  dairyData     // Only dairy products
};

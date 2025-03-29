/**
 * Script to check image URLs in the food database
 */

import { foodData } from './js/data/index.js';

// Function to check if an image URL is working
async function checkImageUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      url,
      status: response.status,
      ok: response.ok
    };
  } catch (error) {
    return {
      url,
      status: 'Error',
      ok: false,
      error: error.message
    };
  }
}

// Check all food image URLs
async function checkAllFoodImages() {
  console.log(`Checking ${foodData.length} food image URLs...`);
  console.log('==================================');
  
  const results = [];
  const brokenImages = [];
  
  for (const food of foodData) {
    const result = await checkImageUrl(food.image);
    results.push(result);
    
    if (!result.ok) {
      brokenImages.push({
        name: food.name,
        category: food.category,
        imageUrl: food.image,
        status: result.status
      });
    }
    
    // Log progress
    process.stdout.write('.');
  }
  
  console.log('\n==================================');
  
  // Print summary
  console.log(`\nTotal images checked: ${results.length}`);
  console.log(`Working images: ${results.filter(r => r.ok).length}`);
  console.log(`Broken images: ${brokenImages.length}`);
  
  if (brokenImages.length > 0) {
    console.log('\nBroken images:');
    brokenImages.forEach(img => {
      console.log(`- ${img.name} (${img.category}): ${img.imageUrl} (Status: ${img.status})`);
    });
  }
}

// Run the check
checkAllFoodImages();

/**
 * Food Image Path Updater
 * 
 * This script updates all food data files with local image paths for downloaded images
 * and ensures that undefined images are properly marked with a placeholder image.
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const DATA_DIR = path.join(__dirname, '../js/data');
const IMAGE_DIR = path.join(__dirname, '../img/data-food');
const PLACEHOLDER_IMAGE = './img/placeholder.png';
const DATA_FILES = ['fruits.js', 'vegetables.js', 'proteins.js', 'grains.js', 'dairy.js'];

// Get the category from filename
function getCategoryFromFilename(filename) {
  const baseName = path.basename(filename, '.js');
  return baseName.endsWith('s') ? baseName.slice(0, -1) : baseName;
}

// Check if an image exists for a food item
async function imageExists(id, category) {
  const imagePath = path.join(IMAGE_DIR, `${id}-${category}.jpg`);
  try {
    await fs.access(imagePath);
    return true;
  } catch (err) {
    return false;
  }
}

// Find all food items in a file
function findFoodItems(content) {
  // Extract all food items with ID - handle both quoted and unquoted property names
  const foodItems = [];
  
  // First try to find the data array definition
  const arrayMatch = content.match(/const\s+(\w+)\s*=\s*\[/);
  if (!arrayMatch) {
    return foodItems; // No data array found
  }
  
  // Get opening and closing braces for each object
  let braceCount = 0;
  let currentItem = '';
  let inItem = false;
  let itemStart = -1;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    // Start of a potential item
    if (char === '{') {
      braceCount++;
      if (!inItem) {
        inItem = true;
        itemStart = i;
        currentItem = '{';
      } else {
        currentItem += char;
      }
    }
    // End of an item
    else if (char === '}') {
      braceCount--;
      currentItem += char;
      
      // If we've balanced all braces, we've found a complete item
      if (inItem && braceCount === 0) {
        // Check if this item has an id property
        const idMatch = currentItem.match(/["']?id["']?\s*:\s*(\d+)/);
        if (idMatch) {
          foodItems.push({
            text: currentItem,
            id: idMatch[1],
            start: itemStart,
            end: i + 1
          });
        }
        
        inItem = false;
        currentItem = '';
      }
    }
    // Add characters to current item
    else if (inItem) {
      currentItem += char;
    }
  }
  
  return foodItems;
}

// Process a data file to update image paths
async function processDataFile(filePath) {
  try {
    console.log(`\nProcessing ${path.basename(filePath)}...`);
    
    // Read the file content
    const content = await fs.readFile(filePath, 'utf8');
    
    // Get the category from the filename
    const category = getCategoryFromFilename(path.basename(filePath));
    
    // Check whether the file uses quoted or unquoted property names
    const useQuotedProps = content.includes('"id"') || content.includes('\'id\'');
    
    // Find all food items in the file
    const foodItems = findFoodItems(content);
    
    if (foodItems.length === 0) {
      console.log(`No food items found in ${path.basename(filePath)}`);
      return false;
    }
    
    console.log(`Found ${foodItems.length} food items in ${path.basename(filePath)}`);
    
    // Create a copy of the content to modify
    let updatedContent = content;
    let updateCount = 0;
    let offset = 0; // To track position shifts after replacements
    
    // Process each food item
    for (const item of foodItems) {
      const id = item.id;
      
      // Adjust positions based on previous changes
      const itemStart = item.start + offset;
      const itemEnd = item.end + offset;
      const itemText = updatedContent.substring(itemStart, itemEnd);
      
      // Check if a local image exists for this food item
      const hasImage = await imageExists(id, category);
      
      // Use the appropriate property name format based on the file
      const imageProp = useQuotedProps ? '"image"' : 'image';
      
      // Check if the item has an image property (handle both quoted and unquoted)
      const hasImageProperty = itemText.includes('"image"') || itemText.includes('image:');
      
      let newItemText = itemText;
      let changed = false;
      
      if (hasImage) {
        // Image exists locally, update the path
        const localPath = `./img/data-food/${id}-${category}.jpg`;
        
        if (hasImageProperty) {
          // Replace existing image property
          if (useQuotedProps) {
            // For quoted property names
            newItemText = newItemText.replace(/"image"\s*:\s*["']?[^,}\n]*["']?/g, `"image": "${localPath}"`);
          } else {
            // For unquoted property names
            newItemText = newItemText.replace(/image\s*:\s*["']?[^,}\n]*["']?/g, `image: "${localPath}"`);
          }
          changed = true;
        } else {
          // No image property, add one
          const lastBrace = newItemText.lastIndexOf('}');
          if (lastBrace > 0) {
            // Check if we need a comma
            const beforeBrace = newItemText.substring(0, lastBrace).trim();
            const needsComma = beforeBrace.charAt(beforeBrace.length - 1) !== ',';
            
            const indentation = newItemText.match(/^(\s+)/m) ? 
                             newItemText.match(/^(\s+)/m)[1] : 
                             '        ';
            
            if (useQuotedProps) {
              newItemText = newItemText.substring(0, lastBrace) + 
                         `${needsComma ? ',' : ''}\n${indentation}"image": "${localPath}"` + 
                         newItemText.substring(lastBrace);
            } else {
              newItemText = newItemText.substring(0, lastBrace) + 
                         `${needsComma ? ',' : ''}\n${indentation}image: "${localPath}"` + 
                         newItemText.substring(lastBrace);
            }
            changed = true;
          }
        }
      } else {
        // No local image exists, use placeholder
        if (hasImageProperty) {
          // Replace existing image property with placeholder
          if (useQuotedProps) {
            // For quoted property names
            newItemText = newItemText.replace(/"image"\s*:\s*["']?[^,}\n]*["']?/g, `"image": "${PLACEHOLDER_IMAGE}"`);
          } else {
            // For unquoted property names
            newItemText = newItemText.replace(/image\s*:\s*["']?[^,}\n]*["']?/g, `image: "${PLACEHOLDER_IMAGE}"`);
          }
          changed = true;
        } else {
          // No image property, add placeholder
          const lastBrace = newItemText.lastIndexOf('}');
          if (lastBrace > 0) {
            // Check if we need a comma
            const beforeBrace = newItemText.substring(0, lastBrace).trim();
            const needsComma = beforeBrace.charAt(beforeBrace.length - 1) !== ',';
            
            const indentation = newItemText.match(/^(\s+)/m) ? 
                             newItemText.match(/^(\s+)/m)[1] : 
                             '        ';
            
            if (useQuotedProps) {
              newItemText = newItemText.substring(0, lastBrace) + 
                         `${needsComma ? ',' : ''}\n${indentation}"image": "${PLACEHOLDER_IMAGE}"` + 
                         newItemText.substring(lastBrace);
            } else {
              newItemText = newItemText.substring(0, lastBrace) + 
                         `${needsComma ? ',' : ''}\n${indentation}image: "${PLACEHOLDER_IMAGE}"` + 
                         newItemText.substring(lastBrace);
            }
            changed = true;
          }
        }
      }
      
      // Update the content if changes were made
      if (changed && newItemText !== itemText) {
        updatedContent = updatedContent.substring(0, itemStart) + 
                        newItemText + 
                        updatedContent.substring(itemEnd);
        
        // Update the offset for subsequent items
        offset += (newItemText.length - itemText.length);
        updateCount++;
      }
    }
    
    // Write the updated content back to the file
    if (updateCount > 0) {
      await fs.writeFile(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated ${updateCount} food items in ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`⚠️ No updates needed in ${path.basename(filePath)}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error processing ${path.basename(filePath)}: ${err.message}`);
    return false;
  }
}

// Create SVG placeholder image
async function ensurePlaceholderImage() {
  const placeholderPath = path.join(__dirname, '..', PLACEHOLDER_IMAGE);
  const placeholderDir = path.dirname(placeholderPath);
  
  try {
    // Check if the placeholder already exists
    await fs.access(placeholderPath);
    console.log('✅ Placeholder image already exists');
    return true;
  } catch (err) {
    // Create the placeholder image
    try {
      // Ensure the directory exists
      await fs.mkdir(placeholderDir, { recursive: true });
      
      // Simple SVG placeholder with a food icon
      const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f8f8"/>
        <circle cx="200" cy="120" r="70" fill="#e0e0e0"/>
        <path d="M200,220 C230,220 260,210 280,190 C260,230 230,250 200,250 C170,250 140,230 120,190 C140,210 170,220 200,220 Z" fill="#d0d0d0"/>
        <text x="200" y="190" font-family="Arial" font-size="16" text-anchor="middle" fill="#888888">Image Not Available</text>
      </svg>`;
      
      await fs.writeFile(placeholderPath, svgContent, 'utf8');
      console.log(`✅ Created placeholder image at ${PLACEHOLDER_IMAGE}`);
      return true;
    } catch (createErr) {
      console.error(`❌ Failed to create placeholder image: ${createErr.message}`);
      return false;
    }
  }
}

// Main function
async function main() {
  try {
    console.log('🔍 Starting Food Image Path Update');
    console.log('=================================');
    
    // Create placeholder image if it doesn't exist
    await ensurePlaceholderImage();
    
    // Check if image directory exists
    try {
      await fs.access(IMAGE_DIR);
      const images = await fs.readdir(IMAGE_DIR);
      console.log(`📷 Found ${images.length} images in ${IMAGE_DIR}`);
    } catch (err) {
      console.log(`⚠️ Image directory ${IMAGE_DIR} does not exist, creating it...`);
      await fs.mkdir(IMAGE_DIR, { recursive: true });
    }
    
    // Process each data file
    let successCount = 0;
    for (const dataFile of DATA_FILES) {
      const filePath = path.join(DATA_DIR, dataFile);
      
      try {
        await fs.access(filePath);
      } catch (err) {
        console.log(`⚠️ File ${dataFile} does not exist, skipping...`);
        continue;
      }
      
      const success = await processDataFile(filePath);
      if (success) successCount++;
    }
    
    console.log('\n=================================');
    console.log(`✅ Process completed! Updated ${successCount} out of ${DATA_FILES.length} data files`);
  } catch (err) {
    console.error(`❌ Unhandled error: ${err.message}`);
    process.exit(1);
  }
}

// Run the script
main().catch(err => {
  console.error(`❌ Fatal error: ${err.message}`);
  process.exit(1);
});

/**
 * Simple image resizing script for AVIF images
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SOURCE_DIR = './public/images/works/thumb';
const TARGET_DIR = './public/images/works/small';
const WIDTH = 500; // Target width

async function processImages() {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(TARGET_DIR)) {
      fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    // Read all files from the source directory
    const files = fs.readdirSync(SOURCE_DIR);
    
    console.log(`Found ${files.length} images to process...`);
    
    // Process each file
    for (const file of files) {
      const inputPath = path.join(SOURCE_DIR, file);
      const outputPath = path.join(TARGET_DIR, file);
      
      try {
        // Process with sharp
        await sharp(inputPath)
          .resize({
            width: WIDTH,
          }) // No height, so it maintains aspect ratio
          .toFile(outputPath);
        
        console.log(`✅ Successfully resized: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to process ${file}:`, error);
      }
    }
    
    console.log('Processing complete!');
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

// Run the function
processImages();

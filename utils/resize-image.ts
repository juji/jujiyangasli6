/**
 * Image Resizing Utility using Sharp
 *
 * This script resizes images using the Sharp library.
 *
 * Usage:
 * ts-node resize-image.ts <source> <destination> <width> <height> [options]
 *
 * Options:
 *  --fit=<fit>: How the image should be resized (cover, contain, fill, inside, outside)
 *  --format=<format>: Output format (jpeg, png, webp, avif)
 *  --quality=<number>: Output quality (1-100)
 */

import sharp from "sharp";
import path from "path";
import fs from "fs";

interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  format?: "jpeg" | "png" | "webp" | "avif";
  quality?: number;
}

/**
 * Resize a single image
 *
 * @param {string} inputPath - Path to the source image
 * @param {string} outputPath - Path where the resized image will be saved
 * @param {ResizeOptions} options - Resizing options
 * @returns {Promise<void>}
 */
async function resizeImage(
  inputPath: string,
  outputPath: string,
  options: ResizeOptions,
): Promise<void> {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Initialize Sharp with the input image
    let image = sharp(inputPath);

    // Apply resizing
    image = image.resize({
      width: options.width,
      height: options.height === undefined ? undefined : options.height, // Allow undefined height for auto aspect ratio
      fit: options.fit || "cover",
    });

    // Set output format if specified
    if (options.format) {
      image = image.toFormat(options.format, {
        quality: options.quality || 80,
      });
    }

    // Save the processed image
    await image.toFile(outputPath);

    console.info(`✅ Successfully resized image: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error resizing image ${inputPath}:`, error);
    throw error;
  }
}

/**
 * Batch resize images in a directory
 *
 * @param {string} inputDir - Directory containing source images
 * @param {string} outputDir - Directory where resized images will be saved
 * @param {ResizeOptions} options - Resizing options
 * @returns {Promise<void>}
 */
async function batchResizeImages(
  inputDir: string,
  outputDir: string,
  options: ResizeOptions,
): Promise<void> {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get all files in the input directory
    const files = fs.readdirSync(inputDir);

    // Filter for image files (simple extension check)
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".avif",
      ".gif",
      ".svg",
    ];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.warn(`No image files found in ${inputDir}`);
      return;
    }

    console.info(`Found ${imageFiles.length} images to process...`);

    // Process each image
    const promises = imageFiles.map((file) => {
      const inputPath = path.join(inputDir, file);
      let outputFilename = file;

      // Update extension if format is specified
      if (options.format) {
        outputFilename = `${path.parse(file).name}.${options.format}`;
      }

      const outputPath = path.join(outputDir, outputFilename);
      return resizeImage(inputPath, outputPath, options);
    });

    await Promise.all(promises);
    console.info(`✅ Successfully processed ${imageFiles.length} images`);
  } catch (error) {
    console.error("❌ Error in batch processing:", error);
    throw error;
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): {
  source: string;
  destination: string;
  options: ResizeOptions;
} {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    printUsage();
    process.exit(1);
  }

  const source = args[0];
  const destination = args[1];
  const options: ResizeOptions = {};

  // Parse width and height
  if (args.length > 2) options.width = parseInt(args[2], 10);
  if (args.length > 3) options.height = parseInt(args[3], 10);

  // Parse named options
  args.slice(4).forEach((arg) => {
    if (arg.startsWith("--fit=")) {
      const fit = arg.split("=")[1] as any;
      if (["cover", "contain", "fill", "inside", "outside"].includes(fit)) {
        options.fit = fit;
      }
    } else if (arg.startsWith("--format=")) {
      const format = arg.split("=")[1] as any;
      if (["jpeg", "png", "webp", "avif"].includes(format)) {
        options.format = format;
      }
    } else if (arg.startsWith("--quality=")) {
      options.quality = parseInt(arg.split("=")[1], 10);
    }
  });

  return { source, destination, options };
}

function printUsage(): void {
  console.info(`
Image Resizer Utility

Usage:
  ts-node resize-image.ts <source> <destination> <width> <height> [options]

Arguments:
  source        Source image file or directory
  destination   Destination file or directory
  width         Width in pixels (optional)
  height        Height in pixels (optional)

Options:
  --fit=<type>       How to fit the image (cover, contain, fill, inside, outside)
  --format=<format>  Output format (jpeg, png, webp, avif)
  --quality=<number> Output quality (1-100)

Examples:
  # Resize a single image to 800x600
  ts-node resize-image.ts input.jpg output.jpg 800 600

  # Convert and resize all images in a directory to webp format
  ts-node resize-image.ts ./input-images ./output-images 1200 --format=webp
  `);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    const { source, destination, options } = parseArgs();

    // Check if source exists
    if (!fs.existsSync(source)) {
      console.error(`❌ Source not found: ${source}`);
      process.exit(1);
    }

    // Determine if it's a single file or directory
    const sourceStats = fs.statSync(source);

    if (sourceStats.isFile()) {
      // Process single file
      await resizeImage(source, destination, options);
    } else if (sourceStats.isDirectory()) {
      // Process directory
      await batchResizeImages(source, destination, options);
    } else {
      console.error("❌ Source is neither a file nor a directory");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ An error occurred:", error);
    process.exit(1);
  }
}

// Run the script
main();

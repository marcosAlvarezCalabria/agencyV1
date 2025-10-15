import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Error: Cloudinary credentials not found in .env file');
  console.log('Please add the following to your .env file:');
  console.log('CLOUDINARY_CLOUD_NAME="your_cloud_name"');
  console.log('CLOUDINARY_API_KEY="your_api_key"');
  console.log('CLOUDINARY_API_SECRET="your_api_secret"');
  process.exit(1);
}

const toursDir = path.resolve(__dirname, '../public/assets/images/tours');

// Function to upload a single image
async function uploadImage(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `agency-cusco/${folder}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      quality: 'auto:best',
      fetch_format: 'auto'
    });
    console.log(`✅ Uploaded: ${path.basename(filePath)} -> ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return null;
  }
}

// Function to get all images from tours folders
function getImageFiles(dir) {
  const images = [];
  const tourFolders = fs.readdirSync(dir);

  for (const tourFolder of tourFolders) {
    const tourPath = path.join(dir, tourFolder);
    if (fs.statSync(tourPath).isDirectory()) {
      const files = fs.readdirSync(tourPath);
      for (const file of files) {
        if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
          images.push({
            filePath: path.join(tourPath, file),
            tourFolder: tourFolder,
            fileName: file
          });
        }
      }
    }
  }

  return images;
}

// Main upload function
async function uploadAllImages() {
  console.log('🚀 Starting upload to Cloudinary...\n');

  const images = getImageFiles(toursDir);
  console.log(`📸 Found ${images.length} images to upload\n`);

  const results = {
    success: [],
    failed: []
  };

  for (const image of images) {
    const result = await uploadImage(image.filePath, image.tourFolder);
    if (result) {
      results.success.push({
        localPath: image.filePath,
        cloudinaryUrl: result.secure_url,
        tourFolder: image.tourFolder,
        fileName: image.fileName
      });
    } else {
      results.failed.push(image.filePath);
    }
  }

  // Save results to a JSON file
  const outputPath = path.resolve(__dirname, '../cloudinary-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('\n✨ Upload completed!');
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`\n📄 URLs saved to: cloudinary-urls.json`);
}

// Run the upload
uploadAllImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

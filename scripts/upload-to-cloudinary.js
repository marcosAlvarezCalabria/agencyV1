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
const videosDir = path.resolve(__dirname, '../public/assets/videos');

// Function to upload a single image
async function uploadImage(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `AGENCY-V1/${folder}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      quality: 'auto:best',
      fetch_format: 'auto'
    });
    console.log(`✅ Uploaded image: ${path.basename(filePath)} -> ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return null;
  }
}

// Function to upload a single video
async function uploadVideo(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: `AGENCY-V1/${folder}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      quality: 'auto:best',
      // Video-specific optimizations
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });
    console.log(`✅ Uploaded video: ${path.basename(filePath)} -> ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`❌ Error uploading video ${filePath}:`, error.message);
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

// Function to get all video files
function getVideoFiles(dir) {
  const videos = [];

  if (!fs.existsSync(dir)) {
    return videos;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (/\.(mp4|mov|avi|webm|mkv)$/i.test(file)) {
      videos.push({
        filePath: path.join(dir, file),
        fileName: file
      });
    }
  }

  return videos;
}

// Main upload function
async function uploadAll() {
  console.log('🚀 Starting upload to Cloudinary...\n');

  const results = {
    images: { success: [], failed: [] },
    videos: { success: [], failed: [] }
  };

  // Upload images
  const images = getImageFiles(toursDir);
  console.log(`📸 Found ${images.length} images to upload\n`);

  for (const image of images) {
    const result = await uploadImage(image.filePath, `images/${image.tourFolder}`);
    if (result) {
      results.images.success.push({
        localPath: image.filePath,
        cloudinaryUrl: result.secure_url,
        tourFolder: image.tourFolder,
        fileName: image.fileName
      });
    } else {
      results.images.failed.push(image.filePath);
    }
  }

  // Upload videos
  const videos = getVideoFiles(videosDir);
  console.log(`\n🎥 Found ${videos.length} videos to upload\n`);

  for (const video of videos) {
    const result = await uploadVideo(video.filePath, 'videos');
    if (result) {
      results.videos.success.push({
        localPath: video.filePath,
        cloudinaryUrl: result.secure_url,
        fileName: video.fileName
      });
    } else {
      results.videos.failed.push(video.filePath);
    }
  }

  // Save results to a JSON file
  const outputPath = path.resolve(__dirname, '../cloudinary-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('\n✨ Upload completed!');
  console.log(`📸 Images - Success: ${results.images.success.length} | Failed: ${results.images.failed.length}`);
  console.log(`🎥 Videos - Success: ${results.videos.success.length} | Failed: ${results.videos.failed.length}`);
  console.log(`\n📄 URLs saved to: cloudinary-urls.json`);
}

// Run the upload
uploadAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

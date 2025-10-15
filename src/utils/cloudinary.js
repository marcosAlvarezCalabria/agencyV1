/**
 * Cloudinary Media URL Generator
 * Generates optimized image and video URLs from Cloudinary CDN
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name_here';
const BASE_IMAGE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const BASE_VIDEO_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload`;

/**
 * Generate a Cloudinary URL for an image
 * @param {string} publicId - The public ID of the image in Cloudinary (e.g., 'agency-cusco/laguna_humantay/laguna_humantay_1.jpg')
 * @param {Object} options - Transformation options
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @param {string} options.crop - Crop mode (fill, fit, scale, etc.)
 * @param {string} options.quality - Image quality (auto, auto:best, auto:good, auto:eco, auto:low, or 1-100)
 * @param {string} options.format - Image format (auto, webp, jpg, png, etc.)
 * @returns {string} The Cloudinary URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto:best',
    format = 'auto',
    gravity = 'auto',
  } = options;

  const transformations = [];

  // Add quality transformation
  if (quality) {
    transformations.push(`q_${quality}`);
  }

  // Add format transformation
  if (format) {
    transformations.push(`f_${format}`);
  }

  // Add dimension transformations
  if (width || height) {
    const dimensions = [];
    if (width) dimensions.push(`w_${width}`);
    if (height) dimensions.push(`h_${height}`);
    if (crop) dimensions.push(`c_${crop}`);
    if (gravity) dimensions.push(`g_${gravity}`);
    transformations.push(dimensions.join(','));
  }

  const transformationString = transformations.length > 0
    ? `/${transformations.join('/')}`
    : '';

  return `${BASE_IMAGE_URL}${transformationString}/${publicId}`;
}

/**
 * Get tour image URL from Cloudinary
 * @param {string} tourSlug - The tour slug (e.g., 'laguna_humantay')
 * @param {string} imageName - The image name (e.g., 'laguna_humantay_1.jpg')
 * @param {Object} options - Transformation options
 * @returns {string} The Cloudinary URL
 */
export function getTourImageUrl(tourSlug, imageName, options = {}) {
  const publicId = `AGENCY-V1/images/${tourSlug}/${imageName}`;
  return getCloudinaryUrl(publicId, options);
}

/**
 * Get tour card image URL (optimized for cards)
 * @param {string} tourSlug - The tour slug
 * @param {string} imageName - The image name
 * @returns {string} The Cloudinary URL optimized for card display
 */
export function getTourCardImageUrl(tourSlug, imageName) {
  return getTourImageUrl(tourSlug, imageName, {
    width: 400,
    height: 300,
    crop: 'fill',
    quality: 'auto:good',
    format: 'auto',
    gravity: 'auto'
  });
}

/**
 * Get tour hero image URL (optimized for hero sections)
 * @param {string} tourSlug - The tour slug
 * @param {string} imageName - The image name
 * @returns {string} The Cloudinary URL optimized for hero display
 */
export function getTourHeroImageUrl(tourSlug, imageName) {
  return getTourImageUrl(tourSlug, imageName, {
    width: 1920,
    height: 1080,
    crop: 'fill',
    quality: 'auto:best',
    format: 'auto',
    gravity: 'auto'
  });
}

/**
 * Get tour gallery image URL (optimized for galleries)
 * @param {string} tourSlug - The tour slug
 * @param {string} imageName - The image name
 * @returns {string} The Cloudinary URL optimized for gallery display
 */
export function getTourGalleryImageUrl(tourSlug, imageName) {
  return getTourImageUrl(tourSlug, imageName, {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto:good',
    format: 'auto',
    gravity: 'auto'
  });
}

/**
 * Check if Cloudinary is configured
 * @returns {boolean} True if Cloudinary is configured
 */
export function isCloudinaryConfigured() {
  return CLOUDINARY_CLOUD_NAME && CLOUDINARY_CLOUD_NAME !== 'your_cloud_name_here';
}

/**
 * Get fallback local image URL if Cloudinary is not configured
 * @param {string} tourSlug - The tour slug
 * @param {string} imageName - The image name
 * @returns {string} The local image URL
 */
export function getLocalImageUrl(tourSlug, imageName) {
  return `/assets/images/tours/${tourSlug}/${imageName}`;
}

/**
 * Get image URL with fallback to local if Cloudinary is not configured
 * @param {string} tourSlug - The tour slug
 * @param {string} imageName - The image name
 * @param {Object} options - Transformation options
 * @returns {string} The image URL (Cloudinary or local fallback)
 */
export function getImageUrl(tourSlug, imageName, options = {}) {
  if (isCloudinaryConfigured()) {
    return getTourImageUrl(tourSlug, imageName, options);
  }
  return getLocalImageUrl(tourSlug, imageName);
}

// ==================== VIDEO FUNCTIONS ====================

/**
 * Generate a Cloudinary URL for a video
 * @param {string} publicId - The public ID of the video in Cloudinary (e.g., 'agency-cusco/videos/hero-video.mp4')
 * @param {Object} options - Transformation options
 * @param {number} options.width - Video width
 * @param {number} options.height - Video height
 * @param {string} options.quality - Video quality (auto, auto:best, auto:good, auto:eco, auto:low)
 * @param {string} options.format - Video format (auto, mp4, webm, etc.)
 * @returns {string} The Cloudinary video URL
 */
export function getCloudinaryVideoUrl(publicId, options = {}) {
  const {
    width,
    height,
    quality = 'auto:best',
    format = 'auto',
  } = options;

  const transformations = [];

  // Add quality transformation
  if (quality) {
    transformations.push(`q_${quality}`);
  }

  // Add format transformation
  if (format) {
    transformations.push(`f_${format}`);
  }

  // Add dimension transformations
  if (width || height) {
    const dimensions = [];
    if (width) dimensions.push(`w_${width}`);
    if (height) dimensions.push(`h_${height}`);
    dimensions.push('c_limit'); // Limit to maintain aspect ratio
    transformations.push(dimensions.join(','));
  }

  const transformationString = transformations.length > 0
    ? `/${transformations.join('/')}`
    : '';

  return `${BASE_VIDEO_URL}${transformationString}/${publicId}`;
}

/**
 * Get video URL from Cloudinary
 * @param {string} videoName - The video file name (e.g., 'hero-video.mp4')
 * @param {Object} options - Transformation options
 * @returns {string} The Cloudinary video URL
 */
export function getVideoUrl(videoName, options = {}) {
  const publicId = `AGENCY-V1/videos/${videoName}`;
  return getCloudinaryVideoUrl(publicId, options);
}

/**
 * Get hero video URL (optimized for hero sections)
 * @param {string} videoName - The video file name
 * @returns {string} The Cloudinary video URL optimized for hero display
 */
export function getHeroVideoUrl(videoName) {
  return getVideoUrl(videoName, {
    width: 1920,
    height: 1080,
    quality: 'auto:good',
    format: 'auto'
  });
}

/**
 * Get fallback local video URL if Cloudinary is not configured
 * @param {string} videoName - The video file name
 * @returns {string} The local video URL
 */
export function getLocalVideoUrl(videoName) {
  return `/assets/videos/${videoName}`;
}

/**
 * Get video URL with fallback to local if Cloudinary is not configured
 * @param {string} videoName - The video file name
 * @param {Object} options - Transformation options
 * @returns {string} The video URL (Cloudinary or local fallback)
 */
export function getVideoUrlWithFallback(videoName, options = {}) {
  if (isCloudinaryConfigured()) {
    return getVideoUrl(videoName, options);
  }
  return getLocalVideoUrl(videoName);
}

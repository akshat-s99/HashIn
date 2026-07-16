import cloudinary from '../config/cloudinary.js';

/**
 * Extracts the public_id from a Cloudinary URL.
 * Example URL: https://res.cloudinary.com/demo/image/upload/v1570979139/folder/sample.jpg
 * Returns: folder/sample
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  // Match everything after /upload/ (including optional versioning /v1234/) and before the file extension
  const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Deletes a file from Cloudinary given its URL.
 */
export const deleteFromCloudinaryByUrl = async (url) => {
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error(`Failed to delete from Cloudinary (${publicId}):`, error);
      return false;
    }
  }
  return false;
};

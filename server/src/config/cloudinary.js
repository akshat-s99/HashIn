import { v2 as cloudinary } from 'cloudinary';

// Note: Cloudinary will automatically pick up CLOUDINARY_URL from process.env if present.
// Alternatively, we can configure it explicitly if individual keys are provided.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

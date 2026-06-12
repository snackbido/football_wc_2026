import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary.
 * @param fileStr Base64 data URI string of the image.
 * @returns Secure URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (fileStr: string): Promise<string> => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "wc2026",
      resource_type: "auto",
    });
    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary using environment variables
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * Uploads an image to Cloudinary.
 * @param fileStr Base64 data URI string of the image.
 * @returns Secure URL of the uploaded image.
 */
const uploadImageToCloudinary = async (fileStr) => {
    try {
        const uploadResponse = await cloudinary_1.v2.uploader.upload(fileStr, {
            folder: "wc2026",
            resource_type: "auto",
        });
        return uploadResponse.secure_url;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;

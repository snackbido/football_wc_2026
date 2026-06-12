import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env" });
const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error(
      "[DB] ❌ Lỗi: Biến môi trường MONGO_URI chưa được cấu hình trong file .env",
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`[DB] ✅ Kết nối MongoDB thành công: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[DB] ❌ Kết nối MongoDB thất bại: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[DB] ⚠️  MongoDB bị ngắt kết nối.");
});

mongoose.connection.on("reconnected", () => {
  console.log("[DB] 🔄 MongoDB đã kết nối lại thành công.");
});

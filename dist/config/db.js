"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: ".env" });
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    if (!MONGO_URI) {
        console.error("[DB] ❌ Lỗi: Biến môi trường MONGO_URI chưa được cấu hình trong file .env");
        process.exit(1);
    }
    try {
        const conn = await mongoose_1.default.connect(MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`[DB] ✅ Kết nối MongoDB thành công: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`[DB] ❌ Kết nối MongoDB thất bại: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
mongoose_1.default.connection.on("disconnected", () => {
    console.warn("[DB] ⚠️  MongoDB bị ngắt kết nối.");
});
mongoose_1.default.connection.on("reconnected", () => {
    console.log("[DB] 🔄 MongoDB đã kết nối lại thành công.");
});

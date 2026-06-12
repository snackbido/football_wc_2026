"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const match_1 = __importDefault(require("./routes/match"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config({ path: ".env" });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// 1. Middlewares toàn cục
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Kết nối database ngay khi khởi động server
(0, db_1.connectDB)();
// 2. Định tuyến các Router con
app.use("/api/matches", match_1.default);
app.use("/api/users", user_1.default);
app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "Backend Express.js đang chạy mượt mà!",
        timestamp: new Date().toISOString(),
    });
});
app.listen(PORT, () => {
    console.log(`[Server] Express đang chạy tại: http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import matchRouter from "./routes/match";
import userRouter from "./routes/user";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares toàn cục
app.use(cors());
app.use(express.json());

// Kết nối database ngay khi khởi động server
connectDB();

// 2. Định tuyến các Router con
app.use("/api/matches", matchRouter);
app.use("/api/users", userRouter);

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

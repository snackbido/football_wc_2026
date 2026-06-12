import { Router, Request, Response } from "express";
import { registerOrVerifyUser, getLeaderboard } from "../services/userService";

const userRouter = Router();

// ─────────────────────────────────────────────
//  GET /api/users/leaderboard
// ─────────────────────────────────────────────
userRouter.get("/leaderboard", async (req: Request, res: Response) => {
  try {
    const leaderboard = await getLeaderboard();
    res.status(200).json({ status: "success", data: leaderboard });
  } catch (error: any) {
    res.status(500).json({ status: "fail", data: null, message: error.message });
  }
});

// ─────────────────────────────────────────────
//  POST /api/users/register
//  Đăng ký mới hoặc đăng nhập bằng token
//
//  Body: { name: string, email: string, token?: string }
//
//  Flow:
//   • name + email chưa có → sinh token, gửi email, lưu DB  (201)
//   • đã có + token đúng   → đăng nhập thành công           (200)
//   • đã có + thiếu token  → yêu cầu nhập token             (400)
//   • đã có + token sai    → xác thực thất bại              (401)
// ─────────────────────────────────────────────
userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, token } = req.body;

    // Validate đầu vào
    if (!name || typeof name !== "string" || name.trim() === "") {
      res
        .status(400)
        .json({ status: "fail", data: null, message: "Trường 'name' là bắt buộc." });
      return;
    }
    if (!email || typeof email !== "string" || email.trim() === "") {
      res
        .status(400)
        .json({ status: "fail", data: null, message: "Trường 'email' là bắt buộc." });
      return;
    }

    // Gọi service xử lý logic chính
    const result = await registerOrVerifyUser(
      name.trim(),
      email.trim(),
      token?.trim()
    );

    if (result.status === "registered") {
      res.status(201).json({
        status: "success",
        data: {
          type: "registered",
          user: sanitizeUser(result.user),
        },
        message: result.message,
      });
      return;
    }

    if (result.status === "token_match") {
      res.status(200).json({
        status: "success",
        data: {
          type: "token_match",
          user: sanitizeUser(result.user),
        },
        message: result.message,
      });
      return;
    }

    if (result.status === "token_required") {
      res.status(400).json({
        status: "fail",
        data: null,
        message: result.message,
      });
      return;
    }

    res.status(401).json({
      status: "fail",
      data: null,
      message: result.message,
    });
  } catch (error: any) {
    console.error("[UserRoute] ❌ Lỗi POST /register:", error.message);
    res.status(500).json({ status: "fail", data: null, message: error.message });
  }
});

const sanitizeUser = (user: any) => ({
  _id:     user._id,
  name:    user.name,
  email:   user.email,
  avatar:  user.avatar,
  balance: user.balance,
});

export default userRouter;

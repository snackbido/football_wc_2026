import { Router, Request, Response } from "express";
import { registerOrVerifyUser, getLeaderboard } from "../services/userService";
import { Match } from "../models/Match";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

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
    const { name, email, token, avatar } = req.body;

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
      token?.trim(),
      avatar?.trim()
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

// GET /api/users/:userId/bets
userRouter.get("/:userId/bets", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const matches = await Match.find({ "bets.userId": userId });
    
    const predictionsMap: Record<number, any> = {};
    matches.forEach(m => {
      const userBet = m.bets.find((b: any) => b.userId.toString() === userId);
      if (userBet) {
        predictionsMap[m.apiMatchId] = {
          supportedTeam: userBet.predictedWinner === "HOME" ? "home" : "away",
          homeScore: userBet.predictedScore.home,
          awayScore: userBet.predictedScore.away,
          amount: userBet.betAmount,
          votedAt: userBet.betTime
        };
      }
    });

    res.json({ status: "success", data: predictionsMap });
  } catch (error: any) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

// POST /api/users/upload
userRouter.post("/upload", async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    if (!image) {
      res.status(400).json({ status: "fail", message: "Trường 'image' là bắt buộc (base64 Data URL)." });
      return;
    }
    
    const imageUrl = await uploadImageToCloudinary(image);
    res.json({ status: "success", data: { url: imageUrl } });
  } catch (error: any) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

export default userRouter;

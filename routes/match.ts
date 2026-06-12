import { Router } from "express";
import { Match } from "../models/Match";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMatchHead2Head, getWcMatches } from "../services/axios";

const matchRouter = Router();

// GET: /api/matches
matchRouter.get("/", async (req, res) => {
  try {
    // const matches = await Match.find({}).sort({ matchTime: 1 });
    const matches = await getWcMatches();
    res.json({ status: "success", data: matches });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST: /api/matches/:id/bet
matchRouter.post("/:id/bet", async (req, res) => {
  try {
    const matchId = req.params.id; // Lấy param trong Express
    const { userId, predictedWinner, predictedScore, betAmount } = req.body; // Lấy body trong Express

    // ... Toàn bộ logic kiểm tra tiền, thời gian, trừ ví (Giữ nguyên từ bài trước) ...
    // Thay vì return c.json({...}) thì bạn dùng:
    // return res.json({ status: 'success', data: updatedMatch })
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

matchRouter.get("/:id/ai-analyze", async (req, res) => {
  try {
    const matchId = req.params.id;

    // 1. Lấy dữ liệu thống kê đối đầu (aggregates) từ API bóng đá
    const aggregates = await getMatchHead2Head(matchId);

    if (!aggregates) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Hai đội này chưa từng gặp nhau trong quá khứ.",
        });
    }

    // 2. Khởi tạo Gemini AI
    // Nhớ đảm bảo bạn đã thêm GEMINI_API_KEY="Mã_API_của_bạn" vào file .env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Xây dựng Prompt (Câu lệnh nhồi dữ liệu thực cho AI)
    // Tên đội có thể lấy trực tiếp từ data trả về
    const homeName = aggregates.homeTeam.name || "Đội Nhà";
    const awayName = aggregates.awayTeam.name || "Đội Khách";

    const prompt = `
      Bạn là một chuyên gia phân tích bóng đá. Hãy phân tích ngắn gọn trận đấu giữa ${homeName} và ${awayName} dựa trên dữ liệu đối đầu lịch sử (Head-to-Head) chính xác sau:
      - Tổng số trận đã gặp nhau: ${aggregates.numberOfMatches} trận.
      - Tổng số bàn thắng đã ghi: ${aggregates.totalGoals} bàn.
      - Thành tích của ${homeName}: Thắng ${aggregates.homeTeam.wins}, Hòa ${aggregates.homeTeam.draws}, Thua ${aggregates.homeTeam.losses}.
      - Thành tích của ${awayName}: Thắng ${aggregates.awayTeam.wins}, Hòa ${aggregates.awayTeam.draws}, Thua ${aggregates.awayTeam.losses}.
      
      Yêu cầu đầu ra:
      1. Đánh giá ngắn gọn xem đội nào đang có lợi thế lịch sử (khắc tinh của đối thủ).
      2. Đưa ra dự đoán tỷ lệ chiến thắng (Ví dụ: 60% - 40%).
      3. Đưa ra 1 lời khuyên vui vẻ, lôi cuốn cho người dùng đang chuẩn bị bấm nút bình chọn.
      Yêu cầu hình thức: Viết dưới 150 từ, trình bày thành các gạch đầu dòng rõ ràng.
    `;

    // 4. Gửi yêu cầu cho AI và chờ kết quả
    const result = await model.generateContent(prompt);
    const aiTextResponse = result.response.text();

    // 5. Trả cả text của AI và số liệu H2H gốc về cho Frontend
    res.json({
      status: "success",
      data: {
        rawH2hStats: aggregates, // Gửi kèm số liệu để Frontend có thể hiển thị thêm biểu đồ nếu thích
        aiAnalysis: aiTextResponse,
      },
    });
  } catch (error: any) {
    console.error("Lỗi hệ thống phân tích:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default matchRouter;

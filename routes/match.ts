import { Request, Response } from 'express';
import { Router } from "express";
import { Match } from "../models/Match";
import { User } from "../models/User";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMatchHead2Head, getWcMatches, getMatchById } from "../services/axios";

const matchRouter = Router();

// GET: /api/matches
matchRouter.get("/", async (req: Request, res: Response) => {
  try {
    // const matches = await Match.find({}).sort({ matchTime: 1 });
    const matches = await getWcMatches();
    res.json({ status: "success", data: matches });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET: /api/matches/:id
matchRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const matchId = parseInt(req.params.id as string, 10);
    if (isNaN(matchId)) {
      return res.status(400).json({ status: "error", message: "ID trận đấu không hợp lệ" });
    }

    const match = await Match.findOne({ apiMatchId: matchId })
      .populate("bets.userId", "name avatar");

    if (match) {
      return res.json({ status: "success", data: match });
    } else {
      return res.json({
        status: "success",
        data: {
          apiMatchId: matchId,
          bets: [],
          stats: {
            totalBetsHome: 0,
            totalBetsAway: 0,
            totalBetsDraw: 0,
            totalPoolMoney: 0
          }
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST: /api/matches/:id/bet
matchRouter.post("/:id/bet", async (req: Request, res: Response) => {
  try {
    const matchId = req.params.id as string;
    const apiMatchId = parseInt(matchId, 10);
    if (isNaN(apiMatchId)) {
      return res.status(400).json({ status: "error", message: "ID trận đấu không hợp lệ" });
    }

    const { userId, predictedWinner, predictedScore, betAmount } = req.body;

    if (!userId) {
      return res.status(400).json({ status: "error", message: "Trường 'userId' là bắt buộc." });
    }
    if (!predictedWinner || !["HOME", "AWAY", "DRAW"].includes(predictedWinner)) {
      return res.status(400).json({ status: "error", message: "Dự đoán đội chiến thắng không hợp lệ." });
    }
    if (!predictedScore || typeof predictedScore.home !== "number" || typeof predictedScore.away !== "number") {
      return res.status(400).json({ status: "error", message: "Dự đoán tỷ số không hợp lệ." });
    }
    if (typeof betAmount !== "number" || betAmount < 5000 || betAmount > 50000) {
      return res.status(400).json({ status: "error", message: "Số tiền đặt cược phải từ 5.000đ đến 50.000đ." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "Người dùng không tồn tại." });
    }

    let match = await Match.findOne({ apiMatchId });

    if (!match) {
      let homeTeam = { name: "", logo: "" };
      let awayTeam = { name: "", logo: "" };
      let matchTime = new Date();
      let status = "SCHEDULED";

      try {
        const apiMatch = await getMatchById(apiMatchId);
        if (apiMatch) {
          homeTeam = {
            name: apiMatch.homeTeam?.name || "Chưa xác định",
            logo: apiMatch.homeTeam?.crest || ""
          };
          awayTeam = {
            name: apiMatch.awayTeam?.name || "Chưa xác định",
            logo: apiMatch.awayTeam?.crest || ""
          };
          matchTime = new Date(apiMatch.utcDate);
          status = apiMatch.status || "SCHEDULED";
        }
      } catch (fetchErr) {
        console.warn(`Lỗi khi gọi API football-data cho trận ${apiMatchId}, sử dụng fallback từ body:`, fetchErr);
        if (req.body.homeTeam && req.body.awayTeam && req.body.matchTime) {
          homeTeam = {
            name: req.body.homeTeam.name || "Chưa xác định",
            logo: req.body.homeTeam.logo || req.body.homeTeam.crest || ""
          };
          awayTeam = {
            name: req.body.awayTeam.name || "Chưa xác định",
            logo: req.body.awayTeam.logo || req.body.awayTeam.crest || ""
          };
          matchTime = new Date(req.body.matchTime);
          status = req.body.status || "SCHEDULED";
        } else {
          return res.status(400).json({ status: "error", message: "Không thể lấy thông tin trận đấu để tạo mới." });
        }
      }

      match = new Match({
        apiMatchId,
        homeTeam,
        awayTeam,
        matchTime,
        status,
        bets: [],
        stats: {
          totalBetsHome: 0,
          totalBetsAway: 0,
          totalBetsDraw: 0,
          totalPoolMoney: 0
        }
      });
    }

    const alreadyVoted = match.bets.some((bet: any) => bet.userId.toString() === userId.toString());
    if (alreadyVoted) {
      return res.status(400).json({ status: "error", message: "Bạn đã bình chọn cho trận đấu này rồi." });
    }

    const isFinished = match.status === "FINISHED";
    const isLive = match.status === "LIVE" || match.status === "IN_PLAY" || match.status === "PAUSED";
    if (isFinished || isLive) {
      return res.status(400).json({ status: "error", message: "Trận đấu đã bắt đầu hoặc đã kết thúc, cổng bình chọn đã khóa." });
    }

    const now = new Date();
    const matchDate = new Date(match.matchTime);
    const diffMs = matchDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs <= 2 * 60 * 1000) {
      return res.status(400).json({ status: "error", message: "Cổng bình chọn đã khóa (đóng trước trận đấu 2 phút)." });
    }
    if (diffHours > 12) {
      return res.status(400).json({ status: "error", message: "Cổng bình chọn chưa mở (chỉ mở trước trận đấu 12 tiếng)." });
    }

    match.bets.push({
      userId,
      predictedWinner,
      predictedScore,
      betAmount,
      betTime: new Date()
    });

    if (predictedWinner === "HOME") {
      match.stats.totalBetsHome += 1;
    } else if (predictedWinner === "AWAY") {
      match.stats.totalBetsAway += 1;
    } else if (predictedWinner === "DRAW") {
      match.stats.totalBetsDraw += 1;
    }
    match.stats.totalPoolMoney += betAmount;

    const updatedMatch = await match.save();
    const populatedMatch = await Match.findById(updatedMatch._id).populate("bets.userId", "name avatar");

    return res.json({ status: "success", data: populatedMatch });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

matchRouter.get("/:id/ai-analyze", async (req: Request, res: Response) => {
  try {
    const matchId = req.params.id as string;
    const apiMatchId = parseInt(matchId, 10);
    if (isNaN(apiMatchId)) {
      return res.status(400).json({ status: "error", message: "ID trận đấu không hợp lệ" });
    }

    // 1. Kiểm tra xem trận đấu đã có bài phân tích AI lưu trong DB chưa
    let dbMatch = await Match.findOne({ apiMatchId });
    if (dbMatch && dbMatch.aiAnalysis) {
      let aggregates = null;
      let noH2h = false;
      try {
        aggregates = await getMatchHead2Head(matchId);
        if (!aggregates || aggregates.numberOfMatches === 0) {
          noH2h = true;
        }
      } catch (err) {
        console.warn("Không thể lấy H2H khi tải cache:", err);
      }

      let aiResult;
      try {
        aiResult = JSON.parse(dbMatch.aiAnalysis);
      } catch (e) {
        aiResult = {
          analysis: dbMatch.aiAnalysis,
          homeChance: 50,
          awayChance: 50
        };
      }

      return res.json({
        status: "success",
        data: {
          rawH2hStats: noH2h ? null : aggregates,
          aiAnalysis: aiResult.analysis,
          homeChance: aiResult.homeChance,
          awayChance: aiResult.awayChance,
          noH2h: noH2h || aiResult.analysis === "Chưa có thành tích đối đầu",
          cached: true
        }
      });
    }

    // 2. Lấy dữ liệu đối đầu (H2H) từ API bóng đá
    let aggregates = null;
    let hasH2h = true;
    try {
      aggregates = await getMatchHead2Head(matchId);
      if (!aggregates || aggregates.numberOfMatches === 0) {
        hasH2h = false;
      }
    } catch (error) {
      console.warn("Không lấy được H2H, coi như chưa có đối đầu:", error);
      hasH2h = false;
    }

    // Tìm hoặc khởi tạo tài liệu trận đấu trong MongoDB
    if (!dbMatch) {
      let homeTeam = { name: "Chưa xác định", logo: "" };
      let awayTeam = { name: "Chưa xác định", logo: "" };
      let matchTime = new Date();
      let status = "SCHEDULED";

      try {
        const apiMatch = await getMatchById(apiMatchId);
        if (apiMatch) {
          homeTeam = {
            name: apiMatch.homeTeam?.name || "Chưa xác định",
            logo: apiMatch.homeTeam?.crest || ""
          };
          awayTeam = {
            name: apiMatch.awayTeam?.name || "Chưa xác định",
            logo: apiMatch.awayTeam?.crest || ""
          };
          matchTime = new Date(apiMatch.utcDate);
          status = apiMatch.status || "SCHEDULED";
        }
      } catch (err) {
        console.warn("Lỗi fetch match details trong AI analyze:", err);
      }

      dbMatch = new Match({
        apiMatchId,
        homeTeam,
        awayTeam,
        matchTime,
        status,
        bets: [],
        stats: {
          totalBetsHome: 0,
          totalBetsAway: 0,
          totalBetsDraw: 0,
          totalPoolMoney: 0
        }
      });
    }

    // Nếu không có lịch sử đối đầu
    if (!hasH2h) {
      const noH2hMessage = "Chưa có thành tích đối đầu";
      dbMatch.aiAnalysis = JSON.stringify({
        analysis: noH2hMessage,
        homeChance: 0,
        awayChance: 0
      });
      await dbMatch.save();

      return res.json({
        status: "success",
        data: {
          rawH2hStats: null,
          aiAnalysis: noH2hMessage,
          homeChance: 0,
          awayChance: 0,
          noH2h: true
        }
      });
    }

    // 3. Gọi mô hình Gemini AI để phân tích trận đấu
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const homeName = dbMatch.homeTeam.name || aggregates.homeTeam.name || "Đội Nhà";
    const awayName = dbMatch.awayTeam.name || aggregates.awayTeam.name || "Đội Khách";

    const prompt = `
      Bạn là một chuyên gia phân tích bóng đá. Hãy phân tích ngắn gọn trận đấu sắp tới giữa ${homeName} và ${awayName} dựa trên dữ liệu đối đầu lịch sử (Head-to-Head) sau:
      - Tổng số trận đã gặp nhau: ${aggregates.numberOfMatches} trận.
      - Tổng số bàn thắng đã ghi: ${aggregates.totalGoals} bàn.
      - Thành tích của ${homeName}: Thắng ${aggregates.homeTeam.wins}, Hòa ${aggregates.homeTeam.draws}, Thua ${aggregates.homeTeam.losses}.
      - Thành tích của ${awayName}: Thắng ${aggregates.awayTeam.wins}, Hòa ${aggregates.awayTeam.draws}, Thua ${aggregates.awayTeam.losses}.
      
      Yêu cầu phân tích:
      1. Đánh giá ngắn gọn xem đội nào đang có lợi thế lịch sử.
      2. Đưa ra 1 lời khuyên vui vẻ, lôi cuốn cho người dùng.
      Viết ngắn gọn, dưới 100 từ, sử dụng các gạch đầu dòng rõ ràng.
      
      Hãy ước lượng tỷ lệ phần trăm chiến thắng của hai đội (phải là số nguyên, tổng 2 tỷ lệ không vượt quá 100% - ví dụ: homeChance: 55, awayChance: 45).
      
      Trả về kết quả duy nhất ở định dạng JSON sau:
      {
        "analysis": "nội dung phân tích bằng tiếng Việt dạng các gạch đầu dòng",
        "homeChance": 55,
        "awayChance": 45
      }
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    let parsedJson;
    try {
      parsedJson = JSON.parse(textResponse);
    } catch (err) {
      console.error("Lỗi parse JSON từ Gemini:", textResponse);
      parsedJson = {
        analysis: textResponse,
        homeChance: 50,
        awayChance: 50
      };
    }

    // 4. Lưu bài phân tích AI vào MongoDB
    dbMatch.aiAnalysis = JSON.stringify(parsedJson);
    await dbMatch.save();

    res.json({
      status: "success",
      data: {
        rawH2hStats: aggregates,
        aiAnalysis: parsedJson.analysis,
        homeChance: parsedJson.homeChance,
        awayChance: parsedJson.awayChance,
        noH2h: false
      }
    });
  } catch (error: any) {
    console.error("Lỗi hệ thống phân tích:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default matchRouter;

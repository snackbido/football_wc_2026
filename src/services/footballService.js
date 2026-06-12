import axiosInstance from "../api/axiosInstance";

export const getWorldCupMatches = async () => {
  try {
    const response = await axiosInstance.get("/matches");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching World Cup matches:", error);
    throw error;
  }
};

export const getMatchDetails = async (matchId) => {
  try {
    const response = await axiosInstance.get(`/matches/${matchId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for match ${matchId}:`, error);
    throw error;
  }
};

export const placeMatchBet = async (matchId, userId, predictedWinner, predictedScore, betAmount, matchDetails) => {
  try {
    const response = await axiosInstance.post(`/matches/${matchId}/bet`, {
      userId,
      predictedWinner,
      predictedScore,
      betAmount,
      homeTeam: matchDetails?.homeTeam,
      awayTeam: matchDetails?.awayTeam,
      matchTime: matchDetails?.utcDate,
      status: matchDetails?.status
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Đã xảy ra lỗi khi đặt cược");
    }
    throw error;
  }
};

export const getAiAnalysis = async (matchId) => {
  try {
    const response = await axiosInstance.get(`/matches/${matchId}/ai-analyze`);
    console.log(response);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Đã xảy ra lỗi khi phân tích AI");
    }
    throw error;
  }
};

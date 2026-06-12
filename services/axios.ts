import axios from "axios";

const footballApi = axios.create({
  baseURL: "https://api.football-data.org/v4",
  headers: {
    "X-Auth-Token": process.env.FOOTBALL_API_KEY,
  },
});

// 2. Viết Service lấy dữ liệu các trận đấu World Cup
export const getWcMatches = async () => {
  try {
    const response = await footballApi.get("/competitions/WC/matches");
    return response.data.matches;
  } catch (error) {
    console.error("Lỗi khi gọi API bóng đá:", error);
    throw new Error("Không thể lấy dữ liệu lịch thi đấu");
  }
};

export const getMatchHead2Head = async (matchId: string) => {
  try {
    const response = await footballApi.get(`/matches/${matchId}/head2head`);
    // API này trả về object có chứa thuộc tính "aggregates" (thống kê tổng hợp lịch sử)
    return response.data.aggregates;
  } catch (error) {
    console.error(`Lỗi khi lấy H2H trận ${matchId}:`, error);
    throw new Error("Không thể lấy dữ liệu thành tích đối đầu từ API bóng đá.");
  }
};

export const getMatchById = async (matchId: number | string) => {
  try {
    const response = await footballApi.get(`/matches/${matchId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy trận đấu ${matchId}:`, error);
    throw new Error("Không thể lấy dữ liệu trận đấu");
  }
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchById = exports.getMatchHead2Head = exports.getWcMatches = void 0;
const axios_1 = __importDefault(require("axios"));
const footballApi = axios_1.default.create({
    baseURL: "https://api.football-data.org/v4",
    headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY,
    },
});
// 2. Viết Service lấy dữ liệu các trận đấu World Cup
const getWcMatches = async () => {
    try {
        const response = await footballApi.get("/competitions/WC/matches");
        return response.data.matches;
    }
    catch (error) {
        console.error("Lỗi khi gọi API bóng đá:", error);
        throw new Error("Không thể lấy dữ liệu lịch thi đấu");
    }
};
exports.getWcMatches = getWcMatches;
const getMatchHead2Head = async (matchId) => {
    try {
        const response = await footballApi.get(`/matches/${matchId}/head2head`);
        // API này trả về object có chứa thuộc tính "aggregates" (thống kê tổng hợp lịch sử)
        return response.data.aggregates;
    }
    catch (error) {
        console.error(`Lỗi khi lấy H2H trận ${matchId}:`, error);
        throw new Error("Không thể lấy dữ liệu thành tích đối đầu từ API bóng đá.");
    }
};
exports.getMatchHead2Head = getMatchHead2Head;
const getMatchById = async (matchId) => {
    try {
        const response = await footballApi.get(`/matches/${matchId}`);
        return response.data;
    }
    catch (error) {
        console.error(`Lỗi khi lấy trận đấu ${matchId}:`, error);
        throw new Error("Không thể lấy dữ liệu trận đấu");
    }
};
exports.getMatchById = getMatchById;

import axiosInstance from "../api/axiosInstance";

export const registerOrLoginUser = async (name, email, token, avatar) => {
  try {
    const response = await axiosInstance.post("/users/register", {
      name,
      email,
      token,
      avatar
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Đã xảy ra lỗi hệ thống");
    }
    throw error;
  }
};

export const getUserBets = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/bets`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bets for user ${userId}:`, error);
    throw error;
  }
};

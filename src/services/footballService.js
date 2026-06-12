import axiosInstance from '../api/axiosInstance';

export const getWorldCupMatches = async () => {
  try {
    const response = await axiosInstance.get('/competitions/WC/matches');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching World Cup matches:', error);
    throw error;
  }
};

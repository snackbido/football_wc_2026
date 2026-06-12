import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: {
    'X-Auth-Token': 'f7f5889d647b4383b112a37d3457ea89',
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/parknplay', // Adjust this to your backend URL
});

// Intercept requests to include the Authorization header if access token is present
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to refresh access token when it expires
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await axios.post('http://127.0.0.1:8000/parknplay/token/refresh/', {
      refresh: refreshToken,
    });
    localStorage.setItem('access_token', response.data.access);
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
};

export { api, refreshAccessToken };

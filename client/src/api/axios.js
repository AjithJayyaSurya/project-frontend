import axios from "axios";

const api = axios.create({
  baseURL: `https://project-backend-1-whqs.onrender.com/api`, // backend URL from .env with /api prefix
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❗ Optional: Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.reload(); // auto logout on token expiry
    }
    return Promise.reject(error);
  }
);

export default api;

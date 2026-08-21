import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shoemart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("shoemart_token");
      localStorage.removeItem("shoemart_user");
    }
    return Promise.reject(error);
  }
);

export default api;

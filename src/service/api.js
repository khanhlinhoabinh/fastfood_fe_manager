import axios from "axios";

// Lấy base URL từ biến môi trường
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo instance axios dùng chung
const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;

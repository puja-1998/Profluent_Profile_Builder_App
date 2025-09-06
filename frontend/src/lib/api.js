
//   API Client
//  - Uses Axios
//  - Automatically attaches JWT token from localStorage
//  - Base URL comes from .env (VITE_API_URL)
 
import axios from "axios";

// Create axios instance with base URL
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

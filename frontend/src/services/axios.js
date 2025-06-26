// src/services/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  // baseURL: "https://crm-qyaz.vercel.app",
}); 

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

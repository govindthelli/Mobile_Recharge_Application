import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// JWT token expiration checker
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (err) {
    console.error("Invalid token:", err);
    return true;
  }
};

// Interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      if (isTokenExpired(token)) {
        console.warn("Token expired, removing from storage.");
        localStorage.removeItem("adminToken");
        return Promise.reject(new Error("Token expired"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== Admin APIs ====================

export const loginAdmin = async (username, password) => {
  const response = await api.post("/auth/admin/login", { username, password });

  const token = response.data.token;
  if (token) {
    localStorage.setItem("adminToken", token); // Save the token
  } else {
    console.warn("No token found in login response");
  }

  return response;
};

export const registerSubscriber = (mobileNumber, name, email) => {
  return api.post("/auth/subscriber/register", { mobileNumber, name, email });
};

export const validateMobile = (mobileNumber) => {
  return api.post("/auth/validate-mobile", { mobileNumber });
};

export const getExpiringSubscribers = () => {
  return api.get("/admin/subscribers/expiring");
};

export const getRechargeHistoryByMobile = (mobileNumber) => {
  return api.get(`/admin/subscribers/${mobileNumber}/history`);
};

// ==================== User APIs ====================

export const getPlans = () => {
  return api.get("/user/plans");
};

export const rechargeUser = (mobileNumber, planId, paymentMethod, paymentDetails) => {
  const payload = {
    mobileNumber,
    planId,
    paymentMethod,
    paymentDetails,
  };
  return api.post("/user/recharge", payload);
};

// ==================== Helper ====================

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "/login"; // Redirect or use navigation
};

export default api;

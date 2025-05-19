// src/components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isAuthenticated = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const isExpired = Date.now() > decoded.exp * 1000;
    return !isExpired;
  } catch (err) {
    console.error("Invalid token:", err);
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

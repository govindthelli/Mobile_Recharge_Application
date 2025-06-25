import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, validateMobile } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("mobile");
  const navigate = useNavigate();

  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    const trimmedMobile = mobileNumber.trim();

    if (!trimmedMobile) {
      toast.warning("Mobile number is required");
      return;
    }

    if (!/^\d+$/.test(trimmedMobile)) {
      toast.error("Mobile number must contain only digits (0–9)");
      return;
    }

    if (trimmedMobile.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      const response = await validateMobile(trimmedMobile);
      sessionStorage.setItem("mobileNumber", trimmedMobile);
      sessionStorage.setItem("subscriber", JSON.stringify(response.data));
      sessionStorage.setItem("subscriberName", response.data.name);
      navigate("/recharge");
    } catch (error) {
      toast.error(error.response?.data || "Mobile number not found");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername && !trimmedPassword) {
      toast.warning("Username and Password are required");
      return;
    }

    if (!trimmedUsername) {
      toast.warning("Username is required");
      return;
    }

    if (!trimmedPassword) {
      toast.warning("Password is required");
      return;
    }

    try {
      const response = await loginAdmin(trimmedUsername, trimmedPassword);
      sessionStorage.setItem("adminToken", response.data.token);
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error.response?.data || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* ✅ Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <header className="bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <h4
          className="m-0 fw-bold text-white"
          role="button"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          📱 Telecom Login Portal
        </h4>
        <button className="btn btn-dark" onClick={() => navigate("/")}>
          Home
        </button>
      </header>

      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5 px-3">
        <div
          style={{ maxWidth: 420, width: "100%" }}
          className="bg-white rounded shadow p-4"
        >
          <h5 className="fw-bold text-center mb-2">
            Welcome to Telecom Recharge
          </h5>
          <p className="text-center text-muted mb-4">
            Login as admin or verify your mobile number
          </p>

          <div className="d-flex justify-content-center mb-3">
            <button
              className={`btn me-2 ${
                activeTab === "mobile"
                  ? "btn-outline-primary active"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setActiveTab("mobile")}
            >
              Mobile User
            </button>
            <button
              className={`btn ${
                activeTab === "admin"
                  ? "btn-outline-primary active"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setActiveTab("admin")}
            >
              Admin Login
            </button>
          </div>

          {activeTab === "mobile" && (
            <>
              <form onSubmit={handleMobileSubmit}>
                <div className="mb-3">
                  <h6 className="fw-semibold">Prepaid Mobile Verification</h6>
                  <p className="text-secondary small mb-2">
                    Enter your prepaid mobile number to continue
                  </p>
                  <label
                    htmlFor="mobileNumber"
                    className="form-label fw-medium"
                  >
                    Mobile Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">📞</span>
                    <input
                      type="tel"
                      id="mobileNumber"
                      className="form-control"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10 digit mobile number"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-2">
                  Verify & Continue
                </button>
              </form>

              <div className="text-center my-2">
                Not registered yet? Register now
              </div>
              <button
                className="btn btn-dark w-100"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}

          {activeTab === "admin" && (
            <form onSubmit={handleAdminSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-medium">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

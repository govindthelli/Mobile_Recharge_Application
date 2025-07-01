import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerSubscriber } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SubscriberRegistration() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    name: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Valid email is required.");
      return;
    }

    try {
      await registerSubscriber(
        formData.mobileNumber,
        formData.name,
        formData.email
      );
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMessage =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Registration failed. Please try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <>
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <span className="navbar-brand fw-bold">📱 Telecom Registration Portal</span>
      </nav>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Registration Form */}
      <div
        className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
        style={{ padding: "1rem" }}
      >
        <div
          className="bg-white rounded shadow p-4 animate__animated animate__fadeIn"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="mb-4 text-center">Subscriber Registration</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="mobileNumber" className="form-label">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                className="form-control"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-2">
              Register
            </button>

            {/* Login Redirect */}
            <div className="text-center">
              <span>Already have an account? </span>
              <Link to="/login" className="text-decoration-none">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

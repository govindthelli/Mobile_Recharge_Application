import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSubscriber } from "../services/api"; // Adjust the path if needed

export default function SubscriberRegistration() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    name: "",
    email: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Valid email is required.");
      return;
    }

    try {
      await registerSubscriber(
        formData.mobileNumber,
        formData.name,
        formData.email
      );
      // Navigate to login page after successful registration
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data || "Registration failed. Please try again later."
      );
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
      style={{ padding: "1rem" }}
    >
      <div
        className="bg-white rounded shadow p-4 animate__animated animate__fadeIn"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="mb-4 text-center">Subscriber Registration</h2>

        {error && <div className="alert alert-danger">{error}</div>}

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

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

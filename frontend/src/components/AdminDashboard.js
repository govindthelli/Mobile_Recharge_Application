import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExpiringSubscribers,
  getRechargeHistoryByMobile,
} from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [expiringSubs, setExpiringSubs] = useState([]);
  const [mobile, setMobile] = useState("");
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [selectedMobile, setSelectedMobile] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getExpiringSubscribers()
      .then((res) => setExpiringSubs(res.data))
      .catch(() => toast.error("Failed to load expiring subscribers"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRechargeHistory([]);

    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    fetchRechargeHistory(mobile);
  };

  const fetchRechargeHistory = (mobileNumber) => {
    getRechargeHistoryByMobile(mobileNumber)
      .then((res) => {
        setSelectedMobile(mobileNumber);
        if (res.data && res.data.length > 0) {
          setRechargeHistory(res.data);
        } else {
          toast.info("No recharge history found for this number.");
        }
      })
      .catch(() => toast.error("Failed to fetch recharge history."));
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const getDaysRemaining = (expiryDateStr) => {
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { label: "Expired", className: "bg-danger" };
    if (diff === 0) return { label: "Today", className: "bg-info text-dark" };
    return {
      label: `${diff} day${diff !== 1 ? "s" : ""}`,
      className: "bg-warning text-dark",
    };
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">Welcome, Admin</span>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Expiring Plans Table */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h4 className="card-title fw-semibold mb-2">
            Subscribers with Expiring Plans
          </h4>
          <p className="text-muted small mb-4">
            Plans expiring within the next 3 days
          </p>

          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Email</th>
                  <th>Plan Expires</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expiringSubs.length > 0 ? (
                  expiringSubs.map((sub) => {
                    const badge = getDaysRemaining(sub.planExpiry);
                    return (
                      <tr key={sub.mobileNumber}>
                        <td>{sub.name}</td>
                        <td>{sub.mobileNumber}</td>
                        <td>{sub.email}</td>
                        <td>
                          <span className={`badge ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              fetchRechargeHistory(sub.mobileNumber)
                            }
                          >
                            View History
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No expiring subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Search Recharge History Form */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h4 className="card-title fw-semibold mb-3">
            Search Recharge History by Mobile
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-2 align-items-center">
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-dark btn-lg w-100">
                  View History
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Recharge History Table */}
      {rechargeHistory.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              Recharge History for {selectedMobile}
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rechargeHistory.map((r, i) => (
                    <tr key={i}>
                      <td>{new Date(r.rechargeDate).toLocaleString()}</td>
                      <td>{r.plan.name}</td>
                      <td>₹{r.amount}</td>
                      <td>{r.paymentMethod}</td>
                      <td>
                        <span className="badge text-capitalize bg-success">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlans, validateMobile, registerSubscriber } from "../services/api";

export default function RechargeInterface() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Plans");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriberName, setSubscriberName] = useState("");
  const [searchAmount, setSearchAmount] = useState("");

  const mobileNumber = sessionStorage.getItem("mobileNumber");

  useEffect(() => {
    if (!mobileNumber) {
      alert("Session expired. Please login again.");
      navigate("/login");
    } else {
      const name = sessionStorage.getItem("subscriberName");
      if (name) setSubscriberName(name);
    }
  }, [mobileNumber, navigate]);

  useEffect(() => {
    getPlans()
      .then((response) => {
        setPlans(response.data);
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
      });
  }, []);

  // Automatically switch to "All Plans" when a search amount is entered
  useEffect(() => {
    if (searchAmount !== "") {
      setActiveTab("All Plans");
    }
  }, [searchAmount]);

  const tabs = ["All Plans", "Popular", "Validity", "Data", "Unlimited", "Special"];

  const filteredPlans = plans.filter((plan) => {
    const matchesTab =
      activeTab === "All Plans" ||
      plan.category.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      searchAmount === "" || plan.price.toString() === searchAmount;
    return matchesTab && matchesSearch;
  });

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const PlanCard = ({ plan }) => (
    <div className="card mb-4 shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{plan.name}</h5>
          <span className="fw-bold text-primary">₹{plan.price}</span>
        </div>
        <p className="card-text text-muted">Category: {plan.category}</p>
        <div className="row text-center mb-3">
          <div className="col-6">
            <small className="text-muted d-block">Validity</small>
            <strong>{plan.validityDays} days</strong>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Data</small>
            <strong>{plan.data}</strong>
          </div>
          <div className="col-6 mt-2">
            <small className="text-muted d-block">Calls</small>
            <strong>{plan.calls}</strong>
          </div>
          <div className="col-6 mt-2">
            <small className="text-muted d-block">SMS</small>
            <strong>{plan.sms}</strong>
          </div>
        </div>
        <button
          className="btn btn-dark w-100 mt-auto"
          disabled={loading}
          onClick={async () => {
            if (!mobileNumber) {
              alert("Mobile number not found. Please login again.");
              navigate("/login");
              return;
            }

            setLoading(true);
            try {
              await validateMobile(mobileNumber);
            } catch (error) {
              const status = error.response?.status;
              if (status === 404) {
                const name = prompt("Enter your name to register:");
                const email = prompt("Enter your email:");
                if (!name || !email) {
                  alert("Name and Email are required.");
                  setLoading(false);
                  return;
                }

                try {
                  await registerSubscriber(mobileNumber, name.trim(), email.trim());
                  alert("Subscriber registered successfully.");
                } catch (regError) {
                  alert("Registration failed: " + (regError.response?.data || regError.message));
                  setLoading(false);
                  return;
                }
              } else {
                alert("Error validating mobile number: " + (error.message || "Unknown error"));
                setLoading(false);
                return;
              }
            }

            sessionStorage.setItem("selectedPlan", JSON.stringify(plan));
            navigate("/payment");
          }}
        >
          {loading ? "Processing..." : "Select Plan"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100">
      <header className="bg-white border-bottom shadow-sm py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h5 text-primary mb-0">MobiComm</h1>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">
              Welcome, {subscriberName || mobileNumber}
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container py-4">
        <h2 className="h5 fw-semibold mb-4">Recharge Plans</h2>

        {/* Search bar above tabs */}
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Search by amount (e.g. 199)"
            value={searchAmount}
            onChange={(e) => setSearchAmount(e.target.value)}
          />
        </div>

        {/* Tabs below search bar */}
        <ul className="nav nav-tabs mb-4 overflow-auto flex-nowrap">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active text-primary fw-semibold" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        {/* Plans */}
        <div className="row">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <div className="col-12 col-md-6 col-lg-4" key={plan.id}>
                <PlanCard plan={plan} />
              </div>
            ))
          ) : (
            <div className="text-center text-muted">No plans found</div>
          )}
        </div>
      </main>
    </div>
  );
}

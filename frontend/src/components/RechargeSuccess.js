import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RechargeSuccess = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    const status = sessionStorage.getItem("paymentStatus");
    const planData = sessionStorage.getItem("selectedPlan");
    const txnId = sessionStorage.getItem("transactionId");
    const mobile = sessionStorage.getItem("mobileNumber");

    if (status !== "success" || !planData || !txnId || !mobile) {
      navigate("/recharge");
      return;
    }

    setPlan(JSON.parse(planData));
    setTransactionId(txnId);
    setMobileNumber(mobile);
  }, [navigate]);

  const handleDashboard = () => navigate("/recharge");

  if (!plan) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <nav className="navbar navbar-light bg-white shadow-sm px-4">
        <span className="navbar-brand fw-bold text-primary fs-4">MobiComm</span>
        <div>
          <button className="btn btn-outline-danger btn-sm" onClick={() => navigate("/login")}>Logout</button>
        </div>
      </nav>

      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="card shadow-sm p-4 text-center" style={{ maxWidth: '400px' }}>
          <div className="mb-3">
            <div
              className="rounded-circle d-inline-flex justify-content-center align-items-center bg-white"
              style={{ width: 60, height: 60 }}
            >
              <img
                src="https://cdn2.iconfinder.com/data/icons/greenline/512/check-512.png"
                alt="Success"
                style={{ width: 60, height: 60 }}
              />
            </div>
          </div>
          <h4 className="text-success">Recharge Successful!</h4>
          <p className="mt-2 mb-2">
            Your mobile number <strong>{mobileNumber}</strong> has been recharged successfully with
          </p>
          <p className="text-muted small">Transaction ID: <strong>{transactionId}</strong></p>

          <div className="d-flex justify-content-between border p-3 rounded bg-light">
            <div>
              <div className="text-muted small">Plan</div>
              <strong>{plan.name}</strong>
            </div>
            <div>
              <div className="text-muted small">Amount</div>
              <strong>₹{plan.price}</strong>
            </div>
          </div>

          <p className="text-muted mt-3 small">A confirmation has been sent to your registered email address.</p>

          <div className="mt-4">
            <button className="btn btn-dark w-100" onClick={handleDashboard}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default RechargeSuccess;

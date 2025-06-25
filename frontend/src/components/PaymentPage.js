import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rechargeUser } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [plan, setPlan] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("selectedPlan");
    const storedMobile = sessionStorage.getItem("mobileNumber");

    if (storedPlan) setPlan(JSON.parse(storedPlan));
    else return navigate("/recharge");

    if (storedMobile) setMobileNumber(storedMobile);
    else {
      toast.error("Mobile number missing. Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const validateExpiry = () => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error("Expiry must be in MM/YY format.");
      return false;
    }

    const [monthStr, yearStr] = expiry.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      toast.error("Invalid month in expiry date.");
      return false;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error("Card expired.");
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!mobileNumber) {
      toast.error("Mobile number not found. Please log in again.");
      return navigate("/login");
    }

    if (paymentMethod === "upi") {
      if (!upiId.trim()) return toast.warning("UPI ID is required.");
      if (!upiId.includes("@")) return toast.error("Invalid UPI ID format.");
    }

    if (paymentMethod === "credit" || paymentMethod === "debit") {
      if (!cardNumber.trim()) {
        toast.warning("Card number is required.");
        return;
      }
      if (!/^\d{16}$/.test(cardNumber)) {
        toast.error("Card number must be 16 digits.");
        return;
      }

      if (!expiry.trim()) {
        toast.warning("Expiry is required.");
        return;
      }

      // Call this only after making sure expiry is not empty
      if (!validateExpiry()) return;

      if (!cvv.trim()) {
        toast.warning("CVV is required.");
        return;
      }
      if (!/^\d{3}$/.test(cvv)) {
        toast.error("CVV must be 3 digits.");
        return;
      }
    }

    if (paymentMethod === "bank") {
      if (!selectedBank.trim()) return toast.warning("Please select a bank.");
      if (!accountNumber.trim())
        return toast.warning("Account number is required.");
      if (!/^\d{11,16}$/.test(accountNumber))
        return toast.error("Account number must be 11 to 16 digits.");
      if (!ifsc.trim()) return toast.warning("IFSC code is required.");
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc))
        return toast.error("Invalid IFSC code format.");
    }

    setIsSubmitting(true);

    const paymentDetails =
      paymentMethod === "upi"
        ? upiId
        : paymentMethod === "bank"
        ? accountNumber
        : `${cardNumber}|${expiry}|${cvv}`;

    try {
      const response = await rechargeUser(
        mobileNumber,
        plan.id,
        paymentMethod.toUpperCase(),
        paymentDetails
      );

      if (response.status === 200 && response.data.transactionId) {
        sessionStorage.setItem("paymentStatus", "success");
        sessionStorage.setItem("transactionId", response.data.transactionId);
        toast.success("Payment successful! Redirecting...");
        setTimeout(() => navigate("/recharge-success"), 2000);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      toast.error("Payment failed: " + (error.response?.data || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!plan) {
    return <div className="text-center mt-5">Loading plan details...</div>;
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <nav className="navbar navbar-light bg-white shadow-sm px-4">
        <span className="navbar-brand fw-bold text-primary fs-4">MobiComm</span>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="card shadow-sm w-100 m-3" style={{ maxWidth: "480px" }}>
          <div className="card-body">
            <h4 className="text-center mb-4 text-primary">
              Complete your payment
            </h4>
            <div className="mb-3 text-muted small">
              <p>
                <strong>Selected plan:</strong> {plan.name} - ₹{plan.price}
              </p>
              <p>
                <strong>Validity:</strong> {plan.validityDays} days
              </p>
              <p>
                <strong>Data:</strong> {plan.data}
              </p>
              <p>
                <strong>Calls:</strong> {plan.calls}
              </p>
              <p>
                <strong>SMS:</strong> {plan.sms}
              </p>
            </div>

            <div className="d-flex justify-content-between mb-4 bg-light rounded-pill p-1">
              {["upi", "credit", "debit", "bank"].map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`btn flex-fill fw-semibold text-capitalize ${
                    paymentMethod === method
                      ? "btn-dark text-white"
                      : "btn-light border text-muted"
                  }`}
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    borderRadius: "2rem",
                    marginRight: method !== "bank" ? "0.5rem" : "0",
                  }}
                >
                  {method === "upi"
                    ? "UPI"
                    : method === "credit"
                    ? "Credit Card"
                    : method === "debit"
                    ? "Debit Card"
                    : "Bank Transfer"}
                </button>
              ))}
            </div>

            <form onSubmit={handlePayment} noValidate>
              {paymentMethod === "upi" && (
                <div className="mb-3">
                  <label htmlFor="upiId" className="form-label">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    className="form-control"
                    placeholder="e.g. name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              )}

              {(paymentMethod === "credit" || paymentMethod === "debit") && (
                <>
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="form-control"
                      placeholder="Enter card number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label htmlFor="expiry" className="form-label">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        className="form-control"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        onBlur={validateExpiry}
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="cvv" className="form-label">
                        CVV
                      </label>
                      <input
                        type="password"
                        id="cvv"
                        className="form-control"
                        placeholder="3-digit CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "bank" && (
                <>
                  <div className="mb-3">
                    <label htmlFor="bankName" className="form-label">
                      Select Bank
                    </label>
                    <select
                      id="bankName"
                      className="form-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="">-- Choose Bank --</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="BOB">Bank of Baroda</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="accountNumber" className="form-label">
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      className="form-control"
                      placeholder="11 to 16 digit number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ifsc" className="form-label">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id="ifsc"
                      className="form-control"
                      placeholder="e.g. HDFC0123456"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn btn-dark w-100 mb-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Pay ₹${plan.price}`}
              </button>
            </form>

            <p className="text-center text-muted small">
              Note: After successful payment, your recharge will be activated
              instantly.
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default PaymentPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rechargeUser } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [plan, setPlan] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("selectedPlan");
    const storedMobile = sessionStorage.getItem("mobileNumber");

    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    } else {
      navigate("/recharge");
      return;
    }

    if (storedMobile) {
      setMobileNumber(storedMobile);
    } else {
      toast.error("Mobile number missing. Please login again.");
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const validateExpiry = () => {
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const nextYear = currentYear + 1;
    const currentMonth = currentDate.getMonth() + 1;

    if (!month || !year || isNaN(month) || isNaN(year)) {
      toast.error("Invalid expiry format. Please enter in MM/YY format.");
      return;
    }

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expMonth < 1 || expMonth > 12) {
      toast.error("Invalid month in expiry date.");
      return;
    }

    if (expYear < currentYear || expYear > nextYear) {
      toast.error("Year must be current or next year only.");
      setExpiry('');
      return;
    }

    if (expYear === currentYear && expMonth < currentMonth) {
      toast.error("Card expired.");
      setExpiry('');
      return;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!mobileNumber) {
      toast.error("Mobile number not found. Please log in again.");
      return navigate('/login');
    }

    // Custom validations with toast
    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast.error("Please enter a valid UPI ID.");
        return;
      }
    } else if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!/^\d{16}$/.test(cardNumber)) {
        toast.error("Card number must be 16 digits.");
        return;
      }
      if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        toast.error("Expiry must be in MM/YY format.");
        return;
      }
      if (!/^\d{3}$/.test(cvv)) {
        toast.error("CVV must be 3 digits.");
        return;
      }
    } else if (paymentMethod === 'bank') {
      if (!selectedBank) {
        toast.error("Please select a bank.");
        return;
      }
      if (!/^\d{11,16}$/.test(accountNumber)) {
        toast.error("Account number must be 11 to 16 digits.");
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
        toast.error("Invalid IFSC code.");
        return;
      }
    }

    setIsSubmitting(true);

    const paymentDetails =
      paymentMethod === 'upi' ? upiId :
      paymentMethod === 'bank' ? accountNumber :
      `${cardNumber}|${expiry}|${cvv}`;

    try {
      const response = await rechargeUser(
        mobileNumber,
        plan.id,
        paymentMethod.toUpperCase(),
        paymentDetails
      );

      if (response.status === 200 && response.data.transactionId) {
        const { transactionId } = response.data;
        sessionStorage.setItem("paymentStatus", "success");
        sessionStorage.setItem("transactionId", transactionId);
        toast.success("Payment successful! Redirecting...");
        setTimeout(() => navigate('/recharge-success'), 2000);
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
        <div>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="card shadow-sm w-100 m-3" style={{ maxWidth: '480px' }}>
          <div className="card-body">
            <h4 className="text-center mb-4 text-primary">Complete your payment</h4>
            <div className="mb-3 text-muted small">
              <p><strong>Selected plan:</strong> {plan.name} - ₹{plan.price}</p>
              <p><strong>Validity:</strong> {plan.validityDays} days</p>
              <p><strong>Data:</strong> {plan.data}</p>
              <p><strong>Calls:</strong> {plan.calls}</p>
              <p><strong>SMS:</strong> {plan.sms}</p>
            </div>

            <div className="btn-group w-100 mb-3" role="group">
              {['upi', 'credit', 'debit', 'bank'].map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`btn ${paymentMethod === method ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method === 'upi' ? 'UPI' : method === 'credit' ? 'Credit Card' : method === 'debit' ? 'Debit Card' : 'Bank Transfer'}
                </button>
              ))}
            </div>

            <form onSubmit={handlePayment}>
              {paymentMethod === 'upi' && (
                <div className="mb-3">
                  <label htmlFor="upiId" className="form-label">UPI ID</label>
                  <input
                    type="text"
                    id="upiId"
                    className="form-control"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              )}

              {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                <>
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="form-control"
                      pattern="\d{16}"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label htmlFor="expiry" className="form-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        id="expiry"
                        className="form-control"
                        placeholder="MM/YY"
                        pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        onBlur={validateExpiry}
                        required
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="cvv" className="form-label">CVV</label>
                      <input
                        type="password"
                        id="cvv"
                        className="form-control"
                        pattern="\d{3}"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'bank' && (
                <>
                  <div className="mb-3">
                    <label htmlFor="bankName" className="form-label">Select Bank</label>
                    <select
                      id="bankName"
                      className="form-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      required
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
                    <label htmlFor="accountNumber" className="form-label">Account Number</label>
                    <input
                      type="text"
                      id="accountNumber"
                      className="form-control"
                      pattern="\d{11,16}"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ifsc" className="form-label">IFSC Code</label>
                    <input
                      type="text"
                      id="ifsc"
                      className="form-control"
                      pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-dark w-100 mb-3" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : `Pay ₹${plan.price}`}
              </button>
            </form>

            <p className="text-center text-muted small">
              Note: After successful payment, your recharge will be activated instantly.
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default PaymentPage;

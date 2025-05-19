import React from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
        <h1 className="text-primary fw-bold fs-3">MobiComm</h1>

        <div className="d-flex gap-2">
          <button className="btn btn-dark" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="btn btn-dark"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow-1">
        {/* Hero Section */}
        <section
          className="text-white text-center py-5 px-3"
          style={{ background: "linear-gradient(90deg, #2563eb, #1d4ed8)" }}
        >
          <h2 className="fw-bold mb-3 display-5">MobiComm Services</h2>
          <p className="fs-5 mb-4">
            The fastest and simplest way to recharge your prepaid mobile
            connection.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-dark" onClick={() => navigate("/login")}>
              Recharge Now
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="text-center py-5 px-3 bg-light">
          <h3 className="fw-bold mb-4 fs-4">Why Choose MobiComm?</h3>
          <div className="row justify-content-center gx-4 gy-4">
            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm h-100 d-flex flex-column align-items-center text-primary">
                <div className="fs-1 mb-2">⚡</div>
                <h4 className="fw-semibold mb-2">Instant Recharges</h4>
                <p className="text-secondary small">
                  Recharge your mobile instantly with our fast processing
                  system.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm h-100 d-flex flex-column align-items-center text-primary">
                <div className="fs-1 mb-2">🔒</div>
                <h4 className="fw-semibold mb-2">Secure Payments</h4>
                <p className="text-secondary small">
                  Multiple secure payment options for your convenience.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm h-100 d-flex flex-column align-items-center text-primary">
                <div className="fs-1 mb-2">⭐</div>
                <h4 className="fw-semibold mb-2">Best Plans</h4>
                <p className="text-secondary small">
                  We offer the best mobile recharge plans across all categories.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-4">
          <h3 className="fw-semibold mb-3 fs-5">Ready to get started?</h3>
          <button className="btn btn-dark" onClick={() => navigate("/login")}>
            Login Now
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        &copy; {new Date().getFullYear()} MobiComm. All rights reserved.
      </footer>
    </div>
  );
};

export default App;

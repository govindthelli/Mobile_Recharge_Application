import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";
import RechargeInterface from "./components/Recharge";
import PaymentForm from "./components/PaymentPage";
import SubscriberRegistration from "./components/Registration";
import RechargeSuccess from "./components/RechargeSuccess";
import PrivateRoute from "./components/PrivateRoute"; // 👈 Add this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        
        👇 Protected admin route
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        
        <Route path="/recharge" element={<RechargeInterface />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/register" element={<SubscriberRegistration />} />
        <Route path="/recharge-success" element={<RechargeSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;

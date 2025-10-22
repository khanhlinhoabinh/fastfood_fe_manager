import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CustomerPage from "./pages/CustomerPage"; // trang này bạn sẽ làm sau
import OrderPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import StaffPage from "./pages/StaffPage";
import PaymentPage from "./pages/PaymentPage";
import PromotionPage from "./pages/PromotionPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/order-detail" element={<OrderDetailPage />} />
        <Route path="/employees" element={<StaffPage />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/promotions" element={<PromotionPage />} />
      </Routes>
    </Router>
  );
}

export default App;

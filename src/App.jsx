import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CustomerPage from "./pages/CustomerPage"; // trang này bạn sẽ làm sau
import OrderPage from "./pages/OrdersPage";
import StaffPage from "./pages/StaffPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/employees" element={<StaffPage />} />
      </Routes>
    </Router>
  );
}

export default App;

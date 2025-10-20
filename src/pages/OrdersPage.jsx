import React from "react";
import Navbar from "../components/Navbar"; // nếu bạn có Navbar
import OrderSection from "../components/OrderSection";
import "./OrdersPage.css";

const OrdersPage = () => {
  return (
    <div className="orders-page">
      <Navbar />
      <div className="orders-content">
        <OrderSection />
      </div>
    </div>
  );
};

export default OrdersPage;

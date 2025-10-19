import React from "react";
import Navbar from "../components/Navbar";
import OrderSection from "../components/OrderSection";
import "./OrderPage.css";

const OrderPage = () => {
  return (
    <div className="order-page">
      <Navbar />
      <div className="order-content">
        <OrderSection />
      </div>
    </div>
  );
};

export default OrderPage;

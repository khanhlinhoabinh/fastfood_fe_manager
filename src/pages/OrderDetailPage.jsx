import React from "react";
import Navbar from "../components/Navbar";
import "./OrderDetailPage.css";
import OrderDetailSection from "../components/OrderDetailSection"; // Đường dẫn tuỳ theo cấu trúc thư mục

const OrderDetailPage = () => {
  return (
    <div className="orderdetail-page">
      <Navbar />
      <div className="orderdetail-content">
        <OrderDetailSection />
      </div>
    </div>
  );
};

export default OrderDetailPage;
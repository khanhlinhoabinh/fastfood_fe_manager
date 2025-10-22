import React from "react";
import Navbar from "../components/Navbar";
import PaymentSection from "../components/PaymentSection"; // component chính hiển thị danh sách thanh toán
import "./PaymentPage.css";

const PaymentPage = () => {
  return (
    <div className="payment-page">
      <Navbar />
      <div className="payment-content">
        <PaymentSection />
      </div>
    </div>
  );
};

export default PaymentPage;

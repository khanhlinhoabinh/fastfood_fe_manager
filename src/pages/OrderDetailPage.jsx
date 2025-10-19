import React from "react";
import Navbar from "../components/Navbar";
import OrderDetailSection from "../components/OrderDetailSection";
import "./OrderDetailPage.css";

export default function OrderDetailPage() {
  return (
    <div className="order-detail-page">
      <Navbar />
      <div className="order-detail-content" style={{ paddingTop: 70 }}>
        <OrderDetailSection />
      </div>
    </div>
  );
}

import React from "react";
import Navbar from "../components/Navbar";
import PromotionSection from "../components/PromotionSection";
import "./PromotionPage.css";

const PromotionPage = () => {
  return (
    <div className="promotion-page">
      <Navbar />
      <div className="promotion-content">
        <PromotionSection />
      </div>
    </div>
  );
};

export default PromotionPage;

import React from "react";
import Navbar from "../components/Navbar";
import StaffSection from "../components/StaffSection";
import "./StaffPage.css";

const StaffPage = () => {
  return (
    <div className="staff-page">
      <Navbar />
      <div className="staff-content">
        <StaffSection />
      </div>
    </div>
  );
};

export default StaffPage;

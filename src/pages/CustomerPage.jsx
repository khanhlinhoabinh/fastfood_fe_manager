import React from "react";
import Navbar from "../components/Navbar";
import CustomerSection from "../components/CustomerSection"; // component giống MenuSection nhưng cho khách hàng
import "./CustomerPage.css";

const CustomerPage = () => {
  return (
    <div className="customer-page">
      <Navbar />
      <div className="customer-content">
        <CustomerSection />
      </div>
    </div>
  );
};

export default CustomerPage;

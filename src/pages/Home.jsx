import React from "react";
import Navbar from "../components/Navbar";
import MenuSection from "../components/HomeSection";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <header className="home-header">
<img
          src="/src/assets/banner.webp" 
          alt="Banner hệ thống quản lý nhà hàng"
          className="home-banner"
        />      </header>
      <MenuSection />
    </div>
  );
}

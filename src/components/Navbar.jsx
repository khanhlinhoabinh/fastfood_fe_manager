import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/src/assets/logo.png" alt="logo" />
      </div>
      <ul className="navbar-menu">
        <li>Trang Chủ</li>
        <li>Món Ăn</li>
        <li>Khách Hàng</li>
        <li>Đơn Hàng</li>
        <li>Chi Tiết Đơn</li>
        <li>Thanh Toán</li>
        <li>Nhân Viên</li>
        <li>Khuyến Mãi</li>
      </ul>
    </nav>
  );
}

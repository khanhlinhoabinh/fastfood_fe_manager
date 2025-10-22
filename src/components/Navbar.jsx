import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/src/assets/logo.png" alt="logo" />
      </div>

      <ul className="navbar-menu">
        <li><Link to="/">Trang Chủ</Link></li>
        <li><Link to="/menu">Món Ăn</Link></li>
        <li><Link to="/customers">Khách Hàng</Link></li>
        <li><Link to="/orders">Đơn Hàng</Link></li>
        <li><Link to="/order-detail">Chi Tiết Đơn</Link></li>
        <li><Link to="/payments">Thanh Toán</Link></li>
        <li><Link to="/employees">Nhân Viên</Link></li>
        <li><Link to="/promotions">Khuyến Mãi</Link></li>
      </ul>
    </nav>
  );
}

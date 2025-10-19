import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

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
<li><Link to="/order-details">Chi Tiết Đơn</Link></li>
<li><Link to="/payment">Thanh Toán</Link></li>
<li><Link to="/staff">Nhân Viên</Link></li>
<li><Link to="/promotions">Khuyến Mãi</Link></li>
</ul>
</nav>
);
}
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeSection.css";

export default function HomeSection() {
  const navigate = useNavigate();

  const menus = [
    { name: "Thực Đơn", img: "/src/assets/thucdon.png", path: "/menu" },
    { name: "Khách Hàng", img: "/src/assets/khachhang.png", path: "/customers" },
    { name: "Đơn Hàng", img: "/src/assets/donhang.png", path: "/orders" },
    { name: "Chi tiết đơn hàng", img: "/src/assets/chitietdonhang.png" },
    { name: "Thanh Toán", img: "/src/assets/thanhToan.png" },
    { name: "Nhân Viên", img: "/src/assets/nhanVien.png" },
    { name: "Khuyến Mãi", img: "/src/assets/khuyenMai.png" },
  ];

  const handleClick = (menu) => {
    if (menu.path) {
      navigate(menu.path);
    } else {
      alert(`⚙️ Chức năng "${menu.name}" đang được phát triển!`);
    }
  };

  return (
    <div className="home-section">
      <h1 className="home-title">🍔 Chào mừng bạn đến với hệ thống quản lý nhà hàng!</h1>
      <p className="home-subtitle">Hãy chọn một chức năng để bắt đầu làm việc 👇</p>

      <div className="menu-grid">
        {menus.map((m, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => handleClick(m)}
          >
            <img src={m.img} alt={m.name} />
            <p>{m.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

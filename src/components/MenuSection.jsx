import React from "react";
import "./MenuSection.css";

export default function MenuSection() {
  const menus = [
    { name: "Thực Đơn", img: "/src/assets/thucdon.png" },
    { name: "Khách Hàng", img: "/src/assets/khachhang.png" },
    { name: "Đơn Hàng", img: "/src/assets/donhang.png" },
    { name: "Chi tiết đơn hàng", img: "/src/assets/chitietdonhang.png" },
    { name: "Thanh Toán", img: "/src/assets/thanhToan.png" },
    { name: "Nhân Viên", img: "/src/assets/nhanVien.png" },
    { name: "Khuyến Mãi", img: "/src/assets/khuyenMai.png" },
  ];

  return (
    <div className="menu-section">
      <div className="menu-grid">
        {menus.map((m, index) => (
          <div key={index} className="menu-item">
            <img src={m.img} alt={m.name} />
            <p>{m.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

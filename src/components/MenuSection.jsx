import React, { useEffect, useState } from "react";
import "./MenuSection.css";
import axios from "axios";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");

  // Gọi API lấy danh sách món ăn
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/menuitems")
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Lỗi khi lấy menu:", err));
  }, []);

  return (
    <div className="menu-container">
      <h1 className="menu-title">🍔 Chào mừng bạn đến với trang Thực Đơn</h1>

      <div className="menu-function-buttons">
        <button
          className={selectedFunction === "list" ? "active" : ""}
          onClick={() => setSelectedFunction("list")}
        >
          Danh sách món ăn
        </button>
        <button
          className={selectedFunction === "add" ? "active" : ""}
          onClick={() => alert("Chức năng thêm món đang phát triển...")}
        >
          ➕ Thêm món mới
        </button>
      </div>

      {selectedFunction === "list" && (
        <div className="menu-table-section">
          <h2>📋 Danh sách món ăn</h2>
          <table className="menu-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên món</th>
                <th>Loại</th>
                <th>Giá (₫)</th>
                <th>Mô tả</th>
                <th>Tồn kho</th>
                <th>Thời gian chuẩn bị (phút)</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.price.toLocaleString()}</td>
                    <td>{item.description}</td>
                    <td>{item.stock}</td>
                    <td>{item.prepTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    Không có dữ liệu món ăn
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuSection;

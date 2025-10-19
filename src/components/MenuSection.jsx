import React, { useEffect, useState } from "react";
import "./MenuSection.css";
import axios from "axios";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5); // Số món mỗi trang

  // ✅ Hàm chuyển trang
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Gọi API lấy danh sách món ăn có phân trang
  useEffect(() => {
    setMenuItems([]); // clear dữ liệu cũ trước khi load trang mới

    axios
      .get(`http://localhost:8080/api/menuitems?page=${currentPage}&size=${pageSize}`)
      .then((res) => {
        if (res.data && res.data.content) {
          setMenuItems(res.data.content);
          setTotalPages(res.data.totalPages);
        } else {
          setMenuItems(res.data);
          setTotalPages(1);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy menu:", err));
  }, [currentPage]);

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
          {/* ✅ PHÂN TRANG */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              ⬅ Trước
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={index === currentPage ? "active-page" : ""}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Sau ➡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSection;

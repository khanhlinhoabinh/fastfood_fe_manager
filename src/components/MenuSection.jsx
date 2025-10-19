import React, { useEffect, useState } from "react";
import "./MenuSection.css";
import axios from "axios";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const pageSize = 5;

  // ✅ Hàm đổi trang
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchMenuItems(searchKeyword.trim(), page);
    }
  };

  // ✅ Hàm lấy danh sách món ăn (phân trang + tìm kiếm)
  const fetchMenuItems = async (keyword = "", page = 0) => {
    try {
      const url = keyword.trim()
        ? `http://localhost:8080/api/menuitems/search?keyword=${keyword}`
        : `http://localhost:8080/api/menuitems/page?page=${page}&size=${pageSize}`;

      const res = await axios.get(url);
      const data = res.data;

      if (keyword.trim()) {
        // Khi tìm kiếm → trả về mảng thường
        setMenuItems(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setCurrentPage(0);
      } else {
        // Khi xem danh sách phân trang
        setMenuItems(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách món ăn:", err);
      setMenuItems([]);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // ✅ Hàm tìm kiếm
  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      fetchMenuItems("", 0);
    } else {
      fetchMenuItems(searchKeyword.trim(), 0);
    }
  };

  // ✅ Hàm xoá món ăn
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa món ăn này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/menuitems/${id}`);
      alert("Xóa món ăn thành công!");
      fetchMenuItems(searchKeyword.trim(), currentPage);
    } catch (err) {
      console.error("Lỗi khi xóa món ăn:", err);
      alert("Không thể xóa món ăn. Vui lòng thử lại!");
    }
  };

  return (
    <div className="menu-container">
      <h1 className="menu-title">🍔 Danh Sách Món Ăn</h1>

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
        <>
          {/* ✅ Thanh tìm kiếm */}
          <div className="search-section">
            <input
              type="text"
              placeholder="🔍 Nhập tên món ăn hoặc loại món..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Tìm kiếm
            </button>
          </div>

          {/* ✅ Bảng danh sách món ăn */}
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
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(menuItems) && menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <tr key={item.menuItemID}>
                      <td>{item.menuItemID}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.price?.toLocaleString()}</td>
                      <td>{item.description}</td>
                      <td>{item.stockQuantity}</td>
                      <td>{item.prepTime}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(item.menuItemID)}
                        >
                          ❌ Xoá
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      Không có dữ liệu món ăn
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ✅ PHÂN TRANG */}
            {totalPages > 1 && (
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
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuSection;

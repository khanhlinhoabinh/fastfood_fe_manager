import React, { useEffect, useState } from "react";
import "./MenuSection.css";
import axios from "axios";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
<<<<<<< Updated upstream
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
=======
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Đọc API base URL từ file .env
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Lấy danh sách món ăn
  const fetchMenuItems = () => {
    axios
      .get(`${baseURL}/menuitems`)
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("❌ Lỗi khi lấy menu:", err));
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);
>>>>>>> Stashed changes

  // ✅ Tìm kiếm món ăn (đúng key BE là keyword)
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchMenuItems();
      return;
    }

    axios
      .get(`${baseURL}/menuitems/search?keyword=${encodeURIComponent(searchTerm)}`)
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("❌ Lỗi khi tìm kiếm:", err));
  };

  // ✅ Xóa món ăn
  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa món "${name}" (ID: ${id}) không?`)) {
      console.log("🧩 Gọi API:", `${baseURL}/menuitems/${id}`);
      axios
        .delete(`${baseURL}/menuitems/${id}`)
        .then(() => {
          alert(`🗑️ Xóa món ăn "${name}" thành công!`);
          fetchMenuItems(); // 🔁 Reload lại danh sách
        })
        .catch((err) => console.error("❌ Lỗi khi xóa món ăn:", err));
    }
  };

  return (
    <div className="menu-container">
      <h1 className="menu-title">🍔 Trang Quản Lý Thực Đơn</h1>

      {/* ✅ Nút chuyển chức năng */}
      <div className="menu-function-buttons">
        <button
          className={selectedFunction === "list" ? "active" : ""}
          onClick={() => {
            setSelectedFunction("list");
            fetchMenuItems(); // 🔁 Cập nhật lại danh sách mỗi khi nhấn
          }}
        >
          Danh sách món ăn
        </button>

        <button
          className={selectedFunction === "add" ? "active" : ""}
          onClick={() => alert("⚙️ Chức năng thêm món đang phát triển...")}
        >
          ➕ Thêm món mới
        </button>
      </div>

      {/* ✅ Thanh tìm kiếm */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Nhập tên món ăn cần tìm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      {/* ✅ Danh sách món ăn */}
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
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
<tr key={item.menuItemID}>    
  <td>{item.menuItemID}</td>              
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.price?.toLocaleString() || 0}</td>
                    <td>{item.description}</td>
                    <td>{item.stockQuantity ?? item.stock ?? 0}</td>
                    <td>{item.prepTime}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.menuItemID, item.name)}
                        style={{
                          backgroundColor: "#ff4d4f",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Xóa
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

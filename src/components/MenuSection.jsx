import React, { useEffect, useState } from "react";
import "./MenuSection.css";
import axios from "axios";
import MenuForm from "./MenuForm";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showForm, setShowForm] = useState(false); // ✅ Thêm
  const [editingMenuItem, setEditingMenuItem] = useState(null); // ✅ Thêm


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
      let url = "";

      if (sortField && sortOrder) {
        url = `http://localhost:8080/api/menuitems/sort?field=${sortField}&order=${sortOrder}`;
      } else {
        url = keyword.trim()
          ? `http://localhost:8080/api/menuitems/search?keyword=${keyword}`
          : `http://localhost:8080/api/menuitems/page?page=${page}&size=${pageSize}`;
      }

      const res = await axios.get(url);
      const data = res.data;

      const items = sortField && sortOrder
        ? Array.isArray(data) ? data : []
        : keyword.trim()
          ? Array.isArray(data) ? data : []
          : Array.isArray(data.content) ? data.content : [];

      setMenuItems(items);
      setTotalPages(sortField && sortOrder || keyword.trim() ? 1 : data.totalPages || 1);
      setCurrentPage(sortField && sortOrder || keyword.trim() ? 0 : page);
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
      toast.success("Xóa món ăn thành công!");
      fetchMenuItems(searchKeyword.trim(), currentPage);
    } catch (err) {
      console.error("Lỗi khi xóa món ăn:", err);
      toast.error("Không thể xóa món ăn. Vui lòng thử lại!");
    }
  };
  
  const handleSortChange = () => {
    fetchMenuItems(searchKeyword.trim(), 0);
  };
  
const handleEdit = (item) => {
    setEditingMenuItem(item);
    setSelectedFunction("edit");
    setShowForm(true);
  };



  return (
    <div className="menu-container">
       <ToastContainer />
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
          onClick={() => {
            setSelectedFunction("add");
            setShowForm(true);
            setEditingMenuItem(null);
          }}
        >
          ➕ Thêm món mới
        </button>

      </div>

      {selectedFunction === "list" && (
        <>
          
{/* ✅ Thanh tìm kiếm + sắp xếp */}
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

            <button
              className="sort-icon-button"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              ⚙️ Sắp xếp
            </button>

            {showSortOptions && (
              <div className="sort-options">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="">-- Chọn tiêu chí --</option>
                  <option value="name">Tên món</option>
                  <option value="price">Giá</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">-- Chọn thứ tự --</option>
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
                <button onClick={handleSortChange}>Áp dụng</button>
              </div>
            )}
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
                          className="edit-button"
                          onClick={() => handleEdit(item)}
                        >
                          ✏️ Sửa
                        </button>

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
      
{(selectedFunction === "add" || selectedFunction === "edit") && showForm && (
        <MenuForm
          menuItem={editingMenuItem}
          onSave={() => {
            setShowForm(false);
            setEditingMenuItem(null);
            setSelectedFunction("list");
            fetchMenuItems(searchKeyword.trim(), currentPage);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingMenuItem(null);
            setSelectedFunction("list");
          }}
        />
      )}
    </div>
  );
};


export default MenuSection;

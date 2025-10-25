import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PromotionSection.css";
import PromotionForm from "./PromotionForm";

const PromotionSection = () => {
  const [promotions, setPromotions] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const pageSize = 5;
  const baseUrl = "http://localhost:8080/api/promotions";

  const fetchPromotions = async (keyword = "", page = 0) => {
    try {
      let url = "";
      if (keyword.trim() !== "") {
        url = `${baseUrl}/search?keyword=${keyword}&page=${page}&size=${pageSize}`;
      } else {
        url = `${baseUrl}?page=${page}&size=${pageSize}`;
        if (sortField && sortOrder)
          url += `&sortBy=${sortField}&direction=${sortOrder}`;
      }

      const res = await axios.get(url);
      const data = res.data;
      const items = data.content || data;
      setPromotions(items);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách khuyến mãi:", err);
      toast.error("❌ Không thể tải danh sách khuyến mãi.");
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSearch = () => {
    fetchPromotions(searchKeyword.trim(), 0);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xoá khuyến mãi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${baseUrl}/${id}`);
      toast.success(" Xóa khuyến mãi thành công!");
      fetchPromotions(searchKeyword.trim(), currentPage);
    } catch (err) {
      toast.error("❌ Không thể xóa khuyến mãi!");
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setSelectedFunction("edit");
    setShowForm(true);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchPromotions(searchKeyword.trim(), page);
    }
  };

  return (
    <div className="promotion-container">
      <ToastContainer />
      <h1 className="promotion-title">🎁 Danh Sách Khuyến Mãi</h1>

      <div className="promotion-buttons">
        <button
          className={selectedFunction === "list" ? "active" : ""}
          onClick={() => setSelectedFunction("list")}
        >
          📋 Danh sách khuyến mãi
        </button>
        <button
          className={selectedFunction === "add" ? "active" : ""}
          onClick={() => {
            setSelectedFunction("add");
            setShowForm(true);
            setEditingPromotion(null);
          }}
        >
          ➕ Thêm khuyến mãi
        </button>
      </div>

      {selectedFunction === "list" && (
        <>
          <div className="search-section">
            <input
              type="text"
              placeholder="🔍 Nhập tên hoặc loại khuyến mãi..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button onClick={handleSearch}>Tìm kiếm</button>
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
                  <option value="">-- Tiêu chí --</option>
                  <option value="name">Tên KM</option>
                  <option value="discountPercent">Giảm giá %</option>
                  <option value="expiryDate">Thời hạn</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">-- Thứ tự --</option>
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
                <button onClick={() => fetchPromotions(searchKeyword, 0)}>
                  Áp dụng
                </button>
              </div>
            )}
          </div>

          <div className="promotion-table-section">
            <table className="promotion-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên khuyến mãi</th>
                  <th>Loại</th>
                  <th>Giảm giá (%)</th>
                  <th>Hạn sử dụng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length > 0 ? (
                  promotions.map((p) => (
                    <tr key={p.promotionID}>
                      <td>{p.promotionID}</td>
                      <td>{p.name}</td>
                      <td>{p.type}</td>
                      <td>{p.discountPercent}%</td>
                      <td>{p.expiryDate}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(p)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(p.promotionID)}
                        >
                          ❌ Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      Không có dữ liệu khuyến mãi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  ⬅ Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={i === currentPage ? "active-page" : ""}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
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

      {(selectedFunction === "add" || selectedFunction === "edit") &&
        showForm && (
          <PromotionForm
            promotion={editingPromotion}
            onSave={() => {
              setShowForm(false);
              setSelectedFunction("list");
              fetchPromotions(searchKeyword.trim(), currentPage);
            }}
            onCancel={() => {
              setShowForm(false);
              setSelectedFunction("list");
            }}
          />
        )}
    </div>
  );
};

export default PromotionSection;

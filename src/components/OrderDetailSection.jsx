import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailForm from "./OrderDetailForm";
import "./OrderDetailSection.css";

const OrderDetailSection = ({ orderId }) => {
  const [details, setDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // sort state
  const [sortField, setSortField] = useState("productCode");
  const [sortDir, setSortDir] = useState("asc");

  // search state
  const [searchTerm, setSearchTerm] = useState("");

  // form state
  const [showForm, setShowForm] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);

  // ==============================
  // Fetch Data
  // ==============================
  const fetchDetails = () => {
    let url = `http://localhost:8080/api/order-details?page=${currentPage}&size=${pageSize}&sort=${sortField},${sortDir}`;

    // thêm tham số tìm kiếm nếu có
    if (searchTerm.trim() !== "") {
      url += `&keyword=${encodeURIComponent(searchTerm.trim())}`;
    }

    axios
      .get(url)
      .then((res) => {
        if (res.data && res.data.content) {
          setDetails(res.data.content);
          setTotalPages(res.data.totalPages || 1);
        } else if (Array.isArray(res.data)) {
          setDetails(res.data);
          setTotalPages(1);
        } else {
          setDetails([]);
          setTotalPages(1);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết đơn:", err);
        setDetails([]);
      });
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line
  }, [currentPage, sortField, sortDir]);

  // ==============================
  // Pagination + Sort + CRUD
  // ==============================
  const handlePageChange = (p) => {
    if (p >= 0 && p < totalPages) setCurrentPage(p);
  };

  const openAdd = () => {
    setEditingDetail(null);
    setShowForm(true);
  };
  const openEdit = (d) => {
    setEditingDetail(d);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chi tiết đơn hàng này?")) return;
    axios
      .delete(`http://localhost:8080/api/order-details/${id}`)
      .then(() => {
        alert("Xóa thành công");
        fetchDetails();
      })
      .catch((err) => {
        console.error(err);
        alert("Xóa thất bại");
      });
  };

  const onSaved = () => {
    setShowForm(false);
    setEditingDetail(null);
    fetchDetails();
  };

  // ==============================
  // Search Function
  // ==============================
  const handleSearch = () => {
    setCurrentPage(0);
    fetchDetails();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ==============================
  // Render UI
  // ==============================
  return (
    <div className="od-container">
      <div className="od-header">
        <h2>📋 Danh sách Chi tiết đơn hàng</h2>
        <div className="od-controls">
          <button className="btn" onClick={openAdd}>
            ➕ Thêm chi tiết
          </button>

          <label>
            Sắp xếp:
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="productCode">Mã món</option>
              <option value="quantity">Số lượng</option>
            </select>
          </label>

          <label>
            Hướng:
            <select
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </label>
        </div>
      </div>

      {/* --- Thanh tìm kiếm --- */}
      <div className="od-search-bar">
        <input
          type="text"
          placeholder="🔍 Nhập từ khóa (mã món, mã đơn, ghi chú...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="btn search-btn" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>

      {/* --- Bảng dữ liệu --- */}
      <table className="od-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã đơn</th>
            <th>Mã món</th>
            <th>Số lượng</th>
            <th>Đơn giá (₫)</th>
            <th>Thành tiền (₫)</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {details.length > 0 ? (
            details.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.orderId ?? d.order?.id ?? "-"}</td>
                <td>{d.productCode ?? d.product?.code ?? "-"}</td>
                <td>{d.quantity}</td>
                <td>{Number(d.unitPrice).toLocaleString()}</td>
                <td>
                  {(Number(d.unitPrice) * Number(d.quantity)).toLocaleString()}
                </td>
                <td>{d.note || "-"}</td>
                <td>
                  <button className="small" onClick={() => openEdit(d)}>
                    ✏ Sửa
                  </button>
                  <button
                    className="small danger"
                    onClick={() => handleDelete(d.id)}
                  >
                    🗑 Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                Không có dữ liệu chi tiết đơn hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- Phân trang --- */}
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
          disabled={currentPage >= totalPages - 1}
        >
          Sau ➡
        </button>
      </div>

      {/* --- Form thêm/sửa --- */}
      {showForm && (
        <OrderDetailForm
          detail={editingDetail}
          onClose={() => setShowForm(false)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
};

export default OrderDetailSection;

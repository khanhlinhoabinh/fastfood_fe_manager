import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderForm from "./OrderForm";
import "./OrderSection.css";

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // sorting
  const [sortField, setSortField] = useState("orderDate");
  const [sortDir, setSortDir] = useState("desc");

  // search
  const [searchTerm, setSearchTerm] = useState("");

  // form modal state
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // ===========================
  // Fetch Orders (with search)
  // ===========================
  const fetchOrders = async () => {
    try {
      const url = `http://localhost:8080/api/orders/paged?page=${currentPage}&size=${pageSize}&keyword=${encodeURIComponent(searchTerm)}`;
      const res = await axios.get(url);
      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [currentPage, sortField, sortDir]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    axios
      .delete(`http://localhost:8080/api/orders/${orderId}`)
      .then(() => {
        alert("Xóa thành công");
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        alert("Xóa thất bại");
      });
  };

  const openAddForm = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const openEditForm = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const onFormSaved = () => {
    setShowForm(false);
    setEditingOrder(null);
    fetchOrders();
  };

  // ===========================
  // Search Handlers
  // ===========================
  const handleSearch = () => {
    setCurrentPage(0); // Đặt lại trang về 0 khi tìm kiếm
    fetchOrders(); // Gọi hàm lấy dữ liệu với từ khóa tìm kiếm
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ===========================
  // UI Rendering
  // ===========================
  return (
    <div className="order-container">
      <h1 className="order-title">🧾 Danh sách Đơn hàng</h1>

      {/* Bộ điều khiển */}
      <div className="order-controls">
        <div className="left-controls">
          <button
            className="btn"
            onClick={() => setSelectedFunction("list")}
          >
            Danh sách đơn hàng
          </button>
          <button className="btn" onClick={openAddForm}>
            ➕ Thêm đơn hàng
          </button>
        </div>

        
      </div>

      {/* 🔍 Thanh tìm kiếm + ⚙️ Sắp xếp */}
<div className="search-section">
  <input
    type="text"
    placeholder="🔍 Nhập từ khóa (Mã KH, trạng thái, Mã NV...)"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={handleKeyPress}
    className="search-input"
  />
  <button className="search-button" onClick={handleSearch}>
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
        <option value="orderDate">Ngày đặt</option>
        <option value="totalAmount">Tổng tiền</option>
      </select>
      <select
        value={sortDir}
        onChange={(e) => setSortDir(e.target.value)}
      >
        <option value="desc">Giảm dần</option>
        <option value="asc">Tăng dần</option>
      </select>
      <button onClick={fetchOrders}>Áp dụng</button>
    </div>
  )}
</div>

      {/* --- Bảng dữ liệu --- */}
      <div className="order-table-section">
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã KH</th>
              <th>Ngày giờ</th>
              <th>Tổng tiền (₫)</th>
              <th>Trạng thái</th>
              <th>Mã NV</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.orderID}>
                  <td>{o.orderID}</td>
                  <td>{o.customerID}</td>
                  <td>{new Date(o.orderDate).toLocaleString()}</td>
                  <td>{Number(o.totalAmount).toLocaleString()}</td>
                  <td>{o.status}</td>
                  <td>{o.staffID}</td>
                  <td>
                    <button className="small" onClick={() => openEditForm(o)}>
                      ✏ Sửa
                    </button>
                    <button
                      className="small danger"
                      onClick={() => handleDelete(o.orderID)}
                    >
                      🗑 Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Không có dữ liệu đơn hàng
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

          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              className={idx === currentPage ? "active-page" : ""}
              onClick={() => handlePageChange(idx)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Sau ➡
          </button>
        </div>
      </div>

      {/* --- Form thêm/sửa --- */}
      {showForm && (
        <OrderForm
          order={editingOrder}
          onClose={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
          onSaved={onFormSaved}
        />
      )}
    </div>
  );
};

export default OrderSection;

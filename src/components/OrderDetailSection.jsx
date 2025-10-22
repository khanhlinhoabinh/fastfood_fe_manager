import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderDetailForm from "./OrderDetailForm";
import "./OrderDetailSection.css";

const OrderDetailSection = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [showForm, setShowForm] = useState(false);
  const [editingOrderDetail, setEditingOrderDetail] = useState(null);

  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortField, setSortField] = useState("quantity");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchOrderDetails();
  }, [currentPage, sortField, sortOrder]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/order-details/sort", {
        params: {
          sortBy: sortField,
          direction: sortOrder,
        },
      });
      setOrderDetails(response.data);
      setTotalPages(1); // Nếu dùng API phân trang thì thay bằng response.data.totalPages
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi tiết đơn hàng:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/order-details/search", {
        params: {
          orderID: searchKeyword,
          menuItemID: searchKeyword,
        },
      });
      setOrderDetails(response.data);
      setTotalPages(1);
      setCurrentPage(0);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá chi tiết đơn hàng này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/order-details/${id}`);
        fetchOrderDetails();
      } catch (error) {
        console.error("Lỗi khi xoá:", error);
      }
    }
  };

  const handleEdit = (detail) => {
    setEditingOrderDetail(detail);
    setShowForm(true);
    setSelectedFunction("edit");
  };

  const handleSortChange = () => {
    setShowSortOptions(false);
    fetchOrderDetails();
  };

  return (
    <div className="menu-container">
      <h2 className="menu-title">📋 Danh sách chi tiết đơn hàng</h2>

      {/* Nút chức năng */}
      <div className="menu-function-buttons">
        <button
          className={selectedFunction === "list" ? "active" : ""}
          onClick={() => {
            setSelectedFunction("list");
            setShowForm(false);
            fetchOrderDetails();
          }}
        >
          📄 Danh sách
        </button>
        <button
          className={selectedFunction === "add" ? "active" : ""}
          onClick={() => {
            setSelectedFunction("add");
            setShowForm(true);
            setEditingOrderDetail(null);
          }}
        >
          ➕ Thêm mới
        </button>
      </div>

      {/* Tìm kiếm + Sắp xếp */}
      <div className="menu-search">
        <input
          type="text"
          placeholder="🔍 Tìm theo Mã đơn hoặc Mã món..."
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
      </div>

      {showSortOptions && (
        <div className="sort-options">
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="menuItemID">Mã món</option>
            <option value="quantity">Số lượng</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
          <button onClick={handleSortChange}>Áp dụng</button>
        </div>
      )}

      {/* Bảng danh sách */}
      {selectedFunction === "list" && (
        <div className="menu-table-section">
          <table className="menu-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã đơn</th>
                <th>Mã món</th>
                <th>Số lượng</th>
                <th>Đơn giá (₫)</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.length > 0 ? (
                orderDetails.map((detail) => (
                  <tr key={detail.orderDetailID}>
                    <td>{detail.orderDetailID}</td>
                    <td>{detail.orderID}</td>
                    <td>{detail.menuItemID}</td>
                    <td>{detail.quantity}</td>
                    <td>{detail.unitPrice?.toLocaleString()}</td>
                    <td>{detail.note}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(detail)}>
                        ✏️ Sửa
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(detail.orderDetailID)}>
                        ❌ Xoá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    Không có dữ liệu chi tiết đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form thêm/sửa */}
      {(selectedFunction === "add" || selectedFunction === "edit") && showForm && (
        <OrderDetailForm
          orderDetail={editingOrderDetail}
          onSave={() => {
            setShowForm(false);
            setEditingOrderDetail(null);
            setSelectedFunction("list");
            fetchOrderDetails();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingOrderDetail(null);
            setSelectedFunction("list");
          }}
        />
      )}
    </div>
  );
};

export default OrderDetailSection;
import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderForm from "./OrderForm";
import "./OrderSection.css";

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [sortField, setSortField] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const [searchCustomerID, setSearchCustomerID] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [sortField, sortOrder]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders/sort", {
        params: {
          sortBy: sortField,
          direction: sortOrder,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders/search", {
        params: {
          customerID: searchCustomerID,
          startDate: "2000-01-01T00:00:00", // mặc định khoảng rộng
          endDate: "2100-01-01T00:00:00",
          status: "", // không lọc theo trạng thái
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm theo mã khách hàng:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá đơn hàng này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/orders/${id}`);
        fetchOrders();
      } catch (error) {
        console.error("Lỗi khi xoá:", error);
      }
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
    setSelectedFunction("edit");
  };

  return (
    <div className="order-container">
      <h2 className="order-title">📦 Danh sách đơn hàng</h2>

      <div className="order-function-buttons">
        <button
          className={selectedFunction === "list" ? "active" : ""}
          onClick={() => {
            setSelectedFunction("list");
            setShowForm(false);
            fetchOrders();
          }}
        >
          📄 Danh sách
        </button>
        <button
          className={selectedFunction === "add" ? "active" : ""}
          onClick={() => {
            setSelectedFunction("add");
            setShowForm(true);
            setEditingOrder(null);
          }}
        >
          ➕ Thêm mới
        </button>
      </div>

      {/* Tìm kiếm theo customerID */}
      <div className="order-search">
        <input
          type="number"
          placeholder="🔍 Nhập mã khách hàng..."
          value={searchCustomerID}
          onChange={(e) => setSearchCustomerID(e.target.value)}
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
            <option value="orderDate">Ngày đặt</option>
            <option value="totalAmount">Tổng tiền</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
          <button onClick={fetchOrders}>Áp dụng</button>
        </div>
      )}

      {/* Bảng danh sách */}
      {selectedFunction === "list" && (
        <div className="order-table-section">
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Tổng tiền (₫)</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderID}>
                    <td>{order.orderID}</td>
                    <td>{order.customerID}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>{order.status}</td>
                    <td>{order.totalAmount?.toLocaleString()}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(order)}>
                        ✏️ Sửa
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(order.orderID)}>
                        ❌ Xoá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    Không có dữ liệu đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form thêm/sửa */}
      {(selectedFunction === "add" || selectedFunction === "edit") && showForm && (
        <OrderForm
          order={editingOrder}
          onSave={() => {
            setShowForm(false);
            setEditingOrder(null);
            setSelectedFunction("list");
            fetchOrders();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingOrder(null);
            setSelectedFunction("list");
          }}
        />
      )}
    </div>
  );
};

export default OrderSection;
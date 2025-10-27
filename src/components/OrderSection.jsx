import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderForm from "./OrderForm";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "./OrderSection.css";

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const [sortField, setSortField] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const [searchCustomerID, setSearchCustomerID] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const fetchOrdersPaged = async (page = 0) => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders/paged", {
        params: {
          page,
          size: pageSize,
          sortBy: sortField,
          direction: sortOrder,
        },
      });

      const data = res.data;
      if (data && Array.isArray(data.content)) {
        setOrders(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number);
      } else {
        setOrders([]);
        setTotalPages(1);
        setCurrentPage(0);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng:", err);
      toast.error("Lỗi khi lấy danh sách đơn hàng ❌");
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrdersPaged();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchOrdersPaged(page);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders/search", {
        params: {
          customerID: searchCustomerID || null,
          status: searchStatus || null,
        },
      });
      setOrders(response.data);
      setTotalPages(1);
      setCurrentPage(0);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("❌ Lỗi khi tìm kiếm đơn hàng.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xoá đơn hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/orders/${id}`);
        toast.success("Xoá đơn hàng thành công!");
        fetchOrdersPaged(currentPage);
      } catch (error) {
        console.error("Lỗi khi xoá:", error);
        toast.error("Xóa thất bại");
      }
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
    setSelectedFunction("edit");
  };

  return (
    <div className="staff-container">
      <ToastContainer />
      <h2 className="staff-title">📦 ĐƠN HÀNG 📦</h2>

      <div className="staff-function-buttons">
        <button
          className={selectedFunction === "list" ? "active" : ""}
          onClick={() => {
            setSelectedFunction("list");
            setShowForm(false);
            fetchOrdersPaged();
          }}
        >
          Danh sách đơn hàng
        </button>
        <button
          className={selectedFunction === "add" ? "active" : ""}
          onClick={() => {
            setSelectedFunction("add");
            setShowForm(true);
            setEditingOrder(null);
          }}
        >
          Thêm mới
        </button>
      </div>

      <div className="search-section">
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
          Sắp xếp
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
          <button onClick={() => fetchOrdersPaged(0)}>Áp dụng</button>
        </div>
      )}

      {selectedFunction === "list" && (
        <div className="staff-table-section">
          <table className="staff-table">
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
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(order.orderID)}
                      >
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
      )}

      {(selectedFunction === "add" || selectedFunction === "edit") && showForm && (
        <OrderForm
          order={editingOrder}
          onSaved={() => {
            setShowForm(false);
            setEditingOrder(null);
            setSelectedFunction("list");
            fetchOrdersPaged(currentPage);
          }}
          onClose={() => {
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
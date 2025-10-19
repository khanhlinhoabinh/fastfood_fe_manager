import React, { useEffect, useState } from "react";
import "./OrderSection.css";
import axios from "axios";

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 từ khóa tìm kiếm (mã KH hoặc mã đơn)
  const [searchCustomerId, setSearchCustomerId] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [searchStatus, setSearchStatus] = useState("");

  // ✅ Gọi API lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: pageSize,
        search: searchTerm, // backend có thể lọc theo mã KH hoặc mã đơn
      }).toString();

      const res = await axios.get(`http://localhost:8080/api/orders?${params}`);

      if (res.data && res.data.content) {
        setOrders(res.data.content);
        setTotalPages(res.data.totalPages);
      } else {
        setOrders(res.data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  // ✅ Xử lý chuyển trang
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  // ✅ Tìm kiếm
const handleSearch = async () => {
  try {
    // convert yyyy-MM-dd -> yyyy-MM-ddTHH:mm:ss
    const start = startDate ? `${startDate}T00:00:00` : "";
    const end = endDate ? `${endDate}T23:59:59` : "";

    const res = await axios.get("http://localhost:8080/api/orders/search", {
      params: {
        customerID: searchCustomerId || undefined,
        startDate: start || undefined,
        endDate: end || undefined,
        status: searchStatus || undefined,
      },
    });

    console.log("🔍 Kết quả tìm kiếm:", res.data);
    setOrders(res.data);
  } catch (error) {
    console.error("❌ Lỗi tìm kiếm:", error);
    alert("Không thể tìm kiếm, kiểm tra lại console!");
  }
};



  // ✅ Xóa đơn hàng
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa đơn hàng #${id}?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/orders/${id}`);
      alert("🗑️ Xóa đơn hàng thành công!");
      fetchOrders(); // tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      alert("❌ Không thể xóa đơn hàng!");
    }
  };

  return (
    <div className="order-container">
      <h1 className="order-title">🧾 Quản lý Đơn Hàng</h1>

      {/* ✅ Tìm kiếm */}
      <form
  className="order-search"
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
>
  <input
    type="text"
    placeholder="Mã khách hàng"
    value={searchCustomerId}
    onChange={(e) => setSearchCustomerId(e.target.value)}
  />
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
  <select
    value={searchStatus}
    onChange={(e) => setSearchStatus(e.target.value)}
  >
    <option value="">-- Trạng thái --</option>
    <option value="Đã thanh toán">Đã thanh toán</option>
    <option value="Chưa thanh toán">Chưa thanh toán</option>
  </select>
  <button type="submit">🔍 Tìm kiếm</button>
</form>


      {/* ✅ Bảng danh sách đơn hàng */}
      <div className="order-table-section">
        <h2>📋 Danh sách đơn hàng</h2>
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã KH</th>
              <th>Mã NV</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền (₫)</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderID}>
                  <td>{order.orderID}</td>
                  <td>{order.customer?.name}</td>
                  <td>{order.staff?.name}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>{order.totalAmount.toLocaleString()}</td>
                  <td>
                    <span
                      className={
                        order.status === "Đã thanh toán"
                          ? "status-paid"
                          : "status-unpaid"
                      }
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(order.orderID)}
                    >
                      ❌ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Không có đơn hàng nào
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
    </div>
  );
};

export default OrderSection;

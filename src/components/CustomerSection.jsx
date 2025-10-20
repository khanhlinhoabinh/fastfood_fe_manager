import React, { useEffect, useState } from "react";
import "./CustomerSection.css";
import axios from "axios";
import CustomerForm from "./CustomerForm";


const CustomerSection = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);           // ✅ thêm
  const [editingCustomer, setEditingCustomer] = useState(null);
  const pageSize = 5;

  // ✅ Hàm đổi trang
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchCustomers(searchKeyword.trim(), page);
    }
  };

  // ✅ Hàm lấy danh sách khách hàng (có phân trang + tìm kiếm)
  const fetchCustomers = async (keyword = "", page = 0) => {
    try {
      const url = keyword.trim()
        ? `http://localhost:8080/api/customers/search?keyword=${keyword}`
        : `http://localhost:8080/api/customers/page?page=${page}&size=${pageSize}`;

      const res = await axios.get(url);
      const data = res.data;

      if (keyword.trim()) {
        // Khi tìm kiếm, trả về toàn bộ danh sách không phân trang
        setCustomers(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setCurrentPage(0);
      } else {
        // Khi xem danh sách, backend trả về dạng phân trang
        setCustomers(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách khách hàng:", err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Hàm tìm kiếm
  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      fetchCustomers("", 0);
    } else {
      fetchCustomers(searchKeyword.trim(), 0);
    }
  };

  // ✅ Hàm xoá khách hàng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/customers/${id}`);
      alert("Xóa khách hàng thành công!");
      fetchCustomers(searchKeyword.trim(), currentPage);
    } catch (err) {
      console.error("Lỗi khi xóa khách hàng:", err);
      alert("Không thể xóa khách hàng. Vui lòng thử lại!");
    }
  };

  return (
    <div className="customer-container">
      <h1 className="customer-title">👥 Danh Sách Khách Hàng</h1>

      <div className="customer-function-buttons">
        <button
          className={selectedFunction === "list" ? "active" : ""}
          onClick={() => setSelectedFunction("list")}
        >
          Danh sách khách hàng
        </button>
        <button
  className={selectedFunction === "add" ? "active" : ""}
  onClick={() => {
    setSelectedFunction("add"); // ✅ chuyển chế độ sang form
    setShowForm(true);
    setEditingCustomer(null);
  }}
>
  ➕ Thêm khách hàng mới
</button>


      </div>

      {selectedFunction === "list" && (
        <>
          {/* ✅ Thanh tìm kiếm */}
          <div className="search-section">
            <input
              type="text"
              placeholder="🔍 Nhập tên, email hoặc số điện thoại..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Tìm kiếm
            </button>
          </div>

          {/* ✅ Bảng khách hàng */}
          <div className="customer-table-section">
            <h2>📋 Thông tin khách hàng</h2>
            <table className="customer-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Điểm tích lũy</th>
                  <th>Loại thành viên</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(customers) && customers.length > 0 ? (
                  customers.map((c) => (
                    <tr key={c.customerID}>
                      <td>{c.customerID}</td>
                      <td>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>{c.email}</td>
                      <td>{c.loyaltyPoints}</td>
                      <td>{c.memberType}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(c.customerID)}
                        >
                          ❌ Xoá
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Không có dữ liệu khách hàng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 🔹 PHÂN TRANG */}
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
      {selectedFunction === "add" && showForm && (
  <CustomerForm
    customer={editingCustomer}
    onSave={() => {
      setShowForm(false);
      setEditingCustomer(null);
      setSelectedFunction("list"); // ✅ quay lại danh sách sau khi lưu
      fetchCustomers(searchKeyword.trim(), currentPage);
    }}
    onCancel={() => {
      setShowForm(false);
      setEditingCustomer(null);
      setSelectedFunction("list"); // ✅ quay lại danh sách nếu hủy
    }}
  />
)}
    </div>
  );
};

export default CustomerSection;

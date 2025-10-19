import React, { useEffect, useState } from "react";
import "./CustomerSection.css";
import axios from "axios";

const CustomerSection = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Hiển thị 10 bản ghi mỗi trang

  // ✅ Hàm chuyển trang (đặt trước useEffect để không bị lỗi)
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  /// ✅ Gọi API lấy danh sách khách hàng có phân trang
  useEffect(() => {
  // Xóa dữ liệu cũ trước khi tải trang mới
  setCustomers([]);

  axios
    .get(`http://localhost:8080/api/customers?page=${currentPage}&size=${pageSize}`)
    .then((res) => {
      if (res.data && res.data.content) {
        setCustomers(res.data.content);
        setTotalPages(res.data.totalPages);
      } else {
        setCustomers(res.data);
        setTotalPages(1);
      }
    })
    .catch((err) => console.error("Lỗi khi lấy danh sách khách hàng:", err));
}, [currentPage]);


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
          onClick={() => alert("Chức năng thêm khách hàng đang được phát triển...")}
        >
          ➕ Thêm khách hàng mới
        </button>
      </div>

      {selectedFunction === "list" && (
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
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.customerID}>
                    <td>{c.customerID}</td>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>{c.loyaltyPoints}</td>
                    <td>{c.memberType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    Không có dữ liệu khách hàng
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

export default CustomerSection;

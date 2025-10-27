import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PaymentSection.css";
import PaymentForm from "./PaymentForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default function PaymentSection() {
  const [payments, setPayments] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const pageSize = 5;

  const fetchPayments = async (keyword = "", page = 0) => {
    try {
      let url = "";
      if (sortField && sortOrder) {
        url = `http://localhost:8080/api/payments/sort?sortBy=${sortField}&order=${sortOrder}`;
      } else {
        url = keyword.trim()
          ? `http://localhost:8080/api/payments/search?method=${encodeURIComponent(keyword)}`
          : `http://localhost:8080/api/payments/page?page=${page}&size=${pageSize}`;
      }

      const res = await axios.get(url);
      const data = res.data;
      const list = Array.isArray(data) ? data : data.content ?? [];
      setPayments(list);

      if (!keyword.trim() && !(sortField && sortOrder)) {
        setTotalPages(data.totalPages ?? 1);
        setCurrentPage(page);
      } else {
        setTotalPages(1);
        setCurrentPage(0);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách thanh toán:", err);
      toast.error("❌ Không thể tải danh sách thanh toán.");
      setPayments([]);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchPayments(searchKeyword.trim(), page);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSearch = () => {
    fetchPayments(searchKeyword.trim(), 0);
  };

  const handleSortApply = () => {
    fetchPayments(searchKeyword.trim(), 0);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xoá thanh toán này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/payments/${id}`);
      toast.success("✅ Xóa thanh toán thành công!");
      fetchPayments(searchKeyword.trim(), currentPage);
    } catch (err) {
      console.error("Lỗi khi xóa thanh toán:", err);
      toast.error("❌ Không thể xóa thanh toán. Vui lòng thử lại!");
    }
  };

  const handleEdit = (p) => {
    setEditingPayment(p);
    setShowForm(true);
  };

  return (
    <div className="staff-container">
      <ToastContainer />
      <h1 className="staff-title">💳 THANH TOÁN 💳</h1>

      <div className="staff-function-buttons">
        <button
          onClick={() => {
            setShowForm(false);
            setEditingPayment(null);
            fetchPayments();
          }}
        >
          Danh sách thanh toán
        </button>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingPayment(null);
          }}
        >
          Thêm thanh toán mới
        </button>
      </div>

      {!showForm && (
        <>
          <div className="search-section">
            <input
              type="text"
              placeholder="🔍 Tìm theo phương thức..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
            <button className="search-button" onClick={handleSearch}>
              Tìm kiếm
            </button>
            <button
              className="sort-icon-button"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              Sắp xếp
            </button>
            {showSortOptions && (
              <div className="sort-options">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="">-- Chọn tiêu chí --</option>
                  <option value="paymentDate">Ngày thanh toán</option>
                  <option value="amount">Số tiền</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">-- Chọn thứ tự --</option>
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
                <button onClick={handleSortApply}>Áp dụng</button>
              </div>
            )}
          </div>

          <div className="staff-table-section">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã đơn</th>
                  <th>Phương thức</th>
                  <th>Số tiền</th>
                  <th>Tiền thừa</th>
                  <th>Ngày TT</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(payments) && payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.paymentID ?? p.id}>
                      <td>{p.paymentID ?? p.id}</td>
                      <td>{p.order?.orderID}</td>
                      <td>{p.method}</td>
                      <td>{p.amount}</td>
                      <td>{p.changeAmount}</td>
                      <td>
                        {p.paymentDate
                          ? new Date(p.paymentDate).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(p)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(p.paymentID ?? p.id)
                          }
                        >
                          ❌ Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Không có dữ liệu thanh toán
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
        </>
      )}

      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onSave={() => {
            setShowForm(false);
            setEditingPayment(null);
            fetchPayments(searchKeyword.trim(), currentPage);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
        />
      )}
    </div>
  );
}
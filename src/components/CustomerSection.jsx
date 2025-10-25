import React, { useEffect, useState } from "react";
import "./CustomerSection.css";
import axios from "axios";
import CustomerForm from "./CustomerForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const CustomerSection = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const pageSize = 5;

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchCustomers(searchKeyword.trim(), page);
    }
  };

  const fetchCustomers = async (keyword = "", page = 0) => {
    try {
      const url = keyword.trim()
        ? `http://localhost:8080/api/customers/search?keyword=${keyword}`
        : `http://localhost:8080/api/customers/page?page=${page}&size=${pageSize}`;
      const res = await axios.get(url);
      let data = res.data;
      let customerList = keyword.trim()
        ? Array.isArray(data) ? data : []
        : Array.isArray(data.content) ? data.content : [];

      if (sortField && sortOrder) {
        customerList.sort((a, b) => {
          let valA = a[sortField];
          let valB = b[sortField];
          if (typeof valA === "string") valA = valA.toLowerCase();
          if (typeof valB === "string") valB = valB.toLowerCase();
          if (valA < valB) return sortOrder === "asc" ? -1 : 1;
          if (valA > valB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      setCustomers(customerList);
      setTotalPages(keyword.trim() ? 1 : data.totalPages || 1);
      setCurrentPage(keyword.trim() ? 0 : page);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách khách hàng:", err);
      toast.error("❌ Không thể tải danh sách khách hàng.");
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = () => {
    fetchCustomers(searchKeyword.trim(), 0);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xoá khách hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/customers/${id}`);
      toast.success("✅ Xóa khách hàng thành công!");
      fetchCustomers(searchKeyword.trim(), currentPage);
    } catch (err) {
      console.error("Lỗi khi xóa khách hàng:", err);
      toast.error("❌ Không thể xóa khách hàng. Vui lòng thử lại!");
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setSelectedFunction("edit");
    setShowForm(true);
  };

  const handleSortChange = () => {
    fetchCustomers(searchKeyword.trim(), 0);
  };

  return (
    <div className="customer-container">
      <ToastContainer />
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
            setSelectedFunction("add");
            setShowForm(true);
            setEditingCustomer(null);
          }}
        >
          Thêm khách hàng mới
        </button>
      </div>

      {selectedFunction === "list" && (
        <>
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
                  <option value="">-- Chọn tiêu chí --</option>
                  <option value="name">Tên</option>
                  <option value="loyaltyPoints">Điểm tích lũy</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">-- Chọn thứ tự --</option>
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
                <button onClick={handleSortChange}>Áp dụng</button>
              </div>
            )}
          </div>

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
                          className="edit-button"
                          onClick={() => handleEdit(c)}
                        >
                          ✏️ Sửa
                        </button>
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

      {(selectedFunction === "add" || selectedFunction === "edit") &&
        showForm && (
          <CustomerForm
            customer={editingCustomer}
            onSave={() => {
              setShowForm(false);
              setEditingCustomer(null);
              setSelectedFunction("list");
              fetchCustomers(searchKeyword.trim(), currentPage);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingCustomer(null);
              setSelectedFunction("list");
            }}
          />
        )}
    </div>
  );
};

export default CustomerSection;
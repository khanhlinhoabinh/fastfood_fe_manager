
import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffForm from "./StaffForm";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "./StaffSection.css";

const StaffSection = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("list");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const pageSize = 10;

  const fetchStaff = async (keyword = "", page = 0) => {
    try {
      const url = keyword.trim()
        ? `http://localhost:8080/api/staff/search?keyword=${keyword}`
        : `http://localhost:8080/api/staff/page?page=${page}&size=${pageSize}`;

      const res = await axios.get(url);
      let data = res.data;
      let staffData = keyword.trim()
        ? Array.isArray(data) ? data : []
        : Array.isArray(data.content) ? data.content : [];

      if (sortField && sortOrder) {
        staffData.sort((a, b) => {
          let valA = a[sortField];
          let valB = b[sortField];
          if (typeof valA === "string") valA = valA.toLowerCase();
          if (typeof valB === "string") valB = valB.toLowerCase();
          if (valA < valB) return sortOrder === "asc" ? -1 : 1;
          if (valA > valB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      setStaffList(staffData);
      setTotalPages(keyword.trim() ? 1 : data.totalPages || 1);
      setCurrentPage(keyword.trim() ? 0 : page);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách nhân viên:", err);
      toast.error("❌ Không thể tải danh sách nhân viên.");
      setStaffList([]);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSearch = () => {
    fetchStaff(searchKeyword.trim(), 0);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchStaff(searchKeyword.trim(), page);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xoá nhân viên này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/staff/${id}`);
      toast.success("✅ Xóa nhân viên thành công!");
      fetchStaff(searchKeyword.trim(), currentPage);
    } catch (err) {
      console.error("Lỗi khi xóa nhân viên:", err);
      toast.error("❌ Không thể xóa nhân viên. Vui lòng thử lại!");
    }
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setSelectedFunction("edit");
    setShowForm(true);
  };

  const handleSortChange = () => {
    fetchStaff(searchKeyword.trim(), 0);
  };

  return (
    <div className="staff-container">
      <ToastContainer />
      <h1 className="staff-title">👨‍🍳 Danh Sách Nhân Viên</h1>

      <div className="staff-function-buttons">
        <button className={selectedFunction === "list" ? "active" : ""} onClick={() => setSelectedFunction("list")}>
          Danh sách nhân viên
        </button>
        <button className={selectedFunction === "add" ? "active" : ""} onClick={() => {
          setSelectedFunction("add");
          setShowForm(true);
          setEditingStaff(null);
        }}>
          Thêm nhân viên mới
        </button>
      </div>

      {selectedFunction === "list" && (
        <>
          <div className="search-section">
            <input type="text" placeholder="🔍 Nhập tên hoặc chức vụ..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="search-input" />
            <button onClick={handleSearch} className="search-button">Tìm kiếm</button>
            <button className="sort-icon-button" onClick={() => setShowSortOptions(!showSortOptions)}>⚙️ Sắp xếp</button>
            {showSortOptions && (
              <div className="sort-options">
                <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                  <option value="">-- Chọn tiêu chí --</option>
                  <option value="name">Tên</option>
                  <option value="salary">Lương</option>
                </select>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="">-- Chọn thứ tự --</option>
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
                <button onClick={handleSortChange}>Áp dụng</button>
              </div>
            )}
          </div>

          <div className="staff-table-section">
            <h2>📋 Thông tin nhân viên</h2>
            <table className="staff-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Chức vụ</th>
                  <th>Ca làm việc</th>
                  <th>Lương</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(staffList) && staffList.length > 0 ? (
                  staffList.map((s) => (
                    <tr key={s.staffID}>
                      <td>{s.staffID}</td>
                      <td>{s.name}</td>
                      <td>{s.position}</td>
                      <td>{s.shift}</td>
                      <td>{s.salary}</td>
                      <td>
                        <button className="edit-button" onClick={() => handleEdit(s)}>✏️ Sửa</button>
                        <button className="delete-button" onClick={() => handleDelete(s.staffID)}>❌ Xoá</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">Không có dữ liệu nhân viên</td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>⬅ Trước</button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button key={index} className={index === currentPage ? "active-page" : ""} onClick={() => handlePageChange(index)}>
                    {index + 1}
                  </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>Sau ➡</button>
              </div>
            )}
          </div>
        </>
      )}

      {(selectedFunction === "add" || selectedFunction === "edit") && showForm && (
        <StaffForm
          staff={editingStaff}
          onSave={() => {
            setShowForm(false);
            setEditingStaff(null);
            setSelectedFunction("list");
            fetchStaff(searchKeyword.trim(), currentPage);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingStaff(null);
            setSelectedFunction("list");
          }}
        />
      )}
    </div>
  );
};

export default StaffSection;
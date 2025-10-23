
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StaffSection.css";

const StaffForm = ({ staff, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    shift: "",
    salary: 0,
  });

  useEffect(() => {
    if (staff) setFormData(staff);
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.position.trim() || !formData.shift.trim()) {
      toast.error("⚠️ Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      if (staff) {
        await axios.put(`http://localhost:8080/api/staff/${staff.staffID}`, formData);
        toast.success("✅ Cập nhật nhân viên thành công!");
      } else {
        await axios.post("http://localhost:8080/api/staff", formData);
        toast.success("✅ Thêm nhân viên mới thành công!");
      }
      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu nhân viên:", err);
      toast.error("❌ Không thể lưu nhân viên. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="staff-form">
      <h3>{staff ? "✏️ Sửa nhân viên" : "➕ Thêm nhân viên mới"}</h3>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Tên nhân viên" required />
      <input name="position" value={formData.position} onChange={handleChange} placeholder="Chức vụ" required />
      <input name="shift" value={formData.shift} onChange={handleChange} placeholder="Ca làm việc" required />
      <input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Lương" required />
      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>❌ Hủy</button>
      </div>
    </form>
  );
};

export default StaffForm;

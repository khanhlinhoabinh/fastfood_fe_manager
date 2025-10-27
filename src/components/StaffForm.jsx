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
    if (!formData.name.trim() || !formData.position || !formData.shift) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
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
      toast.error("Không thể lưu nhân viên. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="staff-form">
      <h3>{staff ? "✏️ Sửa nhân viên" : "➕ Thêm nhân viên mới"}</h3>

      <label>Tên nhân viên</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <label>Chức vụ</label>
      <select name="position" value={formData.position} onChange={handleChange}>
        <option value="">-- Chọn chức vụ --</option>
        <option value="Nhân viên">Nhân viên</option>
        <option value="Quản lý">Quản lý</option>
        <option value="Thu ngân">Thu ngân</option>
        <option value="Phục vụ">Phục vụ</option>
        <option value="Bếp trưởng">Bếp trưởng</option>
      </select>

      <label>Ca làm việc</label>
      <select name="shift" value={formData.shift} onChange={handleChange}>
        <option value="">-- Chọn ca làm việc --</option>
        <option value="Sáng">Sáng</option>
        <option value="Chiều">Chiều</option>
        <option value="Tối">Tối</option>
        <option value="Fulltime">Fulltime</option>
      </select>

      <label>Lương</label>
      <input
        type="number"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
      />

      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>❌ Hủy</button>
      </div>
    </form>
  );
};

export default StaffForm;
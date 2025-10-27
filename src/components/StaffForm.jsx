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

const [errors, setErrors] = useState({
    name: "",
    position: "",
    shift: "",
    salary: "",
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
  const newErrors = { name: '', position: '', shift: '', salary: '' };
  let valid = true;

  
if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên nhân viên!";
      valid = false;
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = "Tên nhân viên phải từ 2 đến 50 ký tự!";
      valid = false;
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.name)) {
      newErrors.name = "Tên chỉ được chứa chữ cái và khoảng trắng!";
      valid = false;
    }

 
if (!formData.position) {
      newErrors.position = "Vui lòng chọn chức vụ!";
      valid = false;
    }

    if (!formData.shift) {
      newErrors.shift = "Vui lòng chọn ca làm việc!";
      valid = false;
    }

    if (isNaN(formData.salary) || formData.salary <= 0 || formData.salary > 100000000) {
      newErrors.salary = "Lương phải là số hợp lệ và lớn hơn 0!";
      valid = false;
    }


  setErrors(newErrors);
  if (!valid) return;

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
{errors.name && <div style={{ color: "red", fontSize: "13px" }}>{errors.name}</div>}
      <label>Chức vụ</label>
      <select name="position" value={formData.position} onChange={handleChange}>
        <option value="">-- Chọn chức vụ --</option>
        <option value="Nhân viên">Nhân viên</option>
        <option value="Quản lý">Quản lý</option>
        <option value="Thu ngân">Thu ngân</option>
        <option value="Phục vụ">Phục vụ</option>
        <option value="Bếp trưởng">Bếp trưởng</option>
      </select>
{errors.position && <div style={{ color: "red", fontSize: "13px" }}>{errors.position}</div>}
      <label>Ca làm việc</label>
      <select name="shift" value={formData.shift} onChange={handleChange}>
        <option value="">-- Chọn ca làm việc --</option>
        <option value="Sáng">Sáng</option>
        <option value="Chiều">Chiều</option>
        <option value="Tối">Tối</option>
        <option value="Fulltime">Fulltime</option>
      </select>
{errors.shift && <div style={{ color: "red", fontSize: "13px" }}>{errors.shift}</div>}
      <label>Lương</label>
      <input
        type="number"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
      />
{errors.salary && <div style={{ color: "red", fontSize: "13px" }}>{errors.salary}</div>}
      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>❌ Hủy</button>
      </div>
    </form>
  );
};

export default StaffForm;
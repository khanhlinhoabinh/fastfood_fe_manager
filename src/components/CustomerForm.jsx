import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CustomerSection.css";

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    loyaltyPoints: 0,
    memberType: "Thường",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "loyaltyPoints" ? Number(value) : value,
    }));

    const newErrors = { ...errors };

    if (name === "name") {
      if (!value.trim()) newErrors.name = "Tên khách hàng không được để trống";
      else delete newErrors.name;
    }

    if (name === "phone") {
      if (!value.trim()) newErrors.phone = "Số điện thoại không được để trống";
      else delete newErrors.phone;
    }

    if (name === "email") {
      if (!value.trim()) newErrors.email = "Email không được để trống";
      else delete newErrors.email;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên khách hàng không được để trống";
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("⚠️ Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (customer) {
        await axios.put(`http://localhost:8080/api/customers/${customer.customerID}`, formData);
        toast.success("✅ Cập nhật khách hàng thành công!");
      } else {
        await axios.post("http://localhost:8080/api/customers", formData);
        toast.success("✅ Thêm khách hàng mới thành công!");
      }
      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu khách hàng:", err);
      toast.error("❌ Không thể lưu khách hàng. Vui lòng thử lại!");
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h3>{customer ? "✏️ Sửa khách hàng" : "➕ Thêm khách hàng mới"}</h3>

      <label>Tên khách hàng</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={errors.name ? "input-error" : ""}
        required
      />
      {errors.name && <div className="error">{errors.name}</div>}

      <label>Số điện thoại</label>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className={errors.phone ? "input-error" : ""}
        required
      />
      {errors.phone && <div className="error">{errors.phone}</div>}

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={errors.email ? "input-error" : ""}
        required
      />
      {errors.email && <div className="error">{errors.email}</div>}

      <label>Điểm tích lũy</label>
      <input
        type="number"
        name="loyaltyPoints"
        value={formData.loyaltyPoints}
        onChange={handleChange}
      />

      <label>Loại thành viên</label>
      <select name="memberType" value={formData.memberType} onChange={handleChange}>
        <option value="Thường">Thường</option>
        <option value="Thân Thiết">Thân Thiết</option>
        <option value="Vãng Lai">Vãng Lai</option>
      </select>

      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>❌ Hủy</button>
      </div>
    </form>
  );
};

export default CustomerForm;
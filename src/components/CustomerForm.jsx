import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerSection.css";

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    loyaltyPoints: 0,
    memberType: "Thường",
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      if (customer) {
        await axios.put(
          `http://localhost:8080/api/customers/${customer.customerID}`,
          formData
        );
        alert("✅ Cập nhật khách hàng thành công!");
      } else {
        await axios.post("http://localhost:8080/api/customers", formData);
        alert("✅ Thêm khách hàng mới thành công!");
      }

      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu khách hàng:", err);
      alert("Không thể lưu khách hàng. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <h3>{customer ? "✏️ Sửa khách hàng" : "➕ Thêm khách hàng mới"}</h3>

      <label>Tên khách hàng</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Tên khách hàng"
        required
      />

      <label>Số điện thoại</label>
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Số điện thoại"
        required
      />

      <label>Email</label>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />

      <label>Điểm tích lũy</label>
      <input
        name="loyaltyPoints"
        type="number"
        value={formData.loyaltyPoints}
        onChange={handleChange}
        placeholder="Điểm tích lũy"
      />

      <label>Loại thành viên</label>
      <select
        name="memberType"
        value={formData.memberType}
        onChange={handleChange}
      >
        <option value="Thân Thiết">Thân Thiết</option>
        <option value="Vãng Lai">Vãng Lai</option>
      </select>

      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>
          ❌ Hủy
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
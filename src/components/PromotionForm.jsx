import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PromotionSection.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PromotionForm = ({ promotion, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    discountPercent: 0,
    expiryDate: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (promotion) setFormData(promotion);
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

    if (name === "name") {
      if (!value.trim()) newErrors.name = "Tên khuyến mãi không được để trống";
      else delete newErrors.name;
    }

    if (name === "type") {
      if (!value.trim()) newErrors.type = "Loại khuyến mãi không được để trống";
      else delete newErrors.type;
    }

    if (name === "discountPercent") {
      const num = parseInt(value);
      if (!num || num <= 0 || num > 100)
        newErrors.discountPercent = "Giảm giá phải từ 1% đến 100%";
      else delete newErrors.discountPercent;
    }

    if (name === "expiryDate") {
      if (!value) newErrors.expiryDate = "Ngày hết hạn không được để trống";
      else if (new Date(value) < new Date())
        newErrors.expiryDate = "Ngày hết hạn phải từ hôm nay trở đi";
      else delete newErrors.expiryDate;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên khuyến mãi không được để trống";
    if (!formData.type.trim()) newErrors.type = "*Loại khuyến mãi không được để trống";
    if (!formData.discountPercent || formData.discountPercent <= 0 || formData.discountPercent > 100)
      newErrors.discountPercent = "Giảm giá phải từ 1% đến 100%";
    if (!formData.expiryDate)
      newErrors.expiryDate = "Ngày hết hạn không được để trống";
    else if (new Date(formData.expiryDate) < new Date())
      newErrors.expiryDate = "Ngày hết hạn phải từ hôm nay trở đi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("⚠️ Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      if (promotion) {
        await axios.put(`http://localhost:8080/api/promotions/${promotion.promotionID}`, formData);
        toast.success("✅ Cập nhật khuyến mãi thành công!");
      } else {
        await axios.post("http://localhost:8080/api/promotions", formData);
        toast.success("✅ Thêm khuyến mãi mới thành công!");
      }
      if (onSave) onSave();
    } catch (err) {
      toast.error(err.response?.data || "❌ Lỗi khi lưu khuyến mãi!");
    }
  };

  return (
    <form className="promotion-form" onSubmit={handleSubmit}>
      <h3>{promotion ? "✏️ Sửa khuyến mãi" : "➕ Thêm khuyến mãi mới"}</h3>

      <label>Tên khuyến mãi</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={errors.name ? "input-error" : ""}
        required
      />
      {errors.name && <div className="error">{errors.name}</div>}

      <label>Loại khuyến mãi</label>
      <input
        name="type"
        value={formData.type}
        onChange={handleChange}
        className={errors.type ? "input-error" : ""}
        required
      />
      {errors.type && <div className="error">{errors.type}</div>}

      <label>Giảm giá (%)</label>
      <input
        name="discountPercent"
        type="number"
        value={formData.discountPercent}
        onChange={handleChange}
        className={errors.discountPercent ? "input-error" : ""}
        required
      />
      {errors.discountPercent && <div className="error">{errors.discountPercent}</div>}

      <label>Ngày hết hạn</label>
      <input
        name="expiryDate"
        type="date"
        value={formData.expiryDate}
        onChange={handleChange}
        className={errors.expiryDate ? "input-error" : ""}
        required
      />
      {errors.expiryDate && <div className="error">{errors.expiryDate}</div>}

      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>❌ Hủy</button>
      </div>
    </form>
  );
};

export default PromotionForm;
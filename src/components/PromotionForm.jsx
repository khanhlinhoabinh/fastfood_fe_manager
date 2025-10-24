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

  useEffect(() => {
    if (promotion) setFormData(promotion);
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.type || formData.discountPercent <= 0) {
      toast.error("⚠️ Vui lòng nhập đầy đủ thông tin hợp lệ!");
      return;
    }

    try {
      if (promotion) {
        await axios.put(
          `http://localhost:8080/api/promotions/${promotion.promotionID}`,
          formData
        );
        toast.success(" Cập nhật khuyến mãi thành công!");
      } else {
        await axios.post("http://localhost:8080/api/promotions", formData);
        toast.success(" Thêm khuyến mãi mới thành công!");
      }
      if (onSave) onSave();
    } catch (err) {
      toast.error(err.response?.data || " Lỗi khi lưu khuyến mãi!");
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
        required
      />

      <label>Loại khuyến mãi</label>
      <input
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
      />

      <label>Giảm giá (%)</label>
      <input
        name="discountPercent"
        type="number"
        value={formData.discountPercent}
        onChange={handleChange}
        required
      />

      <label>Ngày hết hạn</label>
      <input
        name="expiryDate"
        type="date"
        value={formData.expiryDate}
        onChange={handleChange}
        required
      />

      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>
          ❌ Hủy
        </button>
      </div>
    </form>
  );
};

export default PromotionForm;

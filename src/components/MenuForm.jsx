import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MenuSection.css";

const MenuForm = ({ menuItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    stockQuantity: 0,
    prepTime: 0,
  });

  useEffect(() => {
    if (menuItem) {
      setFormData(menuItem);
    }
  }, [menuItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stockQuantity" || name === "prepTime"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category.trim() || formData.price <= 0) {
      alert("Vui lòng điền đầy đủ thông tin hợp lệ!");
      return;
    }

    try {
      if (menuItem) {
        await axios.put(
          `http://localhost:8080/api/menuitems/${menuItem.menuItemID}`,
          formData
        );
        alert("✅ Cập nhật món ăn thành công!");
      } else {
        await axios.post("http://localhost:8080/api/menuitems", formData);
        alert("✅ Thêm món ăn mới thành công!");
      }

      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu món ăn:", err);
      alert("Không thể lưu món ăn. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="menu-form">
      <h3>{menuItem ? "✏️ Sửa món ăn" : "➕ Thêm món ăn mới"}</h3>

      <label>Tên món ăn</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Tên món ăn"
        required
      />

      <label>Loại món</label>
      <input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Loại món"
        required
      />

      <label>Giá (₫)</label>
      <input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Giá"
        required
      />

      <label>Mô tả</label>
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Mô tả"
      />

      <label>Số lượng tồn kho</label>
      <input
        name="stockQuantity"
        type="number"
        value={formData.stockQuantity}
        onChange={handleChange}
        placeholder="Tồn kho"
      />

      <label>Thời gian chuẩn bị (phút)</label>
      <input
        name="prepTime"
        type="number"
        value={formData.prepTime}
        onChange={handleChange}
        placeholder="Thời gian chuẩn bị"
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

export default MenuForm;
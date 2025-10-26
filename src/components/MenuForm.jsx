import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MenuSection.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MenuForm = ({ menuItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    stockQuantity: 0,
    prepTime: 0,
    image: "",
  });
  const [uploading, setUploading] = useState(false); // ✅ trạng thái upload ảnh

  useEffect(() => {
    if (menuItem) {
      setFormData(menuItem);
    }
  }, [menuItem]);

  // ✅ upload ảnh lên Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "unsigned_preset"); // 🔹 preset bạn tạo trong Cloudinary
    form.append("cloud_name", "dgd12qk9s"); // 🔹 thay bằng cloud_name của bạn

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgd12qk9s/image/upload",
        { method: "POST", body: form }
      );
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image: data.secure_url }));
      toast.success("📸 Ảnh đã được tải lên!");
    } catch (err) {
      console.error("Upload ảnh lỗi:", err);
      toast.error("❌ Không thể upload ảnh!");
    } finally {
      setUploading(false);
    }
  };


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
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ!");
      return;
    }

    try {
      if (menuItem) {
        await axios.put(
          `http://localhost:8080/api/menuitems/${menuItem.menuItemID}`,
          formData
        );
        toast.success("✅ Cập nhật món ăn thành công!");
      } else {
        await axios.post("http://localhost:8080/api/menuitems", formData);
        toast.success("Thêm món ăn mới thành công!");
      }

      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu món ăn:", err);
      toast.error("Không thể lưu món ăn. Vui lòng thử lại!");
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

      {/* ✅ Upload ảnh */}
      <label>Ảnh món ăn</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploading && <p>⏳ Đang tải ảnh lên...</p>}
      {formData.image && (
        <div className="image-preview">
          <img
            src={formData.image}
            alt="Preview"
            style={{ width: "150px", borderRadius: "8px", marginTop: "8px" }}
          />
        </div>
      )}

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
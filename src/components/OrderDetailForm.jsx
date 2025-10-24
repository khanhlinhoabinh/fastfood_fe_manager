import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OrderDetailSection.css";

const OrderDetailForm = ({ orderDetail, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    orderID: "",
    menuItemID: "",
    quantity: 1,
    unitPrice: 0,
    note: "",
  });

  useEffect(() => {
    if (orderDetail) {
      setFormData(orderDetail);
    }
  }, [orderDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderID || !formData.menuItemID || formData.quantity <= 0 || formData.unitPrice < 0) {
      toast.error("Vui lòng nhập thông tin hợp lệ!");
      return;
    }

    try {
      if (orderDetail) {
        await axios.put(`http://localhost:8080/api/order-details/${orderDetail.orderDetailID}`, formData);
        toast.success("Cập nhật chi tiết đơn hàng thành công!");
      } else {
        await axios.post("http://localhost:8080/api/order-details", formData);
        toast.success("Thêm chi tiết đơn hàng mới thành công!");
      }
      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu chi tiết đơn hàng:", err);
      toast.error("Không thể lưu. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h3>{orderDetail ? "✏️ Sửa chi tiết đơn hàng" : "➕ Thêm chi tiết đơn hàng"}</h3>

      <label>Mã đơn</label>
      <input name="orderID" value={formData.orderID} onChange={handleChange} placeholder="Mã đơn" required />

      <label>Mã món</label>
      <input name="menuItemID" value={formData.menuItemID} onChange={handleChange} placeholder="Mã món" required />

      <label>Số lượng</label>
      <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Số lượng" required />

      <label>Đơn giá (₫)</label>
      <input name="unitPrice" type="number" value={formData.unitPrice} onChange={handleChange} placeholder="Đơn giá" required />

      <label>Ghi chú</label>
      <input name="note" value={formData.note} onChange={handleChange} placeholder="Ghi chú" />

      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>❌ Hủy</button>
      </div>
    </form>
  );
};

export default OrderDetailForm;
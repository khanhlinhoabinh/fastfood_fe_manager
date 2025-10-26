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

  const [orders, setOrders] = useState([]); // 🧩 danh sách đơn hàng
  const [menuItems, setMenuItems] = useState([]); // 🧩 danh sách món ăn

  // ✅ Load dữ liệu dropdown từ backend
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [resOrders, resMenu] = await Promise.all([
          axios.get("http://localhost:8080/api/orders"),
          axios.get("http://localhost:8080/api/menuitems"),
        ]);
        setOrders(resOrders.data);
        setMenuItems(resMenu.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu dropdown:", error);
        toast.error("Không thể tải danh sách đơn hàng hoặc món ăn!");
      }
    };

    fetchDropdownData();
  }, []);

  // ✅ Khi edit: load dữ liệu sẵn
  useEffect(() => {
    if (orderDetail) {
      setFormData(orderDetail);
    } else {
      setFormData({
        orderID: "",
        menuItemID: "",
        quantity: 1,
        unitPrice: 0,
        note: "",
      });
    }
  }, [orderDetail]);

  // ✅ Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.orderID ||
      !formData.menuItemID ||
      formData.quantity <= 0 ||
      formData.unitPrice < 0
    ) {
      toast.error("⚠️ Vui lòng nhập thông tin hợp lệ!");
      return;
    }

    try {
      if (orderDetail) {
        await axios.put(
          `http://localhost:8080/api/order-details/${orderDetail.orderDetailID}`,
          formData
        );
        toast.success(" Cập nhật chi tiết đơn hàng thành công!");
      } else {
        await axios.post("http://localhost:8080/api/order-details", formData);
        toast.success(" Thêm chi tiết đơn hàng mới thành công!");
      }
      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu chi tiết đơn hàng:", err);
      toast.error("Không thể lưu. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h3>
        {orderDetail ? "✏️ Sửa chi tiết đơn hàng" : "➕ Thêm chi tiết đơn hàng"}
      </h3>

      {/* --- Dropdown Mã đơn hàng --- */}
      <label>Mã đơn hàng</label>
      <select
        name="orderID"
        value={formData.orderID}
        onChange={handleChange}
        required
      >
        <option value="">-- Chọn đơn hàng --</option>
        {orders.map((o) => (
          <option key={o.orderID} value={o.orderID}>
            {o.orderID} - KH: {o.customerID} ({new Date(o.orderDate).toLocaleDateString()})
          </option>
        ))}
      </select>

      {/* --- Dropdown Mã món ăn --- */}
      <label>Món ăn</label>
      <select
        name="menuItemID"
        value={formData.menuItemID}
        onChange={handleChange}
        required
      >
        <option value="">-- Chọn món ăn --</option>
        {menuItems.map((m) => (
          <option key={m.menuItemID} value={m.menuItemID}>
            {m.menuItemID} - {m.name} ({m.price?.toLocaleString()}₫)
          </option>
        ))}
      </select>

      {/* --- Số lượng --- */}
      <label>Số lượng</label>
      <input
        name="quantity"
        type="number"
        min="1"
        value={formData.quantity}
        onChange={handleChange}
        required
      />

      {/* --- Đơn giá --- */}
      <label>Đơn giá (₫)</label>
      <input
        name="unitPrice"
        type="number"
        min="0"
        value={formData.unitPrice}
        onChange={handleChange}
        required
      />

      {/* --- Ghi chú --- */}
      <label>Ghi chú</label>
      <input
        name="note"
        value={formData.note}
        onChange={handleChange}
        placeholder="Nhập ghi chú (tuỳ chọn)"
      />

      {/* --- Nút --- */}
      <div className="form-buttons">
        <button type="submit">💾 Lưu</button>
        <button type="button" onClick={onCancel}>
          ❌ Hủy
        </button>
      </div>
    </form>
  );
};

export default OrderDetailForm;

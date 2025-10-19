import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderSection.css";

const defaultOrder = {
  customerID: "",
  staffID: "",
  orderDate: new Date().toISOString().slice(0, 16),
  totalAmount: 0,
  status: "NEW",
};


const OrderForm = ({ order, onClose, onSaved }) => {
  const [form, setForm] = useState(defaultOrder);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  if (order) {
    const d = order.orderDate ? new Date(order.orderDate) : new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setForm({
      customerID: order.customerID || "",
      staffID: order.staffID || "",
      orderDate: local,
      totalAmount: order.totalAmount || 0,
      status: order.status || "NEW",
      id: order.orderID,
    });
  } else {
    setForm(defaultOrder);
  }
}, [order]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: name === "totalAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); // 🔥 tránh reload

  const payload = {
    customerID: Number(form.customerID),
    staffID: Number(form.staffID),
    orderDate: new Date(form.orderDate).toISOString().slice(0, 19),
    totalAmount: parseFloat(form.totalAmount),
    status: form.status,
  };

  setSaving(true);
  try {
    await axios.post("http://localhost:8080/api/orders", payload);
    alert("Tạo thành công 🎉");
    onSaved(); // reload danh sách
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err);
    alert("Tạo thất bại");
  } finally {
    setSaving(false);
  }
};



  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{form.id ? "Sửa đơn hàng" : "Thêm đơn hàng mới"}</h3>
        <form onSubmit={handleSubmit} className="order-form">
  <label>
    Mã khách hàng
    <input
      name="customerID"
      value={form.customerID}
      onChange={handleChange}
      required
    />
  </label>

  <label>
    Mã nhân viên
    <input
      name="staffID"
      value={form.staffID}
      onChange={handleChange}
      required
    />
  </label>

  <label>
    Ngày giờ đặt
    <input
      name="orderDate"
      type="datetime-local"
      value={form.orderDate}
      onChange={handleChange}
      required
    />
  </label>

  <label>
    Tổng tiền (₫)
    <input
      name="totalAmount"
      type="number"
      min="0"
      value={form.totalAmount}
      onChange={handleChange}
      required
    />
  </label>

  <label>
    Trạng thái
    <select name="status" value={form.status} onChange={handleChange}>
      <option value="NEW">NEW</option>
      <option value="Đã thanh toán">Đã thanh toán</option>
      <option value="Chưa thanh toán">Chưa thanh toán</option>
    </select>
  </label>

  <div className="form-actions">
    <button type="submit" className="btn" disabled={saving}>
      {saving ? "Đang lưu..." : "Lưu"}
    </button>
    <button type="button" className="btn ghost" onClick={onClose} disabled={saving}>
      Hủy
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default OrderForm;

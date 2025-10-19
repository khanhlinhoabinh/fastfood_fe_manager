import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderSection.css";

const defaultOrder = {
  customerCode: "",
  orderDate: new Date().toISOString().slice(0, 16), // datetime-local compatible
  totalAmount: 0,
  status: "NEW",
  note: "",
  // nếu backend cần orderItems, bạn có thể thêm
};

const OrderForm = ({ order, onClose, onSaved }) => {
  const [form, setForm] = useState(defaultOrder);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      // convert date to input datetime-local format if necessary
      const d = order.orderDate ? new Date(order.orderDate) : new Date();
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setForm({
        customerCode: order.customerCode || "",
        orderDate: local,
        totalAmount: order.totalAmount || 0,
        status: order.status || "NEW",
        note: order.note || "",
        id: order.id,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    // convert orderDate back to ISO
    const payload = {
      ...form,
      orderDate: new Date(form.orderDate).toISOString(),
    };

    if (form.id) {
      // update
      axios
        .put(`http://localhost:8080/api/orders/${form.id}`, payload)
        .then(() => {
          alert("Cập nhật thành công");
          onSaved();
        })
        .catch((err) => {
          console.error(err);
          alert("Cập nhật thất bại");
        })
        .finally(() => setSaving(false));
    } else {
      // create
      axios
        .post(`http://localhost:3000/api/orders`, payload)
        .then(() => {
          alert("Tạo đơn hàng thành công");
          onSaved();
        })
        .catch((err) => {
          console.error(err);
          alert("Tạo thất bại");
        })
        .finally(() => setSaving(false));
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
              name="customerCode"
              value={form.customerCode}
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
              <option value="PROCESSING">PROCESSING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </label>

          <label>
            Ghi chú
            <textarea name="note" value={form.note} onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={onClose}
              disabled={saving}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;

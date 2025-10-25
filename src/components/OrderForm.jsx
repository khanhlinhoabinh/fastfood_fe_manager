import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Lấy giờ địa phương hiện tại
const getLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
};

const OrderForm = ({ order, onClose, onSaved }) => {
  const [form, setForm] = useState({
    customerID: "",
    staffID: "",
    orderDate: getLocalDateTime(),
    totalAmount: 0,
    status: "Chưa thanh toán",
  });
  const [saving, setSaving] = useState(false);

  // ✅ Khi chỉnh sửa thì load dữ liệu sẵn vào form
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
        status: order.status || "Chưa thanh toán",
        id: order.orderID,
      });
    } else {
      // Khi mở form thêm mới
      setForm({
        customerID: "",
        staffID: "",
        orderDate: getLocalDateTime(),
        totalAmount: 0,
        status: "Chưa thanh toán",
      });
    }
  }, [order]);

  // ✅ Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? Number(value) : value,
    }));
  };

  // ✅ Submit form (thêm/sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customerID: Number(form.customerID),
      staffID: Number(form.staffID),
      orderDate: new Date(form.orderDate).toISOString().slice(0, 19),
      totalAmount: parseFloat(form.totalAmount),
      status: form.status,
    };

    setSaving(true);

    try {
      let response;
      if (form.id) {
        // Sửa
        response = await axios.put(`http://localhost:8080/api/orders/${form.id}`, payload);
      } else {
        // Thêm mới
        response = await axios.post("http://localhost:8080/api/orders", payload);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(form.id ? "Cập nhật thành công 🎉" : "Tạo thành công 🎉");
        onSaved(); // Gọi hàm reload danh sách bên cha
        onClose(); // Đóng form
      } else {
        toast.error("Tạo/Sửa thất bại ❌");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tạo/sửa đơn hàng:", err);
      toast.error("Tạo/Sửa thất bại ❌");
      // ⚠️ Không gọi onClose() ở đây — tránh đóng form khi lỗi
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
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Chưa thanh toán">Chưa thanh toán</option>
              <option value="Đang xử lý">Đang xử lý</option>
            </select>
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
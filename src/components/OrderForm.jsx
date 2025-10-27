import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OrderSection.css";

// ✅ Lấy giờ địa phương hiện tại
const getLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
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
  const [customers, setCustomers] = useState([]); // 🧩 danh sách KH
  const [staffList, setStaffList] = useState([]); // 🧩 danh sách nhân viên

  // ✅ Gọi API load KH & NV khi mở form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCus, resStaff] = await Promise.all([
          axios.get("http://localhost:8080/api/customers"),
          axios.get("http://localhost:8080/api/staff"),
        ]);
        setCustomers(resCus.data);
        setStaffList(resStaff.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu dropdown:", error);
        toast.error("Không thể tải danh sách KH/NV");
      }
    };
    fetchData();
  }, []);

  // ✅ Khi chỉnh sửa thì load dữ liệu sẵn
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

  // ✅ Submit form
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
        response = await axios.put(
          `http://localhost:8080/api/orders/${form.id}`,
          payload
        );
      } else {
        response = await axios.post("http://localhost:8080/api/orders", payload);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(form.id ? "✅ Cập nhật thành công" : "🎉 Tạo đơn hàng thành công!");
        onSaved();
        onClose();
      } else {
        toast.error("⚠️ Tạo/Sửa thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tạo/sửa đơn hàng:", err);
      toast.error("❌ Tạo/Sửa thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="staff-form" onSubmit={handleSubmit}>
  <h3>{form.id ? "✏️ Sửa đơn hàng" : "➕ Thêm đơn hàng mới"}</h3>

  <label>Mã khách hàng</label>
  <select name="customerID" value={form.customerID} onChange={handleChange} required>
    <option value="">-- Chọn mã khách hàng --</option>
    {customers.map((c) => (
      <option key={c.customerID} value={c.customerID}>
        {c.customerID} - {c.name}
      </option>
    ))}
  </select>

  <label>Mã nhân viên</label>
  <select name="staffID" value={form.staffID} onChange={handleChange} required>
    <option value="">-- Chọn mã nhân viên --</option>
    {staffList.map((s) => (
      <option key={s.staffID} value={s.staffID}>
        {s.staffID} - {s.name}
      </option>
    ))}
  </select>

  <label>Ngày giờ đặt</label>
  <input
    type="datetime-local"
    name="orderDate"
    value={form.orderDate}
    onChange={handleChange}
    required
  />

  <label>Tổng tiền (₫)</label>
  <input
    type="number"
    name="totalAmount"
    min="0"
    value={form.totalAmount}
    onChange={handleChange}
    required
  />

  <label>Trạng thái</label>
  <select name="status" value={form.status} onChange={handleChange}>
    <option value="Đã thanh toán">Đã thanh toán</option>
    <option value="Chưa thanh toán">Chưa thanh toán</option>
    <option value="Đang xử lý">Đang xử lý</option>
  </select>

  <div className="form-buttons">
    <button type="submit" disabled={saving}>
      💾 {saving ? "Đang lưu..." : "Lưu"}
    </button>
    <button type="button" onClick={onClose} disabled={saving}>
      ❌ Hủy
    </button>
  </div>
</form>
  );
};

export default OrderForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PaymentSection.css";

const PaymentForm = ({ payment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    orderId: "",
    method: "",
    amount: 0,
    changeAmount: 0,
    paymentDate: "",
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        orderId: payment.order?.orderID ?? "",
        method: payment.method ?? "",
        amount: payment.amount ?? 0,
        changeAmount: payment.changeAmount ?? 0,
        paymentDate: payment.paymentDate
          ? new Date(payment.paymentDate).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["amount", "changeAmount", "orderId"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderId || !formData.method.trim() || formData.amount <= 0) {
      toast.error("⚠️ Vui lòng điền đầy đủ thông tin hợp lệ!");
      return;
    }

    const payload = {
      orderId: formData.orderId,
      method: formData.method,
      amount: formData.amount,
      changeAmount: formData.changeAmount,
      paymentDate: formData.paymentDate
        ? new Date(formData.paymentDate).toISOString()
        : null,
    };

    try {
      if (payment && payment.paymentID) {
        await axios.put(
          `http://localhost:8080/api/payments/${payment.paymentID}`,
          payload
        );
        toast.success("✅ Cập nhật thanh toán thành công!");
      } else {
        await axios.post("http://localhost:8080/api/payments", payload);
        toast.success("✅ Thêm thanh toán mới thành công!");
      }
      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu thanh toán:", err);
      toast.error("❌ Không thể lưu thanh toán. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="staff-form">
      <h4>{payment ? "✏️ Sửa thanh toán" : "➕ Thêm thanh toán mới"}</h4>

      <label>Mã đơn (ID)</label>
      <input
        name="orderId"
        type="number"
        value={formData.orderId}
        onChange={handleChange}
        required
      />

      <label>Phương thức</label>
      <select
        name="method"
        value={formData.method}
        onChange={handleChange}
        required
      >
        <option value="">-- Chọn phương thức --</option>
        <option value="Tiền mặt">Tiền mặt</option>
        <option value="Thẻ">Thẻ</option>
        <option value="Momo">Momo</option>
        <option value="ZaloPay">ZaloPay</option>
      </select>

      <label>Số tiền (₫)</label>
      <input
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <label>Tiền thừa (₫)</label>
      <input
        name="changeAmount"
        type="number"
        value={formData.changeAmount}
        onChange={handleChange}
      />

      <label>Ngày thanh toán</label>
      <input
        name="paymentDate"
        type="datetime-local"
        value={formData.paymentDate}
        onChange={handleChange}
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

export default PaymentForm;
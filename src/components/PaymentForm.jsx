import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaymentSection.css";

const PaymentForm = ({ payment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    orderCode: "",
    method: "",
    amount: 0,
    change: 0,
    paymentDate: "",
  });

  // Khi sửa thì load dữ liệu cũ
  useEffect(() => {
    if (payment) {
      setFormData(payment);
    }
  }, [payment]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "change" ? Number(value) : value,
    }));
  };

  // Xử lý lưu form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.orderCode.trim() ||
      !formData.method.trim() ||
      formData.amount <= 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin hợp lệ!");
      return;
    }

    try {
      if (payment) {
        await axios.put(
          `http://localhost:8080/api/payments/${payment.paymentID}`,
          formData
        );
        alert("✅ Cập nhật thanh toán thành công!");
      } else {
        await axios.post("http://localhost:8080/api/payments", formData);
        alert("✅ Thêm thanh toán mới thành công!");
      }

      if (onSave) onSave();
    } catch (err) {
      console.error("❌ Lỗi khi lưu thanh toán:", err);
      alert("Không thể lưu thanh toán. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>{payment ? "✏️ Sửa thanh toán" : "➕ Thêm thanh toán mới"}</h3>

      <label>Mã đơn</label>
      <input
        name="orderCode"
        value={formData.orderCode}
        onChange={handleChange}
        placeholder="Nhập mã đơn"
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
        placeholder="Nhập số tiền"
        required
      />

      <label>Tiền thừa (₫)</label>
      <input
        name="change"
        type="number"
        value={formData.change}
        onChange={handleChange}
        placeholder="Nhập tiền thừa"
      />

      <label>Ngày thanh toán</label>
      <input
        name="paymentDate"
        type="datetime-local"
        value={formData.paymentDate}
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

export default PaymentForm;

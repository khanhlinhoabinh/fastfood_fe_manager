import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PaymentSection.css";

const PaymentForm = ({ payment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    orderCode: "",
    method: "Tiền mặt",
    amount: 0,
    change: 0,
    paymentDate: "",
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        orderCode: payment.orderCode || payment.maDon || "",
        method: payment.method || payment.phuongThuc || "Tiền mặt",
        amount: payment.amount ?? payment.soTien ?? 0,
        change: payment.change ?? payment.tienThua ?? 0,
        paymentDate: payment.paymentDate
          ? new Date(payment.paymentDate).toISOString().slice(0, 16)
          : "",
      });
    } else {
      // reset form khi thêm mới
      setFormData({
        orderCode: "",
        method: "Tiền mặt",
        amount: 0,
        change: 0,
        paymentDate: "",
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "change" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.orderCode.trim() || formData.amount <= 0) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin hợp lệ!");
      return;
    }

    const payload = {
      orderCode: formData.orderCode,
      method: formData.method,
      amount: Number(formData.amount),
      change: Number(formData.change),
      paymentDate: formData.paymentDate
        ? new Date(formData.paymentDate).toISOString()
        : null,
    };

    try {
      if (payment && (payment.paymentID || payment.id)) {
        const id = payment.paymentID ?? payment.id;
        await axios.put(`http://localhost:8080/api/payments/${id}`, payload);
        alert("✅ Cập nhật thanh toán thành công!");
      } else {
        await axios.post("http://localhost:8080/api/payments", payload);
        alert("✅ Thêm thanh toán thành công!");
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
        placeholder="Mã đơn"
        required
      />

      <label>Phương thức</label>
      <select name="method" value={formData.method} onChange={handleChange}>
        <option>Tiền mặt</option>
        <option>Thẻ</option>
        <option>ZaloPay</option>
        <option>Momo</option>
      </select>

      <label>Số tiền</label>
      <input
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Số tiền"
        required
      />

      <label>Tiền thừa</label>
      <input
        name="change"
        type="number"
        value={formData.change}
        onChange={handleChange}
        placeholder="Tiền thừa"
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

export default function PaymentSection() {
  const [payments, setPayments] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const fetchPayments = async (keyword = "") => {
    try {
      const url = keyword.trim()
        ? `http://localhost:8080/api/payments/search?keyword=${encodeURIComponent(
            keyword
          )}`
        : `http://localhost:8080/api/payments`;

      const res = await axios.get(url);
      const data = res.data;
      const list = Array.isArray(data) ? data : data.content ?? [];
      setPayments(list);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách thanh toán:", err);
      setPayments([]);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSearch = () => {
    fetchPayments(searchKeyword.trim());
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thanh toán này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/payments/${id}`);
      alert("🗑️ Xóa thanh toán thành công!");
      fetchPayments(searchKeyword.trim());
    } catch (err) {
      console.error("Lỗi khi xóa thanh toán:", err);
      alert("Không thể xóa thanh toán. Vui lòng thử lại!");
    }
  };

  const handleEdit = (p) => {
    setEditingPayment(p);
    setShowForm(true);
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">💳 Quản lý Thanh toán</h1>

      <div className="payment-function-buttons">
        <button
          className={!showForm ? "active" : ""}
          onClick={() => {
            setShowForm(false);
            setEditingPayment(null);
            fetchPayments();
          }}
        >
          Danh sách thanh toán
        </button>

        <button
          className={showForm && !editingPayment ? "active" : ""}
          onClick={() => {
            setShowForm(true);
            setEditingPayment(null);
          }}
        >
          Thêm thanh toán mới
        </button>
      </div>

      {!showForm && (
        <>
          <div className="search-section">
            <input
              type="text"
              placeholder="🔍 Nhập mã đơn, phương thức hoặc ngày..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Tìm kiếm
            </button>
          </div>

          <div className="payment-table-section">
            <h2>📋 Danh sách Thanh toán</h2>
            <table className="payment-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã đơn</th>
                  <th>Phương thức</th>
                  <th>Số tiền</th>
                  <th>Tiền thừa</th>
                  <th>Ngày TT</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(payments) && payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p.paymentID ?? p.id}>
                      <td>{p.paymentID ?? p.id}</td>
                      <td>{p.orderCode ?? p.maDon}</td>
                      <td>{p.method ?? p.phuongThuc}</td>
                      <td>{p.amount ?? p.soTien}</td>
                      <td>{p.change ?? p.tienThua}</td>
                      <td>
                        {p.paymentDate
                          ? new Date(p.paymentDate).toLocaleString()
                          : ""}
                      </td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(p)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(p.paymentID ?? p.id)
                          }
                        >
                          ❌ Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Không có dữ liệu thanh toán
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onSave={() => {
            setShowForm(false);
            setEditingPayment(null);
            fetchPayments(searchKeyword.trim());
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingPayment(null);
          }}
        />
      )}
    </div>
  );
}

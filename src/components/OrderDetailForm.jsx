import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderDetailSection.css";

const defaultDetail = {
  orderId: "",
  productCode: "",
  quantity: 1,
  unitPrice: 0,
  note: "",
};

const OrderDetailForm = ({ detail, onClose, onSaved }) => {
  const [form, setForm] = useState(defaultDetail);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (detail) {
      setForm({
        orderId: detail.orderId ?? detail.order?.id ?? "",
        productCode: detail.productCode ?? detail.product?.code ?? "",
        quantity: detail.quantity ?? 1,
        unitPrice: detail.unitPrice ?? 0,
        note: detail.note ?? "",
        id: detail.id,
      });
    } else {
      setForm(defaultDetail);
    }
  }, [detail]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]:
        name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    // basic validation
    if (
      !form.orderId ||
      !form.productCode ||
      form.quantity <= 0 ||
      form.unitPrice < 0
    ) {
      alert(
        "Vui lòng điền đầy đủ và hợp lệ: Mã đơn, Mã món, Số lượng > 0, Đơn giá ≥ 0"
      );
      return;
    }

    setSaving(true);
    const payload = {
      orderId: form.orderId,
      productCode: form.productCode,
      quantity: form.quantity,
      unitPrice: form.unitPrice,
      note: form.note,
    };

    if (form.id) {
      axios
        .put(`http://localhost:8080/api/order-details/${form.id}`, payload)
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
      axios
        .post(`http://localhost:8080/api/order-details`, payload)
        .then(() => {
          alert("Tạo thành công");
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
        <h3>{form.id ? "Sửa chi tiết đơn" : "Thêm chi tiết đơn mới"}</h3>
        <form className="od-form" onSubmit={submit}>
          <label>
            Mã đơn
            <input
              name="orderId"
              value={form.orderId}
              onChange={change}
              required
            />
          </label>

          <label>
            Mã món
            <input
              name="productCode"
              value={form.productCode}
              onChange={change}
              required
            />
          </label>

          <label>
            Số lượng
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={change}
              required
            />
          </label>

          <label>
            Đơn giá (₫)
            <input
              name="unitPrice"
              type="number"
              min="0"
              value={form.unitPrice}
              onChange={change}
              required
            />
          </label>

          <label>
            Ghi chú
            <textarea name="note" value={form.note} onChange={change} />
          </label>

          <div className="form-actions">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              className="btn ghost"
              type="button"
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

export default OrderDetailForm;

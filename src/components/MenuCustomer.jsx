import React, { useEffect, useState } from "react";
import "./MenuCustomer.css";
import axios from "axios";

const MenuCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const fetchCustomers = () => {
        axios
            .get(`${baseURL}/customers`)
            .then((res) => setCustomers(res.data))
            .catch((err) => console.error("❌ Lỗi khi lấy danh sách khách hàng:", err));
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            fetchCustomers();
            return;
        }

        axios
            .get(`${baseURL}/customers/search?keyword=${encodeURIComponent(searchTerm)}`)
            .then((res) => setCustomers(res.data))
            .catch((err) => console.error("❌ Lỗi khi tìm kiếm khách hàng:", err));
    };
// Hàm xóa khách hàng hàm xóa hàm xóa hàm xóa
    const handleDelete = (id, name) => {
        if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${name}" (ID: ${id}) không?`)) {
            console.log("🧩 Gọi API xóa:", `${baseURL}/customers/${id}`);
            axios
                .delete(`${baseURL}/customers/${id}`)
                .then(() => {
                    alert(`🗑️ Xóa khách hàng "${name}" thành công!`);
                    fetchCustomers();
                })
                .catch((err) => console.error("❌ Lỗi khi xóa khách hàng:", err));
        }
    };

    return (
        <div className="menu-container">
            <h1 className="menu-title">👥 Trang Quản Lý Khách Hàng</h1>

            <div className="menu-function-buttons">
                <button
                    className="active"
                    onClick={fetchCustomers}
                >
                    Danh sách khách hàng
                </button>
            </div>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="🔍 Nhập tên hoặc SĐT khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "8px", width: "250px", marginRight: "10px" }}
                />
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>

            <div className="menu-table-section">
                <h2>📋 Danh sách khách hàng</h2>
                <table className="menu-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Điểm tích lũy</th> 
                            <th>Hạng thành viên</th> 
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((item) => (
                                // ✅ Đảm bảo tất cả <td> đều nằm trong <tr>
                                <tr key={item.customerID}>
                                    <td>{item.customerID}</td>
                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.email}</td>
                                    <td>{item.loyaltypoints}</td> 
                                    <td>{item.membertype}</td> 
                                    <td>
                                        <button
                                            onClick={() => handleDelete(item.customerID, item.name)}
                                            style={{
                                                backgroundColor: "#ff4d4f",
                                                color: "white",
                                                border: "none",
                                                padding: "5px 10px",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data"> 
                                    Không có dữ liệu khách hàng
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MenuCustomer;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/Admin";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState(null); // لعرض تفاصيل الأوردر
  const [orderItems, setOrderItems] = useState([]);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
    fetchContactMessages();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/categories`);
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get(`${API_URL}/orders`);
    setOrders(res.data);
  };

  const fetchContactMessages = async () => {
    const res = await axios.get(`${API_URL}/contact-messages`);
    setContactMessages(res.data);
  };

  const handleDelete = async (type, id) => {
    await axios.delete(`${API_URL}/${type}/${id}`);
    if (type === "categories") fetchCategories();
    if (type === "products") fetchProducts();
    if (type === "orders") fetchOrders();
    if (type === "contact-messages") fetchContactMessages();
  };


  const handleViewOrder = async (order) => {
    try {
      setLoadingOrderDetails(true);
      const res = await axios.get(`${API_URL}/orders/${order.id}/details`);
      setViewOrder(res.data.order);
      setOrderItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching order details:", err.response ? err.response.data : err.message);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load order details"
      );
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleSave = async () => {
    if (formType === "categories") {
      if (formData.id) {
        await axios.put(`${API_URL}/categories/${formData.id}`, formData);
      } else {
        await axios.post(`${API_URL}/categories`, formData);
      }
      fetchCategories();
    }
    if (formType === "products") {
      if (formData.id) {
        await axios.put(`${API_URL}/products/${formData.id}`, formData);
      } else {
        await axios.post(`${API_URL}/products`, formData);
      }
      fetchProducts();
    }
    if (formType === "orders") {
      if (formData.id) {
        await axios.put(`${API_URL}/orders/${formData.id}`, formData);
      } else {
        await axios.post(`${API_URL}/orders`, formData);
      }
      fetchOrders();
    }
    setShowForm(false);
    setFormData({});
  };

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || "Unknown";

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredOrders = orders.filter(
    (o) =>
      o.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search)
  );

  const filteredContactMessages = contactMessages.filter((m) => {
    const keyword = search.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(keyword) ||
      (m.email || "").toLowerCase().includes(keyword) ||
      (m.message || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="admin-container">
      <style>{`
        .admin-container {
          display: flex;
          height: 100vh;
          font-family: "Segoe UI", Arial, sans-serif;
        }
        .sidebar {
          width: 250px;
          background-color: #111;
          color: #f5d742;
          padding: 20px;
          position: sticky;
          top: 0;
          height: 100vh;
        }
        .sidebar h2 {
          margin-bottom: 40px;
          font-size: 22px;
          color: #fff;
        }
        .sidebar ul { list-style: none; padding: 0; }
        .sidebar li {
          margin-bottom: 20px;
          cursor: pointer;
          transition: 0.3s;
        }
        .sidebar li:hover { color: #fff; transform: translateX(5px); }
        .sidebar .active { color: #fff; font-weight: bold; }
        .main {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background-color: #f4f4f9;
        }
        .main h1 { color: #333; margin-bottom: 15px; }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .top-bar input {
          padding: 6px 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .btn {
          padding: 6px 14px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }
        .btn:hover { opacity: 0.85; }
        .btn-home { background-color: #2196F3; color: white; }
        .btn-add { background-color: #f5d742; color: #1e1e2f; }
        .btn-edit { background-color: #f5d742; color: #000; margin-right: 5px; }
        .btn-delete { background-color: #e53935; color: white; }
        .table-container { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; background-color: #fff; }
        thead { background-color: #f5d742; }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        tr:hover { background-color: #f9f9f9; }
        .message-cell {
          max-width: 420px;
          white-space: normal;
          line-height: 1.4;
        }
        img.table-img { width: 60px; border-radius: 5px; }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
        }
        .order-modal {
          width: 650px;
          max-width: 95vw;
          max-height: 90vh;
          overflow-y: auto;
        }
        .items-table {
          width: 100%;
          margin-top: 10px;
          border-collapse: collapse;
        }
        .items-table th, .items-table td {
          border: 1px solid #ddd;
          padding: 8px;
          font-size: 14px;
        }
        .items-table thead { background-color: #f5d742; }
        .summary-box {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 12px;
        }
        .modal h2 { margin-bottom: 15px; }
        .modal input, .modal select, .modal p {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li
            onClick={() => { setActiveTab("categories"); setSearch(""); }}
            className={activeTab === "categories" ? "active" : ""}
          >
            📚 Categories
          </li>
          <li
            onClick={() => { setActiveTab("products"); setSearch(""); }}
            className={activeTab === "products" ? "active" : ""}
          >
            🛒 Products
          </li>
          <li
            onClick={() => { setActiveTab("orders"); setSearch(""); }}
            className={activeTab === "orders" ? "active" : ""}
          >
            📦 Orders
          </li>
          <li
            onClick={() => { setActiveTab("messages"); setSearch(""); }}
            className={activeTab === "messages" ? "active" : ""}
          >
            ✉️ Contact Messages
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="top-bar">
          <h1>
            {activeTab === "categories"
              ? "Categories"
              : activeTab === "products"
              ? "Products"
              : activeTab === "orders"
              ? "Orders"
              : "Contact Messages"}
          </h1>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder={
                activeTab === "categories"
                  ? "Search Categories..."
                  : activeTab === "products"
                  ? "Search Products..."
                  : activeTab === "orders"
                  ? "Search by Name or Phone..."
                  : "Search Messages..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="btn btn-home" onClick={() => navigate("/")}>
              ⬅ Home
            </button>

            {activeTab !== "orders" && activeTab !== "messages" && (
              <button
                className="btn btn-add"
                onClick={() => {
                  setFormType(activeTab);
                  setFormData({});
                  setShowForm(true);
                }}
              >
                + Add
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {activeTab === "categories" && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>
                      <img src={cat.imageUrl} alt={cat.name} className="table-img" />
                    </td>
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => { setFormType("categories"); setFormData(cat); setShowForm(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete("categories", cat.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "products" && (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.name}</td>
                    <td>${prod.price}</td>
                    <td>{getCategoryName(prod.categoryId)}</td>
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => { setFormType("products"); setFormData(prod); setShowForm(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete("products", prod.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "orders" && (
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Total Price</th>
                  <th>View</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.fullName}</td>
                    <td>{order.phone}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      <button
                        className="btn btn-home"
                        onClick={() => handleViewOrder(order)}
                      >
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete("orders", order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "messages" && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContactMessages.length > 0 ? (
                  filteredContactMessages.map((msg) => (
                    <tr key={msg.id}>
                      <td>{msg.id}</td>
                      <td>{msg.name}</td>
                      <td>{msg.email}</td>
                      <td className="message-cell">{msg.message}</td>
                      <td>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete("contact-messages", msg.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No contact messages found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{formData.id ? "Edit" : "Add"} {formType}</h2>
              <input
                type="text"
                placeholder="Name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {formType === "products" && (
                <>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  <select
                    value={formData.categoryId || ""}
                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </>
              )}
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl || ""}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button className="btn btn-delete" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-add" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* View Order Modal */}
        {viewOrder && (
          <div className="modal-overlay">
            <div className="modal order-modal">
              <h2>Order Details</h2>

              <div className="summary-box">
                <p><strong>Order ID:</strong> {viewOrder.id}</p>
                <p><strong>Full Name:</strong> {viewOrder.fullName}</p>
                <p><strong>Phone:</strong> {viewOrder.phone}</p>
                <p><strong>Address:</strong> {viewOrder.address}</p>
                <p><strong>Area:</strong> {viewOrder.area}</p>
                <p><strong>Promo Code:</strong> {viewOrder.promoCode ? viewOrder.promoCode : "N/A"}</p>
                <p><strong>Total Price:</strong> ${Number(viewOrder.totalPrice || 0).toFixed(2)}</p>
                <p><strong>Date:</strong> {viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleString() : "N/A"}</p>
              </div>

              <h3>Ordered Items</h3>
              {loadingOrderDetails ? (
                <p>Loading items...</p>
              ) : orderItems.length > 0 ? (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Line Total</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName || `Product #${item.menuId}`}</td>
                        <td>{item.quantity}</td>
                        <td>${Number(item.productPrice || 0).toFixed(2)}</td>
                        <td>${Number(item.lineTotal || 0).toFixed(2)}</td>
                        <td>{item.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items found for this order.</p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button
                  className="btn btn-delete"
                  onClick={() => {
                    setViewOrder(null);
                    setOrderItems([]);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

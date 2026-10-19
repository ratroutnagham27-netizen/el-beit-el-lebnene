import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const auth = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3000/Admin/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3000/Admin/categories");
    setCategories(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete("http://localhost:3000/Admin/products/${id}");
      fetchProducts();
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", backgroundColor: "#f0f0f0", minHeight: "100vh", padding: "20px" }}>
        <h3>Admin</h3>
        <ul>
          <li>Dashboard</li>
          <li>Items</li>
          <li>Categories</li>
          <li>Orders</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Products List</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt={p.name} style={{ width: "50px" }} />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>
                  <button style={{ marginRight: "5px" }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
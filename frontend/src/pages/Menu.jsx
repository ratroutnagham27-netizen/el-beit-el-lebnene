// src/pages/Menu.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Menu({ cart, setCart }) {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // جلب الكاتيجوريز
  useEffect(() => {
    axios
      .get("http://localhost:3000/Admin/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("❌ Error fetching categories:", err));
  }, []);

  // جلب المنتجات
  useEffect(() => {
    axios
      .get("http://localhost:3000/Admin/products")
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("❌ Error fetching products:", err));
  }, []);

  const filteredMenu = selectedCategory
    ? menu.filter((item) => item.categoryId === selectedCategory.id)
    : menu;

  const addToCart = (item) => {
    const exist = cart.find((c) => c.id === item.id);
    if (exist) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      setCart(cart.filter((item) => item.id !== id));
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          Menu
        </h2>

        {/* الكاتيجوريز أفقياً */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            overflowX: "auto",
            paddingBottom: "10px",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              style={{
                textAlign: "center",
                cursor: "pointer",
                border:
                  selectedCategory?.id === cat.id
                    ? "3px solid transparent"
                    : "2px solid transparent",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <img
                src={cat.imageUrl || "https://via.placeholder.com/80"}
                alt={cat.name}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "60%",
                  objectFit: "cover",
                  marginBottom: "8px",
                }}
              />
              <span style={{ fontSize: "16px" }}>{cat.name}</span>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              marginBottom: "20px",
              padding: "8px 15px",
              backgroundColor: "#eee",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Show All Products
          </button>
        )}

        {/* المنتجات Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <img
                src={item.imageUrl || "https://via.placeholder.com/200"}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
              <h3 style={{ fontWeight: "bold" }}>{item.name}</h3>
              <p style={{ color: "#555" }}>${item.price.toFixed(2)}</p>
              {item.description && (
                <p style={{ fontSize: "13px", color: "#777" }}>
                  {item.description}
                </p>
              )}
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      (cart.find((c) => c.id === item.id)?.quantity || 0) - 1
                    )
                  }
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ddd",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
                <span>{cart.find((c) => c.id === item.id)?.quantity || 0}</span>
                <button
                  onClick={() => addToCart(item)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#cf2a2aff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* الكارت */}
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "15px" }}>
            🛒 Cart
          </h3>
          {cart.length > 0 ? (
            <>
              <ul style={{ marginBottom: "15px", listStyle: "none", padding: 0 }}>
                {cart.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        color: "white",
                        border: "none",
                        background: "red",
                        cursor: "pointer",
                        borderRadius: "6px",
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <h3 style={{ marginBottom: "15px" }}>
                Total: $
                {cart
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </h3>

              <button
                onClick={() => navigate("/checkout")}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#28a787ff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Go to Checkout
              </button>
            </>
          ) : (
            <p>Cart is empty</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Menu;

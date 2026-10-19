// src/pages/Checkout.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Checkout({ cart, setCart }) {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const promoCodes = {
    WELCOME10: { type: "percent", value: 10 },
    SAVE5: { type: "fixed", value: 5 },
    FIRST15: { type: "percent", value: 15 },
  };

  const subtotal =
    Array.isArray(cart) && cart.length > 0
      ? cart.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0
        )
      : 0;

  const cleanPromoCode = promoCode.trim().toUpperCase();
  const appliedPromo = promoCodes[cleanPromoCode];

  let discount = 0;

  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      discount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.type === "fixed") {
      discount = appliedPromo.value;
    }
  }

  if (discount > subtotal) {
    discount = subtotal;
  }

  const totalPrice = subtotal - discount;

  const removeItem = (id) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !address || !area || !phone) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      alert("⚠️ Cart is empty!");
      return;
    }

    if (cleanPromoCode && !appliedPromo) {
      alert("❌ Invalid promo code!");
      return;
    }

    try {
      const orderData = {
        fullName,
        address,
        area,
        phone,
        totalPrice,
        promoCode: cleanPromoCode || null,
      };

      const response = await axios.post(
        "http://localhost:3000/Admin/orders",
        orderData
      );

      const orderId = response.data.id;

      if (!orderId) {
        throw new Error(
          "Order was created but no order id was returned from the backend."
        );
      }

      for (const item of cart) {
        try {
          await axios.post("http://localhost:3000/Admin/order-items", {
            orderId,
            menuId: item.id,
            quantity: item.quantity,
            notes: item.notes || null,
          });
        } catch (itemErr) {
          console.error(
            "ORDER ITEM ERROR:",
            itemErr.response ? itemErr.response.data : itemErr.message
          );

          throw new Error(
            `Failed to save item: ${item.name}. ` +
              (itemErr.response?.data?.error ||
                itemErr.response?.data?.message ||
                itemErr.message)
          );
        }
      }

      const ownerPhone = "96176620728";

      const orderSummary = cart
        .map(
          (item) =>
            `- ${item.name} x${item.quantity} = $${(
              Number(item.price) * item.quantity
            ).toFixed(2)}`
        )
        .join("\n");

      const whatsappMessage = `
New Order #${orderId}

Customer Information:
Name: ${fullName}
Phone: ${phone}
Address: ${address}
Area: ${area}

Order Details:
${orderSummary}

Subtotal: $${subtotal.toFixed(2)}
Discount: $${discount.toFixed(2)}
Total After Discount: $${totalPrice.toFixed(2)}

Promo Code: ${cleanPromoCode || "None"}

Note: The total price does not include delivery service.
`;

      const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, "_blank");

      setSuccess(response.data.message || "Order submitted successfully!");
      setFullName("");
      setAddress("");
      setArea("");
      setPhone("");
      setPromoCode("");
      setCart([]);

      setTimeout(() => navigate("/menu"), 2000);
    } catch (err) {
      console.error(
        "SUBMIT ERROR:",
        err.response ? err.response.data : err.message
      );

      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to submit order"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2 style={styles.title}>Checkout</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={styles.input}
          />

          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={styles.input}
          />

          <input
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            style={styles.input}
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={styles.input}
          />

          <input
            placeholder="Promo Code (optional)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            style={styles.input}
          />

          <button type="submit" style={styles.submitBtn}>
            Submit Order
          </button>
        </form>

        <div style={styles.cartSection}>
          <h1 style={styles.cartTitle}>🛒 Your Cart:</h1>

          {cart.length > 0 ? (
            <ul style={styles.cartList}>
              {cart.map((item) => (
                <li key={item.id} style={styles.cartItem}>
                  <div>
                    {item.name} (x{item.quantity}) - $
                    {(Number(item.price) * item.quantity).toFixed(2)}
                  </div>

                  <div style={styles.cartActions}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={styles.actionBtn}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={styles.actionBtn}
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={styles.removeBtn}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Cart is empty</p>
          )}

          <h3 style={styles.totalPrice}>Subtotal: ${subtotal.toFixed(2)}</h3>

          {cleanPromoCode && appliedPromo && (
            <h3 style={styles.discount}>Discount: -${discount.toFixed(2)}</h3>
          )}

          <h3 style={styles.finalTotal}>Total: ${totalPrice.toFixed(2)}</h3>
        </div>

        {success && <p style={styles.successMsg}>{success}</p>}
      </div>

      <Footer />
    </>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "30px auto",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "25px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  submitBtn: {
    padding: "5px",
    background: "#28a787ff",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  cartSection: {
    marginTop: "20px",
  },
  cartTitle: {
    fontSize: "22px",
    marginBottom: "15px",
    color: "#444",
  },
  cartList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
  cartActions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  actionBtn: {
    padding: "5px 10px",
    border: "none",
    background: "#ddd",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  removeBtn: {
    padding: "5px 10px",
    border: "none",
    background: "#dc3545",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
    fontSize: "14px",
  },
  totalPrice: {
    marginTop: "10px",
    fontWeight: "bold",
    fontSize: "18px",
    color: "#000",
  },
  discount: {
    marginTop: "5px",
    fontWeight: "bold",
    fontSize: "18px",
    color: "#dc3545",
  },
  finalTotal: {
    marginTop: "5px",
    fontWeight: "bold",
    fontSize: "20px",
    color: "#28a745",
  },
  successMsg: {
    marginTop: "15px",
    color: "#28a745",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default Checkout;

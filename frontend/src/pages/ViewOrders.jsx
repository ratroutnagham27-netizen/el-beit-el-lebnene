import React, { useEffect, useState } from "react";

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/Admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>View Orders</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Address</th>
            <th>Area</th>
            <th>Phone</th>
            <th>Total Price</th>
            <th>Promo Code</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.fullName}</td>
              <td>{order.address}</td>
              <td>{order.area}</td>
              <td>{order.phone}</td>
              <td>{order.totalPrice}</td>
              <td>{order.promoCode}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewOrders;

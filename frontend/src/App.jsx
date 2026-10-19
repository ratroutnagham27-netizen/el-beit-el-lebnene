// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
// Admin pages
import Admin from "./pages/Admin";
// Only logged-in admins (with a token) can open the dashboard.
// The real protection is on the API; this just hides the page.
function AdminRoute({ children }) {
  let auth = null;
  try { auth = JSON.parse(localStorage.getItem("auth")); } catch { /* ignore */ }
  return auth?.role === "admin" && auth?.token ? children : <Navigate to="/auth" replace />;
}

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu cart={cart} setCart={setCart} />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
<Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes> 
  );
}

export default App;

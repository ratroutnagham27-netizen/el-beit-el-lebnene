import React from "react";
import { Link, useNavigate } from "react-router-dom";
import IMAGE2 from "../assets/image2.jpg";

function Navbar() {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth")); // جلب بيانات الجلسة

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/auth");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 50px",
        backgroundColor: "#111",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={IMAGE2}
          alt="Logo"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "100%",
          }}
        />
        <h1 style={{ color: "#f5d742" }}>EL BEIT EL LEBNENE</h1>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/menu" style={{ color: "white", textDecoration: "none" }}>
          Menu
        </Link>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          About Us
        </Link>
        <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>
          Contact
        </Link>

        {auth ? (
          <>
            {auth.role === "admin" && (
              <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#f5d742",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" style={{ color: "white", textDecoration: "none" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import IMAGE3 from "../assets/image3.jpg"; // خلفية

function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      {/* Hero Section */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundImage: `url(${IMAGE3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
            Welcome to EL BEIT EL LEBNENE
          </h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
            Experience the authentic taste of Lebanese cuisine with a modern
            twist. Delicious meals prepared with passion and love.
          </p>
          <Link
            to="/menu"
            style={{
              display: "inline-block",
              padding: "12px 25px",
              fontSize: "1rem",
              backgroundColor: "#f5d742",
              color: "#111",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            ORDER NOW
          </Link>
        </div>
      </header>

      <footer
        style={{
          backgroundColor: "#111",
          color: "white",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <p>© 2025 EL BEIT EL LEBNENE - All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Home;

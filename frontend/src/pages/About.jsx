import React from "react";
import Navbar from "../components/Navbar";
import IMAGE3 from "../assets/image3.jpg";
import Footer from "../components/Footer";

function About() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundImage: `url(${IMAGE3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>About Us</h2>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
            EL BEIT EL LEBNENE is dedicated to bringing authentic Lebanese
            cuisine to your table. With fresh ingredients, traditional recipes,
            and a modern twist, we aim to create a dining experience full of
            flavor, passion, and love.
          </p>
        </div>
      </section>
    <Footer/>
    </div>
  );
}

export default About;

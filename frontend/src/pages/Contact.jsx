import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { name: "", email: "", message: "" };
    let hasError = false;

    if (!name.trim()) {
      newErrors.name = "⚠️ Name is required";
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = "⚠️ Email is required";
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "⚠️ Please enter a valid email address";
      hasError = true;
    }

    if (!message.trim()) {
      newErrors.message = "⚠️ Message is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setSuccess("");
      return;
    }

    try {
      await axios.post("http://localhost:3000/Admin/contact-messages", {
        name,
        email,
        message,
      });

      setErrors({ name: "", email: "", message: "" });
      setSuccess("✅ Your message has been saved successfully!");
      setName("");
      setEmail("");
      setMessage("");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error("CONTACT ERROR:", err.response ? err.response.data : err.message);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to send message"
      );
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <section style={{ padding: "50px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>Contact Us</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          We'd love to hear from you! Reach out using the form below.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "500px",
            margin: "0 auto",
            gap: "15px",
            textAlign: "left",
          }}
        >
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: errors.name ? "2px solid red" : "1px solid #ccc",
              }}
            />
            {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: errors.email ? "2px solid red" : "1px solid #ccc",
              }}
            />
            {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
          </div>

          <div>
            <textarea
              placeholder="Your Message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: errors.message ? "2px solid red" : "1px solid #ccc",
              }}
            ></textarea>
            {errors.message && <small style={{ color: "red" }}>{errors.message}</small>}
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 25px",
              backgroundColor: "#f5d742",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            Send Message
          </button>
        </form>

        {success && (
          <p style={{ color: "green", marginTop: "15px", textAlign: "center" }}>
            {success}
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Contact;

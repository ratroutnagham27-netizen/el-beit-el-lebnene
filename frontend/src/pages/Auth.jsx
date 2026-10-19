import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Auth() {
  const API_URL = "http://localhost:3000/Admin";

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Redirect logged-in users away from login page
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth?.token) {
      if (auth.role === "admin") navigate("/admin");
      else navigate("/");
    }
  }, [navigate]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { name: "", email: "", password: "" };
    let hasError = false;

    if (!email) { newErrors.email = "⚠️ Email is required"; hasError = true; }
    else if (!validateEmail(email)) { newErrors.email = "⚠️ Invalid email"; hasError = true; }
    if (!password) { newErrors.password = "⚠️ Password is required"; hasError = true; }
    if (!isLogin && !name) { newErrors.name = "⚠️ Name is required"; hasError = true; }

    setErrors(newErrors);
    if (hasError) { setSuccess(""); return; }

    try {
      // Sign up first (normal users only), then log in to get a token
      if (!isLogin) {
        await axios.post(`${API_URL}/users`, { username: name, email, password });
      }

      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem(
        "auth",
        JSON.stringify({ token, role: user.role, email: user.email, username: user.username })
      );

      setSuccess(isLogin ? "✅ Logged in successfully!" : "✅ Account created successfully!");
      setEmail(""); setPassword(""); setName("");
      setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/"), 500);
    } catch (err) {
      const msg = err.response?.data?.error || "❌ Something went wrong, please try again";
      setErrors((prev) => ({ ...prev, [!isLogin && /exist/i.test(msg) ? "email" : "password"]: msg }));
      setSuccess("");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />
      <section style={{ padding: "50px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>{isLogin ? "Login" : "Sign Up"}</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          {isLogin ? "Welcome back! Please login." : "Create a new account."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px", margin: "0 auto", gap: "15px", textAlign: "left" }}>
          {!isLogin && (
            <div>
              <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: errors.name ? "2px solid red" : "1px solid #ccc" }} />
              {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
            </div>
          )}

          <div>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: errors.email ? "2px solid red" : "1px solid #ccc" }} />
            {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
          </div>

          <div>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: errors.password ? "2px solid red" : "1px solid #ccc" }} />
            {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}
          </div>

          <button type="submit" style={{ padding: "12px 25px", backgroundColor: "#f5d742", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: "#f5d742", cursor: "pointer", fontWeight: "bold" }}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

        {success && <p style={{ color: "green", marginTop: "15px" }}>{success}</p>}
      </section>
      <Footer />
    </div>
  );
}

export default Auth;

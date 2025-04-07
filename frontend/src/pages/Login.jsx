import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ensure this is imported
import "./Auth.css"; 

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Set user after login
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:9090/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setUser({ token: data.token }); // Update auth state
        navigate("/dashboard"); // Redirect after login
      } else {
        setMessage({ text: data.error || "Invalid credentials", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Server error. Please try again.", type: "error" });
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Login</h2>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit" className="auth-btn">Login</button>
      </form>

      <p>Don't have an account? <button className="link-btn" onClick={() => navigate("/register")}>Register</button></p>
    </div>
  );
};

export default Login;

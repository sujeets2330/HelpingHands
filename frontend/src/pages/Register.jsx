import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; 

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" }); // Clear previous messages

    try {
      const res = await fetch("http://localhost:9090/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Registration successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage({ text: data.error || "Registration failed", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error: " + error.message, type: "error" });
    }
  };

  return (
    <div className="auth-container">
      <h2>Join Our Team</h2>

      {message.text && <div className={`message ${message.type}`} style={{ display: "block" }}>{message.text}</div>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="manager">Manager</option>
          <option value="co-worker">Co-worker</option>
          <option value="handler">Handler</option>
          <option value="admin">Main Admin</option>
        </select>

        <button type="submit">Join</button>
      </form>

      <p>Already have an account? <button className="link-btn" onClick={() => navigate("/login")}>Login</button></p>
    </div>
  );
};

export default Register;

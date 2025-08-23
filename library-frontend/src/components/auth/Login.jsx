import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";



const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"                      // ✅ unique id
            name="email"                    // ✅ name attribute
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"            // ✅ autocomplete
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"                   // ✅ unique id
            name="password"                 // ✅ name attribute
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password" // ✅ autocomplete
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
};

export default Login;

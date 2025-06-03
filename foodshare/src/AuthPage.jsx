
import React, { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import "./AuthPage.css";


const AuthPage = () => {
  const { role } = useParams(); // donor, admin, volunteer
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    const body = isLogin
      ? { email: formData.email, password: formData.password, role }
      : {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role,
        };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
console.log("Login response data:", data);

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
      } else {
        setMessage(data.message);
        if (isLogin && data.token) {
        
    localStorage.setItem("token", data.token);
     localStorage.setItem("role", data.role||role);
    localStorage.setItem("email", data.email);
    localStorage.setItem("fullName", data.fullName);
     try {
    const profileRes = await fetch(`http://localhost:5000/api/user/${data.email}`);
    const profileData = await profileRes.json();

    // Store phone and location if available
    localStorage.setItem("phone", profileData.phone || "");
    console.log(profileData.phone);
    localStorage.setItem("location", profileData.location || "");
    console.log(profileData.location);
  } catch (fetchErr) {
    console.error("Failed to fetch user details after login:", fetchErr);
  }
  if (role === "admin") navigate("/admin/dashboard");
  else if (role === "donor") navigate("/donor/dashboard");
  else if (role === "volunteer") navigate("/volunteer/dashboard");
}

        
      }
    } catch (error) {
      setMessage("Server error, please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-role-title">
        {role?.toUpperCase()} {isLogin ? "Login" : "Signup"}
      </h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        {!isLogin && (
          <label>
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>
        )}

        {isLogin ? (
          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        ) : (
          <button type="submit" className="auth-submit-btn">
            Signup
          </button>
        )}
      </form>

      {message && <p className="auth-message">{message}</p>}

      <div className="auth-toggle">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <button onClick={toggleForm} className="auth-toggle-btn">
              Signup here
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={toggleForm} className="auth-toggle-btn">
              Login here
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

import { useState } from "react";
import "./Auth.css";
import { X } from "lucide-react"

export default function Signup({ onSwitchToLogin, onUpdateProfile, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Save user data
    const userData = {
      name: formData.fullName,
      email: formData.email,
      photo: "",
      password: formData.password // Note: In real app, hash the password!
    };

    // Save to localStorage
    localStorage.setItem('bookfinder-user', JSON.stringify(userData));
    localStorage.setItem('bookfinder-users', JSON.stringify({
      ...JSON.parse(localStorage.getItem('bookfinder-users') || '{}'),
      [formData.email]: userData
    }));

    // Update profile and close modal
    onUpdateProfile(userData);
    if (onClose) onClose();
  };

  return (
    <div className="auth-card">
      {/* Close Button Add kiya */}
      <button className="auth-close" onClick={onClose} aria-label="Close">
        <X size={15} />
      </button>

      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Join BookFinder and discover amazing books
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`form-input ${errors.fullName ? "error" : ""}`}
            placeholder="Enter your full name"
            required
          />
          {errors.fullName && (
            <span className="error-message">{errors.fullName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${errors.email ? "error" : ""}`}
            placeholder="Enter your email"
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input ${errors.password ? "error" : ""}`}
            placeholder="Create a password"
            required
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`form-input ${errors.confirmPassword ? "error" : ""}`}
            placeholder="Confirm your password"
            required
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" className="checkbox" required />
            <span className="checkbox-text">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>
        </div>

        <button type="submit" className="auth-button primary">
          Create Account
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-switch">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="auth-link"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}
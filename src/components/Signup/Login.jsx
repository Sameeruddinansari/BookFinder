import { useState } from 'react'
import './Auth.css'
import { X } from "lucide-react"

export default function Login({ onSwitchToSignup, onUpdateProfile, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem('bookfinder-users') || '{}')
    const user = users[formData.email]

    if (!user) {
      setError('No account found with this email')
      return
    }

    if (user.password !== formData.password) {
      setError('Invalid password')
      return
    }

    // Login successful
    onUpdateProfile({
      name: user.name,
      email: user.email,
      photo: user.photo || ''
    })

    if (onClose) onClose()
  }

  return (
    <div className="auth-card">
      {/* Close Button Add kiya */}
      <button className="auth-close" onClick={onClose} aria-label="Close">
        <X size={15} />
      </button>

      <div className="auth-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your BookFinder account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" className="checkbox" />
            <span className="checkbox-text">Remember me</span>
          </label>
          <a href="#" className="forgot-link">Forgot password?</a>
        </div>

        <button type="submit" className="auth-button primary">
          Sign In
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-switch">
          Don't have an account? <button type="button" onClick={onSwitchToSignup} className="auth-link">Sign up here</button>
        </p>
      </div>
    </div>
  )
}

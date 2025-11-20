import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authService';  // ← ADD THIS
import './Login.css';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',  // ← CHANGED from 'email'
    password: ''
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call real API
      const data = await authAPI.login(formData.username, formData.password);
      
      console.log('Login successful:', data);
      
      // Redirect to admin dashboard
      navigate('/admin/frameworks');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo Section */}
        <div className="login-header">
          <div className="login-logo">
            <div className="northstar-icon">
              <i className="fas fa-star"></i>
            </div>
          </div>
          <h1 className="login-title">AuditSmart</h1>
          <p className="login-subtitle">
            Welcome back! Please login to your account.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                autoFocus
                required
              />
            </div>
          </div>


          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-footer">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Toggle Section */}
        <div className="auth-toggle">
          <p>
            Don't have an account?
            <button type="button" onClick={() => navigate('/signup')} className="toggle-btn">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
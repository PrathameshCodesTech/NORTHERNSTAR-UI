// src/pages/PendingActivation.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PendingActivation.css';

const PendingActivation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { tenantSlug, companyName, planName } = location.state || {};

  // If no data, redirect to home
  if (!tenantSlug) {
    navigate('/');
    return null;
  }

  return (
    <div className="pending-activation-page">
      <div className="pending-content">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1>Order Submitted Successfully!</h1>
        <p className="subtitle">Your compliance workspace is being set up</p>

        <div className="tenant-info-card">
          <div className="info-row">
            <span className="label">Company:</span>
            <span className="value">{companyName}</span>
          </div>
          <div className="info-row">
            <span className="label">Tenant ID:</span>
            <span className="value">{tenantSlug}</span>
          </div>
          <div className="info-row">
            <span className="label">Plan:</span>
            <span className="value">{planName}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className="value status-pending">
              <i className="fas fa-clock"></i> Pending Payment Verification
            </span>
          </div>
        </div>

        <div className="next-steps">
          <h3>What happens next?</h3>
          <ol>
            <li>
              <i className="fas fa-envelope"></i>
              <div>
                <strong>Admin Verification</strong>
                <p>Our admin team will verify your payment details</p>
              </div>
            </li>
            <li>
              <i className="fas fa-server"></i>
              <div>
                <strong>Account Provisioning</strong>
                <p>We'll set up your compliance workspace and frameworks</p>
              </div>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <div>
                <strong>Activation Email</strong>
                <p>You'll receive an email with login instructions</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            <i className="fas fa-home"></i> Back to Home
          </button>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            <i className="fas fa-sign-in-alt"></i> Go to Login
          </button>
        </div>

        <div className="support-info">
          <p>Questions? Contact us at <a href="mailto:support@compliance.com">support@compliance.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default PendingActivation;
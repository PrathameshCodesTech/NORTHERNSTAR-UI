import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const [planType, setPlanType] = useState('yearly');

  const features = [
    { icon: 'fa-infinity', title: 'Unlimited Boards', description: 'Create unlimited audit boards' },
    { icon: 'fa-calendar', title: 'Set due dates', description: 'Track deadlines effectively' },
    { icon: 'fa-user-plus', title: 'Assign tasks', description: 'Delegate to team members' },
    { icon: 'fa-list-check', title: 'Unlimited Checklists', description: 'Complete compliance checks' },
    { icon: 'fa-eye', title: 'Custom views', description: 'Personalize your dashboard' },
    { icon: 'fa-comments', title: 'Chat in-context', description: 'Team collaboration' },
    { icon: 'fa-table-cells', title: 'Custom templates', description: 'Pre-built workflows' },
    { icon: 'fa-link', title: 'Powerful Integrations', description: 'Connect your tools' }
  ];

  const handleContinue = () => {
    navigate('/login');
  };

  return (
<div className="pricing-container">
  <button className="back-btn-pricing" onClick={() => navigate(-1)}>
    <i className="fas fa-arrow-left"></i>
  </button>
  <button className="pricing-close" onClick={handleContinue}>
    <i className="fas fa-times"></i>
  </button>


      <div className="pricing-content">
        <div className="pricing-header">
          <h1 className="pricing-title">Special Offer — 37% OFF</h1>
          <p className="pricing-subtitle">
            Update your payment details to receive a lifetime discount for your whole team
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <div className="feature-text">
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-options">
          <div className="plan-selector">
            <label className={`plan-option ${planType === 'yearly' ? 'active' : ''}`}>
              <input
                type="radio"
                name="plan"
                value="yearly"
                checked={planType === 'yearly'}
                onChange={(e) => setPlanType(e.target.value)}
              />
              <div className="plan-details">
                <span className="plan-name">Yearly $4.99/mo/seat</span>
                <span className="discount-badge">37% OFF</span>
              </div>
            </label>

            <label className={`plan-option ${planType === 'monthly' ? 'active' : ''}`}>
              <input
                type="radio"
                name="plan"
                value="monthly"
                checked={planType === 'monthly'}
                onChange={(e) => setPlanType(e.target.value)}
              />
              <div className="plan-details">
                <span className="plan-name">Monthly $7.99/mo/seat</span>
              </div>
            </label>
          </div>

          <div className="payment-form">
            <div className="form-row">
              <input type="text" placeholder="Card number" className="payment-input full-width" />
            </div>
            <div className="form-row">
              <input type="text" placeholder="MM/YY" className="payment-input half-width" />
              <input type="text" placeholder="CVC" className="payment-input half-width" />
            </div>
            <div className="form-row">
              <input type="text" placeholder="Cardholder name" className="payment-input full-width" />
            </div>
            <div className="form-row">
              <input type="text" placeholder="Country" className="payment-input half-width" />
              <input type="text" placeholder="ZIP code" className="payment-input half-width" />
            </div>
          </div>

          <div className="pricing-summary">
            <div className="total-section">
              <span className="total-label">Total now: $0.00</span>
              <span className="total-info">In 14 days: $9.98/mo - billed annually</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={handleContinue}>
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
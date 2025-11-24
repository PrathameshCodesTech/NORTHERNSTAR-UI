// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // Get selections from session storage
  const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan') || '{}');
  const selectedFrameworks = JSON.parse(sessionStorage.getItem('selectedFrameworks') || '[]');

  const calculateTotal = () => {
    return selectedPlan.price || 0;
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment successful! Your account is being set up.');
      sessionStorage.clear();
      navigate('/app/dashboard');
    }, 2000);
  };

  return (
    <div className="checkout-page">
    
      

      {/* Checkout Content */}
      <div className="checkout-content">
        <div className="checkout-grid">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-section">
              <h3>Subscription Plan</h3>
              <div className="plan-item">
                <div className="item-details">
                  <span className="item-name">{selectedPlan.plan_name} Plan</span>
                  <span className="item-billing">{selectedPlan.billing_cycle === 'monthly' ? 'Monthly' : 'Annual'} billing</span>
                </div>
                <span className="item-price">${selectedPlan.price}</span>
              </div>
            </div>

            <div className="summary-section">
              <h3>Selected Frameworks</h3>
              {selectedFrameworks.map(framework => (
                <div key={framework.id} className="framework-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{framework.name}</span>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">${calculateTotal()}</span>
            </div>
          </div>

          {/* Payment Form (Placeholder) */}
          <div className="payment-form">
            <h2>Payment Details</h2>
            
            <div className="payment-notice">
              <i className="fas fa-info-circle"></i>
              <p>Payment integration with Stripe/Razorpay will be implemented here</p>
            </div>

            <button 
              className="pay-button"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock"></i>
                  Complete Payment
                </>
              )}
            </button>

            <div className="security-badges">
              <i className="fas fa-shield-check"></i>
              <span>Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
     
    </div>
  );
};

export default Checkout;
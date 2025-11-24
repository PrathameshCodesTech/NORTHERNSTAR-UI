// src/pages/Pricing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Mock data - will be replaced with API call
  const plans = [
    {
      id: 'basic',
      code: 'BASIC',
      name: 'Basic',
      description: 'Perfect for small teams getting started with compliance',
      monthly_price: 299,
      annual_price: 3228, // 10% discount
      max_users: 10,
      max_frameworks: 2,
      max_controls: 500,
      storage_gb: 10,
      features: [
        'View-only access to frameworks',
        'Up to 10 team members',
        'Choose any 2 frameworks',
        '10GB document storage',
        'Basic compliance reports',
        'Email support',
        'Mobile app access'
      ],
      support_level: 'Email Support',
      popular: false
    },
    {
      id: 'professional',
      code: 'PROFESSIONAL',
      name: 'Professional',
      description: 'For growing teams with advanced compliance needs',
      monthly_price: 599,
      annual_price: 6468, // 10% discount
      max_users: 50,
      max_frameworks: 5,
      max_controls: 2000,
      storage_gb: 50,
      features: [
        'Customize controls & frameworks',
        'Up to 50 team members',
        'Choose any 5 frameworks',
        '50GB document storage',
        'Advanced compliance reports',
        'Priority email & chat support',
        'API access',
        'Custom workflows',
        'Audit trail & history'
      ],
      support_level: 'Priority Support',
      popular: true
    },
    {
      id: 'enterprise',
      code: 'ENTERPRISE',
      name: 'Enterprise',
      description: 'For large organizations with complex requirements',
      monthly_price: 1499,
      annual_price: 16188, // 10% discount
      max_users: 0, // unlimited
      max_frameworks: 0, // unlimited
      max_controls: 0, // unlimited
      storage_gb: 500,
      features: [
        'Full customization capabilities',
        'Unlimited team members',
        'All frameworks included',
        '500GB document storage',
        'White-label reports',
        'Dedicated account manager',
        'SSO & advanced security',
        'Custom integrations',
        'On-premise deployment option',
        'SLA guarantees',
        '24/7 phone support'
      ],
      support_level: 'Dedicated Support',
      popular: false
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getMonthlyEquivalent = (annualPrice) => {
    return formatPrice(annualPrice / 12);
  };

  const calculateSavings = (monthlyPrice, annualPrice) => {
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - annualPrice;
    return formatPrice(savings);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.code);
    // Store selection in sessionStorage
    sessionStorage.setItem('selectedPlan', JSON.stringify({
      plan_code: plan.code,
      plan_name: plan.name,
      billing_cycle: billingCycle,
      price: billingCycle === 'monthly' ? plan.monthly_price : plan.annual_price
    }));
    
    // Navigate to framework selection
    navigate('/frameworks');
  };

  return (
    <div className="pricing-page">
     
      {/* Pricing Content */}
      <div className="pricing-content">
        {/* Billing Toggle */}
        <div className="billing-toggle-container">
          <p className="toggle-label">Choose billing cycle:</p>
          <div className="billing-toggle">
            <button
              className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual
              <span className="save-badge">Save 10%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.code ? 'selected' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <i className="fas fa-star"></i> Most Popular
                </div>
              )}

              <div className="plan-header">
                <h2 className="plan-name">{plan.name}</h2>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-pricing">
                {billingCycle === 'monthly' ? (
                  <>
                    <div className="price-main">
                      <span className="price-amount">{formatPrice(plan.monthly_price)}</span>
                      <span className="price-period">/month</span>
                    </div>
                    <p className="price-subtext">Billed monthly</p>
                  </>
                ) : (
                  <>
                    <div className="price-main">
                      <span className="price-amount">{getMonthlyEquivalent(plan.annual_price)}</span>
                      <span className="price-period">/month</span>
                    </div>
                    <p className="price-subtext">
                      {formatPrice(plan.annual_price)} billed annually
                      <span className="savings-text">
                        Save {calculateSavings(plan.monthly_price, plan.annual_price)}
                      </span>
                    </p>
                  </>
                )}
              </div>

              <div className="plan-limits">
                <div className="limit-item">
                  <i className="fas fa-users"></i>
                  <span>
                    {plan.max_users === 0 ? 'Unlimited' : `Up to ${plan.max_users}`} users
                  </span>
                </div>
                <div className="limit-item">
                  <i className="fas fa-shield-halved"></i>
                  <span>
                    {plan.max_frameworks === 0 ? 'All' : `${plan.max_frameworks}`} frameworks
                  </span>
                </div>
                <div className="limit-item">
                  <i className="fas fa-database"></i>
                  <span>{plan.storage_gb}GB storage</span>
                </div>
              </div>

              <div className="plan-features">
                <h4 className="features-title">Everything included:</h4>
                <ul className="features-list">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`select-plan-btn ${plan.popular ? 'primary' : 'secondary'}`}
                onClick={() => handleSelectPlan(plan)}
              >
                {selectedPlan === plan.code ? (
                  <>
                    <i className="fas fa-check"></i> Selected
                  </>
                ) : (
                  <>
                    Select {plan.name} <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="pricing-info">
          <div className="info-card">
            <i className="fas fa-shield-check"></i>
            <h3>Secure & Compliant</h3>
            <p>Bank-level encryption and SOC 2 Type II certified</p>
          </div>
          <div className="info-card">
            <i className="fas fa-sync-alt"></i>
            <h3>Flexible Plans</h3>
            <p>Change or cancel your plan anytime, no questions asked</p>
          </div>
          <div className="info-card">
            <i className="fas fa-headset"></i>
            <h3>Expert Support</h3>
            <p>Get help from compliance experts whenever you need it</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I change my plan later?</h4>
              <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly.</p>
            </div>
            <div className="faq-item">
              <h4>What happens if I exceed my framework limit?</h4>
              <p>You can add additional frameworks for $150/month each, or upgrade to a higher plan for better value.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>We offer a 14-day free trial on all plans. No credit card required to start.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, ACH transfers, and can invoice for annual plans.</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Pricing;
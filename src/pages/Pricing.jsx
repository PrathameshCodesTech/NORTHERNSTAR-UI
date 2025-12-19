// src/pages/Pricing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';
import { subscriptionPlanAPI } from '../services/tenantService';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingCycle, setBillingCycle] = useState(
    onboardingData.billing_cycle || 'monthly'
  );
  const [selectedPlan, setSelectedPlan] = useState(
    onboardingData.subscription_plan_code || null
  );

  // Fetch subscription plans from backend
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await subscriptionPlanAPI.getAll();
      
      // Map backend response to include features and descriptions
      const mappedPlans = response.results.map(plan => ({
        ...plan,
        // Add descriptions based on plan code
        description: getDescriptionByCode(plan.code),
        // Add features based on plan code
        features: getFeaturesByCode(plan.code),
        // Add popular flag
        popular: plan.code === 'PROFESSIONAL'
      }));
      
      setPlans(mappedPlans);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load subscription plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get description by plan code
  const getDescriptionByCode = (code) => {
    const descriptions = {
      'BASIC': 'Perfect for small teams getting started with compliance',
      'PROFESSIONAL': 'For growing teams with advanced compliance needs',
      'ENTERPRISE': 'For large organizations with complex requirements'
    };
    return descriptions[code] || 'Choose this plan for your compliance needs';
  };

  // Helper: Get features by plan code
  const getFeaturesByCode = (code) => {
    const features = {
      'BASIC': [
        'View-only access to frameworks',
        'Up to 10 team members',
        'Choose any 4 frameworks',
        '10GB document storage',
        'Basic compliance reports',
        'Email support',
        'Mobile app access'
      ],
      'PROFESSIONAL': [
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
      'ENTERPRISE': [
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
      ]
    };
    return features[code] || [];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(price));
  };

  const getMonthlyEquivalent = (annualPrice) => {
    return formatPrice(parseFloat(annualPrice) / 12);
  };

  const calculateSavings = (monthlyPrice, annualPrice) => {
    const monthlyCost = parseFloat(monthlyPrice) * 12;
    const savings = monthlyCost - parseFloat(annualPrice);
    return formatPrice(savings);
  };

  const calculateDiscountPercentage = (monthlyPrice, annualPrice) => {
    const monthlyCost = parseFloat(monthlyPrice) * 12;
    const discount = ((monthlyCost - parseFloat(annualPrice)) / monthlyCost) * 100;
    return Math.round(discount);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.code);
    
    const selectedPlanData = {
    plan_id: plan.id,
    plan_code: plan.code,
    plan_name: plan.name,
    billing_cycle: billingCycle,
    price: billingCycle === 'monthly' 
      ? parseFloat(plan.monthly_price) 
      : parseFloat(plan.annual_price),
    monthly_price: parseFloat(plan.monthly_price),
    annual_price: parseFloat(plan.annual_price),
    max_users: plan.max_users,
    max_frameworks: plan.max_frameworks
  };
    // Save to context
   updateOnboardingData({
    subscription_plan_code: plan.code,
    billing_cycle: billingCycle,
    selected_plan: selectedPlanData
  });

    sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlanData));
    
    // Navigate to framework selection
    navigate('/frameworks');
  };

  // Loading state
  if (loading) {
    return (
      <div className="pricing-page">
        <div className="pricing-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading subscription plans...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pricing-page">
        <div className="pricing-content">
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchPlans}>
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No plans found
  if (plans.length === 0) {
    return (
      <div className="pricing-page">
        <div className="pricing-content">
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h2>No Plans Available</h2>
            <p>Please contact support for more information.</p>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="save-badge">
                Save {calculateDiscountPercentage(plans[0]?.monthly_price, plans[0]?.annual_price)}%
              </span>
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
                    Select {plan.name.replace(' Plan', '')} <i className="fas fa-arrow-right"></i>
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
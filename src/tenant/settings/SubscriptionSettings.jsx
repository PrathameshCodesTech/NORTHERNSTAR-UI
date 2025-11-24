// src/tenant/settings/SubscriptionSettings.jsx
import React, { useState } from 'react';
import './SubscriptionSettings.css';

const SubscriptionSettings = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  // Mock current subscription
  const currentSubscription = {
    plan_code: 'PROFESSIONAL',
    plan_name: 'Professional',
    billing_cycle: 'monthly',
    price: 599,
    annual_price: 5390,
    started_date: '2025-01-15',
    next_billing_date: '2025-12-15',
    status: 'active',
    max_users: 50,
    current_users: 12,
    max_frameworks: 5,
    current_frameworks: 3,
    storage_gb: 500,
    used_storage_gb: 127
  };

  // Available plans
  const plans = [
    {
      code: 'BASIC',
      name: 'Basic',
      monthly_price: 299,
      annual_price: 2690,
      features: ['10 Users', '2 Frameworks', '100 GB Storage', 'Email Support', 'Basic Reports'],
      max_users: 10,
      max_frameworks: 2
    },
    {
      code: 'PROFESSIONAL',
      name: 'Professional',
      monthly_price: 599,
      annual_price: 5390,
      features: ['50 Users', '5 Frameworks', '500 GB Storage', 'Priority Support', 'Advanced Reports', 'Custom Workflows'],
      max_users: 50,
      max_frameworks: 5,
      is_current: true,
      popular: true
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise',
      monthly_price: 1499,
      annual_price: 13490,
      features: ['Unlimited Users', 'Unlimited Frameworks', '2 TB Storage', '24/7 Support', 'Custom Reports', 'API Access', 'Dedicated Manager'],
      max_users: 999999,
      max_frameworks: 999999
    }
  ];

  // Recent invoices
  const invoices = [
    { id: 'inv-001', date: '2025-11-15', amount: 599, status: 'paid', description: 'Professional Plan - November 2025' },
    { id: 'inv-002', date: '2025-10-15', amount: 599, status: 'paid', description: 'Professional Plan - October 2025' },
    { id: 'inv-003', date: '2025-09-15', amount: 599, status: 'paid', description: 'Professional Plan - September 2025' }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthly_price : plan.annual_price;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthly_price * 12;
    const savings = monthlyCost - plan.annual_price;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="subscription-settings-page">
{/* Clean Page Header */}
      <div className="page-header-settings">
        <div className="header-content">
          <div className="header-left">
            <h1>Subscription & Billing</h1>
            <p className="header-subtitle">
              Manage your subscription plan and billing details
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="subscription-content">
        {/* Current Plan Overview */}
        <div className="current-plan-card">
          <div className="card-header-section">
            <h2>Current Plan</h2>
            <span className="status-active">
              <i className="fas fa-check-circle"></i>
              Active
            </span>
          </div>

          <div className="plan-overview-grid">
            <div className="plan-info-main">
              <h3>{currentSubscription.plan_name} Plan</h3>
              <div className="plan-price">
                <span className="price">${currentSubscription.price}</span>
                <span className="period">/month</span>
              </div>
              <p className="billing-date">
                Next billing on {new Date(currentSubscription.next_billing_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="usage-stats">
              <div className="usage-item">
                <div className="usage-label">
                  <i className="fas fa-users"></i>
                  Users
                </div>
                <div className="usage-bar-container">
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{ width: `${(currentSubscription.current_users / currentSubscription.max_users) * 100}%` }}
                    ></div>
                  </div>
                  <span className="usage-text">
                    {currentSubscription.current_users} / {currentSubscription.max_users}
                  </span>
                </div>
              </div>

              <div className="usage-item">
                <div className="usage-label">
                  <i className="fas fa-shield-halved"></i>
                  Frameworks
                </div>
                <div className="usage-bar-container">
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{ width: `${(currentSubscription.current_frameworks / currentSubscription.max_frameworks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="usage-text">
                    {currentSubscription.current_frameworks} / {currentSubscription.max_frameworks}
                  </span>
                </div>
              </div>

              <div className="usage-item">
                <div className="usage-label">
                  <i className="fas fa-database"></i>
                  Storage
                </div>
                <div className="usage-bar-container">
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{ width: `${(currentSubscription.used_storage_gb / currentSubscription.storage_gb) * 100}%` }}
                    ></div>
                  </div>
                  <span className="usage-text">
                    {currentSubscription.used_storage_gb} GB / {currentSubscription.storage_gb} GB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="plans-section">
          <div className="section-header">
            <h2>Change Plan</h2>
            <div className="billing-toggle">
              <button
                className={billingCycle === 'monthly' ? 'active' : ''}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={billingCycle === 'annual' ? 'active' : ''}
                onClick={() => setBillingCycle('annual')}
              >
                Annual
                <span className="save-badge">Save 10%</span>
              </button>
            </div>
          </div>

          <div className="plans-grid">
            {plans.map(plan => {
              const price = getPrice(plan);
              const savings = getSavings(plan);

              return (
                <div 
                  key={plan.code} 
                  className={`plan-card ${plan.is_current ? 'current' : ''} ${plan.popular ? 'popular' : ''}`}
                >
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  {plan.is_current && <div className="current-badge">Current Plan</div>}

                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price-section">
                    <div className="price-display">
                      <span className="currency">$</span>
                      <span className="amount">{price}</span>
                      <span className="period">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="savings-text">
                        Save ${savings.amount}/year ({savings.percentage}%)
                      </div>
                    )}
                  </div>

                  <ul className="features-list">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.is_current ? (
                    <button className="plan-btn current-btn" disabled>
                      <i className="fas fa-check"></i>
                      Current Plan
                    </button>
                  ) : (
                    <button className="plan-btn">
                      {plan.code === 'ENTERPRISE' ? 'Contact Sales' : 'Upgrade'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="invoices-section">
          <h2>Recent Invoices</h2>
          <div className="invoices-table">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="invoice-id">{invoice.id}</td>
                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                    <td>{invoice.description}</td>
                    <td className="amount">${invoice.amount}</td>
                    <td>
                      <span className="status-paid">
                        <i className="fas fa-check-circle"></i>
                        Paid
                      </span>
                    </td>
                    <td>
                      <button className="download-btn">
                        <i className="fas fa-download"></i>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Method */}
        <div className="payment-method-section">
          <h2>Payment Method</h2>
          <div className="payment-card">
            <i className="fab fa-cc-visa card-icon"></i>
            <div className="card-details">
              <span className="card-number">•••• •••• •••• 4242</span>
              <span className="card-expiry">Expires 12/2026</span>
            </div>
            <button className="edit-card-btn">
              <i className="fas fa-edit"></i>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
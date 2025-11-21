// src/admin/components/SubscriptionPlanCard.jsx
import React from 'react';
import '../styles/TenantManagement.css';

const SubscriptionPlanCard = ({ plan, onEdit, onDelete, onSelect = null }) => {
  const getDiscountPercentage = () => {
    if (plan.annual_price && plan.monthly_price) {
      const monthlyTotal = plan.monthly_price * 12;
      const discount = ((monthlyTotal - plan.annual_price) / monthlyTotal) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const getPlanColorClass = () => {
    switch (plan.code) {
      case 'BASIC':
        return 'plan-basic';
      case 'PROFESSIONAL':
        return 'plan-professional';
      case 'ENTERPRISE':
        return 'plan-enterprise';
      default:
        return 'plan-default';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <div className={`subscription-plan-card ${getPlanColorClass()} ${onSelect ? 'selectable' : ''}`}>
      {/* Header */}
      <div className="plan-header">
        <div className="plan-name-section">
          <h3 className="plan-name">{plan.name}</h3>
          <span className="plan-code">{plan.code}</span>
        </div>
        
        {!plan.is_active && (
          <span className="plan-inactive-badge">
            <i className="fas fa-ban"></i> Inactive
          </span>
        )}
      </div>

      {/* Pricing */}
      <div className="plan-pricing">
        <div className="price-option">
          <div className="price-label">Monthly</div>
          <div className="price-amount">{formatPrice(plan.monthly_price)}<span className="price-period">/mo</span></div>
        </div>
        
        <div className="price-option highlighted">
          <div className="price-label">
            Annual
            {discountPercentage > 0 && (
              <span className="discount-badge">Save {discountPercentage}%</span>
            )}
          </div>
          <div className="price-amount">{formatPrice(plan.annual_price)}<span className="price-period">/yr</span></div>
          <div className="price-subtext">{formatPrice(plan.annual_price / 12)}/mo</div>
        </div>
      </div>

      {/* Description */}
      <p className="plan-description">{plan.description}</p>

      {/* Limits */}
      <div className="plan-limits">
        <h4 className="section-title">Limits</h4>
        <div className="limit-item">
          <i className="fas fa-users"></i>
          <span>Users: {plan.max_users === 0 ? 'Unlimited' : plan.max_users}</span>
        </div>
        <div className="limit-item">
          <i className="fas fa-shield-halved"></i>
          <span>Frameworks: {plan.max_frameworks === 0 ? 'Unlimited' : plan.max_frameworks}</span>
        </div>
        <div className="limit-item">
          <i className="fas fa-list-check"></i>
          <span>Controls: {plan.max_controls === 0 ? 'Unlimited' : plan.max_controls}</span>
        </div>
        <div className="limit-item">
          <i className="fas fa-database"></i>
          <span>Storage: {plan.storage_gb} GB</span>
        </div>
      </div>

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <div className="plan-features">
          <h4 className="section-title">Features</h4>
          <ul className="features-list">
            {plan.features.map((feature, index) => (
              <li key={index}>
                <i className="fas fa-check-circle"></i>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Support Level */}
      <div className="plan-support">
        <i className="fas fa-headset"></i>
        <span>{plan.support_level === 'EMAIL' ? 'Email Support' : 
               plan.support_level === 'PRIORITY' ? 'Priority Support' : 
               'Dedicated Account Manager'}</span>
      </div>

      {/* Actions */}
      <div className="plan-actions">
        {onSelect ? (
          <button className="btn-select" onClick={() => onSelect(plan)}>
            <i className="fas fa-check"></i>
            Select Plan
          </button>
        ) : (
          <>
            <button className="btn-edit" onClick={() => onEdit(plan)} title="Edit Plan">
              <i className="fas fa-edit"></i>
              Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(plan)} title="Delete Plan">
              <i className="fas fa-trash"></i>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlanCard;
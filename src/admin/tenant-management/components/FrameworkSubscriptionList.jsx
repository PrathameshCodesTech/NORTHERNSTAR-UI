// src/admin/components/FrameworkSubscriptionList.jsx
import React from 'react';
import TenantStatusBadge from './TenantStatusBadge';
import '../styles/TenantManagement.css';

const FrameworkSubscriptionList = ({ subscriptions = [], onUpgrade, onUnsubscribe }) => {
  if (subscriptions.length === 0) {
    return (
      <div className="empty-state-small">
        <i className="fas fa-shield-halved"></i>
        <p>No framework subscriptions yet</p>
      </div>
    );
  }

  const getCustomizationBadge = (level) => {
    const badges = {
      'VIEW_ONLY': { className: 'customization-view', icon: 'fa-eye', label: 'View Only' },
      'CONTROL_LEVEL': { className: 'customization-control', icon: 'fa-edit', label: 'Control Level' },
      'FULL': { className: 'customization-full', icon: 'fa-wand-magic-sparkles', label: 'Full' }
    };
    
    const badge = badges[level] || badges['VIEW_ONLY'];
    
    return (
      <span className={`customization-badge ${badge.className}`}>
        <i className={`fas ${badge.icon}`}></i>
        {badge.label}
      </span>
    );
  };

  const getSubscriptionTypeBadge = (type) => {
    return type === 'INCLUDED' ? (
      <span className="subscription-type-badge included">
        <i className="fas fa-check-circle"></i>
        Included
      </span>
    ) : (
      <span className="subscription-type-badge addon">
        <i className="fas fa-plus-circle"></i>
        Add-on
      </span>
    );
  };

  return (
    <div className="framework-subscriptions-list">
      {subscriptions.map(sub => (
        <div key={sub.id} className="framework-subscription-item">
          {/* Header */}
          <div className="framework-sub-header">
            <div className="framework-sub-info">
              <h4 className="framework-sub-name">
                <i className="fas fa-shield-halved"></i>
                {sub.framework_name}
              </h4>
              <div className="framework-sub-meta">
                <span className="framework-version">
                  <i className="fas fa-code-branch"></i>
                  v{sub.current_version}
                </span>
                {sub.has_customizations && (
                  <span className="customizations-badge">
                    <i className="fas fa-star"></i>
                    {sub.customized_controls_count} customized
                  </span>
                )}
              </div>
            </div>
            <div className="framework-sub-badges">
              {getCustomizationBadge(sub.customization_level)}
              {getSubscriptionTypeBadge(sub.subscription_type)}
              <TenantStatusBadge status={sub.status} type="subscription" />
            </div>
          </div>

          {/* Version Info */}
          <div className="framework-sub-details">
            <div className="detail-row">
              <span className="detail-label">
                <i className="fas fa-calendar"></i>
                Subscribed
              </span>
              <span className="detail-value">
                {new Date(sub.subscribed_at).toLocaleDateString()}
              </span>
            </div>

            {sub.upgrade_status !== 'UP_TO_DATE' && (
              <div className="detail-row upgrade-available">
                <span className="detail-label">
                  <i className="fas fa-arrow-up"></i>
                  Upgrade Available
                </span>
                <span className="detail-value">
                  v{sub.latest_available_version}
                </span>
              </div>
            )}

            {sub.subscription_type === 'ADDON' && sub.addon_price && (
              <div className="detail-row">
                <span className="detail-label">
                  <i className="fas fa-dollar-sign"></i>
                  Add-on Price
                </span>
                <span className="detail-value">
                  ${parseFloat(sub.addon_price).toFixed(2)}/mo
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="framework-sub-actions">
            {sub.upgrade_status === 'UPGRADE_AVAILABLE' && onUpgrade && (
              <button 
                className="action-btn-sm upgrade-btn"
                onClick={() => onUpgrade(sub)}
                title="Upgrade Framework"
              >
                <i className="fas fa-arrow-up"></i>
                Upgrade
              </button>
            )}
            
            {onUnsubscribe && sub.status === 'ACTIVE' && (
              <button 
                className="action-btn-sm unsubscribe-btn"
                onClick={() => onUnsubscribe(sub)}
                title="Unsubscribe"
              >
                <i className="fas fa-times"></i>
                Unsubscribe
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FrameworkSubscriptionList;
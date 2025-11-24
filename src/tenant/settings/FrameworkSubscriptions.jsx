// src/tenant/settings/FrameworkSubscriptions.jsx
import React, { useState } from 'react';
import './FrameworkSubscriptions.css';

const FrameworkSubscriptions = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Current subscription limits
  const subscription = {
    plan: 'PROFESSIONAL',
    max_frameworks: 5,
    current_frameworks: 3,
    additional_cost: 150 // per framework
  };

  // Subscribed frameworks
  const subscribedFrameworks = [
    {
      id: 'iso27001',
      name: 'ISO 27001',
      code: 'ISO27001',
      version: '2022',
      icon: 'fa-shield-halved',
      color: '#3b82f6',
      subscribed_date: '2025-01-15',
      controls: 114,
      status: 'active',
      usage: { users: 12, assignments: 45 }
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      code: 'GDPR',
      version: '2018',
      icon: 'fa-user-shield',
      color: '#10b981',
      subscribed_date: '2025-01-20',
      controls: 99,
      status: 'active',
      usage: { users: 8, assignments: 28 }
    },
    {
      id: 'sox',
      name: 'SOX',
      code: 'SOX',
      version: '2002',
      icon: 'fa-file-invoice-dollar',
      color: '#f59e0b',
      subscribed_date: '2025-02-01',
      controls: 68,
      status: 'active',
      usage: { users: 15, assignments: 52 }
    }
  ];

  // Available frameworks to add
  const availableFrameworks = [
    {
      id: 'hipaa',
      name: 'HIPAA',
      code: 'HIPAA',
      version: '1996',
      icon: 'fa-hospital',
      color: '#8b5cf6',
      controls: 90,
      description: 'Health Insurance Portability and Accountability Act'
    },
    {
      id: 'pci-dss',
      name: 'PCI DSS',
      code: 'PCI-DSS',
      version: '4.0',
      icon: 'fa-credit-card',
      color: '#ef4444',
      controls: 78,
      description: 'Payment Card Industry Data Security Standard'
    },
    {
      id: 'nist',
      name: 'NIST CSF',
      code: 'NIST-CSF',
      version: '2.0',
      icon: 'fa-lock',
      color: '#06b6d4',
      controls: 108,
      description: 'Cybersecurity Framework'
    }
  ];

  const canAddMore = subscription.current_frameworks < subscription.max_frameworks;
  const remainingSlots = subscription.max_frameworks - subscription.current_frameworks;

  return (
    <div className="framework-subscriptions-page">
      {/* Gradient Banner */}
      {/* Clean Page Header */}
      <div className="page-header-settings">
        <div className="header-content">
          <div className="header-left">
            <h1>Framework Subscriptions</h1>
            <p className="header-subtitle">
              Manage your compliance framework subscriptions
            </p>
          </div>
          <div className="header-action">
            <div className="framework-limit-badge">
              <i className="fas fa-shield-halved"></i>
              <span>{subscription.current_frameworks} / {subscription.max_frameworks} Frameworks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="framework-subs-content">
        {/* Plan Info */}
        <div className="plan-info-card">
          <div className="plan-info-header">
            <div>
              <h3>Your Plan: {subscription.plan}</h3>
              <p className="plan-limit-text">
                You can subscribe to up to {subscription.max_frameworks} frameworks
              </p>
            </div>
            {canAddMore && (
              <button className="add-framework-btn" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus"></i>
                Add Framework
              </button>
            )}
          </div>
          
          {!canAddMore && (
            <div className="limit-reached-notice">
              <i className="fas fa-exclamation-circle"></i>
              <span>You've reached your framework limit. Upgrade your plan to add more frameworks.</span>
              <button className="upgrade-plan-btn">Upgrade Plan</button>
            </div>
          )}

          {canAddMore && (
            <div className="available-slots-info">
              <i className="fas fa-info-circle"></i>
              <span>You have {remainingSlots} {remainingSlots === 1 ? 'slot' : 'slots'} remaining</span>
            </div>
          )}
        </div>

        {/* Subscribed Frameworks */}
        <div className="subscribed-section">
          <h2>Active Frameworks</h2>
          <div className="frameworks-grid">
            {subscribedFrameworks.map(framework => (
              <div key={framework.id} className="subscribed-framework-card">
                <div className="framework-card-header">
                  <div className="framework-icon-box" style={{ backgroundColor: framework.color }}>
                    <i className={`fas ${framework.icon}`}></i>
                  </div>
                  <div className="framework-info-box">
                    <h3>{framework.name}</h3>
                    <p className="framework-code">{framework.code} v{framework.version}</p>
                  </div>
                  <div className="status-badge-active">
                    <i className="fas fa-check-circle"></i>
                    Active
                  </div>
                </div>

                <div className="framework-stats">
                  <div className="stat-item">
                    <i className="fas fa-list-check"></i>
                    <span>{framework.controls} Controls</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-users"></i>
                    <span>{framework.usage.users} Users</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-tasks"></i>
                    <span>{framework.usage.assignments} Assignments</span>
                  </div>
                </div>

                <div className="framework-meta">
                  <span className="subscribed-date">
                    <i className="fas fa-calendar"></i>
                    Subscribed: {new Date(framework.subscribed_date).toLocaleDateString()}
                  </span>
                </div>

                <div className="framework-actions">
                  <button className="action-btn view-btn">
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  <button className="action-btn remove-btn">
                    <i className="fas fa-trash"></i>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Frameworks */}
        {canAddMore && (
          <div className="available-section">
            <h2>Available Frameworks</h2>
            <p className="section-description">
              Add these frameworks to your subscription for ${subscription.additional_cost}/month each
            </p>
            <div className="frameworks-grid">
              {availableFrameworks.map(framework => (
                <div key={framework.id} className="available-framework-card">
                  <div className="framework-card-header">
                    <div className="framework-icon-box" style={{ backgroundColor: `${framework.color}15` }}>
                      <i className={`fas ${framework.icon}`} style={{ color: framework.color }}></i>
                    </div>
                    <div className="framework-info-box">
                      <h3>{framework.name}</h3>
                      <p className="framework-code">{framework.code} v{framework.version}</p>
                    </div>
                  </div>

                  <p className="framework-description">{framework.description}</p>

                  <div className="framework-stats">
                    <div className="stat-item">
                      <i className="fas fa-list-check"></i>
                      <span>{framework.controls} Controls</span>
                    </div>
                  </div>

                  <div className="price-info">
                    <span className="price-label">Additional cost:</span>
                    <span className="price-value">${subscription.additional_cost}/month</span>
                  </div>

                  <button className="add-btn">
                    <i className="fas fa-plus"></i>
                    Add to Subscription
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Framework Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Framework</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-frameworks-list">
                {availableFrameworks.map(framework => (
                  <div key={framework.id} className="modal-framework-item">
                    <div className="modal-framework-icon" style={{ backgroundColor: `${framework.color}15` }}>
                      <i className={`fas ${framework.icon}`} style={{ color: framework.color }}></i>
                    </div>
                    <div className="modal-framework-info">
                      <h4>{framework.name}</h4>
                      <p>{framework.description}</p>
                      <span className="controls-count">{framework.controls} controls</span>
                    </div>
                    <div className="modal-framework-price">
                      <span className="add-cost">+${subscription.additional_cost}/mo</span>
                      <button className="select-btn">
                        <i className="fas fa-check"></i>
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameworkSubscriptions;
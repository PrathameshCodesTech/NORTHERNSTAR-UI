// src/admin/components/TenantCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TenantStatusBadge from './TenantStatusBadge';
import '../styles/TenantManagement.css';

const TenantCard = ({ tenant, onActivate, onSuspend, onReactivate, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/admin/tenants/${tenant.tenant_slug}`);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const getUsagePercentage = (current, limit) => {
    if (limit === 0) return 0;
    return Math.round((current / limit) * 100);
  };

  const plan = tenant.subscription_plan || {};

  return (
    <div className="tenant-card" onClick={handleCardClick}>
      {/* Header */}
      <div className="tenant-card-header">
        <div className="tenant-info">
          <h3 className="tenant-name">{tenant.company_name}</h3>
          <span className="tenant-slug">@{tenant.tenant_slug}</span>
        </div>
        <div className="tenant-badges">
          <TenantStatusBadge status={tenant.subscription_status} type="subscription" />
          {tenant.provisioning_status !== 'ACTIVE' && (
            <TenantStatusBadge status={tenant.provisioning_status} type="provisioning" />
          )}
        </div>
      </div>

      {/* Plan */}
      <div className="tenant-plan">
        <i className="fas fa-tag"></i>
        <span>{plan.name || 'No Plan'}</span>
      </div>

      {/* Contact */}
{/* Contact */}
      <div className="tenant-contact">
        <div className="contact-item">
          <i className="fas fa-envelope"></i>
          <span>{tenant.company_email}</span>
        </div>
        {tenant.company_phone && (
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <span>{tenant.company_phone}</span>
          </div>
        )}
      </div>

      {/* ✅ NEW: Requested Frameworks */}
      {tenant.requested_frameworks && tenant.requested_frameworks.length > 0 && (
        <div className="tenant-requested-frameworks">
          <div className="frameworks-label">
            <i className="fas fa-layer-group"></i>
            <span>Requested Frameworks ({tenant.requested_frameworks.length}):</span>
          </div>
          <div className="frameworks-tags">
            {tenant.requested_frameworks.map((framework, index) => (
              <span key={index} className="framework-tag">
                <i className="fas fa-shield-halved"></i>
                {framework.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="tenant-stats-mini">
        <div className="stat-mini">
          <i className="fas fa-users"></i>
          <span>{tenant.current_user_count}</span>
          {plan.max_users > 0 && <span className="stat-limit">/ {plan.max_users}</span>}
        </div>
        <div className="stat-mini">
          <i className="fas fa-shield-halved"></i>
          <span>{tenant.current_framework_count}</span>
          {plan.max_frameworks > 0 && <span className="stat-limit">/ {plan.max_frameworks}</span>}
        </div>
        <div className="stat-mini">
          <i className="fas fa-database"></i>
          <span>{parseFloat(tenant.storage_used_gb).toFixed(1)} GB</span>
          {plan.storage_gb > 0 && <span className="stat-limit">/ {plan.storage_gb} GB</span>}
        </div>
      </div>

      {/* Progress Indicators */}
      {plan.max_users > 0 && (
        <div className="mini-progress">
          <div 
            className={`mini-progress-bar ${getUsagePercentage(tenant.current_user_count, plan.max_users) >= 80 ? 'warning' : ''}`}
            style={{ width: `${Math.min(getUsagePercentage(tenant.current_user_count, plan.max_users), 100)}%` }}
          ></div>
        </div>
      )}

      {/* Actions */}
      <div className="tenant-card-actions" onClick={(e) => e.stopPropagation()}>
        {tenant.subscription_status === 'PENDING_PAYMENT' && onActivate && (
          <button 
            className="action-btn activate-btn"
            onClick={(e) => handleActionClick(e, () => onActivate(tenant))}
            title="Activate Tenant"
          >
            <i className="fas fa-check-circle"></i>
            Activate
          </button>
        )}
        
        {tenant.subscription_status === 'ACTIVE' && onSuspend && (
          <button 
            className="action-btn suspend-btn"
            onClick={(e) => handleActionClick(e, () => onSuspend(tenant))}
            title="Suspend Tenant"
          >
            <i className="fas fa-pause-circle"></i>
            Suspend
          </button>
        )}
        
        {tenant.subscription_status === 'SUSPENDED' && onReactivate && (
          <button 
            className="action-btn reactivate-btn"
            onClick={(e) => handleActionClick(e, () => onReactivate(tenant))}
            title="Reactivate Tenant"
          >
            <i className="fas fa-play-circle"></i>
            Reactivate
          </button>
        )}

        {tenant.subscription_status === 'PENDING_PAYMENT' && onDelete && (
          <button 
            className="action-btn delete-btn"
            onClick={(e) => handleActionClick(e, () => onDelete(tenant))}
            title="Delete Pending Tenant"
          >
            <i className="fas fa-trash"></i>
            Delete
          </button>
        )}

        <button 
          className="action-btn view-btn"
          onClick={(e) => handleActionClick(e, handleCardClick)}
          title="View Details"
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>

      {/* Footer */}
      <div className="tenant-card-footer">
        <span className="tenant-date">
          <i className="fas fa-calendar"></i>
          Created {new Date(tenant.created_at).toLocaleDateString()}
        </span>
        {tenant.schema_name && (
          <span className="tenant-schema">
            <i className="fas fa-database"></i>
            {tenant.schema_name}
          </span>
        )}
      </div>
    </div>
  );
};

export default TenantCard;
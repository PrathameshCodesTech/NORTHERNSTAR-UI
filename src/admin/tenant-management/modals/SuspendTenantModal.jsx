// src/admin/modals/SuspendTenantModal.jsx
import React, { useState } from 'react';
import '../styles/TenantManagement.css';

const SuspendTenantModal = ({ isOpen, onClose, onConfirm, tenant, action = 'suspend' }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(reason);
      setReason('');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !tenant) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'suspend':
        return {
          title: 'Suspend Tenant',
          icon: 'fa-pause-circle',
          color: 'warning',
          message: 'Are you sure you want to suspend this tenant? They will lose access to the system.',
          confirmText: 'Suspend Tenant',
          confirmClass: 'btn-warning'
        };
      case 'reactivate':
        return {
          title: 'Reactivate Tenant',
          icon: 'fa-play-circle',
          color: 'success',
          message: 'Are you sure you want to reactivate this tenant? They will regain full access.',
          confirmText: 'Reactivate Tenant',
          confirmClass: 'btn-success'
        };
      case 'delete':
        return {
          title: 'Delete Tenant',
          icon: 'fa-trash',
          color: 'danger',
          message: 'Are you sure you want to delete this PENDING tenant? This action cannot be undone.',
          confirmText: 'Delete Tenant',
          confirmClass: 'btn-danger'
        };
      default:
        return {
          title: 'Confirm Action',
          icon: 'fa-exclamation-triangle',
          color: 'warning',
          message: 'Are you sure?',
          confirmText: 'Confirm',
          confirmClass: 'btn-warning'
        };
    }
  };

  const config = getActionConfig();

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container modal-small">
        <div className={`modal-header modal-header-${config.color}`}>
          <h2 className="modal-title">
            <i className={`fas ${config.icon}`}></i>
            {config.title}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-form">
          {/* Tenant Info */}
          <div className="tenant-confirm-info">
            <div className="confirm-tenant-name">{tenant.company_name}</div>
            <div className="confirm-tenant-slug">@{tenant.tenant_slug}</div>
            <div className="confirm-tenant-status">
              Current Status: <strong>{tenant.subscription_status}</strong>
            </div>
          </div>

          {/* Warning Message */}
          <div className={`info-banner info-${config.color}`}>
            <i className={`fas ${config.icon}`}></i>
            <p>{config.message}</p>
          </div>

          {/* Reason (optional for suspend/delete) */}
          {(action === 'suspend' || action === 'delete') && (
            <div className="form-group">
              <label className="form-label">Reason (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Enter reason for this action..."
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
          )}

          {/* Actions */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className={`btn-submit ${config.confirmClass}`}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className={`fas ${config.icon}`}></i>
                  {config.confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendTenantModal;
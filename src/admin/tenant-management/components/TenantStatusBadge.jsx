// src/admin/components/TenantStatusBadge.jsx
import React from 'react';
import '../styles/TenantManagement.css';

const TenantStatusBadge = ({ status, type = 'subscription' }) => {
  const getStatusConfig = () => {
    if (type === 'subscription') {
      // Subscription status badges
      switch (status) {
        case 'PENDING_PAYMENT':
          return { className: 'status-pending', icon: 'fa-clock', label: 'Pending Payment' };
        case 'ACTIVE':
          return { className: 'status-active', icon: 'fa-check-circle', label: 'Active' };
        case 'SUSPENDED':
          return { className: 'status-suspended', icon: 'fa-pause-circle', label: 'Suspended' };
        case 'CANCELLED':
          return { className: 'status-cancelled', icon: 'fa-times-circle', label: 'Cancelled' };
        case 'EXPIRED':
          return { className: 'status-expired', icon: 'fa-exclamation-circle', label: 'Expired' };
        case 'DELETED':
          return { className: 'status-deleted', icon: 'fa-trash', label: 'Deleted' };
        default:
          return { className: 'status-unknown', icon: 'fa-question-circle', label: status };
      }
    } else if (type === 'provisioning') {
      // Provisioning status badges
      switch (status) {
        case 'PENDING':
          return { className: 'status-pending', icon: 'fa-clock', label: 'Pending' };
        case 'PROVISIONING':
          return { className: 'status-provisioning', icon: 'fa-spinner fa-spin', label: 'Provisioning' };
        case 'ACTIVE':
          return { className: 'status-active', icon: 'fa-check-circle', label: 'Active' };
        case 'FAILED':
          return { className: 'status-failed', icon: 'fa-exclamation-triangle', label: 'Failed' };
        case 'DEPROVISIONING':
          return { className: 'status-deprovisioning', icon: 'fa-spinner fa-spin', label: 'Deprovisioning' };
        default:
          return { className: 'status-unknown', icon: 'fa-question-circle', label: status };
      }
    } else if (type === 'payment') {
      // Payment status badges
      switch (status) {
        case 'PENDING':
          return { className: 'status-pending', icon: 'fa-clock', label: 'Pending' };
        case 'PAID':
          return { className: 'status-paid', icon: 'fa-check-circle', label: 'Paid' };
        case 'FAILED':
          return { className: 'status-failed', icon: 'fa-times-circle', label: 'Failed' };
        case 'REFUNDED':
          return { className: 'status-refunded', icon: 'fa-undo', label: 'Refunded' };
        default:
          return { className: 'status-unknown', icon: 'fa-question-circle', label: status };
      }
    }
    
    return { className: 'status-unknown', icon: 'fa-question-circle', label: status };
  };

  const config = getStatusConfig();

  return (
    <span className={`status-badge ${config.className}`}>
      <i className={`fas ${config.icon}`}></i>
      {config.label}
    </span>
  );
};

export default TenantStatusBadge;
// src/admin/components/AuditLogTable.jsx
import React from 'react';
import '../styles/TenantManagement.css';

const AuditLogTable = ({ logs = [] }) => {
  if (logs.length === 0) {
    return (
      <div className="empty-state-small">
        <i className="fas fa-shield-halved"></i>
        <p>No audit logs found</p>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionBadge = (action) => {
    const actionConfig = {
      'VIEW_CREDENTIALS': { className: 'action-view', icon: 'fa-eye', label: 'View Credentials' },
      'IMPERSONATE': { className: 'action-impersonate', icon: 'fa-user-secret', label: 'Impersonate' },
      'QUERY_DATABASE': { className: 'action-query', icon: 'fa-database', label: 'Query Database' },
      'CREATE_TENANT': { className: 'action-create', icon: 'fa-plus-circle', label: 'Create Tenant' },
      'DELETE_TENANT': { className: 'action-delete', icon: 'fa-trash', label: 'Delete Tenant' },
      'SUSPEND_TENANT': { className: 'action-suspend', icon: 'fa-pause-circle', label: 'Suspend Tenant' },
      'MODIFY_SUBSCRIPTION': { className: 'action-modify', icon: 'fa-edit', label: 'Modify Subscription' },
      'VIEW_TENANT_DATA': { className: 'action-view', icon: 'fa-eye', label: 'View Tenant Data' }
    };

    const config = actionConfig[action] || { 
      className: 'action-default', 
      icon: 'fa-info-circle', 
      label: action 
    };

    return (
      <span className={`action-badge ${config.className}`}>
        <i className={`fas ${config.icon}`}></i>
        {config.label}
      </span>
    );
  };

  return (
    <div className="table-container">
      <table className="audit-log-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Admin User</th>
            <th>Action</th>
            <th>Tenant</th>
            <th>IP Address</th>
            <th>Reason</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>
                <span className="timestamp">{formatTimestamp(log.timestamp)}</span>
              </td>
              <td>
                <div className="admin-info">
                  <strong>{log.admin_username}</strong>
                  <small>ID: {log.admin_user_id}</small>
                </div>
              </td>
              <td>
                {getActionBadge(log.action)}
              </td>
              <td>
                {log.tenant_slug ? (
                  <span className="tenant-slug-badge">@{log.tenant_slug}</span>
                ) : (
                  <span className="no-tenant">—</span>
                )}
              </td>
              <td>
                <span className="ip-address">{log.ip_address}</span>
              </td>
              <td>
                {log.reason ? (
                  <span className="reason-text">{log.reason}</span>
                ) : (
                  <span className="no-reason">No reason provided</span>
                )}
              </td>
              <td>
                {log.details && Object.keys(log.details).length > 0 ? (
                  <button 
                    className="details-btn"
                    onClick={() => {
                      alert(`Details:\n${JSON.stringify(log.details, null, 2)}`);
                    }}
                    title="View Details"
                  >
                    <i className="fas fa-info-circle"></i>
                    View
                  </button>
                ) : (
                  <span className="no-details">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
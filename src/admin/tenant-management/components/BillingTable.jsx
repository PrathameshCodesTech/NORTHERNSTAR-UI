// src/admin/components/BillingTable.jsx
import React from 'react';
import TenantStatusBadge from './TenantStatusBadge';
import '../styles/TenantManagement.css';

const BillingTable = ({ billingRecords = [], onViewInvoice }) => {
  if (billingRecords.length === 0) {
    return (
      <div className="empty-state-small">
        <i className="fas fa-file-invoice-dollar"></i>
        <p>No billing records found</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="table-container">
      <table className="billing-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Tenant</th>
            <th>Billing Period</th>
            <th>Base Amount</th>
            <th>Add-ons</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {billingRecords.map(record => {
            const totalAddons = 
              parseFloat(record.addon_frameworks_amount || 0) + 
              parseFloat(record.addon_users_amount || 0) + 
              parseFloat(record.addon_storage_amount || 0);

            return (
              <tr key={record.id}>
                <td>
                  <span className="invoice-number">{record.invoice_number}</span>
                </td>
                <td>
                  <div className="tenant-cell">
                    <strong>{record.tenant?.company_name || 'N/A'}</strong>
                    {record.tenant?.tenant_slug && (
                      <small>@{record.tenant.tenant_slug}</small>
                    )}
                  </div>
                </td>
                <td>
                  <div className="billing-period">
                    <span>{formatDate(record.billing_period_start)}</span>
                    <span className="period-separator">→</span>
                    <span>{formatDate(record.billing_period_end)}</span>
                  </div>
                </td>
                <td>
                  <span className="amount">{formatCurrency(record.base_plan_amount)}</span>
                </td>
                <td>
                  {totalAddons > 0 ? (
                    <div className="addons-breakdown">
                      <span className="amount">{formatCurrency(totalAddons)}</span>
                      <div className="addon-details">
                        {parseFloat(record.addon_frameworks_amount) > 0 && (
                          <small>Frameworks: {formatCurrency(record.addon_frameworks_amount)}</small>
                        )}
                        {parseFloat(record.addon_users_amount) > 0 && (
                          <small>Users: {formatCurrency(record.addon_users_amount)}</small>
                        )}
                        {parseFloat(record.addon_storage_amount) > 0 && (
                          <small>Storage: {formatCurrency(record.addon_storage_amount)}</small>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="amount-zero">$0.00</span>
                  )}
                </td>
                <td>
                  <span className="amount-total">{formatCurrency(record.total_amount)}</span>
                </td>
                <td>
                  <TenantStatusBadge status={record.payment_status} type="payment" />
                </td>
                <td>
                  {record.payment_date ? formatDate(record.payment_date) : 'Pending'}
                </td>
                <td>
                  <div className="table-actions">
                    {record.invoice_url && (
                      <a 
                        href={record.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn view-btn"
                        title="View Invoice"
                      >
                        <i className="fas fa-file-pdf"></i>
                      </a>
                    )}
                    {onViewInvoice && (
                      <button
                        className="icon-btn view-btn"
                        onClick={() => onViewInvoice(record)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;
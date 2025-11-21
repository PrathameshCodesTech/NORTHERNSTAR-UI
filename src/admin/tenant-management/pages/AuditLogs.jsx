// src/admin/pages/AuditLogs.jsx
import React, { useState, useEffect } from 'react';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import SearchBar from '../../components/SearchBar';
import AuditLogTable from '../components/AuditLogTable';
import TenantStatsCard from '../components/TenantStatsCard';
import EmptyState from '../../components/EmptyState';
import { auditLogAPI } from '../../../services/tenantService';
import '../styles/TenantManagement.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [adminSummary, setAdminSummary] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Audit Logs', icon: 'fa-shield-halved' }
  ];

  const actionFilters = [
    { label: 'All Actions', value: '' },
    { label: 'View Credentials', value: 'VIEW_CREDENTIALS' },
    { label: 'Impersonate', value: 'IMPERSONATE' },
    { label: 'Query Database', value: 'QUERY_DATABASE' },
    { label: 'Create Tenant', value: 'CREATE_TENANT' },
    { label: 'Delete Tenant', value: 'DELETE_TENANT' },
    { label: 'Suspend Tenant', value: 'SUSPEND_TENANT' },
    { label: 'Modify Subscription', value: 'MODIFY_SUBSCRIPTION' },
    { label: 'View Tenant Data', value: 'VIEW_TENANT_DATA' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent logs
      const logsResponse = await auditLogAPI.getRecent();
      const logsArray = Array.isArray(logsResponse) ? logsResponse : [];
      setLogs(logsArray);

      // Fetch admin summary
      try {
        const summaryResponse = await auditLogAPI.getByAdmin();
        setAdminSummary(summaryResponse || []);
      } catch (err) {
        console.error('Error fetching admin summary:', err);
      }

    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Failed to load audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (action) => {
    setFilterAction(action);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.admin_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tenant_slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip_address?.includes(searchQuery) ||
      log.reason?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = !filterAction || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  // Calculate statistics
  const stats = {
    totalLogs: logs.length,
    uniqueAdmins: new Set(logs.map(l => l.admin_user_id)).size,
    viewCredentials: logs.filter(l => l.action === 'VIEW_CREDENTIALS').length,
    impersonations: logs.filter(l => l.action === 'IMPERSONATE').length,
    tenantCreations: logs.filter(l => l.action === 'CREATE_TENANT').length,
    tenantDeletions: logs.filter(l => l.action === 'DELETE_TENANT').length
  };

  if (loading) {
    return (
      <div className="audit-logs">
        <BreadcrumbNav items={breadcrumbItems} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0066cc' }}></i>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audit-logs">
        <BreadcrumbNav items={breadcrumbItems} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
          <p style={{ fontSize: '1.1rem', color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
          <button className="create-btn" onClick={fetchData}>
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-logs">
      <BreadcrumbNav items={breadcrumbItems} />

      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Audit Logs</h1>
          <p className="view-subtitle">Security and compliance audit trail</p>
        </div>
        <button className="secondary-btn" onClick={fetchData}>
          <i className="fas fa-sync"></i>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid stats-grid-6">
        <TenantStatsCard
          icon="fa-list"
          label="Total Logs"
          value={stats.totalLogs}
          color="blue"
        />
        <TenantStatsCard
          icon="fa-user-shield"
          label="Unique Admins"
          value={stats.uniqueAdmins}
          color="purple"
        />
        <TenantStatsCard
          icon="fa-eye"
          label="View Credentials"
          value={stats.viewCredentials}
          color="orange"
        />
        <TenantStatsCard
          icon="fa-user-secret"
          label="Impersonations"
          value={stats.impersonations}
          color="red"
        />
        <TenantStatsCard
          icon="fa-plus-circle"
          label="Tenant Creations"
          value={stats.tenantCreations}
          color="green"
        />
        <TenantStatsCard
          icon="fa-trash"
          label="Tenant Deletions"
          value={stats.tenantDeletions}
          color="teal"
        />
      </div>

      {/* Admin Activity Summary */}
      {adminSummary.length > 0 && (
        <div className="admin-summary-section">
          <h3 className="section-heading">
            <i className="fas fa-users"></i>
            Admin Activity Summary
          </h3>
          <div className="admin-summary-grid">
            {adminSummary.slice(0, 6).map(admin => (
              <div key={admin.admin_user_id} className="admin-summary-card">
                <div className="admin-avatar">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="admin-summary-info">
                  <h4>{admin.admin_username}</h4>
                  <span className="action-count">{admin.action_count} actions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <SearchBar
        placeholder="Search by admin, tenant, IP, or reason..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={actionFilters}
      />

      {/* Audit Log Table */}
      {filteredLogs.length > 0 ? (
        <AuditLogTable logs={filteredLogs} />
      ) : (
        <EmptyState
          icon="fa-shield-halved"
          title="No audit logs found"
          description={searchQuery || filterAction 
            ? "Try adjusting your search or filter criteria" 
            : "No audit logs recorded yet"}
        />
      )}
    </div>
  );
};

export default AuditLogs;
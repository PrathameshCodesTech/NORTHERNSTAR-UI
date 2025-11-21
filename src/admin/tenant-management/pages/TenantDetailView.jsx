// src/admin/pages/TenantDetailView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import TenantStatusBadge from '../components/TenantStatusBadge';
import TenantStatsCard from '../components/TenantStatsCard';
import UsageProgressBar from '../components/UsageProgressBar';
import FrameworkSubscriptionList from '../components/FrameworkSubscriptionList';
import SubscribeFrameworkModal from '../modals/SubscribeFrameworkModal';
import SuspendTenantModal from '../modals/SuspendTenantModal';
import { tenantAPI } from '../../../services/tenantService';
import { frameworkAPI } from '../../../services/templateService';
import '../styles/TenantManagement.css';

const TenantDetailView = () => {
  const { tenantSlug } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [frameworks, setFrameworks] = useState([]);
  const [tenantFrameworks, setTenantFrameworks] = useState([]);
  const [usageData, setUsageData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendAction, setSuspendAction] = useState('suspend');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Tenants', path: '/admin/tenants', icon: 'fa-building' },
    { label: tenant?.company_name || tenantSlug, icon: 'fa-info-circle' }
  ];

  useEffect(() => {
    fetchData();
  }, [tenantSlug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tenant details
      const tenantData = await tenantAPI.getBySlug(tenantSlug);
      setTenant(tenantData);

      // Fetch tenant's frameworks
      const frameworksData = await tenantAPI.getFrameworks(tenantSlug);
      setTenantFrameworks(frameworksData.frameworks || []);

      // Fetch usage data
      const usageResponse = await tenantAPI.getUsage(tenantSlug);
      setUsageData(usageResponse);

      // Fetch all available frameworks (for subscribe modal)
      const allFrameworksResponse = await frameworkAPI.getAll();
      const allFrameworksArray = Array.isArray(allFrameworksResponse) 
        ? allFrameworksResponse 
        : allFrameworksResponse?.results || [];
      setFrameworks(allFrameworksArray);

    } catch (err) {
      console.error('Error fetching tenant data:', err);
      setError('Failed to load tenant details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleSubscribeFramework = () => {
    setIsSubscribeModalOpen(true);
  };

  const handleSubscribeModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      const response = await tenantAPI.subscribe(tenantSlug, formData);

      if (response.success) {
        alert(`✅ Successfully subscribed to "${response.distribution.framework_name}"!`);
        await fetchData();
        setIsSubscribeModalOpen(false);
      } else {
        alert(`❌ Failed to subscribe: ${response.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error subscribing to framework:', err);
      alert('Failed to subscribe to framework. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = () => {
    setSuspendAction('suspend');
    setIsSuspendModalOpen(true);
  };

  const handleReactivate = () => {
    setSuspendAction('reactivate');
    setIsSuspendModalOpen(true);
  };

  const handleSuspendModalConfirm = async (reason) => {
    try {
      let response;
      
      if (suspendAction === 'suspend') {
        response = await tenantAPI.suspend(tenantSlug);
      } else {
        response = await tenantAPI.reactivate(tenantSlug);
      }

      if (response.success) {
        alert(`✅ Tenant ${suspendAction === 'suspend' ? 'suspended' : 'reactivated'} successfully!`);
        await fetchData();
        setIsSuspendModalOpen(false);
      } else {
        alert(`❌ Failed to ${suspendAction}: ${response.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error(`Error ${suspendAction}ing tenant:`, err);
      alert(`Failed to ${suspendAction} tenant. Please try again.`);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="tenant-detail-view">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading tenant details...</p>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="tenant-detail-view">
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
          <p style={{ fontSize: '1.1rem', color: '#dc3545', marginBottom: '1rem' }}>
            {error || 'Tenant not found'}
          </p>
          <button className="create-btn" onClick={() => navigate('/admin/tenants')}>
            <i className="fas fa-arrow-left"></i> Back to Tenants
          </button>
        </div>
      </div>
    );
  }

  const plan = tenant.subscription_plan || {};

  return (
    <div className="tenant-detail-view">
      <BreadcrumbNav items={breadcrumbItems} />

      {/* Header */}
      <div className="tenant-detail-header">
        <div className="tenant-header-info">
          <div className="tenant-header-main">
            <h1 className="tenant-detail-title">{tenant.company_name}</h1>
            <span className="tenant-detail-slug">@{tenant.tenant_slug}</span>
          </div>
          <div className="tenant-header-badges">
            <TenantStatusBadge status={tenant.subscription_status} type="subscription" />
            {tenant.provisioning_status !== 'ACTIVE' && (
              <TenantStatusBadge status={tenant.provisioning_status} type="provisioning" />
            )}
          </div>
        </div>

        <div className="tenant-header-actions">
          {tenant.subscription_status === 'ACTIVE' && (
            <>
              <button className="action-btn-primary" onClick={handleSubscribeFramework}>
                <i className="fas fa-plus"></i>
                Add Framework
              </button>
              <button className="action-btn-warning" onClick={handleSuspend}>
                <i className="fas fa-pause-circle"></i>
                Suspend
              </button>
            </>
          )}
          
          {tenant.subscription_status === 'SUSPENDED' && (
            <button className="action-btn-success" onClick={handleReactivate}>
              <i className="fas fa-play-circle"></i>
              Reactivate
            </button>
          )}

          <button className="action-btn-secondary" onClick={() => navigate('/admin/tenants')}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <TenantStatsCard
          icon="fa-users"
          label="Users"
          value={tenant.current_user_count}
          limit={plan.max_users}
          color="blue"
        />
        <TenantStatsCard
          icon="fa-shield-halved"
          label="Frameworks"
          value={tenant.current_framework_count}
          limit={plan.max_frameworks}
          color="teal"
        />
        <TenantStatsCard
          icon="fa-list-check"
          label="Controls"
          value={tenant.current_control_count}
          limit={plan.max_controls}
          color="purple"
        />
        <TenantStatsCard
          icon="fa-database"
          label="Storage"
          value={`${parseFloat(tenant.storage_used_gb).toFixed(1)} GB`}
          limit={plan.storage_gb > 0 ? `${plan.storage_gb} GB` : null}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="tenant-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-info-circle"></i>
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'frameworks' ? 'active' : ''}`}
          onClick={() => setActiveTab('frameworks')}
        >
          <i className="fas fa-shield-halved"></i>
          Frameworks ({tenantFrameworks.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'usage' ? 'active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          <i className="fas fa-chart-line"></i>
          Usage & Limits
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="tab-panel">
            <div className="detail-sections">
              {/* Company Info */}
              <section className="detail-section">
                <h3 className="section-heading">
                  <i className="fas fa-building"></i>
                  Company Information
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Company Name</label>
                    <span>{tenant.company_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tenant Slug</label>
                    <span className="monospace">@{tenant.tenant_slug}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{tenant.company_email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <span>{tenant.company_phone || 'N/A'}</span>
                  </div>
                </div>
              </section>

              {/* Subscription Info */}
              <section className="detail-section">
                <h3 className="section-heading">
                  <i className="fas fa-tag"></i>
                  Subscription Details
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Plan</label>
                    <span className="plan-name">{plan.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <TenantStatusBadge status={tenant.subscription_status} type="subscription" />
                  </div>
                  <div className="detail-item">
                    <label>Start Date</label>
                    <span>
                      {tenant.subscription_start_date 
                        ? new Date(tenant.subscription_start_date).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>End Date</label>
                    <span>
                      {tenant.subscription_end_date 
                        ? new Date(tenant.subscription_end_date).toLocaleDateString()
                        : 'Ongoing'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Database Info */}
              <section className="detail-section">
                <h3 className="section-heading">
                  <i className="fas fa-database"></i>
                  Database Information
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Schema Name</label>
                    <span className="monospace">{tenant.schema_name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Database</label>
                    <span className="monospace">{tenant.database_name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Provisioning Status</label>
                    <TenantStatusBadge status={tenant.provisioning_status} type="provisioning" />
                  </div>
                  <div className="detail-item">
                    <label>Provisioned At</label>
                    <span>
                      {tenant.provisioned_at 
                        ? new Date(tenant.provisioned_at).toLocaleString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Timestamps */}
              <section className="detail-section">
                <h3 className="section-heading">
                  <i className="fas fa-clock"></i>
                  Timestamps
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Created At</label>
                    <span>{new Date(tenant.created_at).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Updated At</label>
                    <span>{new Date(tenant.updated_at).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Health Check</label>
                    <span>
                      {tenant.last_health_check 
                        ? new Date(tenant.last_health_check).toLocaleString()
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* FRAMEWORKS TAB */}
        {activeTab === 'frameworks' && (
          <div className="tab-panel">
            <div className="frameworks-tab-header">
              <h3 className="section-heading">
                <i className="fas fa-shield-halved"></i>
                Subscribed Frameworks
              </h3>
              <button 
                className="add-framework-btn"
                onClick={handleSubscribeFramework}
                disabled={plan.max_frameworks > 0 && tenant.current_framework_count >= plan.max_frameworks}
              >
                <i className="fas fa-plus"></i>
                Add Framework
              </button>
            </div>

            <FrameworkSubscriptionList
              subscriptions={tenantFrameworks}
              onUpgrade={(sub) => alert('Upgrade feature coming soon!')}
              onUnsubscribe={(sub) => alert('Unsubscribe feature coming soon!')}
            />
          </div>
        )}

        {/* USAGE TAB */}
        {activeTab === 'usage' && (
          <div className="tab-panel">
            <section className="detail-section">
              <h3 className="section-heading">
                <i className="fas fa-chart-line"></i>
                Current Usage vs Plan Limits
              </h3>

              <div className="usage-bars">
                <UsageProgressBar
                  label="Users"
                  current={tenant.current_user_count}
                  limit={plan.max_users}
                  height="large"
                />
                
                <UsageProgressBar
                  label="Frameworks"
                  current={tenant.current_framework_count}
                  limit={plan.max_frameworks}
                  height="large"
                />
                
                <UsageProgressBar
                  label="Controls"
                  current={tenant.current_control_count}
                  limit={plan.max_controls}
                  height="large"
                />
                
                <UsageProgressBar
                  label="Storage"
                  current={parseFloat(tenant.storage_used_gb)}
                  limit={plan.storage_gb}
                  unit=" GB"
                  height="large"
                />
              </div>
            </section>

            {/* Plan Limits Summary */}
            <section className="detail-section">
              <h3 className="section-heading">
                <i className="fas fa-tag"></i>
                Plan Limits - {plan.name}
              </h3>
              <div className="limits-grid">
                <div className="limit-card">
                  <i className="fas fa-users"></i>
                  <div className="limit-info">
                    <span className="limit-label">Max Users</span>
                    <span className="limit-value">{plan.max_users === 0 ? 'Unlimited' : plan.max_users}</span>
                  </div>
                </div>
                <div className="limit-card">
                  <i className="fas fa-shield-halved"></i>
                  <div className="limit-info">
                    <span className="limit-label">Max Frameworks</span>
                    <span className="limit-value">{plan.max_frameworks === 0 ? 'Unlimited' : plan.max_frameworks}</span>
                  </div>
                </div>
                <div className="limit-card">
                  <i className="fas fa-list-check"></i>
                  <div className="limit-info">
                    <span className="limit-label">Max Controls</span>
                    <span className="limit-value">{plan.max_controls === 0 ? 'Unlimited' : plan.max_controls}</span>
                  </div>
                </div>
                <div className="limit-card">
                  <i className="fas fa-database"></i>
                  <div className="limit-info">
                    <span className="limit-label">Storage</span>
                    <span className="limit-value">{plan.storage_gb} GB</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Modals */}
      <SubscribeFrameworkModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        onSubmit={handleSubscribeModalSubmit}
        tenant={tenant}
        frameworks={frameworks}
      />

      <SuspendTenantModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleSuspendModalConfirm}
        tenant={tenant}
        action={suspendAction}
      />
    </div>
  );
};

export default TenantDetailView;
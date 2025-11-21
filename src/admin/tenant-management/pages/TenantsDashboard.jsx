// src/admin/pages/TenantsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import SearchBar from '../../components/SearchBar';
import TenantCard from '../components/TenantCard';
import TenantStatsCard from '../components/TenantStatsCard';
import CreateTenantModal from '../modals/CreateTenantModal';
import ActivateTenantModal from '../modals/ActivateTenantModal';
import SuspendTenantModal from '../modals/SuspendTenantModal';
import EmptyState from '../../components/EmptyState';
import { tenantAPI, subscriptionPlanAPI } from '../../../services/tenantService';
import { frameworkAPI } from '../../../services/templateService';
import '../styles/TenantManagement.css';

const TenantsDashboard = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [plans, setPlans] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or table

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [suspendAction, setSuspendAction] = useState('suspend');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Tenants', icon: 'fa-building' }
  ];

  const statusFilters = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Pending Payment', value: 'PENDING_PAYMENT' },
    { label: 'Suspended', value: 'SUSPENDED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Expired', value: 'EXPIRED' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tenants
      const tenantsResponse = await tenantAPI.getAll();
      const tenantsArray = Array.isArray(tenantsResponse) 
        ? tenantsResponse 
        : tenantsResponse?.results || [];
      setTenants(tenantsArray);

      // Fetch subscription plans
      const plansResponse = await subscriptionPlanAPI.getAll();
      const plansArray = Array.isArray(plansResponse) 
        ? plansResponse 
        : plansResponse?.results || [];
      setPlans(plansArray);

      // Fetch frameworks
      const frameworksResponse = await frameworkAPI.getAll();
      const frameworksArray = Array.isArray(frameworksResponse) 
        ? frameworksResponse 
        : frameworksResponse?.results || [];
      setFrameworks(frameworksArray);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  // ============================================================================
  // CREATE TENANT
  // ============================================================================
  
  const handleCreateTenant = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      const response = await tenantAPI.create(formData);

      if (response.success) {
        alert(
          `✅ Tenant "${response.company_name}" created successfully!\n\n` +
          `Status: ${response.status}\n` +
          `Amount Due: $${response.amount}\n\n` +
          `Next Step: Activate the tenant after payment confirmation.`
        );

        await fetchData();
        handleCreateModalClose();
      } else {
        alert(`❌ Failed to create tenant: ${response.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error creating tenant:', err);
      alert('Failed to create tenant. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================================
  // ACTIVATE TENANT
  // ============================================================================

  const handleActivateTenant = (tenant) => {
    setSelectedTenant(tenant);
    setIsActivateModalOpen(true);
  };

  const handleActivateModalClose = () => {
    setIsActivateModalOpen(false);
    setSelectedTenant(null);
  };

  const handleActivateModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      const response = await tenantAPI.activate(selectedTenant.tenant_slug, formData);

      if (response.success) {
        alert(
          `✅ Tenant "${response.tenant.company_name}" activated successfully!\n\n` +
          `Status: ${response.tenant.subscription_status}\n` +
          `Framework: ${response.framework_subscribed ? 'Subscribed' : 'Pending'}`
        );

        await fetchData();
        handleActivateModalClose();
      } else {
        alert(`❌ Activation failed: ${response.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error activating tenant:', err);
      alert('Failed to activate tenant. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================================
  // SUSPEND TENANT
  // ============================================================================

  const handleSuspendTenant = (tenant) => {
    setSelectedTenant(tenant);
    setSuspendAction('suspend');
    setIsSuspendModalOpen(true);
  };

  const handleSuspendConfirm = async (reason) => {
    try {
      const response = await tenantAPI.suspend(selectedTenant.tenant_slug);

      if (response.success) {
        alert(`✅ Tenant "${response.tenant_slug}" suspended successfully!`);
        await fetchData();
        setIsSuspendModalOpen(false);
        setSelectedTenant(null);
      } else {
        alert(`❌ Failed to suspend tenant: ${response.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error suspending tenant:', err);
      alert('Failed to suspend tenant. Please try again.');
    }
  };

  // ============================================================================
  // REACTIVATE TENANT
  // ============================================================================

  const handleReactivateTenant = (tenant) => {
    setSelectedTenant(tenant);
    setSuspendAction('reactivate');
    setIsSuspendModalOpen(true);
  };

  const handleReactivateConfirm = async () => {
    try {
      const response = await tenantAPI.reactivate(selectedTenant.tenant_slug);

      if (response.success) {
        alert(`✅ Tenant "${response.tenant_slug}" reactivated successfully!`);
        await fetchData();
        setIsSuspendModalOpen(false);
        setSelectedTenant(null);
      } else {
        alert(`❌ Failed to reactivate tenant: ${response.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error reactivating tenant:', err);
      alert('Failed to reactivate tenant. Please try again.');
    }
  };

  // ============================================================================
  // DELETE PENDING TENANT
  // ============================================================================

  const handleDeletePendingTenant = (tenant) => {
    setSelectedTenant(tenant);
    setSuspendAction('delete');
    setIsSuspendModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await tenantAPI.deletePending(selectedTenant.tenant_slug);

      if (response.success) {
        alert(`✅ Tenant "${response.tenant_slug}" deleted successfully!`);
        await fetchData();
        setIsSuspendModalOpen(false);
        setSelectedTenant(null);
      } else {
        alert(`❌ Failed to delete tenant: ${response.error || 'Unknown error'}`);
      }

    } catch (err) {
      console.error('Error deleting tenant:', err);
      alert('Failed to delete tenant. Please try again.');
    }
  };

  const handleSuspendModalConfirm = async (reason) => {
    switch (suspendAction) {
      case 'suspend':
        await handleSuspendConfirm(reason);
        break;
      case 'reactivate':
        await handleReactivateConfirm();
        break;
      case 'delete':
        await handleDeleteConfirm();
        break;
      default:
        break;
    }
  };

  // ============================================================================
  // FILTERING
  // ============================================================================

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = 
      tenant.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.tenant_slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.company_email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filterStatus || tenant.subscription_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ============================================================================
  // STATISTICS
  // ============================================================================

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.subscription_status === 'ACTIVE').length,
    pending: tenants.filter(t => t.subscription_status === 'PENDING_PAYMENT').length,
    suspended: tenants.filter(t => t.subscription_status === 'SUSPENDED').length,
    totalUsers: tenants.reduce((sum, t) => sum + (t.current_user_count || 0), 0),
    totalFrameworks: tenants.reduce((sum, t) => sum + (t.current_framework_count || 0), 0)
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="tenants-dashboard">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading tenants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tenants-dashboard">
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
    <div className="tenants-dashboard">
      <BreadcrumbNav items={breadcrumbItems} />

      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Tenants Dashboard</h1>
          <p className="view-subtitle">Manage all tenant organizations and subscriptions</p>
        </div>
        <div className="header-actions">
          <button 
            className="secondary-btn"
            onClick={() => navigate('/admin/plans')}
          >
            <i className="fas fa-tag"></i>
            Manage Plans
          </button>
          <button 
            className="create-btn" 
            onClick={handleCreateTenant}
            disabled={actionLoading}
          >
            <i className="fas fa-plus"></i>
            Create Tenant
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stats-grid-6">
        <TenantStatsCard
          icon="fa-building"
          label="Total Tenants"
          value={stats.total}
          color="blue"
        />
        <TenantStatsCard
          icon="fa-check-circle"
          label="Active"
          value={stats.active}
          color="green"
        />
        <TenantStatsCard
          icon="fa-clock"
          label="Pending"
          value={stats.pending}
          color="orange"
        />
        <TenantStatsCard
          icon="fa-pause-circle"
          label="Suspended"
          value={stats.suspended}
          color="red"
        />
        <TenantStatsCard
          icon="fa-users"
          label="Total Users"
          value={stats.totalUsers}
          color="purple"
        />
        <TenantStatsCard
          icon="fa-shield-halved"
          label="Total Frameworks"
          value={stats.totalFrameworks}
          color="teal"
        />
      </div>

      {/* Search & View Toggle */}
      <div className="search-view-container">
        <SearchBar
          placeholder="Search tenants by name, slug, or email..."
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={statusFilters}
        />

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      {/* Tenants Display */}
      {filteredTenants.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="tenants-grid">
            {filteredTenants.map(tenant => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                onActivate={tenant.subscription_status === 'PENDING_PAYMENT' ? handleActivateTenant : null}
                onSuspend={tenant.subscription_status === 'ACTIVE' ? handleSuspendTenant : null}
                onReactivate={tenant.subscription_status === 'SUSPENDED' ? handleReactivateTenant : null}
                onDelete={tenant.subscription_status === 'PENDING_PAYMENT' ? handleDeletePendingTenant : null}
              />
            ))}
          </div>
        ) : (
          <div className="table-container">
            <table className="tenants-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Slug</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Users</th>
                  <th>Frameworks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map(tenant => (
                  <tr 
                    key={tenant.id}
                    onClick={() => navigate(`/admin/tenants/${tenant.tenant_slug}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div className="table-tenant-info">
                        <strong>{tenant.company_name}</strong>
                        <small>{tenant.company_email}</small>
                      </div>
                    </td>
                    <td>
                      <span className="table-slug">@{tenant.tenant_slug}</span>
                    </td>
                    <td>{tenant.subscription_plan?.name || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${tenant.subscription_status.toLowerCase()}`}>
                        {tenant.subscription_status}
                      </span>
                    </td>
                    <td>{tenant.current_user_count}</td>
                    <td>{tenant.current_framework_count}</td>
                    <td>{new Date(tenant.created_at).toLocaleDateString()}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="table-actions">
                        <button
                          className="icon-btn view-btn"
                          onClick={() => navigate(`/admin/tenants/${tenant.tenant_slug}`)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <EmptyState
          icon="fa-building"
          title="No tenants found"
          description={searchQuery || filterStatus 
            ? "Try adjusting your search or filter criteria" 
            : "Get started by creating your first tenant organization"}
          actionLabel={!searchQuery && !filterStatus ? "Create Tenant" : undefined}
          onAction={!searchQuery && !filterStatus ? handleCreateTenant : undefined}
        />
      )}

      {/* Modals */}
      <CreateTenantModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSubmit={handleCreateModalSubmit}
        plans={plans}
      />

      <ActivateTenantModal
        isOpen={isActivateModalOpen}
        onClose={handleActivateModalClose}
        onSubmit={handleActivateModalSubmit}
        tenant={selectedTenant}
        frameworks={frameworks}
      />

      <SuspendTenantModal
        isOpen={isSuspendModalOpen}
        onClose={() => {
          setIsSuspendModalOpen(false);
          setSelectedTenant(null);
        }}
        onConfirm={handleSuspendModalConfirm}
        tenant={selectedTenant}
        action={suspendAction}
      />
    </div>
  );
};

export default TenantsDashboard;
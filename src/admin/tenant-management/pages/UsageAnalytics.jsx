// src/admin/pages/UsageAnalytics.jsx
import React, { useState, useEffect } from 'react';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import TenantStatsCard from '../components/TenantStatsCard';
import { usageLogAPI, tenantAPI } from '../../../services/tenantService';
import '../styles/TenantManagement.css';

const UsageAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, all

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Usage Analytics', icon: 'fa-chart-line' }
  ];

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch usage summary
      const summaryResponse = await usageLogAPI.getSummary();
      setSummary(summaryResponse);

      // Fetch all tenants for analysis
      const tenantsResponse = await tenantAPI.getAll();
      const tenantsArray = Array.isArray(tenantsResponse) 
        ? tenantsResponse 
        : tenantsResponse?.results || [];
      setTenants(tenantsArray);

      // Fetch recent usage logs
      const logsResponse = await usageLogAPI.getAll();
      const logsArray = Array.isArray(logsResponse) 
        ? logsResponse 
        : logsResponse?.results || [];
      setRecentLogs(logsArray.slice(0, 10));

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTopTenants = (metric) => {
    return [...tenants]
      .sort((a, b) => b[metric] - a[metric])
      .slice(0, 5);
  };

  const calculateGrowth = () => {
    // Mock growth calculation - in real app, compare with previous period
    return {
      users: 12.5,
      frameworks: 8.3,
      storage: 15.7
    };
  };

  if (loading) {
    return (
      <div className="usage-analytics">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="usage-analytics">
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

  const growth = calculateGrowth();
  const topByUsers = getTopTenants('current_user_count');
  const topByFrameworks = getTopTenants('current_framework_count');
  const topByStorage = getTopTenants('storage_used_gb');

  return (
    <div className="usage-analytics">
      <BreadcrumbNav items={breadcrumbItems} />

      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Usage Analytics</h1>
          <p className="view-subtitle">Platform-wide usage statistics and trends</p>
        </div>
        <div className="header-actions">
          <select 
            className="time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          <button className="secondary-btn" onClick={fetchData}>
            <i className="fas fa-sync"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="stats-grid stats-grid-4">
        <TenantStatsCard
          icon="fa-users"
          label="Total Users"
          value={summary?.total_users || 0}
          trend={growth.users}
          color="blue"
        />
        <TenantStatsCard
          icon="fa-shield-halved"
          label="Total Frameworks"
          value={summary?.total_frameworks || 0}
          trend={growth.frameworks}
          color="teal"
        />
        <TenantStatsCard
          icon="fa-list-check"
          label="Total Controls"
          value={summary?.total_controls || 0}
          color="purple"
        />
        <TenantStatsCard
          icon="fa-database"
          label="Total Storage"
          value={`${(summary?.total_storage_gb || 0).toFixed(1)} GB`}
          trend={growth.storage}
          color="orange"
        />
      </div>

      {/* Top Tenants Sections */}
      <div className="analytics-sections">
        {/* Top by Users */}
        <section className="analytics-section">
          <h3 className="section-heading">
            <i className="fas fa-users"></i>
            Top Tenants by Users
          </h3>
          <div className="top-tenants-list">
            {topByUsers.map((tenant, index) => (
              <div key={tenant.id} className="top-tenant-item">
                <div className="tenant-rank">#{index + 1}</div>
                <div className="tenant-info">
                  <h4>{tenant.company_name}</h4>
                  <span className="tenant-slug">@{tenant.tenant_slug}</span>
                </div>
                <div className="tenant-metric">
                  <span className="metric-value">{tenant.current_user_count}</span>
                  <span className="metric-label">users</span>
                </div>
                <div className="tenant-usage-bar">
                  <div 
                    className="usage-bar-fill"
                    style={{ 
                      width: `${tenant.subscription_plan?.max_users > 0 
                        ? Math.min((tenant.current_user_count / tenant.subscription_plan.max_users) * 100, 100)
                        : 50}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top by Frameworks */}
        <section className="analytics-section">
          <h3 className="section-heading">
            <i className="fas fa-shield-halved"></i>
            Top Tenants by Frameworks
          </h3>
          <div className="top-tenants-list">
            {topByFrameworks.map((tenant, index) => (
              <div key={tenant.id} className="top-tenant-item">
                <div className="tenant-rank rank-teal">#{index + 1}</div>
                <div className="tenant-info">
                  <h4>{tenant.company_name}</h4>
                  <span className="tenant-slug">@{tenant.tenant_slug}</span>
                </div>
                <div className="tenant-metric">
                  <span className="metric-value">{tenant.current_framework_count}</span>
                  <span className="metric-label">frameworks</span>
                </div>
                <div className="tenant-usage-bar">
                  <div 
                    className="usage-bar-fill bar-teal"
                    style={{ 
                      width: `${tenant.subscription_plan?.max_frameworks > 0 
                        ? Math.min((tenant.current_framework_count / tenant.subscription_plan.max_frameworks) * 100, 100)
                        : 50}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top by Storage */}
        <section className="analytics-section">
          <h3 className="section-heading">
            <i className="fas fa-database"></i>
            Top Tenants by Storage
          </h3>
          <div className="top-tenants-list">
            {topByStorage.map((tenant, index) => (
              <div key={tenant.id} className="top-tenant-item">
                <div className="tenant-rank rank-orange">#{index + 1}</div>
                <div className="tenant-info">
                  <h4>{tenant.company_name}</h4>
                  <span className="tenant-slug">@{tenant.tenant_slug}</span>
                </div>
                <div className="tenant-metric">
                  <span className="metric-value">{parseFloat(tenant.storage_used_gb).toFixed(1)}</span>
                  <span className="metric-label">GB</span>
                </div>
                <div className="tenant-usage-bar">
                  <div 
                    className="usage-bar-fill bar-orange"
                    style={{ 
                      width: `${tenant.subscription_plan?.storage_gb > 0 
                        ? Math.min((parseFloat(tenant.storage_used_gb) / tenant.subscription_plan.storage_gb) * 100, 100)
                        : 50}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Subscription Distribution */}
      <section className="analytics-section full-width">
        <h3 className="section-heading">
          <i className="fas fa-tag"></i>
          Subscription Plan Distribution
        </h3>
        <div className="plan-distribution">
          {(() => {
            const planCounts = {};
            tenants.forEach(t => {
              const planName = t.subscription_plan?.name || 'Unknown';
              planCounts[planName] = (planCounts[planName] || 0) + 1;
            });

            return Object.entries(planCounts).map(([plan, count]) => {
              const percentage = ((count / tenants.length) * 100).toFixed(1);
              return (
                <div key={plan} className="plan-distribution-item">
                  <div className="plan-distribution-header">
                    <span className="plan-name">{plan}</span>
                    <span className="plan-count">{count} tenants ({percentage}%)</span>
                  </div>
                  <div className="plan-distribution-bar">
                    <div 
                      className="plan-bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* Tenant Status Overview */}
      <section className="analytics-section full-width">
        <h3 className="section-heading">
          <i className="fas fa-chart-pie"></i>
          Tenant Status Overview
        </h3>
        <div className="status-overview">
          {(() => {
            const statusCounts = {
              ACTIVE: 0,
              PENDING_PAYMENT: 0,
              SUSPENDED: 0,
              CANCELLED: 0,
              EXPIRED: 0
            };

            tenants.forEach(t => {
              if (statusCounts[t.subscription_status] !== undefined) {
                statusCounts[t.subscription_status]++;
              }
            });

            return Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="status-card">
                <div className={`status-icon status-${status.toLowerCase()}`}>
                  <i className="fas fa-circle"></i>
                </div>
                <div className="status-info">
                  <span className="status-count">{count}</span>
                  <span className="status-label">{status.replace('_', ' ')}</span>
                </div>
              </div>
            ));
          })()}
        </div>
      </section>
    </div>
  );
};

export default UsageAnalytics;
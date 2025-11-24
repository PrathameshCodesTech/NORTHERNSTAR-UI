// src/tenant/dashboard/TenantAdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import './TenantDashboard.css';

const TenantAdminDashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  // Mock data for Tenant Admin
  const dashboardData = {
    stats: {
      totalFrameworks: 3,
      teamMembers: 45,
      complianceScore: 78,
      monthlyCost: 599
    },
    frameworks: [
      { name: 'ISO 27001', progress: 78, controls: '89/114', status: 'active' },
      { name: 'GDPR', progress: 85, controls: '34/40', status: 'active' },
      { name: 'SOX', progress: 65, controls: '26/40', status: 'active' }
    ],
    teamBreakdown: [
      { role: 'Compliance Managers', count: 2 },
      { role: 'Managers', count: 8 },
      { role: 'Employees', count: 32 },
      { role: 'Auditors', count: 3 }
    ],
    subscription: {
      plan: 'Professional Plan',
      nextBilling: '2025-12-15',
      amount: '$599.00',
      status: 'Active'
    },
    recentActivity: [
      {
        id: 1,
        type: 'team',
        title: 'New team member added: Mike Chen (Manager)',
        time: '2 hours ago',
        icon: 'fa-user-plus',
        color: '#3b82f6'
      },
      {
        id: 2,
        type: 'framework',
        title: 'SOX framework subscribed',
        time: '1 day ago',
        icon: 'fa-shield-halved',
        color: '#f59e0b'
      },
      {
        id: 3,
        type: 'compliance',
        title: 'ISO 27001 compliance increased to 78%',
        time: '2 days ago',
        icon: 'fa-chart-line',
        color: '#10b981'
      },
      {
        id: 4,
        type: 'billing',
        title: 'Payment processed successfully: $599.00',
        time: '15 days ago',
        icon: 'fa-credit-card',
        color: '#8b5cf6'
      }
    ]
  };

  return (
    <div className="tenant-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Company Overview</h1>
          <p className="header-subtitle">Welcome back, {currentUser.name} 👋</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon="fa-shield-halved"
            title="Active Frameworks"
            value={dashboardData.stats.totalFrameworks}
            subtitle="Subscriptions"
            color="#3b82f6"
            onClick={() => navigate('/app/settings/frameworks')}
          />
          <StatCard
            icon="fa-users"
            title="Team Members"
            value={dashboardData.stats.teamMembers}
            subtitle="Across all roles"
            color="#10b981"
            onClick={() => navigate('/app/settings/users')}
          />
          <StatCard
            icon="fa-chart-line"
            title="Compliance Score"
            value={`${dashboardData.stats.complianceScore}%`}
            change="+5% this month"
            changeType="positive"
            color="#8b5cf6"
          />
          <StatCard
            icon="fa-credit-card"
            title="Monthly Cost"
            value={`$${dashboardData.stats.monthlyCost}`}
            subtitle={dashboardData.subscription.plan}
            color="#f59e0b"
            onClick={() => navigate('/app/settings/subscription')}
          />
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Frameworks Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Framework Status</h2>
              <button className="view-all-btn" onClick={() => navigate('/app/frameworks')}>
                View All <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="frameworks-list">
              {dashboardData.frameworks.map((framework, index) => (
                <div key={index} className="framework-item">
                  <div className="framework-info">
                    <div className="framework-name">{framework.name}</div>
                    <div className="framework-controls">{framework.controls} controls</div>
                  </div>
                  <div className="framework-progress-section">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${framework.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{framework.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Subscription Details</h2>
              <button className="view-all-btn" onClick={() => navigate('/app/settings/subscription')}>
                Manage <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="subscription-details">
              <div className="subscription-item">
                <span className="subscription-label">Current Plan</span>
                <span className="subscription-value">{dashboardData.subscription.plan}</span>
              </div>
              <div className="subscription-item">
                <span className="subscription-label">Status</span>
                <span className="status-badge status-active">{dashboardData.subscription.status}</span>
              </div>
              <div className="subscription-item">
                <span className="subscription-label">Next Billing</span>
                <span className="subscription-value">{dashboardData.subscription.nextBilling}</span>
              </div>
              <div className="subscription-item">
                <span className="subscription-label">Amount</span>
                <span className="subscription-value subscription-amount">{dashboardData.subscription.amount}</span>
              </div>
            </div>

            {/* Team Breakdown */}
            <div className="team-breakdown">
              <h3>Team Breakdown</h3>
              <div className="team-roles-list">
                {dashboardData.teamBreakdown.map((role, index) => (
                  <div key={index} className="team-role-item">
                    <span className="role-name">{role.role}</span>
                    <span className="role-count">{role.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Company Activity</h2>
            <button className="view-all-btn" onClick={() => navigate('/app/audit-trail')}>
              View All <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="activity-list">
            {dashboardData.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: `${activity.color}15` }}>
                  <i className={`fas ${activity.icon}`} style={{ color: activity.color }}></i>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-card" onClick={() => navigate('/app/settings/users')}>
              <i className="fas fa-user-plus"></i>
              <span>Invite Team Member</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/settings/frameworks')}>
              <i className="fas fa-shield-halved"></i>
              <span>Subscribe Framework</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/reports')}>
              <i className="fas fa-file-alt"></i>
              <span>Generate Report</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/settings/subscription')}>
              <i className="fas fa-credit-card"></i>
              <span>Manage Billing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantAdminDashboard;
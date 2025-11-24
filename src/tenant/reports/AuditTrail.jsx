// src/tenant/reports/AuditTrail.jsx
import React, { useState } from 'react';
import EmptyState from '../components/EmptyState';
import './Reports.css';

const AuditTrail = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [filterDate, setFilterDate] = useState('last30');

  // Mock data
  const activities = [
    {
      id: 'act1',
      action: 'control_assigned',
      description: 'Assigned control AC-001 to Mike Smith',
      user: 'Sarah Chen',
      user_role: 'COMPLIANCE_MANAGER',
      timestamp: '2025-11-23T14:30:00',
      icon: 'fa-tasks',
      color: '#3b82f6',
      details: {
        control: 'AC-001: Multi-Factor Authentication',
        framework: 'ISO 27001',
        assignee: 'Mike Smith'
      }
    },
    {
      id: 'act2',
      action: 'evidence_uploaded',
      description: 'Uploaded evidence for control PR-002',
      user: 'John Doe',
      user_role: 'EMPLOYEE',
      timestamp: '2025-11-23T13:15:00',
      icon: 'fa-file-upload',
      color: '#10b981',
      details: {
        control: 'PR-002: Privacy Impact Assessment',
        framework: 'GDPR',
        files: 2
      }
    },
    {
      id: 'act3',
      action: 'approval_granted',
      description: 'Approved assignment submission for FIN-005',
      user: 'Emily Johnson',
      user_role: 'MANAGER',
      timestamp: '2025-11-23T11:45:00',
      icon: 'fa-check-circle',
      color: '#10b981',
      details: {
        control: 'FIN-005: Financial Controls Documentation',
        framework: 'SOX',
        approved_for: 'John Doe'
      }
    },
    {
      id: 'act4',
      action: 'user_invited',
      description: 'Invited new team member',
      user: 'You',
      user_role: 'TENANT_ADMIN',
      timestamp: '2025-11-23T10:20:00',
      icon: 'fa-user-plus',
      color: '#8b5cf6',
      details: {
        email: 'newuser@acmecorp.com',
        role: 'EMPLOYEE'
      }
    },
    {
      id: 'act5',
      action: 'assessment_submitted',
      description: 'Submitted assessment for control AC-008',
      user: 'Mike Smith',
      user_role: 'EMPLOYEE',
      timestamp: '2025-11-22T16:30:00',
      icon: 'fa-clipboard-check',
      color: '#f59e0b',
      details: {
        control: 'AC-008: Access Control Policy',
        framework: 'ISO 27001',
        questions: 5
      }
    },
    {
      id: 'act6',
      action: 'framework_subscribed',
      description: 'Added GDPR framework to subscription',
      user: 'You',
      user_role: 'TENANT_ADMIN',
      timestamp: '2025-11-22T14:00:00',
      icon: 'fa-shield-halved',
      color: '#10b981',
      details: {
        framework: 'GDPR',
        controls: 99
      }
    },
    {
      id: 'act7',
      action: 'evidence_verified',
      description: 'Verified evidence for control AC-001',
      user: 'Sarah Chen',
      user_role: 'COMPLIANCE_MANAGER',
      timestamp: '2025-11-22T11:20:00',
      icon: 'fa-check-double',
      color: '#10b981',
      details: {
        control: 'AC-001: Multi-Factor Authentication',
        framework: 'ISO 27001',
        verified_for: 'Mike Smith'
      }
    },
    {
      id: 'act8',
      action: 'report_generated',
      description: 'Generated Compliance Summary Report',
      user: 'You',
      user_role: 'TENANT_ADMIN',
      timestamp: '2025-11-21T15:45:00',
      icon: 'fa-file-chart',
      color: '#06b6d4',
      details: {
        report: 'Compliance Summary',
        framework: 'All Frameworks',
        format: 'PDF'
      }
    },
    {
      id: 'act9',
      action: 'approval_rejected',
      description: 'Rejected evidence for control FIN-003',
      user: 'Emily Johnson',
      user_role: 'MANAGER',
      timestamp: '2025-11-21T13:10:00',
      icon: 'fa-times-circle',
      color: '#ef4444',
      details: {
        control: 'FIN-003: Financial Reporting',
        framework: 'SOX',
        reason: 'Incomplete documentation'
      }
    },
    {
      id: 'act10',
      action: 'settings_updated',
      description: 'Updated team notification settings',
      user: 'You',
      user_role: 'TENANT_ADMIN',
      timestamp: '2025-11-21T10:00:00',
      icon: 'fa-cog',
      color: '#6b7280',
      details: {
        changed: 'Email notifications',
        value: 'Enabled'
      }
    }
  ];

  const users = ['You', 'Sarah Chen', 'Mike Smith', 'John Doe', 'Emily Johnson'];
  const actionTypes = [
    { value: 'control_assigned', label: 'Control Assigned' },
    { value: 'evidence_uploaded', label: 'Evidence Uploaded' },
    { value: 'approval_granted', label: 'Approval Granted' },
    { value: 'approval_rejected', label: 'Approval Rejected' },
    { value: 'assessment_submitted', label: 'Assessment Submitted' },
    { value: 'user_invited', label: 'User Invited' },
    { value: 'framework_subscribed', label: 'Framework Subscribed' },
    { value: 'report_generated', label: 'Report Generated' },
    { value: 'settings_updated', label: 'Settings Updated' }
  ];

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUser = filterUser === 'all' || activity.user === filterUser;
    const matchesAction = filterAction === 'all' || activity.action === filterAction;
    return matchesSearch && matchesUser && matchesAction;
  });

  const stats = {
    today: activities.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.timestamp).toDateString() === today;
    }).length,
    this_week: activities.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.timestamp) > weekAgo;
    }).length,
    total: activities.length
  };

  return (
    <div className="audit-trail-page">
      {/* Clean Page Header */}
      <div className="page-header-reports">
        <div className="header-content">
          <div className="header-left">
            <h1>Audit Trail</h1>
            <p className="header-subtitle">
              Track all system activities and user actions
            </p>
          </div>
          <button className="export-logs-btn">
            <i className="fas fa-download"></i>
            Export Logs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="audit-content">
        {/* Stats */}
        <div className="audit-stats-grid">
          <div className="stat-card-small">
            <i className="fas fa-calendar-day" style={{ color: '#3b82f6' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.today}</span>
              <span className="stat-label">Today</span>
            </div>
          </div>
          <div className="stat-card-small">
            <i className="fas fa-calendar-week" style={{ color: '#10b981' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.this_week}</span>
              <span className="stat-label">This Week</span>
            </div>
          </div>
          <div className="stat-card-small">
            <i className="fas fa-history" style={{ color: '#f59e0b' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Activities</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="audit-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>User:</label>
            <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Action:</label>
            <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
              <option value="all">All Actions</option>
              {actionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Period:</label>
            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
              <option value="today">Today</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        {filteredActivities.length > 0 ? (
          <div className="audit-timeline">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-connector">
                  <div 
                    className="timeline-icon"
                    style={{ backgroundColor: activity.color }}
                  >
                    <i className={`fas ${activity.icon}`}></i>
                  </div>
                  {index < filteredActivities.length - 1 && <div className="timeline-line"></div>}
                </div>

                <div className="timeline-content">
                  <div className="timeline-header">
                    <div className="header-left">
                      <h3 className="activity-description">{activity.description}</h3>
                      <div className="activity-meta">
                        <span className="user-name">
                          <i className="fas fa-user"></i>
                          {activity.user}
                        </span>
                        <span className="user-role">({activity.user_role.replace('_', ' ')})</span>
                        <span className="timestamp">
                          <i className="fas fa-clock"></i>
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {activity.details && (
                    <div className="activity-details">
                      {Object.entries(activity.details).map(([key, value]) => (
                        <div key={key} className="detail-row">
                          <span className="detail-key">{key.replace('_', ' ')}:</span>
                          <span className="detail-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="fa-history"
            title="No activities found"
            description="Try adjusting your search or filter criteria"
          />
        )}
      </div>
    </div>
  );
};

export default AuditTrail;

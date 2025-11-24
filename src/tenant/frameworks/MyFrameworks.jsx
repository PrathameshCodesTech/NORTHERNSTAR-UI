// src/tenant/frameworks/MyFrameworks.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import './Frameworks.css';

const MyFrameworks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const frameworks = [
    {
      id: 'iso27001',
      name: 'ISO 27001',
      code: 'ISO27001',
      description: 'Information Security Management System',
      version: '2022',
      status: 'active',
      subscribed_date: '2025-01-15',
      icon: 'fa-shield-halved',
      color: '#3b82f6',
      stats: {
        total_controls: 114,
        assigned_controls: 45,
        completed_controls: 32,
        compliance_score: 71
      },
      domains: 4,
      recent_activity: 'Updated 2 hours ago'
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      code: 'GDPR',
      description: 'General Data Protection Regulation',
      version: '2018',
      status: 'in-progress',
      subscribed_date: '2025-01-20',
      icon: 'fa-user-shield',
      color: '#10b981',
      stats: {
        total_controls: 99,
        assigned_controls: 28,
        completed_controls: 15,
        compliance_score: 54
      },
      domains: 3,
      recent_activity: 'Updated 5 hours ago'
    },
    {
      id: 'sox',
      name: 'SOX',
      code: 'SOX',
      description: 'Sarbanes-Oxley Act - Financial Compliance',
      version: '2002',
      status: 'active',
      subscribed_date: '2025-02-01',
      icon: 'fa-file-invoice-dollar',
      color: '#f59e0b',
      stats: {
        total_controls: 68,
        assigned_controls: 52,
        completed_controls: 48,
        compliance_score: 92
      },
      domains: 2,
      recent_activity: 'Updated 1 day ago'
    }
  ];

  const filteredFrameworks = frameworks.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: '#d1fae5', color: '#065f46', label: 'Active', icon: 'fa-check-circle' },
      'in-progress': { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: 'fa-clock' },
      paused: { bg: '#f3f4f6', color: '#4b5563', label: 'Paused', icon: 'fa-pause-circle' }
    };
    return styles[status] || styles.active;
  };

  const getComplianceColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const totalControls = frameworks.reduce((sum, f) => sum + f.stats.total_controls, 0);

  return (
    <div className="my-frameworks-page">
      {/* Clean Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-header-left">
            <h1>My Frameworks</h1>
            <p className="page-header-subtitle">
              Manage and monitor your compliance frameworks
            </p>
          </div>
          <div className="page-header-stats">
            <div className="header-stat-item">
              <span className="header-stat-value">{frameworks.length}</span>
              <span className="header-stat-label">Active</span>
            </div>
            <div className="header-stat-item">
              <span className="header-stat-value">{totalControls}</span>
              <span className="header-stat-label">Controls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="frameworks-content">
        {/* Filters */}
        <div className="frameworks-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              <i className="fas fa-check-circle"></i>
              Active
            </button>
            <button
              className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilterStatus('in-progress')}
            >
              <i className="fas fa-clock"></i>
              In Progress
            </button>
          </div>
        </div>

        {/* Frameworks Grid */}
        {filteredFrameworks.length > 0 ? (
          <div className="frameworks-grid">
            {filteredFrameworks.map(framework => {
              const statusStyle = getStatusBadge(framework.status);
              const progressPercent = Math.round((framework.stats.completed_controls / framework.stats.total_controls) * 100);
              
              return (
                <div
                  key={framework.id}
                  className="framework-card"
                  onClick={() => navigate(`/app/frameworks/${framework.id}`)}
                >
                  {/* Header */}
                  <div className="framework-card-header">
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                    >
                      <i className={`fas ${statusStyle.icon}`}></i>
                      {statusStyle.label}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="framework-info">
                    <h3 className="framework-name">{framework.name}</h3>
                    <p className="framework-code">{framework.code} v{framework.version}</p>
                    <p className="framework-description">{framework.description}</p>
                  </div>

                  {/* Progress */}
                  <div className="framework-progress-section">
                    <div className="progress-header">
                      <span className="progress-label">Progress</span>
                      <span className="progress-percent">{progressPercent}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="progress-stats">
                      <span>{framework.stats.completed_controls} / {framework.stats.total_controls} completed</span>
                      <span>{framework.stats.assigned_controls} assigned</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="framework-stats-grid">
                    <div className="stat-item">
                      <i className="fas fa-layer-group"></i>
                      <div className="stat-content">
                        <span className="stat-value">{framework.domains}</span>
                        <span className="stat-label">Domains</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-chart-line"></i>
                      <div className="stat-content">
                        <span 
                          className="stat-value"
                          style={{ color: getComplianceColor(framework.stats.compliance_score) }}
                        >
                          {framework.stats.compliance_score}%
                        </span>
                        <span className="stat-label">Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="framework-card-footer">
                    <span className="recent-activity">
                      <i className="fas fa-clock"></i>
                      {framework.recent_activity}
                    </span>
                    <button className="view-details-btn">
                      View Details
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="fa-search"
            title="No frameworks found"
            description="Try adjusting your search or filter criteria"
          />
        )}
      </div>
    </div>
  );
};

export default MyFrameworks;
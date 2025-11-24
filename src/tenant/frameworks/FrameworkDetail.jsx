// src/tenant/frameworks/FrameworkDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Frameworks.css';

const FrameworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedDomains, setExpandedDomains] = useState({});
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock framework data
  const framework = {
    id: 'iso27001',
    name: 'ISO 27001',
    code: 'ISO27001',
    description: 'Information Security Management System - International standard for managing information security',
    version: '2022',
    status: 'active',
    icon: 'fa-shield-halved',
    color: '#3b82f6',
    subscribed_date: '2025-01-15',
    stats: {
      total_controls: 114,
      assigned_controls: 45,
      completed_controls: 32,
      in_progress: 13,
      not_started: 69,
      compliance_score: 71
    },
    domains: [
      {
        id: 'd1',
        name: 'Organizational Controls',
        control_count: 37,
        completed: 15,
        categories: [
          {
            id: 'c1',
            name: 'Information Security Policies',
            control_count: 2,
            controls: [
              { id: 'ctrl1', code: 'A.5.1', title: 'Policies for information security', status: 'completed' },
              { id: 'ctrl2', code: 'A.5.2', title: 'Information security roles', status: 'in-progress' }
            ]
          },
          {
            id: 'c2',
            name: 'Access Control',
            control_count: 8,
            controls: [
              { id: 'ctrl3', code: 'A.5.15', title: 'Access control policy', status: 'completed' },
              { id: 'ctrl4', code: 'A.5.16', title: 'Identity management', status: 'not-started' }
            ]
          }
        ]
      },
      {
        id: 'd2',
        name: 'People Controls',
        control_count: 8,
        completed: 5,
        categories: [
          {
            id: 'c3',
            name: 'Human Resource Security',
            control_count: 6,
            controls: [
              { id: 'ctrl5', code: 'A.6.1', title: 'Screening', status: 'completed' },
              { id: 'ctrl6', code: 'A.6.2', title: 'Terms and conditions', status: 'completed' }
            ]
          }
        ]
      },
      {
        id: 'd3',
        name: 'Physical Controls',
        control_count: 14,
        completed: 6,
        categories: []
      },
      {
        id: 'd4',
        name: 'Technological Controls',
        control_count: 55,
        completed: 6,
        categories: []
      }
    ]
  };

  const toggleDomain = (domainId) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: !prev[domainId]
    }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: { bg: '#d1fae5', color: '#065f46', label: 'Completed', icon: 'fa-check-circle' },
      'in-progress': { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: 'fa-clock' },
      'not-started': { bg: '#f3f4f6', color: '#6b7280', label: 'Not Started', icon: 'fa-circle' }
    };
    return styles[status] || styles['not-started'];
  };

  const progressPercent = Math.round((framework.stats.completed_controls / framework.stats.total_controls) * 100);

  return (
    <div className="framework-detail-page">
      {/* Clean Page Header */}
      <div className="detail-page-header">
        <div className="page-header-content">
          <button className="back-button" onClick={() => navigate('/app/frameworks')}>
            <i className="fas fa-arrow-left"></i>
            Back to Frameworks
          </button>
          
          <div className="framework-title-row">
            <div className="framework-icon-large" style={{ backgroundColor: framework.color }}>
              <i className={`fas ${framework.icon}`}></i>
            </div>
            <div className="framework-title-info">
              <h1>{framework.name}</h1>
              <p className="framework-version-text">{framework.code} v{framework.version}</p>
              <p className="framework-description-text">{framework.description}</p>
            </div>
          </div>

          <div className="detail-header-stats">
            <div className="detail-stat-box">
              <span className="detail-stat-num">{framework.stats.total_controls}</span>
              <span className="detail-stat-label">Total Controls</span>
            </div>
            <div className="detail-stat-box">
              <span className="detail-stat-num">{framework.stats.completed_controls}</span>
              <span className="detail-stat-label">Completed</span>
            </div>
            <div className="detail-stat-box">
              <span className="detail-stat-num">{framework.stats.compliance_score}%</span>
              <span className="detail-stat-label">Compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Tabs */}
        <div className="detail-tabs">
          <button
            className={`tab-btn ${selectedTab === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            <i className="fas fa-chart-pie"></i>
            Overview
          </button>
          <button
            className={`tab-btn ${selectedTab === 'structure' ? 'active' : ''}`}
            onClick={() => setSelectedTab('structure')}
          >
            <i className="fas fa-sitemap"></i>
            Framework Structure
          </button>
          <button
            className={`tab-btn ${selectedTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setSelectedTab('assignments')}
          >
            <i className="fas fa-tasks"></i>
            Assignments
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="tab-content">
            {/* Progress Card */}
            <div className="overview-card">
              <h3>
                <i className="fas fa-chart-line" style={{ color: '#14b8a6' }}></i>
                Compliance Progress
              </h3>
              <div className="large-progress">
                <div className="progress-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#14b8a6" 
                      strokeWidth="8"
                      strokeDasharray={`${progressPercent * 2.827} 282.7`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="progress-text">
                    <span className="percent">{progressPercent}%</span>
                    <span className="label">Complete</span>
                  </div>
                </div>
                <div className="progress-breakdown">
                  <div className="breakdown-item">
                    <span className="bullet completed"></span>
                    <span className="count">{framework.stats.completed_controls}</span>
                    <span className="label">Completed</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="bullet in-progress"></span>
                    <span className="count">{framework.stats.in_progress}</span>
                    <span className="label">In Progress</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="bullet not-started"></span>
                    <span className="count">{framework.stats.not_started}</span>
                    <span className="label">Not Started</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Stats */}
            <div className="overview-card">
              <h3>
                <i className="fas fa-layer-group" style={{ color: '#14b8a6' }}></i>
                Domains Overview
              </h3>
              <div className="domains-progress-list">
                {framework.domains.map(domain => {
                  const domainPercent = Math.round((domain.completed / domain.control_count) * 100);
                  return (
                    <div key={domain.id} className="domain-progress-item">
                      <div className="domain-progress-header">
                        <span className="domain-name">{domain.name}</span>
                        <span className="domain-stats">{domain.completed}/{domain.control_count}</span>
                      </div>
                      <div className="domain-progress-bar">
                        <div 
                          className="domain-progress-fill" 
                          style={{ width: `${domainPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'structure' && (
          <div className="tab-content">
            <div className="structure-card">
              <h3>
                <i className="fas fa-sitemap" style={{ color: '#14b8a6' }}></i>
                Framework Structure
              </h3>
              <div className="domains-list">
                {framework.domains.map(domain => (
                  <div key={domain.id} className="domain-block">
                    <div 
                      className="domain-header"
                      onClick={() => toggleDomain(domain.id)}
                    >
                      <div className="domain-left">
                        <i className={`fas fa-chevron-${expandedDomains[domain.id] ? 'down' : 'right'}`}></i>
                        <i className="fas fa-folder"></i>
                        <span className="domain-title">{domain.name}</span>
                      </div>
                      <div className="domain-right">
                        <span className="control-badge">{domain.control_count} controls</span>
                        <span className="completion-badge">{domain.completed} completed</span>
                      </div>
                    </div>

                    {expandedDomains[domain.id] && domain.categories && domain.categories.length > 0 && (
                      <div className="categories-list">
                        {domain.categories.map(category => (
                          <div key={category.id} className="category-block">
                            <div className="category-header">
                              <i className="fas fa-folder-open"></i>
                              <span>{category.name}</span>
                              <span className="count-badge">{category.control_count}</span>
                            </div>
                            <div className="controls-list">
                              {category.controls.map(control => {
                                const statusStyle = getStatusBadge(control.status);
                                return (
                                  <div key={control.id} className="control-item">
                                    <span className="control-code">{control.code}</span>
                                    <span className="control-title">{control.title}</span>
                                    <span 
                                      className="control-status"
                                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                                    >
                                      <i className={`fas ${statusStyle.icon}`}></i>
                                      {statusStyle.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'assignments' && (
          <div className="tab-content">
            <div className="assignments-card">
              <h3>Recent Assignments</h3>
              <p className="placeholder-text">Assignment functionality will be available in MyAssignments page</p>
              <button className="go-to-btn" onClick={() => navigate('/app/assignments')}>
                Go to Assignments
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameworkDetail;
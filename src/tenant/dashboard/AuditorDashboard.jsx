// src/tenant/dashboard/AuditorDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import './TenantDashboard.css';

const AuditorDashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  // Mock data for Auditor (READ-ONLY)
  const dashboardData = {
    stats: {
      totalControls: 114,
      completedVerified: 89,
      pendingVerification: 15,
      complianceScore: 78
    },
    frameworks: [
      { name: 'ISO 27001', completed: 89, total: 114, percentage: 78, status: 'in_progress' },
      { name: 'GDPR', completed: 34, total: 40, percentage: 85, status: 'in_progress' },
      { name: 'SOX', completed: 26, total: 40, percentage: 65, status: 'in_progress' }
    ],
    completedControls: [
      {
        id: 1,
        control: 'AC-001',
        title: 'Multi-Factor Authentication',
        framework: 'ISO 27001',
        completedBy: 'John Doe',
        completedDate: '2025-11-20',
        evidenceCount: 3,
        verificationStatus: 'verified'
      },
      {
        id: 2,
        control: 'AC-005',
        title: 'Access Control Review',
        framework: 'ISO 27001',
        completedBy: 'Mike Chen',
        completedDate: '2025-11-18',
        evidenceCount: 2,
        verificationStatus: 'verified'
      },
      {
        id: 3,
        control: 'PR-002',
        title: 'Privacy Impact Assessment',
        framework: 'GDPR',
        completedBy: 'Emily Davis',
        completedDate: '2025-11-15',
        evidenceCount: 5,
        verificationStatus: 'verified'
      }
    ],
    pendingVerification: [
      {
        id: 1,
        control: 'AC-008',
        title: 'Network Security Configuration',
        framework: 'ISO 27001',
        submittedBy: 'Sarah Johnson',
        submittedDate: '2025-11-23',
        evidenceCount: 4
      },
      {
        id: 2,
        control: 'FIN-005',
        title: 'Financial Controls Documentation',
        framework: 'SOX',
        submittedBy: 'Tom Wilson',
        submittedDate: '2025-11-22',
        evidenceCount: 3
      }
    ],
    auditTrail: [
      {
        id: 1,
        action: 'Control Completed',
        control: 'AC-001',
        user: 'John Doe',
        timestamp: '2025-11-20 14:30',
        details: 'MFA Implementation completed and submitted'
      },
      {
        id: 2,
        action: 'Evidence Uploaded',
        control: 'AC-005',
        user: 'Mike Chen',
        timestamp: '2025-11-18 10:15',
        details: 'Uploaded 2 evidence files'
      },
      {
        id: 3,
        action: 'Approval',
        control: 'PR-002',
        user: 'Sarah Johnson (Compliance Manager)',
        timestamp: '2025-11-15 16:45',
        details: 'Approved Privacy Impact Assessment'
      }
    ],
    complianceGaps: [
      {
        id: 1,
        category: 'Access Control',
        totalControls: 25,
        completed: 18,
        gap: 7,
        risk: 'medium'
      },
      {
        id: 2,
        category: 'Privacy Controls',
        totalControls: 15,
        completed: 12,
        gap: 3,
        risk: 'low'
      },
      {
        id: 3,
        category: 'Financial Controls',
        totalControls: 20,
        completed: 13,
        gap: 7,
        risk: 'high'
      }
    ]
  };

  const getRiskBadge = (risk) => {
    const badges = {
      high: { label: 'High Risk', class: 'risk-high' },
      medium: { label: 'Medium Risk', class: 'risk-medium' },
      low: { label: 'Low Risk', class: 'risk-low' }
    };
    return badges[risk] || badges.medium;
  };

  return (
    <div className="tenant-dashboard auditor-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Audit Dashboard</h1>
          <p className="header-subtitle">Welcome back, {currentUser.name} 👋</p>
          <div className="auditor-badge">
            <i className="fas fa-eye"></i> Read-Only Access
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/app/reports')}>
            <i className="fas fa-file-alt"></i> Generate Audit Report
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon="fa-tasks"
            title="Total Controls"
            value={dashboardData.stats.totalControls}
            subtitle="Across all frameworks"
            color="#3b82f6"
          />
          <StatCard
            icon="fa-check-circle"
            title="Completed & Verified"
            value={dashboardData.stats.completedVerified}
            subtitle="Ready for audit"
            color="#10b981"
          />
          <StatCard
            icon="fa-clock"
            title="Pending Verification"
            value={dashboardData.stats.pendingVerification}
            subtitle="To review"
            color="#f59e0b"
          />
          <StatCard
            icon="fa-chart-line"
            title="Compliance Score"
            value={`${dashboardData.stats.complianceScore}%`}
            subtitle="Overall readiness"
            color="#8b5cf6"
          />
        </div>

        {/* Framework Compliance Overview */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Framework Compliance Overview</h2>
            <button className="view-all-btn" onClick={() => navigate('/app/frameworks')}>
              View Details <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="frameworks-list">
            {dashboardData.frameworks.map((framework, index) => (
              <div key={index} className="framework-item">
                <div className="framework-info">
                  <div className="framework-name">{framework.name}</div>
                  <div className="framework-controls">{framework.completed}/{framework.total} controls</div>
                </div>
                <div className="framework-progress-section">
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${framework.percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-percentage">{framework.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Completed Controls */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '8px' }}></i>
                Verified Controls
              </h2>
              <button className="view-all-btn" onClick={() => navigate('/app/evidence')}>
                Browse All <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="verified-controls-list">
              {dashboardData.completedControls.map(control => (
                <div key={control.id} className="verified-control-item">
                  <div className="control-badge verified-badge">{control.control}</div>
                  <div className="verified-control-info">
                    <div className="verified-control-title">{control.title}</div>
                    <div className="verified-control-meta">
                      <span className="framework-tag">{control.framework}</span>
                      <span> • By {control.completedBy}</span>
                    </div>
                    <div className="verified-control-evidence">
                      <i className="fas fa-paperclip"></i> {control.evidenceCount} evidence files
                      <button className="btn-view-evidence" onClick={() => navigate('/app/evidence')}>
                        <i className="fas fa-eye"></i> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Verification */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-clock" style={{ color: '#f59e0b', marginRight: '8px' }}></i>
                Pending Verification
              </h2>
            </div>
            <div className="pending-verification-list">
              {dashboardData.pendingVerification.map(item => (
                <div key={item.id} className="pending-verification-item">
                  <div className="control-badge">{item.control}</div>
                  <div className="pending-verification-info">
                    <div className="pending-verification-title">{item.title}</div>
                    <div className="pending-verification-meta">
                      <span className="framework-tag">{item.framework}</span>
                      <span> • {item.submittedDate}</span>
                    </div>
                    <div className="pending-verification-evidence">
                      <i className="fas fa-paperclip"></i> {item.evidenceCount} files to review
                    </div>
                  </div>
                  <button className="btn-review-evidence" onClick={() => navigate('/app/evidence')}>
                    <i className="fas fa-search"></i> Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Gaps Analysis */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Compliance Gaps Analysis</h2>
          </div>
          <div className="compliance-gaps-table">
            <div className="gaps-table-header">
              <div className="gaps-col">Category</div>
              <div className="gaps-col">Total Controls</div>
              <div className="gaps-col">Completed</div>
              <div className="gaps-col">Gap</div>
              <div className="gaps-col">Risk Level</div>
            </div>
            {dashboardData.complianceGaps.map((gap, index) => {
              const riskBadge = getRiskBadge(gap.risk);
              return (
                <div key={index} className="gaps-table-row">
                  <div className="gaps-col gaps-category">{gap.category}</div>
                  <div className="gaps-col">{gap.totalControls}</div>
                  <div className="gaps-col">
                    <span className="gaps-completed">{gap.completed}</span>
                  </div>
                  <div className="gaps-col">
                    <span className="gaps-gap">{gap.gap}</span>
                  </div>
                  <div className="gaps-col">
                    <span className={`risk-badge ${riskBadge.class}`}>
                      {riskBadge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Trail */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Audit Trail</h2>
            <button className="view-all-btn" onClick={() => navigate('/app/audit-trail')}>
              View Full Trail <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="audit-trail-list">
            {dashboardData.auditTrail.map(entry => (
              <div key={entry.id} className="audit-trail-item">
                <div className="audit-trail-icon">
                  <i className="fas fa-history"></i>
                </div>
                <div className="audit-trail-content">
                  <div className="audit-trail-action">{entry.action} - {entry.control}</div>
                  <div className="audit-trail-details">{entry.details}</div>
                  <div className="audit-trail-meta">
                    <span className="audit-trail-user">{entry.user}</span>
                    <span> • {entry.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-card" onClick={() => navigate('/app/evidence')}>
              <i className="fas fa-folder-open"></i>
              <span>Browse Evidence</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/audit-trail')}>
              <i className="fas fa-history"></i>
              <span>View Audit Trail</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/reports')}>
              <i className="fas fa-file-alt"></i>
              <span>Generate Report</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/frameworks')}>
              <i className="fas fa-shield-halved"></i>
              <span>Review Frameworks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditorDashboard;
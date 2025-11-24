// src/tenant/dashboard/ComplianceManagerDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import './TenantDashboard.css';

const ComplianceManagerDashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  // Mock data for Compliance Manager
  const dashboardData = {
    stats: {
      totalControls: 114,
      completed: 32,
      pendingApprovals: 15,
      overdue: 3
    },
    frameworkProgress: [
      { name: 'ISO 27001', completed: 32, total: 114, percentage: 28 },
      { name: 'GDPR', completed: 18, total: 40, percentage: 45 },
      { name: 'SOX', completed: 26, total: 40, percentage: 65 }
    ],
    pendingApprovals: [
      {
        id: 1,
        control: 'AC-001',
        title: 'Multi-Factor Authentication Implementation',
        submittedBy: 'John Doe',
        submittedDate: '2025-11-20',
        framework: 'ISO 27001',
        evidenceCount: 3
      },
      {
        id: 2,
        control: 'AC-008',
        title: 'Access Control Review',
        submittedBy: 'Mike Chen',
        submittedDate: '2025-11-22',
        framework: 'ISO 27001',
        evidenceCount: 2
      },
      {
        id: 3,
        control: 'PR-002',
        title: 'Privacy Impact Assessment',
        submittedBy: 'Emily Davis',
        submittedDate: '2025-11-23',
        framework: 'GDPR',
        evidenceCount: 5
      }
    ],
    overdueAlerts: [
      {
        id: 1,
        control: 'FIN-003',
        title: 'Financial Controls Documentation',
        assignedTo: 'Sarah Johnson',
        dueDate: '2025-11-20',
        daysOverdue: 4
      },
      {
        id: 2,
        control: 'PHY-005',
        title: 'Physical Security Assessment',
        assignedTo: 'Tom Wilson',
        dueDate: '2025-11-22',
        daysOverdue: 2
      }
    ],
    teamWorkload: [
      { name: 'John Doe', assigned: 8, completed: 5, pending: 3 },
      { name: 'Mike Chen', assigned: 6, completed: 4, pending: 2 },
      { name: 'Emily Davis', assigned: 10, completed: 6, pending: 4 },
      { name: 'Sarah Johnson', assigned: 7, completed: 3, pending: 4 }
    ]
  };

  return (
    <div className="tenant-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Compliance Management</h1>
          <p className="header-subtitle">Welcome back, {currentUser.name} 👋</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/app/assignments')}>
            <i className="fas fa-plus"></i> Assign Control
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
            title="Completed"
            value={dashboardData.stats.completed}
            change={`${Math.round((dashboardData.stats.completed / dashboardData.stats.totalControls) * 100)}% complete`}
            changeType="positive"
            color="#10b981"
          />
          <StatCard
            icon="fa-clock"
            title="Pending Approvals"
            value={dashboardData.stats.pendingApprovals}
            subtitle="Awaiting your review"
            color="#f59e0b"
            onClick={() => navigate('/app/approvals')}
          />
          <StatCard
            icon="fa-exclamation-triangle"
            title="Overdue"
            value={dashboardData.stats.overdue}
            subtitle="Requires attention"
            color="#ef4444"
          />
        </div>

        {/* Framework Progress */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Framework Progress</h2>
            <button className="view-all-btn" onClick={() => navigate('/app/frameworks')}>
              View All <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="frameworks-list">
            {dashboardData.frameworkProgress.map((framework, index) => (
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
          {/* Pending Approvals Queue */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-check-circle" style={{ color: '#f59e0b', marginRight: '8px' }}></i>
                Pending Approvals
              </h2>
              <button className="view-all-btn" onClick={() => navigate('/app/approvals')}>
                View All <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="approvals-list">
              {dashboardData.pendingApprovals.map(approval => (
                <div key={approval.id} className="approval-item">
                  <div className="approval-left">
                    <div className="control-badge">{approval.control}</div>
                    <div className="approval-info">
                      <div className="approval-title">{approval.title}</div>
                      <div className="approval-meta">
                        <span className="framework-tag">{approval.framework}</span>
                        <span> • By {approval.submittedBy}</span>
                      </div>
                      <div className="approval-evidence">
                        <i className="fas fa-paperclip"></i> {approval.evidenceCount} evidence files
                      </div>
                    </div>
                  </div>
                  <div className="approval-actions">
                    <button className="btn-approve">
                      <i className="fas fa-check"></i> Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Alerts */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444', marginRight: '8px' }}></i>
                Overdue Tasks
              </h2>
            </div>
            <div className="overdue-list">
              {dashboardData.overdueAlerts.map(alert => (
                <div key={alert.id} className="overdue-item">
                  <div className="overdue-left">
                    <div className="control-badge overdue-badge">{alert.control}</div>
                    <div className="overdue-info">
                      <div className="overdue-title">{alert.title}</div>
                      <div className="overdue-meta">
                        Assigned to: {alert.assignedTo}
                      </div>
                    </div>
                  </div>
                  <div className="overdue-right">
                    <div className="overdue-days">{alert.daysOverdue} days overdue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Workload */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Team Workload</h2>
          </div>
          <div className="workload-table">
            <div className="workload-header">
              <div className="workload-col">Team Member</div>
              <div className="workload-col">Assigned</div>
              <div className="workload-col">Completed</div>
              <div className="workload-col">Pending</div>
            </div>
            {dashboardData.teamWorkload.map((member, index) => (
              <div key={index} className="workload-row">
                <div className="workload-col workload-name">{member.name}</div>
                <div className="workload-col">{member.assigned}</div>
                <div className="workload-col">
                  <span className="workload-badge workload-completed">{member.completed}</span>
                </div>
                <div className="workload-col">
                  <span className="workload-badge workload-pending">{member.pending}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-card" onClick={() => navigate('/app/assignments')}>
              <i className="fas fa-plus-circle"></i>
              <span>Assign Control</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/approvals')}>
              <i className="fas fa-check-circle"></i>
              <span>Review Submissions</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/reports')}>
              <i className="fas fa-chart-bar"></i>
              <span>Generate Report</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/evidence')}>
              <i className="fas fa-file-check"></i>
              <span>Verify Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceManagerDashboard;
// src/tenant/reports/ComplianceReports.jsx
import React, { useState } from 'react';
import EmptyState from '../components/EmptyState';
import './Reports.css';

const ComplianceReports = () => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Report templates
  const templates = [
    {
      id: 'compliance-summary',
      name: 'Compliance Summary Report',
      description: 'Overall compliance score and status across all frameworks',
      icon: 'fa-chart-pie',
      color: '#3b82f6',
      frameworks: ['All'],
      estimated_time: '2 minutes'
    },
    {
      id: 'control-status',
      name: 'Control Status Report',
      description: 'Detailed status of all controls by framework',
      icon: 'fa-tasks',
      color: '#10b981',
      frameworks: ['ISO 27001', 'GDPR', 'SOX'],
      estimated_time: '3 minutes'
    },
    {
      id: 'evidence-report',
      name: 'Evidence Documentation Report',
      description: 'Complete evidence inventory with verification status',
      icon: 'fa-file-archive',
      color: '#f59e0b',
      frameworks: ['All'],
      estimated_time: '4 minutes'
    },
    {
      id: 'audit-readiness',
      name: 'Audit Readiness Report',
      description: 'Assessment of readiness for external audits',
      icon: 'fa-clipboard-check',
      color: '#8b5cf6',
      frameworks: ['ISO 27001', 'GDPR', 'SOX'],
      estimated_time: '5 minutes'
    },
    {
      id: 'gap-analysis',
      name: 'Gap Analysis Report',
      description: 'Identify gaps and areas requiring attention',
      icon: 'fa-chart-line',
      color: '#ef4444',
      frameworks: ['All'],
      estimated_time: '3 minutes'
    },
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'High-level overview for leadership',
      icon: 'fa-user-tie',
      color: '#06b6d4',
      frameworks: ['All'],
      estimated_time: '2 minutes'
    }
  ];

  // Generated reports history
  const reportsHistory = [
    {
      id: 'rpt1',
      template: 'Compliance Summary Report',
      framework: 'All Frameworks',
      generated_date: '2025-11-23',
      generated_by: 'You',
      format: 'PDF',
      file_size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 'rpt2',
      template: 'Control Status Report',
      framework: 'ISO 27001',
      generated_date: '2025-11-20',
      generated_by: 'Sarah Chen',
      format: 'Excel',
      file_size: '856 KB',
      status: 'completed'
    },
    {
      id: 'rpt3',
      template: 'Evidence Documentation Report',
      framework: 'GDPR',
      generated_date: '2025-11-18',
      generated_by: 'You',
      format: 'PDF',
      file_size: '3.2 MB',
      status: 'completed'
    },
    {
      id: 'rpt4',
      template: 'Audit Readiness Report',
      framework: 'SOX',
      generated_date: '2025-11-15',
      generated_by: 'Mike Johnson',
      format: 'PDF',
      file_size: '1.8 MB',
      status: 'completed'
    }
  ];

  const handleGenerateReport = (template) => {
    setSelectedTemplate(template);
    setShowGenerateModal(true);
  };

  return (
    <div className="compliance-reports-page">
      {/* Clean Page Header */}
      <div className="page-header-reports">
        <div className="header-content">
          <div className="header-left">
            <h1>Compliance Reports</h1>
            <p className="header-subtitle">
              Generate and manage compliance reports
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="reports-content">
        {/* Report Templates */}
        <div className="templates-section">
          <h2>Report Templates</h2>
          <div className="templates-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div 
                  className="template-icon"
                  style={{ backgroundColor: `${template.color}15` }}
                >
                  <i className={`fas ${template.icon}`} style={{ color: template.color }}></i>
                </div>
                <h3 className="template-name">{template.name}</h3>
                <p className="template-description">{template.description}</p>
                <div className="template-meta">
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{template.estimated_time}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-shield-halved"></i>
                    <span>{template.frameworks.length === 1 && template.frameworks[0] === 'All' ? 'All Frameworks' : `${template.frameworks.length} frameworks`}</span>
                  </div>
                </div>
                <button 
                  className="generate-btn"
                  onClick={() => handleGenerateReport(template)}
                >
                  <i className="fas fa-file-export"></i>
                  Generate Report
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reports History */}
        <div className="history-section">
          <div className="history-header">
            <h2>Recent Reports</h2>
            <button className="view-all-btn">
              View All Reports
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {reportsHistory.length > 0 ? (
            <div className="reports-table-container">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Framework</th>
                    <th>Generated</th>
                    <th>Generated By</th>
                    <th>Format</th>
                    <th>Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsHistory.map(report => (
                    <tr key={report.id}>
                      <td className="report-name">{report.template}</td>
                      <td>
                        <span className="framework-badge">{report.framework}</span>
                      </td>
                      <td>{new Date(report.generated_date).toLocaleDateString()}</td>
                      <td>{report.generated_by}</td>
                      <td>
                        <span className="format-badge">{report.format}</span>
                      </td>
                      <td className="file-size">{report.file_size}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn view" title="View">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="action-btn download" title="Download">
                            <i className="fas fa-download"></i>
                          </button>
                          <button className="action-btn share" title="Share">
                            <i className="fas fa-share"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="fa-file-chart"
              title="No reports generated yet"
              description="Generate your first compliance report using the templates above"
            />
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && selectedTemplate && (
        <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate {selectedTemplate.name}</h2>
              <button className="close-btn" onClick={() => setShowGenerateModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Framework</label>
                <select className="form-input">
                  <option value="all">All Frameworks</option>
                  <option value="iso27001">ISO 27001</option>
                  <option value="gdpr">GDPR</option>
                  <option value="sox">SOX</option>
                </select>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Date Range</label>
                  <select className="form-input">
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="last180">Last 6 Months</option>
                    <option value="last365">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Export Format</label>
                  <select className="form-input">
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Include Sections</label>
                <div className="checkbox-options">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Executive Summary</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Control Status Details</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Evidence Documentation</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Compliance Score</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Recommendations</span>
                  </label>
                </div>
              </div>

              <div className="info-box">
                <i className="fas fa-info-circle"></i>
                <div>
                  <strong>Estimated Generation Time:</strong> {selectedTemplate.estimated_time}
                  <br />
                  <span>You'll receive an email when the report is ready for download.</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowGenerateModal(false)}>
                Cancel
              </button>
              <button className="submit-btn">
                <i className="fas fa-cog fa-spin"></i>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceReports;
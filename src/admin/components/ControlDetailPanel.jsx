import React from 'react';
import './ControlDetailPanel.css';

const ControlDetailPanel = ({ control, isOpen, onClose }) => {
  if (!control) return null;

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case 'HIGH':
        return 'risk-high';
      case 'MEDIUM':
        return 'risk-medium';
      case 'LOW':
        return 'risk-low';
      default:
        return '';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'PREVENTIVE':
        return 'type-preventive';
      case 'DETECTIVE':
        return 'type-detective';
      case 'CORRECTIVE':
        return 'type-corrective';
      default:
        return '';
    }
  };

  // Mock questions and evidence - will come from control data
  const questions = [
    {
      id: '1',
      question: 'Is there a documented process for user account creation?',
      question_type: 'YES_NO',
      is_mandatory: true
    },
    {
      id: '2',
      question: 'Are all account creation requests approved by managers?',
      question_type: 'YES_NO',
      is_mandatory: true
    },
    {
      id: '3',
      question: 'What is the average time to provision access?',
      question_type: 'NUMERIC',
      is_mandatory: false
    }
  ];

  const evidenceRequirements = [
    {
      id: '1',
      title: 'User Access Request Form',
      evidence_type: 'DOCUMENT',
      is_mandatory: true,
      file_format: 'PDF, DOC'
    },
    {
      id: '2',
      title: 'Manager Approval Email',
      evidence_type: 'SCREENSHOT',
      is_mandatory: true,
      file_format: 'PNG, JPG, PDF'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`panel-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className={`control-detail-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="panel-header">
          <div className="panel-title-section">
            <span className="control-code-large">{control.control_code}</span>
            <h2 className="panel-title">{control.title}</h2>
          </div>
          <button className="panel-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="panel-content">
          {/* Control Details */}
          <section className="panel-section">
            <h3 className="section-heading">
              <i className="fas fa-info-circle"></i>
              Control Details
            </h3>
            
            <div className="detail-grid">
              <div className="detail-item">
                <label>Control Type</label>
                <span className={`badge type-badge ${getTypeBadgeClass(control.control_type)}`}>
                  {control.control_type}
                </span>
              </div>

              <div className="detail-item">
                <label>Risk Level</label>
                <span className={`badge risk-badge ${getRiskBadgeClass(control.risk_level)}`}>
                  {control.risk_level}
                </span>
              </div>

              <div className="detail-item">
                <label>Frequency</label>
                <span className="detail-value">{control.frequency}</span>
              </div>

              <div className="detail-item full-width">
                <label>Description</label>
                <p className="detail-description">{control.description}</p>
              </div>

              {control.objective && (
                <div className="detail-item full-width">
                  <label>Objective</label>
                  <p className="detail-description">{control.objective || 'Ensure compliance with access control policies'}</p>
                </div>
              )}
            </div>
          </section>

          {/* Assessment Questions */}
          <section className="panel-section">
            <div className="section-header">
              <h3 className="section-heading">
                <i className="fas fa-circle-question"></i>
                Assessment Questions ({questions.length})
              </h3>
              <button className="add-item-btn">
                <i className="fas fa-plus"></i>
                Add Question
              </button>
            </div>

            {questions.length > 0 ? (
              <div className="questions-list">
                {questions.map((q, index) => (
                  <div key={q.id} className="question-item">
                    <div className="question-header">
                      <span className="question-number">Q{index + 1}</span>
                      <span className={`question-type ${q.is_mandatory ? 'mandatory' : 'optional'}`}>
                        {q.is_mandatory ? 'Mandatory' : 'Optional'}
                      </span>
                    </div>
                    <p className="question-text">{q.question}</p>
                    <div className="question-footer">
                      <span className="question-meta">Type: {q.question_type}</span>
                      <div className="question-actions">
                        <button className="icon-btn-small edit-btn">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="icon-btn-small delete-btn">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-small">
                <i className="fas fa-circle-question"></i>
                <p>No assessment questions added yet</p>
              </div>
            )}
          </section>

          {/* Evidence Requirements */}
          <section className="panel-section">
            <div className="section-header">
              <h3 className="section-heading">
                <i className="fas fa-file-lines"></i>
                Evidence Requirements ({evidenceRequirements.length})
              </h3>
              <button className="add-item-btn">
                <i className="fas fa-plus"></i>
                Add Evidence
              </button>
            </div>

            {evidenceRequirements.length > 0 ? (
              <div className="evidence-list">
                {evidenceRequirements.map((ev, index) => (
                  <div key={ev.id} className="evidence-item">
                    <div className="evidence-header">
                      <div className="evidence-icon">
                        <i className="fas fa-file-lines"></i>
                      </div>
                      <div className="evidence-info">
                        <h4 className="evidence-title">{ev.title}</h4>
                        <span className={`evidence-type ${ev.is_mandatory ? 'mandatory' : 'optional'}`}>
                          {ev.evidence_type} {ev.is_mandatory ? '(Mandatory)' : '(Optional)'}
                        </span>
                      </div>
                    </div>
                    <div className="evidence-footer">
                      <span className="evidence-format">
                        <i className="fas fa-file"></i> {ev.file_format}
                      </span>
                      <div className="evidence-actions">
                        <button className="icon-btn-small edit-btn">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="icon-btn-small delete-btn">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-small">
                <i className="fas fa-file-lines"></i>
                <p>No evidence requirements added yet</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ControlDetailPanel;
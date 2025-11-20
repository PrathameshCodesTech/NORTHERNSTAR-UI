// src/admin/components/ControlDetailPanel.jsx
import React, { useState, useEffect } from 'react';
import { controlAPI, questionAPI, evidenceAPI } from '../../services/templateService';
import './ControlDetailPanel.css';

const ControlDetailPanel = ({ control, isOpen, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [detailedControl, setDetailedControl] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [evidenceRequirements, setEvidenceRequirements] = useState([]);

  // ============================================================================
  // FETCH DETAILED CONTROL DATA
  // ============================================================================
  useEffect(() => {
    if (!control || !isOpen) return;

    fetchControlDetails();
  }, [control, isOpen]);

  const fetchControlDetails = async () => {
    try {
      setLoading(true);
      
      // ✅ Fetch control with deep data (questions & evidence)
      const detailData = await controlAPI.getById(control.id, true); // Pass true for deep
      
      setDetailedControl(detailData);
      setQuestions(detailData.assessment_questions || []);
      setEvidenceRequirements(detailData.evidence_requirements || []);
      
    } catch (err) {
      console.error('Error fetching control details:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // BADGE HELPERS
  // ============================================================================
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

  // ============================================================================
  // QUESTION HANDLERS
  // ============================================================================
  const handleAddQuestion = () => {
    console.log('Add question to control:', control.id);
    // TODO: Open CreateQuestionModal
    alert('Question modal coming soon! You can use controlAPI.addQuestion()');
  };

  const handleEditQuestion = (question) => {
    console.log('Edit question:', question);
    // TODO: Open EditQuestionModal with questionAPI.update()
    alert('Edit question modal coming soon!');
  };

  const handleDeleteQuestion = async (question) => {
    if (!window.confirm(`Are you sure you want to delete this question?`)) return;

    try {
      // ✅ REAL DELETE using your questionAPI
      await questionAPI.delete(question.id);
      
      alert('Question deleted successfully!');
      
      // Refresh control details
      await fetchControlDetails();
      
      // Notify parent to refresh if needed
      if (onRefresh) onRefresh();
      
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Failed to delete question. Please try again.');
    }
  };

  // ============================================================================
  // EVIDENCE HANDLERS
  // ============================================================================
  const handleAddEvidence = () => {
    console.log('Add evidence to control:', control.id);
    // TODO: Open CreateEvidenceModal
    alert('Evidence modal coming soon! You can use controlAPI.addEvidence()');
  };

  const handleEditEvidence = (evidence) => {
    console.log('Edit evidence:', evidence);
    // TODO: Open EditEvidenceModal with evidenceAPI.update()
    alert('Edit evidence modal coming soon!');
  };

  const handleDeleteEvidence = async (evidence) => {
    if (!window.confirm(`Are you sure you want to delete this evidence requirement?`)) return;

    try {
      // ✅ REAL DELETE using your evidenceAPI
      await evidenceAPI.delete(evidence.id);
      
      alert('Evidence requirement deleted successfully!');
      
      // Refresh control details
      await fetchControlDetails();
      
      // Notify parent to refresh if needed
      if (onRefresh) onRefresh();
      
    } catch (err) {
      console.error('Error deleting evidence:', err);
      alert('Failed to delete evidence requirement. Please try again.');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  if (!control) return null;

  const displayControl = detailedControl || control;

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
            <span className="control-code-large">{displayControl.control_code}</span>
            <h2 className="panel-title">{displayControl.title}</h2>
          </div>
          <button className="panel-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="panel-content">
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '3rem',
              color: '#666'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i>
            </div>
          ) : (
            <>
              {/* Control Details */}
              <section className="panel-section">
                <h3 className="section-heading">
                  <i className="fas fa-info-circle"></i>
                  Control Details
                </h3>
                
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Control Type</label>
                    <span className={`badge type-badge ${getTypeBadgeClass(displayControl.control_type)}`}>
                      {displayControl.control_type}
                    </span>
                  </div>

                  <div className="detail-item">
                    <label>Risk Level</label>
                    <span className={`badge risk-badge ${getRiskBadgeClass(displayControl.risk_level)}`}>
                      {displayControl.risk_level}
                    </span>
                  </div>

                  <div className="detail-item">
                    <label>Frequency</label>
                    <span className="detail-value">{displayControl.frequency}</span>
                  </div>

                  <div className="detail-item full-width">
                    <label>Description</label>
                    <p className="detail-description">{displayControl.description}</p>
                  </div>

                  {displayControl.objective && (
                    <div className="detail-item full-width">
                      <label>Objective</label>
                      <p className="detail-description">{displayControl.objective}</p>
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
                  <button className="add-item-btn" onClick={handleAddQuestion}>
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
                            <button 
                              className="icon-btn-small edit-btn"
                              onClick={() => handleEditQuestion(q)}
                              title="Edit Question"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="icon-btn-small delete-btn"
                              onClick={() => handleDeleteQuestion(q)}
                              title="Delete Question"
                            >
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
                    <button 
                      className="add-item-btn" 
                      onClick={handleAddQuestion}
                      style={{ marginTop: '1rem' }}
                    >
                      <i className="fas fa-plus"></i>
                      Add First Question
                    </button>
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
                  <button className="add-item-btn" onClick={handleAddEvidence}>
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
                            <i className="fas fa-file"></i> {ev.file_format || 'Any format'}
                          </span>
                          <div className="evidence-actions">
                            <button 
                              className="icon-btn-small edit-btn"
                              onClick={() => handleEditEvidence(ev)}
                              title="Edit Evidence"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="icon-btn-small delete-btn"
                              onClick={() => handleDeleteEvidence(ev)}
                              title="Delete Evidence"
                            >
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
                    <button 
                      className="add-item-btn" 
                      onClick={handleAddEvidence}
                      style={{ marginTop: '1rem' }}
                    >
                      <i className="fas fa-plus"></i>
                      Add First Evidence
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ControlDetailPanel;
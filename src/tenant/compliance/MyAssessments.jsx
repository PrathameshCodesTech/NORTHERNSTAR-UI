// src/tenant/compliance/MyAssessments.jsx
import React, { useState } from 'react';
import EmptyState from '../components/EmptyState';
import './Compliance.css';

const MyAssessments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFramework, setFilterFramework] = useState('all');
  const [expandedControls, setExpandedControls] = useState({});
  const [answers, setAnswers] = useState({});

  // Mock data
  const assessments = [
    {
      id: 'ctrl1',
      control_code: 'AC-001',
      control_title: 'Multi-Factor Authentication',
      framework: 'ISO 27001',
      framework_color: '#3b82f6',
      status: 'in-progress',
      progress: 60,
      due_date: '2025-11-28',
      questions: [
        {
          id: 'q1',
          text: 'Is multi-factor authentication (MFA) enabled for all user accounts?',
          type: 'radio',
          options: ['Yes', 'No', 'Partially'],
          required: true
        },
        {
          id: 'q2',
          text: 'Which MFA methods are supported? (Select all that apply)',
          type: 'checkbox',
          options: ['SMS/Text', 'Authenticator App', 'Hardware Token', 'Biometric'],
          required: true
        },
        {
          id: 'q3',
          text: 'Describe your MFA implementation and coverage',
          type: 'textarea',
          required: true
        }
      ]
    },
    {
      id: 'ctrl2',
      control_code: 'PR-002',
      control_title: 'Privacy Impact Assessment',
      framework: 'GDPR',
      framework_color: '#10b981',
      status: 'not-started',
      progress: 0,
      due_date: '2025-11-30',
      questions: [
        {
          id: 'q4',
          text: 'Has a Privacy Impact Assessment (PIA) been conducted for data processing activities?',
          type: 'radio',
          options: ['Yes', 'No', 'In Progress'],
          required: true
        },
        {
          id: 'q5',
          text: 'Which types of personal data are processed?',
          type: 'checkbox',
          options: ['Basic Identity', 'Contact Information', 'Financial Data', 'Health Data', 'Location Data'],
          required: true
        },
        {
          id: 'q6',
          text: 'Provide details of your data processing activities',
          type: 'textarea',
          required: true
        }
      ]
    },
    {
      id: 'ctrl3',
      control_code: 'FIN-005',
      control_title: 'Financial Controls Documentation',
      framework: 'SOX',
      framework_color: '#f59e0b',
      status: 'completed',
      progress: 100,
      due_date: '2025-11-20',
      questions: [
        {
          id: 'q7',
          text: 'Are all financial control procedures documented?',
          type: 'radio',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'q8',
          text: 'How frequently are financial controls reviewed?',
          type: 'radio',
          options: ['Monthly', 'Quarterly', 'Annually'],
          required: true
        }
      ]
    }
  ];

  const frameworks = ['ISO 27001', 'GDPR', 'SOX'];

  const getStatusStyle = (status) => {
    const styles = {
      'not-started': { bg: '#f3f4f6', color: '#6b7280', label: 'Not Started', icon: 'fa-circle' },
      'in-progress': { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: 'fa-clock' },
      'completed': { bg: '#d1fae5', color: '#065f46', label: 'Completed', icon: 'fa-check-circle' }
    };
    return styles[status] || styles['not-started'];
  };

  const toggleControl = (controlId) => {
    setExpandedControls(prev => ({
      ...prev,
      [controlId]: !prev[controlId]
    }));
  };

  const handleAnswerChange = (questionId, value, type) => {
    if (type === 'checkbox') {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [questionId]: newAnswers });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = 
      a.control_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.control_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = filterFramework === 'all' || a.framework === filterFramework;
    return matchesSearch && matchesFramework;
  });

  const stats = {
    total: assessments.length,
    completed: assessments.filter(a => a.status === 'completed').length,
    in_progress: assessments.filter(a => a.status === 'in-progress').length,
    not_started: assessments.filter(a => a.status === 'not-started').length
  };

  return (
    <div className="my-assessments-page">
      {/* Clean Page Header */}
      <div className="page-header-compliance">
        <div className="header-content">
          <div className="header-left">
            <h1>My Assessments</h1>
            <p className="header-subtitle">
              Answer compliance questions for assigned controls
            </p>
          </div>
          <div className="header-action">
            <div className="header-badge">
              <i className="fas fa-clipboard-check"></i>
              <span>{stats.completed}/{stats.total} completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="assessments-content">
        {/* Stats */}
        <div className="assessment-stats-grid">
          <div className="stat-card-small">
            <i className="fas fa-clipboard-list" style={{ color: '#3b82f6' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-card-small">
            <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card-small">
            <i className="fas fa-clock" style={{ color: '#f59e0b' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.in_progress}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="assessment-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Framework:</label>
            <select value={filterFramework} onChange={(e) => setFilterFramework(e.target.value)}>
              <option value="all">All Frameworks</option>
              {frameworks.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Assessments List */}
        {filteredAssessments.length > 0 ? (
          <div className="assessments-list">
            {filteredAssessments.map(assessment => {
              const statusStyle = getStatusStyle(assessment.status);
              const isExpanded = expandedControls[assessment.id];

              return (
                <div key={assessment.id} className="assessment-card">
                  {/* Header */}
                  <div 
                    className="assessment-card-header"
                    onClick={() => toggleControl(assessment.id)}
                  >
                    <div className="header-left">
                      <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                      <div className="control-badge" style={{ backgroundColor: assessment.framework_color }}>
                        {assessment.control_code}
                      </div>
                      <div className="assessment-info">
                        <h3>{assessment.control_title}</h3>
                        <span 
                          className="framework-tag"
                          style={{ backgroundColor: `${assessment.framework_color}15`, color: assessment.framework_color }}
                        >
                          {assessment.framework}
                        </span>
                      </div>
                    </div>
                    <div className="header-right">
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                      >
                        <i className={`fas ${statusStyle.icon}`}></i>
                        {statusStyle.label}
                      </div>
                      <div className="progress-info">
                        <span className="progress-text">{assessment.progress}%</span>
                        <div className="mini-progress-bar">
                          <div 
                            className="mini-progress-fill" 
                            style={{ width: `${assessment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions */}
                  {isExpanded && (
                    <div className="questions-section">
                      {assessment.questions.map((question, idx) => (
                        <div key={question.id} className="question-block">
                          <div className="question-header">
                            <span className="question-number">Question {idx + 1}</span>
                            {question.required && <span className="required-badge">Required</span>}
                          </div>
                          <p className="question-text">{question.text}</p>

                          {question.type === 'radio' && (
                            <div className="radio-options">
                              {question.options.map(option => (
                                <label key={option} className="radio-label">
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={answers[question.id] === option}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value, 'radio')}
                                  />
                                  <span className="radio-text">{option}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {question.type === 'checkbox' && (
                            <div className="checkbox-options">
                              {question.options.map(option => (
                                <label key={option} className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    value={option}
                                    checked={(answers[question.id] || []).includes(option)}
                                    onChange={(e) => handleAnswerChange(question.id, option, 'checkbox')}
                                  />
                                  <span className="checkbox-text">{option}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {question.type === 'textarea' && (
                            <textarea
                              className="answer-textarea"
                              rows="4"
                              placeholder="Type your answer here..."
                              value={answers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value, 'textarea')}
                            ></textarea>
                          )}
                        </div>
                      ))}

                      {/* Action Buttons */}
                      <div className="assessment-actions">
                        <button className="save-draft-btn">
                          <i className="fas fa-save"></i>
                          Save Draft
                        </button>
                        <button className="submit-assessment-btn">
                          <i className="fas fa-paper-plane"></i>
                          Submit for Approval
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="fa-clipboard-question"
            title="No assessments found"
            description="You don't have any assessments matching the selected filters"
          />
        )}
      </div>
    </div>
  );
};

export default MyAssessments;
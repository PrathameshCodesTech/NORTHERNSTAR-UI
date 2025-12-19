import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../../services/authService'; // ✅ Add this import
import './AIReports.css';

const AIReports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  
  // Form State
  const [question, setQuestion] = useState('');
  const [aiChoice, setAiChoice] = useState('gemini');
  
  // Results State
  const [results, setResults] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  // Get API base URL from environment or default
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Get auth token from localStorage
const getAuthToken = () => {
    const token = authAPI.getAccessToken(); // Use the service method
    if (!token) {
      navigate('/login');
      return null;
    }
    return token;
  };

  // Test AI services on component mount
  useEffect(() => {
    testAIServices();
  }, []);

  // Test AI Services
  const testAIServices = async () => {
    setTesting(true);
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/test/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAiStatus(data);
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (err) {
      console.error('AI test failed:', err);
    } finally {
      setTesting(false);
    }
  };

  // Generate SQL and Execute
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-sql/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          ai_choice: aiChoice,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        // Add to history
        setQueryHistory(prev => [
          {
            question: data.question,
            sql: data.generated_sql,
            count: data.count,
            timestamp: new Date().toLocaleString(),
            ai_used: data.ai_used,
          },
          ...prev.slice(0, 4) // Keep last 5
        ]);
      } else {
        setError(data.error || 'Failed to generate report');
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Download Results as CSV
  const downloadCSV = () => {
    if (!results || !results.results) return;

    const headers = results.columns.join(',');
    const rows = results.results.map(row => 
      results.columns.map(col => {
        const value = row[col];
        // Handle values with commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${Date.now()}.csv`;
    a.click();
  };

  // Load example query
  const loadExample = (exampleQuestion) => {
    setQuestion(exampleQuestion);
    setError(null);
  };

  return (
    <div className="ai-reports-page">
      {/* Page Header */}
      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">
            <i className="fas fa-robot"></i> AI Reports
          </h1>
          <p className="view-subtitle">
            Ask questions about your data in plain English
          </p>
        </div>
        <div className="header-actions">
          {testing && (
            <span className="status-loading">
              <i className="fas fa-spinner fa-spin"></i> Testing AI...
            </span>
          )}
          {aiStatus && !testing && (
            <div className="ai-status">
              <span className={`status-indicator ${aiStatus.gemini_enabled ? 'status-active' : 'status-inactive'}`}>
                <i className="fas fa-circle"></i> Gemini {aiStatus.gemini_enabled ? 'Active' : 'Inactive'}
              </span>
              <span className={`status-indicator ${aiStatus.ollama_enabled ? 'status-active' : 'status-inactive'}`}>
                <i className="fas fa-circle"></i> Ollama {aiStatus.ollama_enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Example Questions */}
      <div className="example-questions">
        <h3>
          <i className="fas fa-lightbulb"></i> Example Questions
        </h3>
        <div className="examples-grid">
          <button 
            className="example-btn" 
            onClick={() => loadExample('Show all frameworks')}
          >
            <i className="fas fa-list"></i> Show all frameworks
          </button>
          <button 
            className="example-btn" 
            onClick={() => loadExample('Count total users')}
          >
            <i className="fas fa-users"></i> Count total users
          </button>
          <button 
            className="example-btn" 
            onClick={() => loadExample('List active framework subscriptions')}
          >
            <i className="fas fa-check-circle"></i> List active subscriptions
          </button>
          <button 
            className="example-btn" 
            onClick={() => loadExample('Show the 10 most recent controls')}
          >
            <i className="fas fa-clock"></i> Show recent controls
          </button>
        </div>
      </div>

      {/* Main Query Form */}
      <div className="query-form-card">
        <form onSubmit={handleGenerateReport}>
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-question-circle"></i> Your Question
            </label>
            <textarea
              className="form-textarea"
              placeholder="E.g., Show me all frameworks created in the last 30 days"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-brain"></i> AI Model
              </label>
              <select
                className="form-input"
                value={aiChoice}
                onChange={(e) => setAiChoice(e.target.value)}
                disabled={loading}
              >
                <option value="gemini">Gemini (Fast - Recommended)</option>
                <option value="ollama">Ollama (Local)</option>
                <option value="auto">Auto (Smart Selection)</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-generate" 
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i> Generate Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-triangle"></i>
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="results-section">
          <div className="results-header">
            <div>
              <h2 className="results-title">
                <i className="fas fa-chart-bar"></i> Results
              </h2>
              <p className="results-meta">
                Found <strong>{results.count}</strong> results using <strong>{results.ai_used}</strong>
              </p>
            </div>
            <button className="btn-download" onClick={downloadCSV}>
              <i className="fas fa-download"></i> Download CSV
            </button>
          </div>

          {/* Generated SQL */}
          <div className="sql-display">
            <div className="sql-header">
              <h3>
                <i className="fas fa-code"></i> Generated SQL
              </h3>
            </div>
            <pre className="sql-code">{results.generated_sql}</pre>
          </div>

          {/* Results Table */}
          {results.results.length > 0 ? (
            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    {results.columns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.results.map((row, idx) => (
                    <tr key={idx}>
                      {results.columns.map((col, colIdx) => (
                        <td key={colIdx}>
                          {row[col] !== null && row[col] !== undefined
                            ? String(row[col])
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-results">
              <i className="fas fa-inbox"></i>
              <p>No results found</p>
            </div>
          )}
        </div>
      )}

      {/* Query History */}
      {queryHistory.length > 0 && (
        <div className="history-section">
          <h3 className="section-heading">
            <i className="fas fa-history"></i> Recent Queries
          </h3>
          <div className="history-list">
            {queryHistory.map((item, idx) => (
              <div key={idx} className="history-item" onClick={() => loadExample(item.question)}>
                <div className="history-question">
                  <i className="fas fa-comment-dots"></i>
                  <strong>{item.question}</strong>
                </div>
                <div className="history-meta">
                  <span className="history-count">
                    <i className="fas fa-database"></i> {item.count} rows
                  </span>
                  <span className="history-ai">
                    <i className="fas fa-robot"></i> {item.ai_used}
                  </span>
                  <span className="history-time">
                    <i className="fas fa-clock"></i> {item.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReports;
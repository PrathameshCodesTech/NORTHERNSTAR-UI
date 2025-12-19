import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../../services/authService'; // ✅ Add this import
import ChartRenderer from '../components/charts/ChartRenderer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AIDashboard.css';

const AIDashboard = () => {
  const navigate = useNavigate();
  const dashboardRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard State
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  const [widgets, setWidgets] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  
  // Saved Dashboards
  const [savedDashboards, setSavedDashboards] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const getAuthToken = () => {
    const token = authAPI.getAccessToken(); // Use the service method
    if (!token) {
      navigate('/login');
      return null;
    }
    return token;
  };

  // Load saved dashboards on mount
  useEffect(() => {
    loadSavedDashboards();
  }, []);

  const loadSavedDashboards = () => {
    const saved = localStorage.getItem('ai_dashboards');
    if (saved) {
      setSavedDashboards(JSON.parse(saved));
    }
  };

  // Add widget to dashboard
  const addWidget = async (e) => {
    e.preventDefault();
    
    if (!currentQuestion.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);

    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-chart/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newWidget = {
          id: Date.now(),
          question: data.question,
          sql: data.generated_sql,
          chartConfig: data.chartConfig,
          results: data.results,
          columns: data.columns,
          timestamp: new Date().toLocaleString(),
        };
        
        setWidgets(prev => [...prev, newWidget]);
        setCurrentQuestion('');
      } else {
        setError(data.error || 'Failed to generate chart');
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove widget
  const removeWidget = (widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  // Save dashboard
  const saveDashboard = () => {
    if (!dashboardName.trim()) {
      alert('Please enter a dashboard name');
      return;
    }

    const dashboard = {
      id: Date.now(),
      name: dashboardName,
      widgets: widgets,
      createdAt: new Date().toISOString(),
    };

    const saved = [...savedDashboards, dashboard];
    setSavedDashboards(saved);
    localStorage.setItem('ai_dashboards', JSON.stringify(saved));
    
    alert('Dashboard saved successfully!');
  };

  // Load dashboard
  const loadDashboard = (dashboard) => {
    setDashboardName(dashboard.name);
    setWidgets(dashboard.widgets);
  };

  // Delete dashboard
  const deleteDashboard = (dashboardId) => {
    if (!confirm('Are you sure you want to delete this dashboard?')) return;
    
    const updated = savedDashboards.filter(d => d.id !== dashboardId);
    setSavedDashboards(updated);
    localStorage.setItem('ai_dashboards', JSON.stringify(updated));
  };

  // Export to PDF
  const exportToPDF = async () => {
    setExporting(true);
    
    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${dashboardName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
    } catch (err) {
      alert('Failed to export PDF: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  // Quick templates
  const quickTemplates = [
    'Show total count of users',
    'List top 10 frameworks by usage',
    'Show control distribution by domain',
    'Display monthly subscription trends',
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <input
            type="text"
            className="dashboard-name-input"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            placeholder="Dashboard Name"
          />
          <span className="widget-count">{widgets.length} widgets</span>
        </div>
        <div className="header-actions">
          <button className="btn-save" onClick={saveDashboard}>
            <i className="fas fa-save"></i> Save Dashboard
          </button>
          <button 
            className="btn-export" 
            onClick={exportToPDF}
            disabled={widgets.length === 0 || exporting}
          >
            {exporting ? (
              <><i className="fas fa-spinner fa-spin"></i> Exporting...</>
            ) : (
              <><i className="fas fa-file-pdf"></i> Export PDF</>
            )}
          </button>
        </div>
      </div>

      {/* Add Widget Form */}
      <div className="add-widget-section">
        <form onSubmit={addWidget} className="widget-form">
          <div className="form-row">
            <input
              type="text"
              className="question-input"
              placeholder="Ask a question to add a chart (e.g., Show total users by role)"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn-add-widget" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Adding...</>
              ) : (
                <><i className="fas fa-plus-circle"></i> Add Widget</>
              )}
            </button>
          </div>
        </form>

        {/* Quick Templates */}
        <div className="quick-templates">
          <span className="templates-label">Quick add:</span>
          {quickTemplates.map((template, idx) => (
            <button
              key={idx}
              className="template-btn"
              onClick={() => setCurrentQuestion(template)}
              disabled={loading}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-alert">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Dashboard Grid */}
      <div ref={dashboardRef} className="dashboard-grid">
        {widgets.length === 0 ? (
          <div className="empty-dashboard">
            <i className="fas fa-chart-line"></i>
            <h3>No Widgets Yet</h3>
            <p>Start by asking a question above to add your first chart</p>
          </div>
        ) : (
          widgets.map(widget => (
            <div key={widget.id} className="dashboard-widget">
              <div className="widget-header">
                <div className="widget-title">
                  <i className="fas fa-chart-bar"></i>
                  <span>{widget.chartConfig.title}</span>
                </div>
                <button
                  className="widget-remove"
                  onClick={() => removeWidget(widget.id)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="widget-content">
                <ChartRenderer
                  chartConfig={widget.chartConfig}
                  data={widget.results}
                  columns={widget.columns}
                />
              </div>

              {widget.chartConfig.insights && (
                <div className="widget-insights">
                  <div className="insights-header">
                    <i className="fas fa-lightbulb"></i>
                    <strong>Insights</strong>
                  </div>
                  <ul>
                    {widget.chartConfig.insights.slice(0, 2).map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Saved Dashboards Sidebar */}
      {savedDashboards.length > 0 && (
        <div className="saved-dashboards">
          <h3>
            <i className="fas fa-folder"></i> Saved Dashboards
          </h3>
          <div className="dashboard-list">
            {savedDashboards.map(dashboard => (
              <div key={dashboard.id} className="dashboard-item">
                <div 
                  className="dashboard-info"
                  onClick={() => loadDashboard(dashboard)}
                >
                  <strong>{dashboard.name}</strong>
                  <span>{dashboard.widgets.length} widgets</span>
                </div>
                <button
                  className="dashboard-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDashboard(dashboard.id);
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDashboard;
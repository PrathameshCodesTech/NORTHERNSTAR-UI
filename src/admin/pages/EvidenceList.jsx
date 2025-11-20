// src/admin/pages/EvidenceList.jsx
import React, { useState, useEffect } from 'react';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import AddEvidenceModal from '../modals/AddEvidenceModal';
import { evidenceAPI, controlAPI } from '../../services/templateService';
import './EvidenceList.css';

const EvidenceList = () => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [controls, setControls] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all evidence requirements
      const evidenceResponse = await evidenceAPI.getAll();
      const evidenceArray = Array.isArray(evidenceResponse) 
        ? evidenceResponse 
        : evidenceResponse?.results || [];
      setEvidenceList(evidenceArray);

      // Fetch all controls for dropdown
      const controlsResponse = await controlAPI.getAll();
      const controlsArray = Array.isArray(controlsResponse) 
        ? controlsResponse 
        : controlsResponse?.results || [];
      setControls(controlsArray);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Evidence Requirements', icon: 'fa-file-lines' }
  ];

  const typeFilters = [
    { label: 'All Types', value: '' },
    { label: 'Document', value: 'DOCUMENT' },
    { label: 'Screenshot', value: 'SCREENSHOT' },
    { label: 'Video', value: 'VIDEO' },
    { label: 'Log File', value: 'LOG_FILE' },
    { label: 'Report', value: 'REPORT' },
    { label: 'Policy', value: 'POLICY' },
    { label: 'Procedure', value: 'PROCEDURE' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (type) => {
    setFilterType(type);
  };

  const handleCreateEvidence = () => {
    setEditingEvidence(null);
    setIsModalOpen(true);
  };

  const handleEdit = (evidence) => {
    setEditingEvidence(evidence);
    setIsModalOpen(true);
  };

  const handleDelete = async (evidence) => {
    if (!window.confirm('Are you sure you want to delete this evidence requirement?')) return;

    try {
      setActionLoading(true);
      await evidenceAPI.delete(evidence.id);
      alert('Evidence requirement deleted successfully!');
      await fetchData();
    } catch (err) {
      console.error('Error deleting evidence:', err);
      alert('Failed to delete evidence requirement. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEvidence(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      if (editingEvidence) {
        await evidenceAPI.update(editingEvidence.id, formData);
        alert('Evidence requirement updated successfully!');
      } else {
        await evidenceAPI.create(formData);
        alert('Evidence requirement created successfully!');
      }

      await fetchData();
      handleModalClose();
    } catch (err) {
      console.error('Error saving evidence:', err);
      alert('Failed to save evidence requirement. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvidence = evidenceList.filter(ev => {
    const matchesSearch = ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ev.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || ev.evidence_type === filterType;
    return matchesSearch && matchesType;
  });

  // Get control details for evidence
  const getControlForEvidence = (evidence) => {
    return controls.find(c => c.id === evidence.control) || null;
  };

  if (loading) {
    return (
      <div className="evidence-list">
        <BreadcrumbNav items={breadcrumbItems} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0066cc' }}></i>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading evidence requirements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evidence-list">
        <BreadcrumbNav items={breadcrumbItems} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
          <p style={{ fontSize: '1.1rem', color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
          <button className="create-btn" onClick={fetchData}>
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="evidence-list">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Evidence Requirements</h1>
          <p className="view-subtitle">Manage all evidence requirements across controls</p>
        </div>
        <button 
          className="create-btn" 
          onClick={handleCreateEvidence}
          disabled={actionLoading}
        >
          <i className="fas fa-plus"></i>
          Add Evidence
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          icon="fa-file-lines"
          label="Total Evidence"
          value={evidenceList.length}
          color="teal"
        />
        <StatsCard
          icon="fa-star"
          label="Mandatory"
          value={evidenceList.filter(e => e.is_mandatory).length}
          color="red"
        />
        <StatsCard
          icon="fa-circle"
          label="Optional"
          value={evidenceList.filter(e => !e.is_mandatory).length}
          color="blue"
        />
      </div>

      <SearchBar
        placeholder="Search evidence..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={typeFilters}
      />

      {filteredEvidence.length > 0 ? (
        <div className="table-container">
          <table className="evidence-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Control</th>
                <th>Type</th>
                <th>Format</th>
                <th>Mandatory</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvidence.map(evidence => {
                const control = getControlForEvidence(evidence);
                return (
                  <tr key={evidence.id}>
                    <td>
                      <strong className="evidence-title">{evidence.title}</strong>
                    </td>
                    <td>
                      <p className="evidence-description">{evidence.description}</p>
                    </td>
                    <td>
                      {control ? (
                        <div className="control-info">
                          <span className="control-code">{control.control_code}</span>
                          <span className="control-title">{control.title}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#999' }}>Unknown Control</span>
                      )}
                    </td>
                    <td>
                      <span className="badge type-badge">{evidence.evidence_type}</span>
                    </td>
                    <td>
                      <span className="format-text">{evidence.file_format || 'Any'}</span>
                    </td>
                    <td>
                      {evidence.is_mandatory ? (
                        <span className="badge mandatory-badge">Mandatory</span>
                      ) : (
                        <span className="badge optional-badge">Optional</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="icon-btn edit-btn" 
                          onClick={() => handleEdit(evidence)} 
                          title="Edit"
                          disabled={actionLoading}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="icon-btn delete-btn" 
                          onClick={() => handleDelete(evidence)} 
                          title="Delete"
                          disabled={actionLoading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon="fa-file-lines"
          title="No evidence requirements found"
          description={searchQuery || filterType 
            ? "Try adjusting your search or filter criteria" 
            : "Get started by adding your first evidence requirement"}
          actionLabel={!searchQuery && !filterType ? "Add Evidence" : undefined}
          onAction={!searchQuery && !filterType ? handleCreateEvidence : undefined}
        />
      )}

      <AddEvidenceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        evidence={editingEvidence}
        controls={controls}
      />
    </div>
  );
};

export default EvidenceList;
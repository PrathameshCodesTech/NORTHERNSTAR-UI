// src/admin/pages/ControlList.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import CreateControlModal from '../modals/CreateControlModal';
import ControlDetailPanel from '../components/ControlDetailPanel';
import { subcategoryAPI, controlAPI } from '../../services/templateService';
import './ControlList.css';

const ControlList = () => {
  const [searchParams] = useSearchParams();
  const subcategoryId = searchParams.get('subcategory');

  const [subcategory, setSubcategory] = useState(null);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [controls, setControls] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedControl, setSelectedControl] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingControl, setEditingControl] = useState(null);

  useEffect(() => {
    fetchData();
  }, [subcategoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all subcategories for dropdown
      const subcategoriesResponse = await subcategoryAPI.getAll();
      const subcategoriesArray = Array.isArray(subcategoriesResponse) 
        ? subcategoriesResponse 
        : subcategoriesResponse?.results || [];
      setAllSubcategories(subcategoriesArray);

      // If viewing specific subcategory
      if (subcategoryId) {
        const subcategoryData = await subcategoryAPI.getById(subcategoryId);
        setSubcategory(subcategoryData);
      }

      // Fetch all controls (filter by subcategory if specified)
      const controlsResponse = await controlAPI.getAll();
      const controlsArray = Array.isArray(controlsResponse) 
        ? controlsResponse 
        : controlsResponse?.results || [];
      
      // Filter by subcategory if viewing specific one
      const filteredControls = subcategoryId 
        ? controlsArray.filter(c => c.subcategory === subcategoryId)
        : controlsArray;
      
      setControls(filteredControls);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = subcategoryId && subcategory
    ? [
        { label: 'Admin', path: '/admin', icon: 'fa-home' },
        { label: 'All Subcategories', path: '/admin/subcategories', icon: 'fa-sitemap' },
        { label: subcategory.name, icon: 'fa-shield-halved' }
      ]
    : [
        { label: 'Admin', path: '/admin', icon: 'fa-home' },
        { label: 'All Controls', icon: 'fa-shield-halved' }
      ];

  const controlTypeFilters = [
    { label: 'All Types', value: '' },
    { label: 'Preventive', value: 'PREVENTIVE' },
    { label: 'Detective', value: 'DETECTIVE' },
    { label: 'Corrective', value: 'CORRECTIVE' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (type) => {
    setFilterType(type);
  };

  const handleCreateControl = () => {
    setEditingControl(null);
    setIsModalOpen(true);
  };

  const handleEdit = (control) => {
    setEditingControl(control);
    setIsModalOpen(true);
  };

  const handleDelete = async (control) => {
    if (!window.confirm(`Are you sure you want to delete "${control.control_code}"?`)) return;

    try {
      setActionLoading(true);
      await controlAPI.delete(control.id);
      alert('Control deleted successfully!');
      await fetchData();
    } catch (err) {
      console.error('Error deleting control:', err);
      alert('Failed to delete control. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (control) => {
    setSelectedControl(control);
    setIsDetailPanelOpen(true);
  };

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedControl(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingControl(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      if (editingControl) {
        await controlAPI.update(editingControl.id, formData);
        alert('Control updated successfully!');
      } else {
        await controlAPI.create(formData);
        alert('Control created successfully!');
      }

      await fetchData();
      handleModalClose();
    } catch (err) {
      console.error('Error saving control:', err);
      alert('Failed to save control. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddQuestion = (control) => {
    console.log('Add question to control:', control);
    // TODO: Open add question modal
  };

  const handleAddEvidence = (control) => {
    console.log('Add evidence to control:', control);
    // TODO: Open add evidence modal
  };

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

  const filteredControls = controls.filter(c => {
    const matchesSearch = c.control_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || c.control_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="control-list">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading controls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="control-list">
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
    <div className="control-list">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">
            {subcategoryId && subcategory ? `Controls - ${subcategory.name}` : 'All Controls'}
          </h1>
          <p className="view-subtitle">
            {subcategoryId && subcategory 
              ? `Manage controls for ${subcategory.name}`
              : 'View and manage all controls'}
          </p>
        </div>
        <button 
          className="create-btn" 
          onClick={handleCreateControl}
          disabled={actionLoading}
        >
          <i className="fas fa-plus"></i>
          Create Control
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          icon="fa-shield-halved"
          label="Total Controls"
          value={controls.length}
          color="teal"
        />
        <StatsCard
          icon="fa-shield-check"
          label="Preventive"
          value={controls.filter(c => c.control_type === 'PREVENTIVE').length}
          color="green"
        />
        <StatsCard
          icon="fa-magnifying-glass"
          label="Detective"
          value={controls.filter(c => c.control_type === 'DETECTIVE').length}
          color="blue"
        />
        <StatsCard
          icon="fa-wrench"
          label="Corrective"
          value={controls.filter(c => c.control_type === 'CORRECTIVE').length}
          color="orange"
        />
      </div>

      <SearchBar
        placeholder="Search controls by code or title..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={controlTypeFilters}
      />

      {/* Controls Table */}
      <div className="controls-section">
        <h2 className="section-title">
          <i className="fas fa-shield-halved"></i>
          Controls ({filteredControls.length})
        </h2>

        {filteredControls.length > 0 ? (
          <div className="table-container">
            <table className="controls-table">
              <thead>
                <tr>
                  <th>Control Code</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Frequency</th>
                  <th>Risk Level</th>
                  <th>Q&E</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredControls.map(control => (
                  <tr key={control.id} onClick={() => handleViewDetails(control)} style={{ cursor: 'pointer' }}>
                    <td>
                      <span className="control-code">{control.control_code}</span>
                    </td>
                    <td>
                      <div className="control-title-cell">
                        <strong>{control.title}</strong>
                        <p className="control-description">{control.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`badge type-badge ${getTypeBadgeClass(control.control_type)}`}>
                        {control.control_type}
                      </span>
                    </td>
                    <td>
                      <span className="frequency-text">{control.frequency}</span>
                    </td>
                    <td>
                      <span className={`badge risk-badge ${getRiskBadgeClass(control.risk_level)}`}>
                        {control.risk_level}
                      </span>
                    </td>
                    <td>
                      <div className="qe-count">
                        <span className="count-item" title="Questions">
                          <i className="fas fa-circle-question"></i> {control.question_count || 0}
                        </span>
                        <span className="count-item" title="Evidence">
                          <i className="fas fa-file-lines"></i> {control.evidence_count || 0}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="icon-btn view-btn" 
                          onClick={() => handleViewDetails(control)} 
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="icon-btn edit-btn" 
                          onClick={() => handleEdit(control)} 
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="icon-btn question-btn" 
                          onClick={() => handleAddQuestion(control)} 
                          title="Add Question"
                        >
                          <i className="fas fa-circle-question"></i>
                        </button>
                        <button 
                          className="icon-btn evidence-btn" 
                          onClick={() => handleAddEvidence(control)} 
                          title="Add Evidence"
                        >
                          <i className="fas fa-file-lines"></i>
                        </button>
                        <button 
                          className="icon-btn delete-btn" 
                          onClick={() => handleDelete(control)} 
                          title="Delete"
                          disabled={actionLoading}
                        >
                          <i className="fas fa-trash"></i>
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
            icon="fa-shield-halved"
            title="No controls found"
            description={searchQuery || filterType 
              ? "Try adjusting your search or filter criteria" 
              : "Get started by creating your first control"}
            actionLabel={!searchQuery && !filterType ? "Create Control" : undefined}
            onAction={!searchQuery && !filterType ? handleCreateControl : undefined}
          />
        )}
      </div>

      <CreateControlModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        control={editingControl}
        subcategories={allSubcategories}
        currentSubcategoryId={subcategoryId}
      />

      <ControlDetailPanel
        control={selectedControl}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
      />
    </div>
  );
};

export default ControlList;
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import CreateControlModal from '../modals/CreateControlModal';
import ControlDetailPanel from '../components/ControlDetailPanel';
import './ControlList.css';


const ControlList = () => {
  const [searchParams] = useSearchParams();
  const subcategoryId = searchParams.get('subcategory');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedControl, setSelectedControl] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingControl, setEditingControl] = useState(null);

  // Mock data - replace with API call
  const subcategory = {
    id: subcategoryId || '1',
    name: 'User Access Management',
    code: 'UAM',
    category: {
      id: '1',
      name: 'Access Controls',
      domain: {
        id: '1',
        name: 'IT General Controls',
        framework: { id: '1', name: 'SOX', version: '2024.1' }
      }
    }
  };

  const [subcategories] = useState([
    { id: '1', name: 'User Access Management', code: 'UAM' },
    { id: '2', name: 'System Access Monitoring', code: 'SAM' },
    { id: '3', name: 'Privileged Access Management', code: 'PAM' }
  ]);

  const [controls, setControls] = useState([
    {
      id: '1',
      control_code: 'AC-001',
      title: 'User Account Creation Process',
      description: 'Ensure proper authorization for new user accounts',
      objective: 'Ensure compliance with access control policies',
      control_type: 'PREVENTIVE',
      frequency: 'DAILY',
      risk_level: 'HIGH',
      is_linked: true,
      question_count: 3,
      evidence_count: 2
    },
    {
      id: '2',
      control_code: 'AC-002',
      title: 'User Access Review',
      description: 'Regular review of user access rights',
      objective: 'Ensure users have appropriate access levels',
      control_type: 'DETECTIVE',
      frequency: 'QUARTERLY',
      risk_level: 'MEDIUM',
      is_linked: true,
      question_count: 2,
      evidence_count: 1
    },
    {
      id: '3',
      control_code: 'AC-003',
      title: 'Terminated User Access Removal',
      description: 'Immediate removal of access for terminated employees',
      objective: 'Prevent unauthorized access by former employees',
      control_type: 'PREVENTIVE',
      frequency: 'CONTINUOUS',
      risk_level: 'HIGH',
      is_linked: true,
      question_count: 4,
      evidence_count: 3
    },
    {
      id: '4',
      control_code: 'AC-004',
      title: 'Password Policy Enforcement',
      description: 'Enforce strong password requirements',
      objective: 'Enhance system security through strong passwords',
      control_type: 'PREVENTIVE',
      frequency: 'CONTINUOUS',
      risk_level: 'MEDIUM',
      is_linked: false,
      question_count: 0,
      evidence_count: 0
    }
  ]);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Frameworks', path: '/admin/frameworks', icon: 'fa-folder-tree' },
    { label: subcategory.category.domain.framework.name, path: `/admin/domains?framework=${subcategory.category.domain.framework.id}`, icon: 'fa-layer-group' },
    { label: subcategory.category.domain.name, path: `/admin/categories?domain=${subcategory.category.domain.id}`, icon: 'fa-tags' },
    { label: subcategory.category.name, path: `/admin/subcategories?category=${subcategory.category.id}`, icon: 'fa-sitemap' },
    { label: subcategory.name, icon: 'fa-shield-halved' }
  ];

  const controlTypeFilters = [
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

  const handleDelete = (control) => {
    if (window.confirm(`Are you sure you want to delete ${control.control_code}?`)) {
      setControls(prev => prev.filter(c => c.id !== control.id));
      console.log('Control deleted:', control);
    }
  };

  const handleLink = (control) => {
    setControls(prev => 
      prev.map(c => c.id === control.id ? { ...c, is_linked: true } : c)
    );
    console.log('Control linked:', control, 'to subcategory:', subcategoryId);
  };

  const handleUnlink = (control) => {
    if (window.confirm(`Are you sure you want to unlink ${control.control_code}?`)) {
      setControls(prev => 
        prev.map(c => c.id === control.id ? { ...c, is_linked: false } : c)
      );
      console.log('Control unlinked:', control);
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

  const handleModalSubmit = (formData) => {
    if (editingControl) {
      // Update existing control
      setControls(prev => 
        prev.map(c => c.id === editingControl.id ? { ...c, ...formData } : c)
      );
      console.log('Control updated:', formData);
    } else {
      // Create new control
      const newControl = {
        id: String(controls.length + 1),
        ...formData,
        is_linked: formData.subcategory_id ? true : false,
        question_count: 0,
        evidence_count: 0
      };
      setControls(prev => [...prev, newControl]);
      console.log('Control created:', newControl);
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
    const matchesSearch = c.control_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || c.control_type === filterType;
    return matchesSearch && matchesType;
  });

  const linkedControls = filteredControls.filter(c => c.is_linked);
  const unlinkedControls = filteredControls.filter(c => !c.is_linked);

  return (
    <div className="control-list">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Controls</h1>
          <p className="view-subtitle">
            Manage controls for {subcategory.name}
          </p>
        </div>
        <button className="create-btn" onClick={handleCreateControl}>
          <i className="fas fa-plus"></i>
          Create Control
        </button>
      </div>

      <SearchBar
        placeholder="Search controls by code or title..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={controlTypeFilters}
      />

      {/* Linked Controls */}
      <div className="controls-section">
        <h2 className="section-title">
          <i className="fas fa-link"></i>
          Linked Controls ({linkedControls.length})
        </h2>

        {linkedControls.length > 0 ? (
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
                {linkedControls.map(control => (
                  <tr key={control.id} onClick={() => handleViewDetails(control)}>
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
                          <i className="fas fa-circle-question"></i> {control.question_count}
                        </span>
                        <span className="count-item" title="Evidence">
                          <i className="fas fa-file-lines"></i> {control.evidence_count}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <button className="icon-btn view-btn" onClick={() => handleViewDetails(control)} title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="icon-btn edit-btn" onClick={() => handleEdit(control)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="icon-btn question-btn" onClick={() => handleAddQuestion(control)} title="Add Question">
                          <i className="fas fa-circle-question"></i>
                        </button>
                        <button className="icon-btn evidence-btn" onClick={() => handleAddEvidence(control)} title="Add Evidence">
                          <i className="fas fa-file-lines"></i>
                        </button>
                        <button className="icon-btn unlink-btn" onClick={() => handleUnlink(control)} title="Unlink">
                          <i className="fas fa-unlink"></i>
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => handleDelete(control)} title="Delete">
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
            title="No linked controls found"
            description="Link existing controls or create new ones"
          />
        )}
      </div>

      {/* Unlinked Controls */}
      {unlinkedControls.length > 0 && (
        <div className="controls-section">
          <h2 className="section-title">
            <i className="fas fa-unlink"></i>
            Unlinked Controls ({unlinkedControls.length})
          </h2>

          <div className="table-container">
            <table className="controls-table">
              <thead>
                <tr>
                  <th>Control Code</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Frequency</th>
                  <th>Risk Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unlinkedControls.map(control => (
                  <tr key={control.id}>
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
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <button className="icon-btn link-btn" onClick={() => handleLink(control)} title="Link">
                          <i className="fas fa-link"></i>
                        </button>
                        <button className="icon-btn edit-btn" onClick={() => handleEdit(control)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => handleDelete(control)} title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateControlModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        control={editingControl}
        subcategories={subcategories}
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

import React, { useState } from 'react';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import AddEvidenceModal from '../modals/AddEvidenceModal';
import './EvidenceList.css';


const EvidenceList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState(null);

  // Mock data
  const [evidenceList, setEvidenceList] = useState([
    {
      id: '1',
      title: 'User Access Request Form',
      description: 'Documented request form for new user access',
      evidence_type: 'DOCUMENT',
      file_format: 'PDF, DOC',
      is_mandatory: true,
      sort_order: 1,
      control: { control_code: 'AC-001', title: 'User Account Creation' }
    },
    {
      id: '2',
      title: 'Manager Approval Email',
      description: 'Email approval from manager for access request',
      evidence_type: 'SCREENSHOT',
      file_format: 'PNG, JPG',
      is_mandatory: true,
      sort_order: 2,
      control: { control_code: 'AC-001', title: 'User Account Creation' }
    },
    {
      id: '3',
      title: 'Access Review Report',
      description: 'Quarterly access review report',
      evidence_type: 'REPORT',
      file_format: 'PDF, XLSX',
      is_mandatory: true,
      sort_order: 1,
      control: { control_code: 'AC-002', title: 'User Access Review' }
    },
    {
      id: '4',
      title: 'Password Policy Document',
      description: 'Corporate password policy documentation',
      evidence_type: 'POLICY',
      file_format: 'PDF',
      is_mandatory: false,
      sort_order: 1,
      control: { control_code: 'AC-004', title: 'Password Management' }
    },
    {
      id: '5',
      title: 'System Audit Logs',
      description: 'System access and activity logs',
      evidence_type: 'LOG_FILE',
      file_format: 'LOG, TXT, CSV',
      is_mandatory: true,
      sort_order: 1,
      control: { control_code: 'AC-003', title: 'System Monitoring' }
    }
  ]);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Evidence Requirements', icon: 'fa-file-lines' }
  ];

  const typeFilters = [
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

  const handleDelete = (evidence) => {
    if (window.confirm('Are you sure you want to delete this evidence requirement?')) {
      setEvidenceList(prev => prev.filter(ev => ev.id !== evidence.id));
      console.log('Evidence deleted:', evidence);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEvidence(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingEvidence) {
      // Update existing evidence
      setEvidenceList(prev => 
        prev.map(ev => ev.id === editingEvidence.id 
          ? { ...ev, ...formData } 
          : ev
        )
      );
      console.log('Evidence updated:', formData);
    } else {
      // Create new evidence
      const newEvidence = {
        id: String(evidenceList.length + 1),
        ...formData,
        control: { control_code: 'GENERAL', title: 'General Evidence' }
      };
      setEvidenceList(prev => [...prev, newEvidence]);
      console.log('Evidence created:', newEvidence);
    }
  };

  const filteredEvidence = evidenceList.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || ev.evidence_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="evidence-list">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Evidence Requirements</h1>
          <p className="view-subtitle">Manage all evidence requirements across controls</p>
        </div>
        <button className="create-btn" onClick={handleCreateEvidence}>
          <i className="fas fa-plus"></i>
          Add Evidence
        </button>
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
              {filteredEvidence.map(evidence => (
                <tr key={evidence.id}>
                  <td>
                    <strong className="evidence-title">{evidence.title}</strong>
                  </td>
                  <td>
                    <p className="evidence-description">{evidence.description}</p>
                  </td>
                  <td>
                    <div className="control-info">
                      <span className="control-code">{evidence.control.control_code}</span>
                      <span className="control-title">{evidence.control.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge type-badge">{evidence.evidence_type}</span>
                  </td>
                  <td>
                    <span className="format-text">{evidence.file_format}</span>
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
                      <button className="icon-btn edit-btn" onClick={() => handleEdit(evidence)} title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDelete(evidence)} title="Delete">
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
          icon="fa-file-lines"
          title="No evidence requirements found"
          description="Try adjusting your search criteria"
        />
      )}

      <AddEvidenceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        evidence={editingEvidence}
      />
    </div>
  );
};

export default EvidenceList;

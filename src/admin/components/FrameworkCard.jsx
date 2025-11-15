import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrameworkCard.css';

const FrameworkCard = ({ framework, onEdit, onDelete, onClone }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'DRAFT':
        return 'status-draft';
      case 'DEPRECATED':
        return 'status-deprecated';
      default:
        return '';
    }
  };

  const handleClick = () => {
    navigate(`/admin/domains?framework=${framework.id}`);
  };

  return (
    <div className="framework-card" onClick={handleClick}>
      <div className="framework-card-header">
        <div className="framework-icon">
          <i className="fas fa-folder-tree"></i>
        </div>
        <span className={`framework-status ${getStatusColor(framework.status)}`}>
          {framework.status}
        </span>
      </div>

      <div className="framework-card-body">
        <h3 className="framework-name">{framework.name}</h3>
        <p className="framework-full-name">{framework.full_name}</p>
        <p className="framework-version">Version: {framework.version}</p>
        {framework.description && (
          <p className="framework-description">{framework.description}</p>
        )}
      </div>

      <div className="framework-card-stats">
        <div className="stat-item">
          <i className="fas fa-layer-group"></i>
          <span>{framework.domain_count || 0} Domains</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-shield-halved"></i>
          <span>{framework.control_count || 0} Controls</span>
        </div>
      </div>

      <div className="framework-card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="action-btn edit-btn" onClick={() => onEdit(framework)}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="action-btn clone-btn" onClick={() => onClone(framework)}>
          <i className="fas fa-copy"></i>
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(framework)}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default FrameworkCard;
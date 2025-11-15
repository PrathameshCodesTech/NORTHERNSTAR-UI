import React from 'react';
import './EntityCard.css';

const EntityCard = ({ 
  entity, 
  type = 'domain',
  onEdit, 
  onDelete, 
  onLink, 
  onUnlink,
  isLinked = true,
  onClick 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'domain':
        return 'fa-layer-group';
      case 'category':
        return 'fa-tags';
      case 'subcategory':
        return 'fa-sitemap';
      default:
        return 'fa-folder';
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(entity);
    }
  };

  return (
    <div className="entity-card" onClick={handleCardClick}>
      <div className="entity-card-header">
        <div className="entity-icon">
          <i className={`fas ${getIcon()}`}></i>
        </div>
        {entity.code && (
          <span className="entity-code">{entity.code}</span>
        )}
      </div>

      <div className="entity-card-body">
        <h4 className="entity-name">{entity.name}</h4>
        {entity.description && (
          <p className="entity-description">{entity.description}</p>
        )}
        {entity.sort_order !== undefined && (
          <span className="entity-sort">Order: {entity.sort_order}</span>
        )}
      </div>

      <div className="entity-card-actions" onClick={(e) => e.stopPropagation()}>
        {isLinked ? (
          <>
            <button className="action-btn edit-btn" onClick={() => onEdit(entity)} title="Edit">
              <i className="fas fa-edit"></i>
            </button>
            <button className="action-btn unlink-btn" onClick={() => onUnlink(entity)} title="Unlink">
              <i className="fas fa-unlink"></i>
            </button>
            <button className="action-btn delete-btn" onClick={() => onDelete(entity)} title="Delete">
              <i className="fas fa-trash"></i>
            </button>
          </>
        ) : (
          <>
            <button className="action-btn link-btn" onClick={() => onLink(entity)} title="Link">
              <i className="fas fa-link"></i>
            </button>
            <button className="action-btn edit-btn" onClick={() => onEdit(entity)} title="Edit">
              <i className="fas fa-edit"></i>
            </button>
            <button className="action-btn delete-btn" onClick={() => onDelete(entity)} title="Delete">
              <i className="fas fa-trash"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EntityCard;
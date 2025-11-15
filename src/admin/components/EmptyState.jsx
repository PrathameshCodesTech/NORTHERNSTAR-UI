import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  icon = 'fa-folder-open',
  title = 'No items found',
  description = 'Get started by creating a new item',
  actionLabel,
  onAction 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          <i className="fas fa-plus"></i>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
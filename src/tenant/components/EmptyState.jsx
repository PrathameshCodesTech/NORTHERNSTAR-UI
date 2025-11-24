// src/tenant/components/EmptyState.jsx
import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  icon = 'fa-inbox',
  title = 'No data available',
  description,
  actionLabel,
  onAction,
  compact = false
}) => {
  return (
    <div className={`empty-state ${compact ? 'compact' : ''}`}>
      <div className="empty-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="empty-title">{title}</h3>
      {description && <p className="empty-description">{description}</p>}
      {actionLabel && onAction && (
        <button className="empty-action-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
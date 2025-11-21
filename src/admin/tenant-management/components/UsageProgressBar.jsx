// src/admin/components/UsageProgressBar.jsx
import React from 'react';
import '../styles/TenantManagement.css';

const UsageProgressBar = ({ 
  label, 
  current, 
  limit, 
  unit = '', 
  showPercentage = true,
  height = 'medium' // small, medium, large
}) => {
  const isUnlimited = limit === 0 || limit === null;
  const percentage = isUnlimited ? 0 : Math.round((current / limit) * 100);
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;

  const getBarColor = () => {
    if (isOverLimit) return 'progress-red';
    if (isNearLimit) return 'progress-orange';
    return 'progress-blue';
  };

  const getHeightClass = () => {
    switch (height) {
      case 'small': return 'progress-sm';
      case 'large': return 'progress-lg';
      default: return 'progress-md';
    }
  };

  return (
    <div className="usage-progress-container">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-values">
          {current}{unit} / {isUnlimited ? '∞' : `${limit}${unit}`}
          {showPercentage && !isUnlimited && (
            <span className={`progress-percentage ${isOverLimit ? 'text-red' : isNearLimit ? 'text-orange' : ''}`}>
              ({percentage}%)
            </span>
          )}
        </span>
      </div>
      
      <div className={`progress-bar-container ${getHeightClass()}`}>
        <div 
          className={`progress-bar ${getBarColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        >
          {percentage >= 20 && (
            <span className="progress-bar-text">{percentage}%</span>
          )}
        </div>
      </div>

      {isOverLimit && (
        <div className="progress-warning">
          <i className="fas fa-exclamation-triangle"></i>
          Limit exceeded! Please upgrade your plan.
        </div>
      )}
      
      {isNearLimit && !isOverLimit && (
        <div className="progress-warning warning-near">
          <i className="fas fa-exclamation-circle"></i>
          Approaching limit
        </div>
      )}
    </div>
  );
};

export default UsageProgressBar;
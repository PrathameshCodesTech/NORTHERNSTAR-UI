// src/admin/components/TenantStatsCard.jsx
import React from 'react';
import '../styles/TenantManagement.css';

const TenantStatsCard = ({ 
  icon, 
  label, 
  value, 
  limit = null, 
  color = 'blue',
  trend = null,
  onClick = null 
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'stats-blue';
      case 'green': return 'stats-green';
      case 'orange': return 'stats-orange';
      case 'red': return 'stats-red';
      case 'purple': return 'stats-purple';
      case 'teal': return 'stats-teal';
      default: return 'stats-blue';
    }
  };

  const getPercentage = () => {
    if (limit === null || limit === 0) return null;
    return Math.round((value / limit) * 100);
  };

  const percentage = getPercentage();
  const isNearLimit = percentage && percentage >= 80;
  const isOverLimit = percentage && percentage >= 100;

  return (
    <div 
      className={`tenant-stats-card ${getColorClass()} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stats-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      
      <div className="stats-content">
        <div className="stats-label">{label}</div>
        
        <div className="stats-value-row">
          <span className="stats-value">{value}</span>
          
          {limit !== null && (
            <span className="stats-limit">
              / {limit === 0 ? '∞' : limit}
            </span>
          )}
        </div>

        {percentage !== null && (
          <div className="stats-progress">
            <div 
              className={`stats-progress-bar ${isOverLimit ? 'over-limit' : isNearLimit ? 'near-limit' : ''}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        )}

        {trend && (
          <div className={`stats-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
            <i className={`fas fa-arrow-${trend > 0 ? 'up' : 'down'}`}></i>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantStatsCard;
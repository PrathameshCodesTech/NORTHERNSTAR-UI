// src/tenant/components/StatCard.jsx
import React from 'react';
import './StatCard.css';

const StatCard = ({ 
  icon, 
  title, 
  value, 
  change, 
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  color = '#14b8a6',
  subtitle,
  onClick
}) => {
  const getChangeIcon = () => {
    if (changeType === 'positive') return 'fa-arrow-up';
    if (changeType === 'negative') return 'fa-arrow-down';
    return 'fa-minus';
  };

  const getChangeClass = () => {
    if (changeType === 'positive') return 'change-positive';
    if (changeType === 'negative') return 'change-negative';
    return 'change-neutral';
  };

  return (
    <div 
      className={`stat-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
        <i className={`fas ${icon}`} style={{ color }}></i>
      </div>

      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        
        {change && (
          <div className={`stat-change ${getChangeClass()}`}>
            <i className={`fas ${getChangeIcon()}`}></i>
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
import React from 'react';
import './StatsCard.css';

const StatsCard = ({ icon, label, value, color = 'teal' }) => {
  const getColorClass = () => {
    switch (color) {
      case 'teal':
        return 'stats-teal';
      case 'blue':
        return 'stats-blue';
      case 'green':
        return 'stats-green';
      case 'purple':
        return 'stats-purple';
      default:
        return 'stats-teal';
    }
  };

  return (
    <div className={`stats-card ${getColorClass()}`}>
      <div className="stats-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <h3 className="stats-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
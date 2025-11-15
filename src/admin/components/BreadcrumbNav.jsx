import React from 'react';
import { Link } from 'react-router-dom';
import './BreadcrumbNav.css';

const BreadcrumbNav = ({ items }) => {
  return (
    <nav className="breadcrumb-nav">
      <div className="breadcrumb-items">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <i className="fas fa-chevron-right breadcrumb-separator"></i>}
            {item.path ? (
              <Link to={item.path} className="breadcrumb-link">
                {item.icon && <i className={`fas ${item.icon}`}></i>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="breadcrumb-current">
                {item.icon && <i className={`fas ${item.icon}`}></i>}
                <span>{item.label}</span>
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default BreadcrumbNav;
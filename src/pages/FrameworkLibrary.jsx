// src/pages/FrameworkLibrary.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FrameworkLibrary.css';

const FrameworkLibrary = () => {
  const navigate = useNavigate();
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFramework, setExpandedFramework] = useState(null);

  // Get selected plan from session storage
  const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan') || '{}');
  
  // Mock framework data - will be replaced with API call
  const frameworks = [
    {
      id: 'iso27001',
      name: 'ISO 27001',
      code: 'ISO27001',
      description: 'Information Security Management System - International standard for managing information security',
      category: 'Security & Privacy',
      version: '2022',
      control_count: 114,
      domain_count: 4,
      domains: [
        {
          id: 'd1',
          name: 'Organizational Controls',
          control_count: 37,
          categories: [
            {
              id: 'c1',
              name: 'Access Control',
              subcategories: [
                { id: 'sc1', name: 'User Access Management', control_count: 8 },
                { id: 'sc2', name: 'User Responsibilities', control_count: 5 }
              ]
            },
            {
              id: 'c2',
              name: 'Cryptography',
              subcategories: [
                { id: 'sc3', name: 'Cryptographic Controls', control_count: 4 }
              ]
            }
          ]
        },
        {
          id: 'd2',
          name: 'People Controls',
          control_count: 8,
          categories: [
            {
              id: 'c3',
              name: 'Human Resource Security',
              subcategories: [
                { id: 'sc4', name: 'Prior to Employment', control_count: 3 },
                { id: 'sc5', name: 'During Employment', control_count: 3 }
              ]
            }
          ]
        },
        {
          id: 'd3',
          name: 'Physical Controls',
          control_count: 14,
          categories: []
        },
        {
          id: 'd4',
          name: 'Technological Controls',
          control_count: 55,
          categories: []
        }
      ],
      icon: 'fa-shield-halved',
      color: '#3b82f6'
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      code: 'GDPR',
      description: 'General Data Protection Regulation - EU data protection and privacy regulation',
      category: 'Data Protection',
      version: '2018',
      control_count: 99,
      domain_count: 3,
      domains: [
        {
          id: 'gd1',
          name: 'Principles',
          control_count: 7,
          categories: []
        },
        {
          id: 'gd2',
          name: 'Rights of Data Subjects',
          control_count: 44,
          categories: []
        },
        {
          id: 'gd3',
          name: 'Controller & Processor Obligations',
          control_count: 48,
          categories: []
        }
      ],
      icon: 'fa-user-shield',
      color: '#10b981'
    },
    {
      id: 'sox',
      name: 'SOX',
      code: 'SOX',
      description: 'Sarbanes-Oxley Act - Financial reporting and internal controls for public companies',
      category: 'Financial Compliance',
      version: '2002',
      control_count: 68,
      domain_count: 2,
      domains: [
        {
          id: 'sd1',
          name: 'Internal Controls',
          control_count: 35,
          categories: []
        },
        {
          id: 'sd2',
          name: 'Financial Reporting',
          control_count: 33,
          categories: []
        }
      ],
      icon: 'fa-file-invoice-dollar',
      color: '#f59e0b'
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      code: 'HIPAA',
      description: 'Health Insurance Portability and Accountability Act - Healthcare data privacy and security',
      category: 'Healthcare',
      version: '1996',
      control_count: 90,
      domain_count: 3,
      domains: [
        {
          id: 'hd1',
          name: 'Administrative Safeguards',
          control_count: 38,
          categories: []
        },
        {
          id: 'hd2',
          name: 'Physical Safeguards',
          control_count: 24,
          categories: []
        },
        {
          id: 'hd3',
          name: 'Technical Safeguards',
          control_count: 28,
          categories: []
        }
      ],
      icon: 'fa-heart-pulse',
      color: '#ef4444'
    },
    {
      id: 'pci',
      name: 'PCI DSS',
      code: 'PCIDSS',
      description: 'Payment Card Industry Data Security Standard - Security for payment card transactions',
      category: 'Financial Security',
      version: '4.0',
      control_count: 78,
      domain_count: 6,
      domains: [],
      icon: 'fa-credit-card',
      color: '#8b5cf6'
    },
    {
      id: 'nist',
      name: 'NIST CSF',
      code: 'NISTCSF',
      description: 'NIST Cybersecurity Framework - Comprehensive cybersecurity risk management',
      category: 'Cybersecurity',
      version: '2.0',
      control_count: 108,
      domain_count: 5,
      domains: [],
      icon: 'fa-network-wired',
      color: '#06b6d4'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Frameworks', count: frameworks.length },
    { id: 'security', name: 'Security & Privacy', count: 2 },
    { id: 'data', name: 'Data Protection', count: 1 },
    { id: 'financial', name: 'Financial Compliance', count: 2 },
    { id: 'healthcare', name: 'Healthcare', count: 1 },
    { id: 'cyber', name: 'Cybersecurity', count: 1 }
  ];

  const handleSelectFramework = (framework) => {
    if (selectedFrameworks.includes(framework.id)) {
      setSelectedFrameworks(selectedFrameworks.filter(id => id !== framework.id));
    } else {
      // Check if limit reached (based on selected plan)
      const maxFrameworks = selectedPlan.plan_code === 'BASIC' ? 2 : selectedPlan.plan_code === 'PROFESSIONAL' ? 5 : 999;
      
      if (selectedFrameworks.length >= maxFrameworks) {
        alert(`You can only select ${maxFrameworks} frameworks with your ${selectedPlan.plan_name} plan. Please remove a framework first or upgrade your plan.`);
        return;
      }
      setSelectedFrameworks([...selectedFrameworks, framework.id]);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedFrameworks.length === 0) {
      alert('Please select at least one framework to continue.');
      return;
    }

    // Store selection
    sessionStorage.setItem('selectedFrameworks', JSON.stringify(
      frameworks.filter(f => selectedFrameworks.includes(f.id)).map(f => ({
        id: f.id,
        name: f.name,
        code: f.code
      }))
    ));

    // Navigate to payment page
    navigate('/checkout');
  };

  const toggleFrameworkExpand = (frameworkId) => {
    setExpandedFramework(expandedFramework === frameworkId ? null : frameworkId);
  };

  const filteredFrameworks = frameworks.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getFrameworkLimit = () => {
    if (selectedPlan.plan_code === 'BASIC') return 2;
    if (selectedPlan.plan_code === 'PROFESSIONAL') return 5;
    return 'Unlimited';
  };

  return (
    <div className="framework-library-page">
    


      {/* Main Content */}
      <div className="library-content">
        {/* Selection Summary */}
        <div className="selection-summary">
          <div className="summary-left">
            <div className="plan-badge">
              <i className="fas fa-tag"></i>
              {selectedPlan.plan_name} Plan
            </div>
            <div className="framework-count">
              {selectedFrameworks.length} / {getFrameworkLimit()} frameworks selected
            </div>
          </div>
          <button 
            className="proceed-btn"
            onClick={handleProceedToPayment}
            disabled={selectedFrameworks.length === 0}
          >
            Proceed to Payment
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        {/* Filters */}
        <div className="library-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
                <span className="count-badge">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>

        {/* Frameworks Grid/List */}
        <div className={`frameworks-container ${viewMode}`}>
          {filteredFrameworks.map(framework => (
            <div
              key={framework.id}
              className={`framework-card ${selectedFrameworks.includes(framework.id) ? 'selected' : ''} ${expandedFramework === framework.id ? 'expanded' : ''}`}
            >
              <div className="framework-header">
                <div className="framework-icon" style={{ backgroundColor: framework.color }}>
                  <i className={`fas ${framework.icon}`}></i>
                </div>
                <div className="framework-info">
                  <h3 className="framework-name">{framework.name}</h3>
                  <p className="framework-code">{framework.code} v{framework.version}</p>
                </div>
                {selectedFrameworks.includes(framework.id) && (
                  <div className="selected-badge">
                    <i className="fas fa-check-circle"></i>
                  </div>
                )}
              </div>

              <p className="framework-description">{framework.description}</p>

              <div className="framework-stats">
                <div className="stat-item">
                  <i className="fas fa-layer-group"></i>
                  <span>{framework.domain_count} Domains</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-list-check"></i>
                  <span>{framework.control_count} Controls</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-tag"></i>
                  <span>{framework.category}</span>
                </div>
              </div>

              <div className="framework-actions">
                <button
                  className="view-details-btn"
                  onClick={() => toggleFrameworkExpand(framework.id)}
                >
                  <i className={`fas fa-chevron-${expandedFramework === framework.id ? 'up' : 'down'}`}></i>
                  {expandedFramework === framework.id ? 'Hide' : 'View'} Details
                </button>
                <button
                  className={`select-framework-btn ${selectedFrameworks.includes(framework.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectFramework(framework)}
                >
                  {selectedFrameworks.includes(framework.id) ? (
                    <>
                      <i className="fas fa-check"></i> Selected
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i> Select
                    </>
                  )}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedFramework === framework.id && framework.domains.length > 0 && (
                <div className="framework-details">
                  <h4 className="details-title">Framework Structure:</h4>
                  <div className="domains-list">
                    {framework.domains.map(domain => (
                      <div key={domain.id} className="domain-item">
                        <div className="domain-header">
                          <i className="fas fa-folder"></i>
                          <span className="domain-name">{domain.name}</span>
                          <span className="control-count">{domain.control_count} controls</span>
                        </div>
                        {domain.categories && domain.categories.length > 0 && (
                          <div className="categories-list">
                            {domain.categories.map(category => (
                              <div key={category.id} className="category-item">
                                <i className="fas fa-folder-open"></i>
                                <span>{category.name}</span>
                                {category.subcategories && (
                                  <div className="subcategories-list">
                                    {category.subcategories.map(sub => (
                                      <div key={sub.id} className="subcategory-item">
                                        <i className="fas fa-file-alt"></i>
                                        <span>{sub.name}</span>
                                        <span className="count">({sub.control_count})</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFrameworks.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <h3>No frameworks found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameworkLibrary;
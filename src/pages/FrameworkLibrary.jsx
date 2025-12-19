// src/pages/FrameworkLibrary.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { frameworkCategoryAPI, frameworkAPI } from '../services/templateService';
import { useOnboarding } from '../contexts/OnboardingContext';
import './FrameworkLibrary.css';

const FrameworkLibrary = () => {
  const { onboardingData } = useOnboarding();
  const navigate = useNavigate();
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFramework, setExpandedFramework] = useState(null);


  // API Data States
  const [categories, setCategories] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [frameworkDetails, setFrameworkDetails] = useState({}); // Cache for expanded frameworks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get selected plan from session storage
  const selectedPlan = onboardingData.selected_plan ||
    JSON.parse(sessionStorage.getItem('selectedPlan') || '{}');

  // Icon mapping for framework categories
  const iconMap = {
    'bank': 'fa-building-columns',
    'shield': 'fa-shield-halved',
    'lock': 'fa-lock',
    'health': 'fa-heart-pulse',
    'industry': 'fa-industry',
    'leaf': 'fa-leaf',
    'network': 'fa-network-wired',
    'credit-card': 'fa-credit-card'
  };

  // ============================================================================
  // API CALLS
  // ============================================================================

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load frameworks on mount
  useEffect(() => {
    loadFrameworks();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await frameworkCategoryAPI.getAll();

      // Transform API response to match component structure
      const categoriesData = [
        { id: 'all', name: 'All Frameworks', count: 0 }, // Will update count after frameworks load
        ...response.results.map(cat => ({
          id: cat.id,
          name: cat.name,
          code: cat.code,
          icon: iconMap[cat.icon] || 'fa-folder',
          color: cat.color,
          count: 0 // Will be updated from frameworks
        }))
      ];

      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load framework categories');
    }
  };

  const loadFrameworks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch only ACTIVE frameworks
      const response = await frameworkAPI.getAll({
        status: 'ACTIVE',
        is_active: true
      });

      // Enrich frameworks with stats (domain_count, control_count)
      const enrichedFrameworks = await Promise.all(
        response.results.map(async (fw) => {
          try {
            const stats = await frameworkAPI.getStats(fw.id);

            return {
              id: fw.id,
              name: fw.name,
              code: fw.name, // Use name as code
              full_name: fw.full_name,
              description: fw.description || `${fw.full_name} compliance framework`,
              category: fw.category_name || 'General',
              category_id: fw.category,
              version: fw.version,
              status: fw.status,
              control_count: stats.hierarchy.controls,
              domain_count: stats.hierarchy.domains,
              // Get icon from category or use default
              icon: 'fa-shield-halved', // Default, will be updated from category match
              color: '#3b82f6' // Default color
            };
          } catch (err) {
            console.error(`Failed to load stats for ${fw.name}:`, err);
            // Return framework without stats
            return {
              id: fw.id,
              name: fw.name,
              code: fw.name,
              full_name: fw.full_name,
              description: fw.description || `${fw.full_name} compliance framework`,
              category: fw.category_name || 'General',
              category_id: fw.category,
              version: fw.version,
              status: fw.status,
              control_count: 0,
              domain_count: 0,
              icon: 'fa-shield-halved',
              color: '#3b82f6'
            };
          }
        })
      );

      setFrameworks(enrichedFrameworks);

      // Update category counts
      updateCategoryCounts(enrichedFrameworks);

    } catch (err) {
      console.error('Failed to load frameworks:', err);
      setError('Failed to load frameworks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryCounts = (frameworksData) => {
    setCategories(prevCategories => {
      return prevCategories.map(cat => {
        if (cat.id === 'all') {
          return { ...cat, count: frameworksData.length };
        }

        const count = frameworksData.filter(fw => fw.category_id === cat.id).length;
        return { ...cat, count };
      });
    });
  };

  const loadFrameworkDetails = async (frameworkId) => {
    // Check if already loaded
    if (frameworkDetails[frameworkId]) {
      return frameworkDetails[frameworkId];
    }

    try {
      const details = await frameworkAPI.getById(frameworkId, true); // deep=true

      // Cache the details
      setFrameworkDetails(prev => ({
        ...prev,
        [frameworkId]: details
      }));

      return details;
    } catch (err) {
      console.error(`Failed to load framework details for ${frameworkId}:`, err);
      throw err;
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSelectFramework = (framework) => {
    if (selectedFrameworks.includes(framework.id)) {
      setSelectedFrameworks(selectedFrameworks.filter(id => id !== framework.id));
    } else {
      // Check if limit reached (based on selected plan)
      const maxFrameworks = selectedPlan.plan_code === 'BASIC' ? 2 :
        selectedPlan.plan_code === 'PROFESSIONAL' ? 5 : 999;

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


    //  Store selection to sessionStorage
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

  const toggleFrameworkExpand = async (frameworkId) => {
    if (expandedFramework === frameworkId) {
      setExpandedFramework(null);
    } else {
      setExpandedFramework(frameworkId);

      // Load details if not already loaded
      if (!frameworkDetails[frameworkId]) {
        try {
          await loadFrameworkDetails(frameworkId);
        } catch (err) {
          alert('Failed to load framework details. Please try again.');
          setExpandedFramework(null);
        }
      }
    }
  };

  // ============================================================================
  // FILTERING
  // ============================================================================

  const filteredFrameworks = frameworks.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.full_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || f.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getFrameworkLimit = () => {
    if (selectedPlan.plan_code === 'BASIC') return 2;
    if (selectedPlan.plan_code === 'PROFESSIONAL') return 5;
    return 'Unlimited';
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderFrameworkDetails = (framework) => {
    const details = frameworkDetails[framework.id];

    if (!details || !details.domains || details.domains.length === 0) {
      return (
        <div className="framework-details">
          <p className="no-details">No detailed structure available for this framework.</p>
        </div>
      );
    }

    return (
      <div className="framework-details">
        <h4 className="details-title">Framework Structure:</h4>
        <div className="domains-list">
          {details.domains.map(domain => (
            <div key={domain.id} className="domain-item">
              <div className="domain-header">
                <i className="fas fa-folder"></i>
                <span className="domain-name">{domain.name}</span>
                <span className="control-count">
                  {domain.categories?.reduce((sum, cat) =>
                    sum + (cat.subcategories?.reduce((subSum, sub) =>
                      subSum + (sub.controls?.length || 0), 0) || 0), 0) || 0} controls
                </span>
              </div>
              {domain.categories && domain.categories.length > 0 && (
                <div className="categories-list">
                  {domain.categories.map(category => (
                    <div key={category.id} className="category-item">
                      <i className="fas fa-folder-open"></i>
                      <span>{category.name}</span>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="subcategories-list">
                          {category.subcategories.map(sub => (
                            <div key={sub.id} className="subcategory-item">
                              <i className="fas fa-file-alt"></i>
                              <span>{sub.name}</span>
                              <span className="count">({sub.controls?.length || 0})</span>
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
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="framework-library-page">
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading frameworks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="framework-library-page">
        <div className="error-container">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Error Loading Frameworks</h3>
          <p>{error}</p>
          <button onClick={loadFrameworks} className="retry-btn">
            <i className="fas fa-refresh"></i> Retry
          </button>
        </div>
      </div>
    );
  }

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
                {/* <div className="framework-icon" style={{ backgroundColor: framework.color }}>
                  <i className={`fas ${framework.icon}`}></i>
                </div> */}
                <div className="framework-info">
                  <h3 className="framework-name">{framework.name}</h3>
                  <p className="framework-code">v{framework.version}</p>
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
                  disabled={expandedFramework === framework.id && !frameworkDetails[framework.id]}
                >
                  {expandedFramework === framework.id && !frameworkDetails[framework.id] ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Loading...
                    </>
                  ) : (
                    <>
                      <i className={`fas fa-chevron-${expandedFramework === framework.id ? 'up' : 'down'}`}></i>
                      {expandedFramework === framework.id ? 'Hide' : 'View'} Details
                    </>
                  )}
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
              {expandedFramework === framework.id && renderFrameworkDetails(framework)}
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
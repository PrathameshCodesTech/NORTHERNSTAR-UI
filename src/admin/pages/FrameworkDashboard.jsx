// src/admin/pages/FrameworkDashboard.jsx
import React, { useState, useEffect } from 'react';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import FrameworkCard from '../components/FrameworkCard';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import CreateFrameworkModal from '../modals/CreateFrameworkModal';
import { frameworkAPI } from '../../services/templateService';
import './FrameworkDashboard.css';

const FrameworkDashboard = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFramework, setEditingFramework] = useState(null);

  // ============================================================================
  // FETCH FRAMEWORKS ON MOUNT
  // ============================================================================
  useEffect(() => {
    fetchFrameworks();
  }, []);

  // ============================================================================
  // HELPER: COUNT CONTROLS IN NESTED STRUCTURE
  // ============================================================================
  const countControls = (domains) => {
    let total = 0;
    domains.forEach(domain => {
      domain.categories?.forEach(category => {
        category.subcategories?.forEach(subcategory => {
          total += subcategory.controls?.length || 0;
        });
      });
    });
    return total;
  };

  const fetchFrameworks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch with deep=true to get nested hierarchy
      const data = await frameworkAPI.getAll({ deep: 'true' });

      console.log('API Response:', data);

      // Handle paginated or direct array response
      const frameworksArray = Array.isArray(data)
        ? data
        : (data?.results || []);

      // Calculate counts from nested data
      const frameworksWithCounts = frameworksArray.map(fw => ({
        ...fw,
        domain_count: fw.domains?.length || 0,
        control_count: countControls(fw.domains || [])
      }));

      console.log('Frameworks with counts:', frameworksWithCounts);
      setFrameworks(frameworksWithCounts);

    } catch (err) {
      console.error('Error fetching frameworks:', err);
      setError('Failed to load frameworks. Please try again.');
      setFrameworks([]);
    } finally {
      setLoading(false);
    }
  };


  // ============================================================================
  // BREADCRUMB & FILTERS
  // ============================================================================
  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Frameworks', icon: 'fa-folder-tree' }
  ];

  const statusFilters = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Deprecated', value: 'DEPRECATED' }
  ];

  // ============================================================================
  // SEARCH & FILTER HANDLERS
  // ============================================================================
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  // ============================================================================
  // CRUD HANDLERS
  // ============================================================================

  // CREATE FRAMEWORK
  const handleCreateFramework = () => {
    setEditingFramework(null);
    setIsModalOpen(true);
  };

  // EDIT FRAMEWORK
  const handleEdit = (framework) => {
    setEditingFramework(framework);
    setIsModalOpen(true);
  };

  // DELETE FRAMEWORK
// Replace existing handleDelete with:
const handleDelete = async (framework) => {
  if (!window.confirm(`Are you sure you want to delete ${framework.name}?`)) return;

  try {
    await frameworkAPI.delete(framework.id);
    console.log('Framework deleted successfully:', framework.name);
    alert('Framework deleted successfully!');
    await fetchFrameworks();  // Refresh the frameworks list
  } catch (err) {
    console.error('Error deleting framework:', err);
    alert('Failed to delete framework. Please try again.');
  }
};



// Replace existing handleClone with:
const handleClone = async (framework) => {
  const newVersion = prompt('Enter new version for cloned framework:', `${framework.version}-copy`);
  if (!newVersion) return;

  try {
    await frameworkAPI.clone(framework.id, { version: newVersion, name: `${framework.name}_COPY` });
    console.log('Framework cloned successfully');
    alert('Framework cloned successfully!');
    await fetchFrameworks(); // Refresh list after clone
  } catch (err) {
    console.error('Error cloning framework:', err);
    alert('Failed to clone framework. Please try again.');
  }
};


  // ============================================================================
  // MODAL HANDLERS
  // ============================================================================
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingFramework(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingFramework) {
        // UPDATE existing framework
        await frameworkAPI.update(editingFramework.id, formData);
        console.log('Framework updated successfully');
      } else {
        // CREATE new framework
        await frameworkAPI.create(formData);
        console.log('Framework created successfully');
      }
      alert('Operation successful!');
      await fetchFrameworks();  // Refresh frameworks list after changes
      handleModalClose();
    } catch (err) {
      console.error('Error saving framework:', err);
      alert('Failed to save framework. Please try again.');
    }
  };


  // ============================================================================
  // FILTERED DATA
  // ============================================================================
  const filteredFrameworks = frameworks.filter(fw => {
    const matchesSearch = fw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fw.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || fw.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ============================================================================
  // STATS CALCULATIONS
  // ============================================================================
  const totalDomains = frameworks.reduce((sum, fw) => sum + (fw.domain_count || 0), 0);
  const totalControls = frameworks.reduce((sum, fw) => sum + (fw.control_count || 0), 0);
  const activeFrameworks = frameworks.filter(fw => fw.status === 'ACTIVE').length;

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (loading) {
    return (
      <div className="framework-dashboard">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0066cc' }}></i>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading frameworks...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================
  if (error) {
    return (
      <div className="framework-dashboard">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="error-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
          <p style={{ fontSize: '1.1rem', color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
          <button className="create-btn" onClick={fetchFrameworks}>
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="framework-dashboard">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Framework Management</h1>
          <p className="dashboard-subtitle">Manage compliance frameworks and their hierarchies</p>
        </div>
        <button className="create-btn" onClick={handleCreateFramework}>
          <i className="fas fa-plus"></i>
          Create Framework
        </button>
      </div>

      <div className="stats-grid">
        <StatsCard
          icon="fa-folder-tree"
          label="Total Frameworks"
          value={frameworks.length}
          color="teal"
        />
        <StatsCard
          icon="fa-check-circle"
          label="Active Frameworks"
          value={activeFrameworks}
          color="green"
        />
        <StatsCard
          icon="fa-layer-group"
          label="Total Domains"
          value={totalDomains}
          color="blue"
        />
        <StatsCard
          icon="fa-shield-halved"
          label="Total Controls"
          value={totalControls}
          color="purple"
        />
      </div>

      <SearchBar
        placeholder="Search frameworks..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={statusFilters}
      />

      {filteredFrameworks.length > 0 ? (
        <div className="frameworks-grid">
          {filteredFrameworks.map(framework => (
            <FrameworkCard
              key={framework.id}
              framework={framework}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClone={handleClone}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="fa-folder-tree"
          title="No frameworks found"
          description={searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first framework"}
          actionLabel={!searchQuery ? "Create Framework" : undefined}
          onAction={!searchQuery ? handleCreateFramework : undefined}
        />
      )}

      <CreateFrameworkModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        framework={editingFramework}
      />
    </div>
  );
};

export default FrameworkDashboard;

import React, { useState } from 'react';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import FrameworkCard from '../components/FrameworkCard';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import CreateFrameworkModal from '../modals/CreateFrameworkModal';
import './FrameworkDashboard.css';


const FrameworkDashboard = () => {
  const [frameworks, setFrameworks] = useState([
    {
      id: '1',
      name: 'SOX',
      full_name: 'Sarbanes-Oxley Act',
      version: '2024.1',
      status: 'ACTIVE',
      description: 'Financial compliance framework for publicly traded companies',
      domain_count: 5,
      control_count: 45
    },
    {
      id: '2',
      name: 'ISO27001',
      full_name: 'ISO/IEC 27001',
      version: '2022.1',
      status: 'ACTIVE',
      description: 'Information security management system standard',
      domain_count: 3,
      control_count: 28
    },
    {
      id: '3',
      name: 'NIST',
      full_name: 'NIST Cybersecurity Framework',
      version: '1.1',
      status: 'DRAFT',
      description: 'Framework for improving critical infrastructure cybersecurity',
      domain_count: 0,
      control_count: 0
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFramework, setEditingFramework] = useState(null);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Frameworks', icon: 'fa-folder-tree' }
  ];

  const statusFilters = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Deprecated', value: 'DEPRECATED' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const handleEdit = (framework) => {
    setEditingFramework(framework);
    setIsModalOpen(true);
  };

  const handleDelete = (framework) => {
    if (window.confirm(`Are you sure you want to delete ${framework.name}?`)) {
      setFrameworks(prev => prev.filter(fw => fw.id !== framework.id));
      console.log('Framework deleted:', framework);
    }
  };

  const handleClone = (framework) => {
    const clonedFramework = {
      ...framework,
      id: String(frameworks.length + 1),
      name: `${framework.name} (Copy)`,
      version: `${framework.version}-copy`,
      status: 'DRAFT'
    };
    setFrameworks(prev => [...prev, clonedFramework]);
    console.log('Framework cloned:', clonedFramework);
  };

  const handleCreateFramework = () => {
    setEditingFramework(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingFramework(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingFramework) {
      // Update existing framework
      setFrameworks(prev => 
        prev.map(fw => fw.id === editingFramework.id 
          ? { ...fw, ...formData } 
          : fw
        )
      );
      console.log('Framework updated:', formData);
    } else {
      // Create new framework
      const newFramework = {
        id: String(frameworks.length + 1),
        ...formData,
        domain_count: 0,
        control_count: 0
      };
      setFrameworks(prev => [...prev, newFramework]);
      console.log('Framework created:', newFramework);
    }
  };

  const filteredFrameworks = frameworks.filter(fw => {
    const matchesSearch = fw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fw.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || fw.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalDomains = frameworks.reduce((sum, fw) => sum + fw.domain_count, 0);
  const totalControls = frameworks.reduce((sum, fw) => sum + fw.control_count, 0);
  const activeFrameworks = frameworks.filter(fw => fw.status === 'ACTIVE').length;

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

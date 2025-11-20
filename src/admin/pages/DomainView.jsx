// src/admin/pages/DomainView.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EntityCard from '../components/EntityCard';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import CreateDomainModal from '../modals/CreateDomainModal';
import LinkFrameworkModal from '../modals/LinkFrameworkModal'; // ✅ NEW
import ViewFrameworkTooltip from '../modals/ViewFrameworkTooltip'; // ✅ NEW
import { frameworkAPI, domainAPI } from '../../services/templateService';
import './DomainView.css';

const DomainView = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [allFrameworks, setAllFrameworks] = useState([]);
  const [linkedDomains, setLinkedDomains] = useState([]);
  const [unlinkedDomains, setUnlinkedDomains] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('linked');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false); // ✅ NEW
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // ✅ NEW
  
  const [editingDomain, setEditingDomain] = useState(null);
  const [linkingDomain, setLinkingDomain] = useState(null); // ✅ NEW
  const [viewingFramework, setViewingFramework] = useState(null); // ✅ NEW

  // ============================================================================
  // FETCH DATA ON MOUNT
  // ============================================================================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all frameworks
      const frameworksResponse = await frameworkAPI.getAll();
      const frameworksArray = Array.isArray(frameworksResponse) 
        ? frameworksResponse 
        : frameworksResponse?.results || [];
      setAllFrameworks(frameworksArray);

      // Fetch all domains and separate linked/unlinked
      const domainsResponse = await domainAPI.getAll();
      const domainsArray = Array.isArray(domainsResponse) 
        ? domainsResponse 
        : domainsResponse?.results || [];

      const linked = domainsArray.filter(d => d.framework);
      const unlinked = domainsArray.filter(d => !d.framework);

      setLinkedDomains(linked);
      setUnlinkedDomains(unlinked);

      console.log('Linked domains:', linked.length);
      console.log('Unlinked domains:', unlinked.length);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // BREADCRUMB
  // ============================================================================
  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'All Domains', icon: 'fa-layer-group' }
  ];

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateDomain = () => {
    setEditingDomain(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (domain) => {
    setEditingDomain(domain);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (domain) => {
    if (!window.confirm(`Are you sure you want to delete "${domain.name}"?`)) return;

    try {
      setActionLoading(true);
      await domainAPI.delete(domain.id);
      alert('Domain deleted successfully!');
      await fetchData();
    } catch (err) {
      console.error('Error deleting domain:', err);
      alert('Failed to delete domain. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ NEW: Open link modal
  const handleLinkClick = (domain) => {
    setLinkingDomain(domain);
    setIsLinkModalOpen(true);
  };

  // ✅ NEW: Link domain to framework
  const handleLinkSubmit = async (frameworkId) => {
    if (!linkingDomain) return;

    try {
      setActionLoading(true);
      await domainAPI.linkFramework(linkingDomain.id, frameworkId);
      
      alert(`Domain "${linkingDomain.name}" linked successfully!`);
      setIsLinkModalOpen(false);
      setLinkingDomain(null);
      
      await fetchData();
    } catch (err) {
      console.error('Error linking domain:', err);
      const errorMsg = err.response?.data?.error || 'Failed to link domain. Please try again.';
      alert(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ NEW: View framework details
  const handleViewFramework = (domain) => {
    const framework = allFrameworks.find(f => f.id === domain.framework);
    if (framework) {
      setViewingFramework(framework);
      setIsViewModalOpen(true);
    } else {
      alert('Framework not found');
    }
  };

  const handleUnlink = async (domain) => {
    if (!window.confirm(`Are you sure you want to unlink "${domain.name}"?`)) return;

    try {
      setActionLoading(true);
      await domainAPI.unlinkFramework(domain.id);
      alert(`Domain "${domain.name}" unlinked successfully!`);
      await fetchData();
    } catch (err) {
      console.error('Error unlinking domain:', err);
      alert('Failed to unlink domain. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDomainClick = (domain) => {
    navigate(`/admin/categories?domain=${domain.id}`);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingDomain(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      if (editingDomain) {
        await domainAPI.update(editingDomain.id, formData);
        alert('Domain updated successfully!');
      } else {
        await domainAPI.create(formData);
        alert('Domain created successfully!');
      }

      await fetchData();
      handleModalClose();
    } catch (err) {
      console.error('Error saving domain:', err);
      alert('Failed to save domain. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================================
  // FILTERED DATA
  // ============================================================================
  const currentDomains = activeTab === 'linked' ? linkedDomains : unlinkedDomains;
  const filteredDomains = currentDomains.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================================================
  // LOADING/ERROR STATES
  // ============================================================================
  if (loading) {
    return (
      <div className="domain-view">
        <BreadcrumbNav items={breadcrumbItems} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#0066cc' }}></i>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading domains...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="domain-view">
        <BreadcrumbNav items={breadcrumbItems} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
          <p style={{ fontSize: '1.1rem', color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
          <button className="create-btn" onClick={fetchData}>
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
    <div className="domain-view">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">All Domains</h1>
          <p className="view-subtitle">Manage all domains and their framework connections</p>
        </div>
        <button 
          className="create-btn" 
          onClick={handleCreateDomain}
          disabled={actionLoading}
        >
          <i className="fas fa-plus"></i>
          Create Domain
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          icon="fa-layer-group"
          label="Total Domains"
          value={linkedDomains.length + unlinkedDomains.length}
          color="teal"
        />
        <StatsCard
          icon="fa-link"
          label="Linked"
          value={linkedDomains.length}
          color="green"
        />
        <StatsCard
          icon="fa-unlink"
          label="Unlinked"
          value={unlinkedDomains.length}
          color="orange"
        />
      </div>

      <SearchBar
        placeholder="Search domains..."
        onSearch={handleSearch}
        showFilters={false}
      />

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'linked' ? 'active' : ''}`}
          onClick={() => setActiveTab('linked')}
        >
          <i className="fas fa-link"></i>
          Linked ({linkedDomains.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'unlinked' ? 'active' : ''}`}
          onClick={() => setActiveTab('unlinked')}
        >
          <i className="fas fa-unlink"></i>
          Unlinked ({unlinkedDomains.length})
        </button>
      </div>

      {/* Domain Grid */}
      {filteredDomains.length > 0 ? (
        <div className="entities-grid">
          {filteredDomains.map(domain => (
            <div key={domain.id}>
              <EntityCard
                entity={domain}
                type="domain"
                isLinked={activeTab === 'linked'}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLink={() => handleLinkClick(domain)} // ✅ Opens link modal
                onUnlink={handleUnlink}
                onClick={handleDomainClick}
                disabled={actionLoading}
              />
              
              {/* ✅ Framework Badge for Linked Domains */}
              {activeTab === 'linked' && domain.framework && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  background: '#e0f2fe',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>
                    <i className="fas fa-link" style={{ marginRight: '0.5rem' }}></i>
                    {allFrameworks.find(f => f.id === domain.framework)?.name || 'Unknown'}
                  </span>
                  <button
                    onClick={() => handleViewFramework(domain)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: '#0891b2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    View Framework
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="fa-layer-group"
          title="No domains found"
          description={searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first domain"}
          actionLabel={!searchQuery ? "Create Domain" : undefined}
          onAction={!searchQuery ? handleCreateDomain : undefined}
        />
      )}

      {/* Modals */}
      <CreateDomainModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        domain={editingDomain}
        currentFrameworkId={null}
      />

      <LinkFrameworkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setLinkingDomain(null);
        }}
        onSubmit={handleLinkSubmit}
        frameworks={allFrameworks}
        domainName={linkingDomain?.name}
      />

      <ViewFrameworkTooltip
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingFramework(null);
        }}
        framework={viewingFramework}
      />
    </div>
  );
};

export default DomainView;
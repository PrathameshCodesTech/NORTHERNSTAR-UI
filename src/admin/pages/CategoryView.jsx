// src/admin/pages/CategoryView.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EntityCard from '../components/EntityCard';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import CreateCategoryModal from '../modals/CreateCategoryModal';
import LinkDomainModal from '../modals/LinkDomainModal';
import ViewDomainTooltip from '../modals/ViewDomainTooltip';
import { domainAPI, categoryAPI } from '../../services/templateService';
import './CategoryView.css';

const CategoryView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [allDomains, setAllDomains] = useState([]);
  const [linkedCategories, setLinkedCategories] = useState([]);
  const [unlinkedCategories, setUnlinkedCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('linked');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [linkingCategory, setLinkingCategory] = useState(null);
  const [viewingDomain, setViewingDomain] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const domainsResponse = await domainAPI.getAll();
      const domainsArray = Array.isArray(domainsResponse) 
        ? domainsResponse 
        : domainsResponse?.results || [];
      setAllDomains(domainsArray);

      const categoriesResponse = await categoryAPI.getAll();
      const categoriesArray = Array.isArray(categoriesResponse) 
        ? categoriesResponse 
        : categoriesResponse?.results || [];

      const linked = categoriesArray.filter(c => c.domain);
      const unlinked = categoriesArray.filter(c => !c.domain);

      setLinkedCategories(linked);
      setUnlinkedCategories(unlinked);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'All Categories', icon: 'fa-tags' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      setActionLoading(true);
      await categoryAPI.delete(category.id);
      alert('Category deleted successfully!');
      await fetchData();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLinkClick = (category) => {
    setLinkingCategory(category);
    setIsLinkModalOpen(true);
  };

  const handleLinkSubmit = async (domainId) => {
    if (!linkingCategory) return;

    try {
      setActionLoading(true);
      await categoryAPI.linkDomain(linkingCategory.id, domainId);
      
      alert(`Category "${linkingCategory.name}" linked successfully!`);
      setIsLinkModalOpen(false);
      setLinkingCategory(null);
      
      await fetchData();
    } catch (err) {
      console.error('Error linking category:', err);
      const errorMsg = err.response?.data?.error || 'Failed to link category. Please try again.';
      alert(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDomain = (category) => {
    const domain = allDomains.find(d => d.id === category.domain);
    if (domain) {
      setViewingDomain(domain);
      setIsViewModalOpen(true);
    } else {
      alert('Domain not found');
    }
  };

  const handleUnlink = async (category) => {
    if (!window.confirm(`Are you sure you want to unlink "${category.name}"?`)) return;

    try {
      setActionLoading(true);
      await categoryAPI.unlinkDomain(category.id);
      alert(`Category "${category.name}" unlinked successfully!`);
      await fetchData();
    } catch (err) {
      console.error('Error unlinking category:', err);
      alert('Failed to unlink category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/admin/subcategories?category=${category.id}`);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingCategory(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, formData);
        alert('Category updated successfully!');
      } else {
        await categoryAPI.create(formData);
        alert('Category created successfully!');
      }

      await fetchData();
      handleModalClose();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const currentCategories = activeTab === 'linked' ? linkedCategories : unlinkedCategories;
  const filteredCategories = currentCategories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="category-view">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-view">
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

  return (
    <div className="category-view">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">All Categories</h1>
          <p className="view-subtitle">Manage all categories and their domain connections</p>
        </div>
        <button 
          className="create-btn" 
          onClick={handleCreateCategory}
          disabled={actionLoading}
        >
          <i className="fas fa-plus"></i>
          Create Category
        </button>
      </div>

      <div className="stats-grid">
        <StatsCard
          icon="fa-tags"
          label="Total Categories"
          value={linkedCategories.length + unlinkedCategories.length}
          color="teal"
        />
        <StatsCard
          icon="fa-link"
          label="Linked"
          value={linkedCategories.length}
          color="green"
        />
        <StatsCard
          icon="fa-unlink"
          label="Unlinked"
          value={unlinkedCategories.length}
          color="orange"
        />
      </div>

      <SearchBar
        placeholder="Search categories..."
        onSearch={handleSearch}
        showFilters={false}
      />

      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'linked' ? 'active' : ''}`}
          onClick={() => setActiveTab('linked')}
        >
          <i className="fas fa-link"></i>
          Linked ({linkedCategories.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'unlinked' ? 'active' : ''}`}
          onClick={() => setActiveTab('unlinked')}
        >
          <i className="fas fa-unlink"></i>
          Unlinked ({unlinkedCategories.length})
        </button>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="entities-grid">
          {filteredCategories.map(category => (
            <div key={category.id}>
              <EntityCard
                entity={category}
                type="category"
                isLinked={activeTab === 'linked'}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLink={() => handleLinkClick(category)}
                onUnlink={handleUnlink}
                onClick={handleCategoryClick}
                disabled={actionLoading}
              />
              
              {activeTab === 'linked' && category.domain && (
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
                    {allDomains.find(d => d.id === category.domain)?.name || 'Unknown'}
                  </span>
                  <button
                    onClick={() => handleViewDomain(category)}
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
                    View Domain
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="fa-tags"
          title="No categories found"
          description={searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first category"}
          actionLabel={!searchQuery ? "Create Category" : undefined}
          onAction={!searchQuery ? handleCreateCategory : undefined}
        />
      )}

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        category={editingCategory}
        domains={allDomains}
      />

      <LinkDomainModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setLinkingCategory(null);
        }}
        onSubmit={handleLinkSubmit}
        domains={allDomains}
        categoryName={linkingCategory?.name}
      />

      <ViewDomainTooltip
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingDomain(null);
        }}
        domain={viewingDomain}
      />
    </div>
  );
};

export default CategoryView;
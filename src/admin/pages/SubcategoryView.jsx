// src/admin/pages/SubcategoryView.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EntityCard from '../components/EntityCard';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import CreateSubcategoryModal from '../modals/CreateSubcategoryModal';
import LinkCategoryModal from '../modals/LinkCategoryModal';
import ViewCategoryTooltip from '../modals/ViewCategoryTooltip';
import { categoryAPI, subcategoryAPI } from '../../services/templateService';
import './SubcategoryView.css';

const SubcategoryView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [allCategories, setAllCategories] = useState([]);
  const [linkedSubcategories, setLinkedSubcategories] = useState([]);
  const [unlinkedSubcategories, setUnlinkedSubcategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('linked');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [linkingSubcategory, setLinkingSubcategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all categories
      const categoriesResponse = await categoryAPI.getAll();
      const categoriesArray = Array.isArray(categoriesResponse) 
        ? categoriesResponse 
        : categoriesResponse?.results || [];
      setAllCategories(categoriesArray);

      // Fetch all subcategories and separate linked/unlinked
      const subcategoriesResponse = await subcategoryAPI.getAll();
      const subcategoriesArray = Array.isArray(subcategoriesResponse) 
        ? subcategoriesResponse 
        : subcategoriesResponse?.results || [];

      const linked = subcategoriesArray.filter(s => s.category);
      const unlinked = subcategoriesArray.filter(s => !s.category);

      setLinkedSubcategories(linked);
      setUnlinkedSubcategories(unlinked);

      console.log('Linked subcategories:', linked.length);
      console.log('Unlinked subcategories:', unlinked.length);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'All Subcategories', icon: 'fa-sitemap' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateSubcategory = () => {
    setEditingSubcategory(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (subcategory) => {
    if (!window.confirm(`Are you sure you want to delete "${subcategory.name}"?`)) return;

    try {
      setActionLoading(true);
      await subcategoryAPI.delete(subcategory.id);
      alert('Subcategory deleted successfully!');
      await fetchData();
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      alert('Failed to delete subcategory. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLinkClick = (subcategory) => {
    setLinkingSubcategory(subcategory);
    setIsLinkModalOpen(true);
  };

  const handleLinkSubmit = async (categoryId) => {
    if (!linkingSubcategory) return;

    try {
      setActionLoading(true);
      await subcategoryAPI.linkCategory(linkingSubcategory.id, categoryId);
      
      alert(`Subcategory "${linkingSubcategory.name}" linked successfully!`);
      setIsLinkModalOpen(false);
      setLinkingSubcategory(null);
      
      await fetchData();
    } catch (err) {
      console.error('Error linking subcategory:', err);
      const errorMsg = err.response?.data?.error || 'Failed to link subcategory. Please try again.';
      alert(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewCategory = (subcategory) => {
    const category = allCategories.find(c => c.id === subcategory.category);
    if (category) {
      setViewingCategory(category);
      setIsViewModalOpen(true);
    } else {
      alert('Category not found');
    }
  };

  const handleUnlink = async (subcategory) => {
    if (!window.confirm(`Are you sure you want to unlink "${subcategory.name}"?`)) return;

    try {
      setActionLoading(true);
      await subcategoryAPI.unlinkCategory(subcategory.id);
      alert(`Subcategory "${subcategory.name}" unlinked successfully!`);
      await fetchData();
    } catch (err) {
      console.error('Error unlinking subcategory:', err);
      alert('Failed to unlink subcategory. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/admin/controls?subcategory=${subcategory.id}`);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingSubcategory(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      if (editingSubcategory) {
        await subcategoryAPI.update(editingSubcategory.id, formData);
        alert('Subcategory updated successfully!');
      } else {
        await subcategoryAPI.create(formData);
        alert('Subcategory created successfully!');
      }

      await fetchData();
      handleModalClose();
    } catch (err) {
      console.error('Error saving subcategory:', err);
      alert('Failed to save subcategory. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const currentSubcategories = activeTab === 'linked' ? linkedSubcategories : unlinkedSubcategories;
  const filteredSubcategories = currentSubcategories.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="subcategory-view">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading subcategories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subcategory-view">
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
    <div className="subcategory-view">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">All Subcategories</h1>
          <p className="view-subtitle">Manage all subcategories and their category connections</p>
        </div>
        <button 
          className="create-btn" 
          onClick={handleCreateSubcategory}
          disabled={actionLoading}
        >
          <i className="fas fa-plus"></i>
          Create Subcategory
        </button>
      </div>

      <div className="stats-grid">
        <StatsCard
          icon="fa-sitemap"
          label="Total Subcategories"
          value={linkedSubcategories.length + unlinkedSubcategories.length}
          color="teal"
        />
        <StatsCard
          icon="fa-link"
          label="Linked"
          value={linkedSubcategories.length}
          color="green"
        />
        <StatsCard
          icon="fa-unlink"
          label="Unlinked"
          value={unlinkedSubcategories.length}
          color="orange"
        />
      </div>

      <SearchBar
        placeholder="Search subcategories..."
        onSearch={handleSearch}
        showFilters={false}
      />

      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'linked' ? 'active' : ''}`}
          onClick={() => setActiveTab('linked')}
        >
          <i className="fas fa-link"></i>
          Linked ({linkedSubcategories.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'unlinked' ? 'active' : ''}`}
          onClick={() => setActiveTab('unlinked')}
        >
          <i className="fas fa-unlink"></i>
          Unlinked ({unlinkedSubcategories.length})
        </button>
      </div>

      {filteredSubcategories.length > 0 ? (
        <div className="entities-grid">
          {filteredSubcategories.map(subcategory => (
            <div key={subcategory.id}>
              <EntityCard
                entity={subcategory}
                type="subcategory"
                isLinked={activeTab === 'linked'}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLink={() => handleLinkClick(subcategory)}
                onUnlink={handleUnlink}
                onClick={handleSubcategoryClick}
                disabled={actionLoading}
              />
              
              {activeTab === 'linked' && subcategory.category && (
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
                    {allCategories.find(c => c.id === subcategory.category)?.name || 'Unknown'}
                  </span>
                  <button
                    onClick={() => handleViewCategory(subcategory)}
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
                    View Category
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="fa-sitemap"
          title="No subcategories found"
          description={searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first subcategory"}
          actionLabel={!searchQuery ? "Create Subcategory" : undefined}
          onAction={!searchQuery ? handleCreateSubcategory : undefined}
        />
      )}

      <CreateSubcategoryModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        subcategory={editingSubcategory}
        categories={allCategories}
      />

      <LinkCategoryModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setLinkingSubcategory(null);
        }}
        onSubmit={handleLinkSubmit}
        categories={allCategories}
        subcategoryName={linkingSubcategory?.name}
      />

      <ViewCategoryTooltip
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingCategory(null);
        }}
        category={viewingCategory}
      />
    </div>
  );
};

export default SubcategoryView;
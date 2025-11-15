import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EntityCard from '../components/EntityCard';
import EmptyState from '../components/EmptyState';
import CreateSubcategoryModal from '../modals/CreateSubcategoryModal';
import './SubcategoryView.css';


const SubcategoryView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get('category');

  const [activeTab, setActiveTab] = useState('linked');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  // Mock data - replace with API call
  const category = {
    id: categoryId || '1',
    name: 'Access Controls',
    code: 'AC',
    domain: { 
      id: '1',
      name: 'IT General Controls', 
      code: 'ITGC',
      framework: { id: '1', name: 'SOX', version: '2024.1' }
    }
  };

  const [categories] = useState([
    { id: '1', name: 'Access Controls', code: 'AC' },
    { id: '2', name: 'Change Management', code: 'CM' },
    { id: '3', name: 'Segregation of Duties', code: 'SOD' }
  ]);

  const [linkedSubcategories, setLinkedSubcategories] = useState([
    {
      id: '1',
      name: 'User Access Management',
      code: 'UAM',
      description: 'Controls for creating, modifying, and removing user access',
      sort_order: 1
    },
    {
      id: '2',
      name: 'System Access Monitoring',
      code: 'SAM',
      description: 'Controls for monitoring system access and activities',
      sort_order: 2
    },
    {
      id: '3',
      name: 'Privileged Access Management',
      code: 'PAM',
      description: 'Controls for managing privileged and administrator access',
      sort_order: 3
    }
  ]);

  const [unlinkedSubcategories, setUnlinkedSubcategories] = useState([
    {
      id: '4',
      name: 'Password Management',
      code: 'PM',
      description: 'Controls for password policies and management',
      sort_order: 4
    }
  ]);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Frameworks', path: '/admin/frameworks', icon: 'fa-folder-tree' },
    { label: `${category.domain.framework.name}`, path: `/admin/domains?framework=${category.domain.framework.id}`, icon: 'fa-layer-group' },
    { label: category.domain.name, path: `/admin/categories?domain=${category.domain.id}`, icon: 'fa-tags' },
    { label: category.name, icon: 'fa-sitemap' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const handleDelete = (subcategory) => {
    if (window.confirm(`Are you sure you want to delete ${subcategory.name}?`)) {
      setLinkedSubcategories(prev => prev.filter(s => s.id !== subcategory.id));
      setUnlinkedSubcategories(prev => prev.filter(s => s.id !== subcategory.id));
      console.log('Subcategory deleted:', subcategory);
    }
  };

  const handleLink = (subcategory) => {
    setUnlinkedSubcategories(prev => prev.filter(s => s.id !== subcategory.id));
    setLinkedSubcategories(prev => [...prev, subcategory]);
    console.log('Subcategory linked:', subcategory, 'to category:', categoryId);
  };

  const handleUnlink = (subcategory) => {
    if (window.confirm(`Are you sure you want to unlink ${subcategory.name}?`)) {
      setLinkedSubcategories(prev => prev.filter(s => s.id !== subcategory.id));
      setUnlinkedSubcategories(prev => [...prev, subcategory]);
      console.log('Subcategory unlinked:', subcategory);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/admin/controls?subcategory=${subcategory.id}`);
  };

  const handleCreateSubcategory = () => {
    setEditingSubcategory(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSubcategory(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingSubcategory) {
      // Update existing subcategory
      const updateSubcategory = (subcategories) => 
        subcategories.map(s => s.id === editingSubcategory.id ? { ...s, ...formData } : s);
      
      setLinkedSubcategories(prev => updateSubcategory(prev));
      setUnlinkedSubcategories(prev => updateSubcategory(prev));
      console.log('Subcategory updated:', formData);
    } else {
      // Create new subcategory
      const newSubcategory = {
        id: String(linkedSubcategories.length + unlinkedSubcategories.length + 1),
        ...formData
      };
      
      // Add to linked or unlinked based on category_id
      if (formData.category_id) {
        setLinkedSubcategories(prev => [...prev, newSubcategory]);
      } else {
        setUnlinkedSubcategories(prev => [...prev, newSubcategory]);
      }
      console.log('Subcategory created:', newSubcategory);
    }
  };

  const filteredLinkedSubcategories = linkedSubcategories.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUnlinkedSubcategories = unlinkedSubcategories.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="subcategory-view">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Subcategories</h1>
          <p className="view-subtitle">
            Manage subcategories for {category.name}
          </p>
        </div>
        <button className="create-btn" onClick={handleCreateSubcategory}>
          <i className="fas fa-plus"></i>
          Create Subcategory
        </button>
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

      {activeTab === 'linked' && (
        <>
          {filteredLinkedSubcategories.length > 0 ? (
            <div className="entities-grid">
              {filteredLinkedSubcategories.map(subcategory => (
                <EntityCard
                  key={subcategory.id}
                  entity={subcategory}
                  type="subcategory"
                  isLinked={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUnlink={handleUnlink}
                  onClick={handleSubcategoryClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-sitemap"
              title="No linked subcategories found"
              description="Link existing subcategories or create new ones"
            />
          )}
        </>
      )}

      {activeTab === 'unlinked' && (
        <>
          {filteredUnlinkedSubcategories.length > 0 ? (
            <div className="entities-grid">
              {filteredUnlinkedSubcategories.map(subcategory => (
                <EntityCard
                  key={subcategory.id}
                  entity={subcategory}
                  type="subcategory"
                  isLinked={false}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLink={handleLink}
                  onClick={handleSubcategoryClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-sitemap"
              title="No unlinked subcategories found"
              description="All subcategories are currently linked to categories"
            />
          )}
        </>
      )}

      <CreateSubcategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        subcategory={editingSubcategory}
        categories={categories}
      />
    </div>
  );
};

export default SubcategoryView;

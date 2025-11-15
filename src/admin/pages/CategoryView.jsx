import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EntityCard from '../components/EntityCard';
import EmptyState from '../components/EmptyState';
import CreateCategoryModal from '../modals/CreateCategoryModal';
import './CategoryView.css';


const CategoryView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const domainId = searchParams.get('domain');

  const [activeTab, setActiveTab] = useState('linked');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Mock data - replace with API call
  const domain = {
    id: domainId || '1',
    name: 'IT General Controls',
    code: 'ITGC',
    framework: { id: '1', name: 'SOX', version: '2024.1' }
  };

  const [domains] = useState([
    { id: '1', name: 'IT General Controls', code: 'ITGC' },
    { id: '2', name: 'Business Process Controls', code: 'BPC' },
    { id: '3', name: 'Application Controls', code: 'AC' }
  ]);

  const [linkedCategories, setLinkedCategories] = useState([
    {
      id: '1',
      name: 'Access Controls',
      code: 'AC',
      description: 'Controls for managing user access to systems',
      sort_order: 1
    },
    {
      id: '2',
      name: 'Change Management',
      code: 'CM',
      description: 'Controls for managing system changes',
      sort_order: 2
    },
    {
      id: '3',
      name: 'Segregation of Duties',
      code: 'SOD',
      description: 'Controls to ensure proper separation of responsibilities',
      sort_order: 3
    }
  ]);

  const [unlinkedCategories, setUnlinkedCategories] = useState([
    {
      id: '4',
      name: 'Data Backup',
      code: 'DB',
      description: 'Controls for data backup and recovery',
      sort_order: 4
    }
  ]);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Frameworks', path: '/admin/frameworks', icon: 'fa-folder-tree' },
    { label: `${domain.framework.name}`, path: `/admin/domains?framework=${domain.framework.id}`, icon: 'fa-layer-group' },
    { label: domain.name, icon: 'fa-tags' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
      setLinkedCategories(prev => prev.filter(c => c.id !== category.id));
      setUnlinkedCategories(prev => prev.filter(c => c.id !== category.id));
      console.log('Category deleted:', category);
    }
  };

  const handleLink = (category) => {
    setUnlinkedCategories(prev => prev.filter(c => c.id !== category.id));
    setLinkedCategories(prev => [...prev, category]);
    console.log('Category linked:', category, 'to domain:', domainId);
  };

  const handleUnlink = (category) => {
    if (window.confirm(`Are you sure you want to unlink ${category.name}?`)) {
      setLinkedCategories(prev => prev.filter(c => c.id !== category.id));
      setUnlinkedCategories(prev => [...prev, category]);
      console.log('Category unlinked:', category);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/admin/subcategories?category=${category.id}`);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingCategory) {
      // Update existing category
      const updateCategory = (categories) => 
        categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c);
      
      setLinkedCategories(prev => updateCategory(prev));
      setUnlinkedCategories(prev => updateCategory(prev));
      console.log('Category updated:', formData);
    } else {
      // Create new category
      const newCategory = {
        id: String(linkedCategories.length + unlinkedCategories.length + 1),
        ...formData
      };
      
      // Add to linked or unlinked based on domain_id
      if (formData.domain_id) {
        setLinkedCategories(prev => [...prev, newCategory]);
      } else {
        setUnlinkedCategories(prev => [...prev, newCategory]);
      }
      console.log('Category created:', newCategory);
    }
  };

  const filteredLinkedCategories = linkedCategories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUnlinkedCategories = unlinkedCategories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="category-view">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Categories</h1>
          <p className="view-subtitle">
            Manage categories for {domain.name}
          </p>
        </div>
        <button className="create-btn" onClick={handleCreateCategory}>
          <i className="fas fa-plus"></i>
          Create Category
        </button>
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

      {activeTab === 'linked' && (
        <>
          {filteredLinkedCategories.length > 0 ? (
            <div className="entities-grid">
              {filteredLinkedCategories.map(category => (
                <EntityCard
                  key={category.id}
                  entity={category}
                  type="category"
                  isLinked={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUnlink={handleUnlink}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-tags"
              title="No linked categories found"
              description="Link existing categories or create new ones"
            />
          )}
        </>
      )}

      {activeTab === 'unlinked' && (
        <>
          {filteredUnlinkedCategories.length > 0 ? (
            <div className="entities-grid">
              {filteredUnlinkedCategories.map(category => (
                <EntityCard
                  key={category.id}
                  entity={category}
                  type="category"
                  isLinked={false}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLink={handleLink}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-tags"
              title="No unlinked categories found"
              description="All categories are currently linked to domains"
            />
          )}
        </>
      )}

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        category={editingCategory}
        domains={domains}
      />
    </div>
  );
};

export default CategoryView;

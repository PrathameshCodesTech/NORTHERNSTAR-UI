import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EntityCard from '../components/EntityCard';
import EmptyState from '../components/EmptyState';
import CreateDomainModal from '../modals/CreateDomainModal';
import './DomainView.css';


const DomainView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const frameworkId = searchParams.get('framework');

  const [activeTab, setActiveTab] = useState('linked');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);

  // Mock data - replace with API call
  const framework = {
    id: frameworkId || '1',
    name: 'SOX',
    version: '2024.1'
  };

  const [frameworks] = useState([
    { id: '1', name: 'SOX', version: '2024.1' },
    { id: '2', name: 'ISO27001', version: '2022.1' },
    { id: '3', name: 'NIST', version: '1.1' }
  ]);

  const [linkedDomains, setLinkedDomains] = useState([
    {
      id: '1',
      name: 'IT General Controls',
      code: 'ITGC',
      description: 'Controls over IT systems and processes',
      sort_order: 1
    },
    {
      id: '2',
      name: 'Business Process Controls',
      code: 'BPC',
      description: 'Controls within business processes',
      sort_order: 2
    }
  ]);

  const [unlinkedDomains, setUnlinkedDomains] = useState([
    {
      id: '3',
      name: 'Application Controls',
      code: 'AC',
      description: 'Controls specific to applications',
      sort_order: 3
    }
  ]);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Frameworks', path: '/admin/frameworks', icon: 'fa-folder-tree' },
    { label: `${framework.name} v${framework.version}`, icon: 'fa-layer-group' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (domain) => {
    setEditingDomain(domain);
    setIsModalOpen(true);
  };

  const handleDelete = (domain) => {
    if (window.confirm(`Are you sure you want to delete ${domain.name}?`)) {
      setLinkedDomains(prev => prev.filter(d => d.id !== domain.id));
      setUnlinkedDomains(prev => prev.filter(d => d.id !== domain.id));
      console.log('Domain deleted:', domain);
    }
  };

  const handleLink = (domain) => {
    setUnlinkedDomains(prev => prev.filter(d => d.id !== domain.id));
    setLinkedDomains(prev => [...prev, domain]);
    console.log('Domain linked:', domain, 'to framework:', frameworkId);
  };

  const handleUnlink = (domain) => {
    if (window.confirm(`Are you sure you want to unlink ${domain.name}?`)) {
      setLinkedDomains(prev => prev.filter(d => d.id !== domain.id));
      setUnlinkedDomains(prev => [...prev, domain]);
      console.log('Domain unlinked:', domain);
    }
  };

  const handleDomainClick = (domain) => {
    navigate(`/admin/categories?domain=${domain.id}`);
  };

  const handleCreateDomain = () => {
    setEditingDomain(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDomain(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingDomain) {
      // Update existing domain
      const updateDomain = (domains) => 
        domains.map(d => d.id === editingDomain.id ? { ...d, ...formData } : d);
      
      setLinkedDomains(prev => updateDomain(prev));
      setUnlinkedDomains(prev => updateDomain(prev));
      console.log('Domain updated:', formData);
    } else {
      // Create new domain
      const newDomain = {
        id: String(linkedDomains.length + unlinkedDomains.length + 1),
        ...formData
      };
      
      // Add to linked or unlinked based on framework_id
      if (formData.framework_id) {
        setLinkedDomains(prev => [...prev, newDomain]);
      } else {
        setUnlinkedDomains(prev => [...prev, newDomain]);
      }
      console.log('Domain created:', newDomain);
    }
  };

  const filteredLinkedDomains = linkedDomains.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUnlinkedDomains = unlinkedDomains.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="domain-view">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Domains</h1>
          <p className="view-subtitle">
            Manage domains for {framework.name} v{framework.version}
          </p>
        </div>
        <button className="create-btn" onClick={handleCreateDomain}>
          <i className="fas fa-plus"></i>
          Create Domain
        </button>
      </div>

      <SearchBar
        placeholder="Search domains..."
        onSearch={handleSearch}
        showFilters={false}
      />

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

      {activeTab === 'linked' && (
        <>
          {filteredLinkedDomains.length > 0 ? (
            <div className="entities-grid">
              {filteredLinkedDomains.map(domain => (
                <EntityCard
                  key={domain.id}
                  entity={domain}
                  type="domain"
                  isLinked={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUnlink={handleUnlink}
                  onClick={handleDomainClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-layer-group"
              title="No linked domains found"
              description="Link existing domains or create new ones"
            />
          )}
        </>
      )}

      {activeTab === 'unlinked' && (
        <>
          {filteredUnlinkedDomains.length > 0 ? (
            <div className="entities-grid">
              {filteredUnlinkedDomains.map(domain => (
                <EntityCard
                  key={domain.id}
                  entity={domain}
                  type="domain"
                  isLinked={false}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLink={handleLink}
                  onClick={handleDomainClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-layer-group"
              title="No unlinked domains found"
              description="All domains are currently linked to frameworks"
            />
          )}
        </>
      )}

      <CreateDomainModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        domain={editingDomain}
        frameworks={frameworks}
      />
    </div>
  );
};

export default DomainView;

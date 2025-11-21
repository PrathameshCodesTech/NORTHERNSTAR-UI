// src/admin/pages/SubscriptionPlansList.jsx
import React, { useState, useEffect } from 'react';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import CreatePlanModal from '../modals/CreatePlanModal';
import EmptyState from '../../components/EmptyState';
import { subscriptionPlanAPI } from '../../../services/tenantService';
import '../styles/TenantManagement.css';

const SubscriptionPlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Subscription Plans', icon: 'fa-tag' }
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await subscriptionPlanAPI.getAll();
      const plansArray = Array.isArray(response) ? response : response?.results || [];
      setPlans(plansArray);

    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load subscription plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleDeletePlan = async (plan) => {
    if (!window.confirm(`Are you sure you want to delete the "${plan.name}" plan?`)) return;

    try {
      setActionLoading(true);
      await subscriptionPlanAPI.delete(plan.id);
      alert('Plan deleted successfully!');
      await fetchPlans();
    } catch (err) {
      console.error('Error deleting plan:', err);
      alert('Failed to delete plan. It may be in use by tenants.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      if (editingPlan) {
        await subscriptionPlanAPI.update(editingPlan.id, formData);
        alert('Plan updated successfully!');
      } else {
        await subscriptionPlanAPI.create(formData);
        alert('Plan created successfully!');
      }

      await fetchPlans();
      handleModalClose();
    } catch (err) {
      console.error('Error saving plan:', err);
      alert('Failed to save plan. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="subscription-plans-list">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-plans-list">
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
          <button className="create-btn" onClick={fetchPlans}>
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-plans-list">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Subscription Plans</h1>
          <p className="view-subtitle">Manage pricing tiers and plan features</p>
        </div>
        <button 
          className="create-btn" 
          onClick={handleCreatePlan}
          disabled={actionLoading}
        >
          <i className="fas fa-plus"></i>
          Create Plan
        </button>
      </div>

      {plans.length > 0 ? (
        <div className="plans-grid">
          {plans.map(plan => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="fa-tag"
          title="No subscription plans"
          description="Get started by creating your first subscription plan"
          actionLabel="Create Plan"
          onAction={handleCreatePlan}
        />
      )}

      <CreatePlanModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        plan={editingPlan}
      />
    </div>
  );
};

export default SubscriptionPlansList;
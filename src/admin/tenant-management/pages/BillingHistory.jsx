// src/admin/pages/BillingHistory.jsx
import React, { useState, useEffect } from 'react';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import SearchBar from '../../components/SearchBar';
import BillingTable from '../components/BillingTable';
import TenantStatsCard from '../components/TenantStatsCard';
import EmptyState from '../../components/EmptyState';
import { billingAPI } from '../../../services/tenantService';
import '../styles/TenantManagement.css';

const BillingHistory = () => {
  const [billingRecords, setBillingRecords] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Billing History', icon: 'fa-file-invoice-dollar' }
  ];

  const statusFilters = [
    { label: 'All Status', value: '' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Refunded', value: 'REFUNDED' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all billing records
      const billingResponse = await billingAPI.getAll();
      const billingArray = Array.isArray(billingResponse) 
        ? billingResponse 
        : billingResponse?.results || [];
      setBillingRecords(billingArray);

      // Fetch pending payments summary
      try {
        const pendingResponse = await billingAPI.getPendingPayments();
        setPendingPayments(pendingResponse);
      } catch (err) {
        console.error('Error fetching pending payments:', err);
      }

    } catch (err) {
      console.error('Error fetching billing data:', err);
      setError('Failed to load billing data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const handleViewInvoice = (record) => {
    console.log('View invoice details:', record);
    alert(`Invoice: ${record.invoice_number}\nTotal: $${record.total_amount}`);
  };

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = 
      record.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.tenant?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.tenant?.tenant_slug?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filterStatus || record.payment_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalInvoices: billingRecords.length,
    totalRevenue: billingRecords
      .filter(r => r.payment_status === 'PAID')
      .reduce((sum, r) => sum + parseFloat(r.total_amount || 0), 0),
    pendingAmount: pendingPayments.total_amount || 0,
    pendingCount: pendingPayments.count || 0,
    paidCount: billingRecords.filter(r => r.payment_status === 'PAID').length,
    failedCount: billingRecords.filter(r => r.payment_status === 'FAILED').length
  };

  if (loading) {
    return (
      <div className="billing-history">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading billing records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-history">
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
    <div className="billing-history">
      <BreadcrumbNav items={breadcrumbItems} />

      {/* Header */}
      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Billing History</h1>
          <p className="view-subtitle">View all invoices and payment records</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid stats-grid-6">
        <TenantStatsCard
          icon="fa-file-invoice"
          label="Total Invoices"
          value={stats.totalInvoices}
          color="blue"
        />
        <TenantStatsCard
          icon="fa-dollar-sign"
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="green"
        />
        <TenantStatsCard
          icon="fa-check-circle"
          label="Paid"
          value={stats.paidCount}
          color="teal"
        />
        <TenantStatsCard
          icon="fa-clock"
          label="Pending"
          value={stats.pendingCount}
          color="orange"
        />
        <TenantStatsCard
          icon="fa-times-circle"
          label="Failed"
          value={stats.failedCount}
          color="red"
        />
        <TenantStatsCard
          icon="fa-exclamation-triangle"
          label="Pending Amount"
          value={`$${stats.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="purple"
        />
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search by invoice number, tenant name, or slug..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={statusFilters}
      />

      {/* Billing Table */}
      {filteredRecords.length > 0 ? (
        <BillingTable
          billingRecords={filteredRecords}
          onViewInvoice={handleViewInvoice}
        />
      ) : (
        <EmptyState
          icon="fa-file-invoice-dollar"
          title="No billing records found"
          description={searchQuery || filterStatus 
            ? "Try adjusting your search or filter criteria" 
            : "No billing records available yet"}
        />
      )}
    </div>
  );
};

export default BillingHistory;
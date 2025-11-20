// src/admin/pages/QuestionList.jsx
import React, { useState, useEffect } from 'react';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import AddQuestionModal from '../modals/AddQuestionModal';
import { questionAPI, controlAPI } from '../../services/templateService';
import './QuestionList.css';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [controls, setControls] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all questions
      const questionsResponse = await questionAPI.getAll();
      const questionsArray = Array.isArray(questionsResponse) 
        ? questionsResponse 
        : questionsResponse?.results || [];
      setQuestions(questionsArray);

      // Fetch all controls for dropdown
      const controlsResponse = await controlAPI.getAll();
      const controlsArray = Array.isArray(controlsResponse) 
        ? controlsResponse 
        : controlsResponse?.results || [];
      setControls(controlsArray);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Assessment Questions', icon: 'fa-circle-question' }
  ];

  const typeFilters = [
    { label: 'All Types', value: '' },
    { label: 'Yes/No', value: 'YES_NO' },
    { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
    { label: 'Text', value: 'TEXT' },
    { label: 'Numeric', value: 'NUMERIC' },
    { label: 'Date', value: 'DATE' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (type) => {
    setFilterType(type);
  };

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDelete = async (question) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      setActionLoading(true);
      await questionAPI.delete(question.id);
      alert('Question deleted successfully!');
      await fetchData();
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Failed to delete question. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setActionLoading(true);

      if (editingQuestion) {
        await questionAPI.update(editingQuestion.id, formData);
        alert('Question updated successfully!');
      } else {
        await questionAPI.create(formData);
        alert('Question created successfully!');
      }

      await fetchData();
      handleModalClose();
    } catch (err) {
      console.error('Error saving question:', err);
      alert('Failed to save question. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || q.question_type === filterType;
    return matchesSearch && matchesType;
  });

  // Get control details for a question
  const getControlForQuestion = (question) => {
    return controls.find(c => c.id === question.control) || null;
  };

  if (loading) {
    return (
      <div className="question-list">
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
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="question-list">
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
    <div className="question-list">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Assessment Questions</h1>
          <p className="view-subtitle">Manage all assessment questions across controls</p>
        </div>
        <button 
          className="create-btn" 
          onClick={handleCreateQuestion}
          disabled={actionLoading}
        >
          <i className="fas fa-plus"></i>
          Add Question
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          icon="fa-circle-question"
          label="Total Questions"
          value={questions.length}
          color="teal"
        />
        <StatsCard
          icon="fa-star"
          label="Mandatory"
          value={questions.filter(q => q.is_mandatory).length}
          color="red"
        />
        <StatsCard
          icon="fa-circle"
          label="Optional"
          value={questions.filter(q => !q.is_mandatory).length}
          color="blue"
        />
      </div>

      <SearchBar
        placeholder="Search questions..."
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={typeFilters}
      />

      {filteredQuestions.length > 0 ? (
        <div className="table-container">
          <table className="questions-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Control</th>
                <th>Type</th>
                <th>Mandatory</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map(question => {
                const control = getControlForQuestion(question);
                return (
                  <tr key={question.id}>
                    <td>
                      <p className="question-text">{question.question}</p>
                      {question.options && question.options.length > 0 && (
                        <div className="question-options">
                          <span className="options-label">Options: </span>
                          {question.options.join(', ')}
                        </div>
                      )}
                    </td>
                    <td>
                      {control ? (
                        <div className="control-info">
                          <span className="control-code">{control.control_code}</span>
                          <span className="control-title">{control.title}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#999' }}>Unknown Control</span>
                      )}
                    </td>
                    <td>
                      <span className="badge type-badge">{question.question_type}</span>
                    </td>
                    <td>
                      {question.is_mandatory ? (
                        <span className="badge mandatory-badge">Mandatory</span>
                      ) : (
                        <span className="badge optional-badge">Optional</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="icon-btn edit-btn" 
                          onClick={() => handleEdit(question)} 
                          title="Edit"
                          disabled={actionLoading}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="icon-btn delete-btn" 
                          onClick={() => handleDelete(question)} 
                          title="Delete"
                          disabled={actionLoading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon="fa-circle-question"
          title="No questions found"
          description={searchQuery || filterType 
            ? "Try adjusting your search or filter criteria" 
            : "Get started by adding your first assessment question"}
          actionLabel={!searchQuery && !filterType ? "Add Question" : undefined}
          onAction={!searchQuery && !filterType ? handleCreateQuestion : undefined}
        />
      )}

      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        question={editingQuestion}
        controls={controls}
      />
    </div>
  );
};

export default QuestionList;
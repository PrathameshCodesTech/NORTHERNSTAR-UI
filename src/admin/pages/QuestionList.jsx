import React, { useState } from 'react';
import BreadcrumbNav from '../components/BreadcrumbNav';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import AddQuestionModal from '../modals/AddQuestionModal';
import './QuestionList.css';


const QuestionList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Mock data
  const [questions, setQuestions] = useState([
    {
      id: '1',
      question: 'Is there a documented process for user account creation?',
      question_type: 'YES_NO',
      is_mandatory: true,
      sort_order: 1,
      control: { control_code: 'AC-001', title: 'User Account Creation' }
    },
    {
      id: '2',
      question: 'What is the average time to provision access?',
      question_type: 'NUMERIC',
      is_mandatory: false,
      sort_order: 2,
      control: { control_code: 'AC-001', title: 'User Account Creation' }
    },
    {
      id: '3',
      question: 'Describe the password reset process',
      question_type: 'TEXT',
      is_mandatory: true,
      sort_order: 1,
      control: { control_code: 'AC-004', title: 'Password Management' }
    },
    {
      id: '4',
      question: 'How often are access reviews performed?',
      question_type: 'MULTIPLE_CHOICE',
      options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'],
      is_mandatory: true,
      sort_order: 1,
      control: { control_code: 'AC-002', title: 'User Access Review' }
    }
  ]);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin', icon: 'fa-home' },
    { label: 'Assessment Questions', icon: 'fa-circle-question' }
  ];

  const typeFilters = [
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

  const handleDelete = (question) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== question.id));
      console.log('Question deleted:', question);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingQuestion) {
      // Update existing question
      setQuestions(prev => 
        prev.map(q => q.id === editingQuestion.id 
          ? { ...q, ...formData } 
          : q
        )
      );
      console.log('Question updated:', formData);
    } else {
      // Create new question
      const newQuestion = {
        id: String(questions.length + 1),
        ...formData,
        control: { control_code: 'GENERAL', title: 'General Question' }
      };
      setQuestions(prev => [...prev, newQuestion]);
      console.log('Question created:', newQuestion);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || q.question_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="question-list">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="view-header">
        <div className="header-content">
          <h1 className="view-title">Assessment Questions</h1>
          <p className="view-subtitle">Manage all assessment questions across controls</p>
        </div>
        <button className="create-btn" onClick={handleCreateQuestion}>
          <i className="fas fa-plus"></i>
          Add Question
        </button>
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
              {filteredQuestions.map(question => (
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
                    <div className="control-info">
                      <span className="control-code">{question.control.control_code}</span>
                      <span className="control-title">{question.control.title}</span>
                    </div>
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
                      <button className="icon-btn edit-btn" onClick={() => handleEdit(question)} title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDelete(question)} title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon="fa-circle-question"
          title="No questions found"
          description="Try adjusting your search criteria"
        />
      )}

      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        question={editingQuestion}
      />
    </div>
  );
};

export default QuestionList;

import React, { useState, useEffect } from 'react';
import './HumanReviewInterface.css';

interface ReviewCase {
  id: string;
  type: 'loan' | 'feedback' | 'query';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  details: {
    applicantName?: string;
    loanAmount?: number;
    reason: string; // Changed from optional to required
    aiDecision?: string;
    aiConfidence?: number;
    requiredDocuments?: string[];
    notes?: string[];
  };
}

// Helper component for case list items
const CaseListItem: React.FC<{
  reviewCase: ReviewCase;
  isSelected: boolean;
  onSelect: (reviewCase: ReviewCase) => void;
  formatDate: (date: Date) => string;
}> = ({ reviewCase, isSelected, onSelect, formatDate }) => (
  <div 
    className={`case-item ${isSelected ? 'selected' : ''} ${reviewCase.status}`}
    onClick={() => onSelect(reviewCase)}
  >
    <div className="case-header">
      <span className={`priority-indicator ${reviewCase.priority}`}></span>
      <span className="case-id">{reviewCase.id}</span>
      <span className={`case-type ${reviewCase.type}`}>{reviewCase.type}</span>
    </div>
    <div className="case-details">
      {reviewCase.type === 'loan' && (
        <p className="applicant-name">{reviewCase.details.applicantName}</p>
      )}
      <p className="case-reason">{reviewCase.details.reason}</p>
      <p className="case-date">Created: {formatDate(reviewCase.createdAt)}</p>
    </div>
    <div className="case-status">
      <span className={`status-badge ${reviewCase.status}`}>
        {reviewCase.status.replace('_', ' ')}
      </span>
    </div>
  </div>
);

const HumanReviewInterface: React.FC = () => {
  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<ReviewCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state
  const [filter, setFilter] = useState('all');
  const [reviewNote, setReviewNote] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | ''>('');

  // Simulate fetching review cases
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockCases: ReviewCase[] = Array.from({ length: 8 }, (_, i) => {
          const id = `REVIEW-${2000 + i}`;
          const type = i < 5 ? 'loan' : i < 7 ? 'feedback' : 'query';
          const status = ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * (i === 0 ? 1 : 3))] as 'pending' | 'in_progress' | 'completed';
          const priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
          const createdAt = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000);
          const updatedAt = new Date(createdAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
          
          const details: ReviewCase['details'] = {
            reason: '' // Initialize with empty string to satisfy the required field
          };
          
          if (type === 'loan') {
            details.applicantName = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][i % 5];
            details.loanAmount = Math.floor(Math.random() * 50000) + 5000;
            details.reason = 'AI confidence below threshold for automatic approval';
            details.aiDecision = Math.random() > 0.5 ? 'Leaning towards approval' : 'Leaning towards rejection';
            details.aiConfidence = Math.round(Math.random() * 30 + 50);
            details.requiredDocuments = [
              'Proof of Income',
              'Credit Report',
              'Bank Statements',
              'Employment Verification'
            ];
            details.notes = status !== 'pending' ? [
              'Customer has good payment history but recent credit inquiries',
              'Income verification shows inconsistent earnings'
            ] : [];
          } else if (type === 'feedback') {
            details.reason = 'Complex customer feedback requires human assessment';
            details.notes = status !== 'pending' ? [
              'Customer reported issues with loan application process',
              'Multiple service complaints in feedback'
            ] : [];
          } else {
            details.reason = 'Query contains complex financial planning request';
            details.notes = status !== 'pending' ? [
              'Customer asking about retirement planning with complex tax situation',
              'Request involves multiple financial products'
            ] : [];
          }
          
          return {
            id,
            type,
            status,
            priority,
            assignedTo: status === 'in_progress' ? 'Current User' : status === 'completed' ? 'Jane Analyst' : undefined,
            createdAt,
            updatedAt,
            details
          };
        });
        
        setCases(mockCases);
        setLoading(false);
      } catch (err) {
        setError('Failed to load review cases. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCaseSelect = (reviewCase: ReviewCase) => {
    setSelectedCase(reviewCase);
    setReviewNote('');
    setDecision('');
  };

  const handleAddNote = () => {
    if (!reviewNote.trim() || !selectedCase) return;
    
    const updatedCase: ReviewCase = {
      ...selectedCase,
      details: {
        ...selectedCase.details,
        notes: [...(selectedCase.details.notes || []), reviewNote]
      }
    };
    
    setCases(cases.map(c => c.id === selectedCase.id ? updatedCase : c));
    setSelectedCase(updatedCase);
    setReviewNote('');
  };

  const handleSubmitDecision = () => {
    if (!decision || !selectedCase) return;
    
    const updatedCase: ReviewCase = {
      ...selectedCase,
      status: 'completed',
      updatedAt: new Date(),
      details: {
        ...selectedCase.details,
        notes: [
          ...(selectedCase.details.notes || []),
          `Decision: ${decision === 'approve' ? 'Approved' : 'Rejected'} by human reviewer`
        ]
      }
    };
    
    setCases(cases.map(c => c.id === selectedCase.id ? updatedCase : c));
    setSelectedCase(updatedCase);
    setDecision('');
  };

  const handleAssignToMe = () => {
    if (!selectedCase || selectedCase.status !== 'pending') return;
    
    const updatedCase: ReviewCase = {
      ...selectedCase,
      status: 'in_progress',
      assignedTo: 'Current User',
      updatedAt: new Date()
    };
    
    setCases(cases.map(c => c.id === selectedCase.id ? updatedCase : c));
    setSelectedCase(updatedCase);
  };

  // Simplified filter logic
  const getFilteredCases = () => {
    if (filter === 'all') return cases;
    if (['pending', 'in_progress', 'completed'].includes(filter)) {
      return cases.filter(c => c.status === filter);
    }
    return cases.filter(c => c.type === filter);
  };

  const filteredCases = getFilteredCases();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render case details panel
  const renderCaseDetails = () => {
    if (!selectedCase) {
      return (
        <div className="no-case-selected">
          <p>Select a case from the list to view details</p>
        </div>
      );
    }

    return (
      <>
        <div className="case-details-header">
          <h3>{selectedCase.id} - {selectedCase.type.charAt(0).toUpperCase() + selectedCase.type.slice(1)} Review</h3>
          <span className={`status-badge ${selectedCase.status}`}>
            {selectedCase.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="case-info">
          <div className="info-row">
            <span className="info-label">Created:</span>
            <span className="info-value">{formatDate(selectedCase.createdAt)}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Last Updated:</span>
            <span className="info-value">{formatDate(selectedCase.updatedAt)}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Priority:</span>
            <span className={`info-value priority ${selectedCase.priority}`}>
              {selectedCase.priority.charAt(0).toUpperCase() + selectedCase.priority.slice(1)}
            </span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Assigned To:</span>
            <span className="info-value">
              {selectedCase.assignedTo || 'Unassigned'}
            </span>
          </div>
        </div>
        
        {selectedCase.type === 'loan' && (
          <div className="loan-details">
            <h4>Loan Details</h4>
            
            <div className="info-row">
              <span className="info-label">Applicant:</span>
              <span className="info-value">{selectedCase.details.applicantName}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Amount:</span>
              <span className="info-value">${selectedCase.details.loanAmount?.toLocaleString()}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">AI Decision:</span>
              <span className="info-value">{selectedCase.details.aiDecision}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">AI Confidence:</span>
              <span className="info-value">{selectedCase.details.aiConfidence}%</span>
            </div>
            
            {selectedCase.details.requiredDocuments && (
              <div className="required-documents">
                <h5>Required Documents</h5>
                <ul>
                  {selectedCase.details.requiredDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className="case-notes">
          <h4>Notes</h4>
          
          {selectedCase.details.notes && selectedCase.details.notes.length > 0 ? (
            <ul className="notes-list">
              {selectedCase.details.notes.map((note, index) => (
                <li key={index} className="note-item">
                  <p>{note}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-notes">No notes available.</p>
          )}
          
          {selectedCase.status !== 'completed' && (
            <div className="add-note">
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Add a note..."
              ></textarea>
              <button onClick={handleAddNote} disabled={!reviewNote.trim()}>
                Add Note
              </button>
            </div>
          )}
        </div>
        
        <div className="case-actions">
          {selectedCase.status === 'pending' && (
            <button className="assign-button" onClick={handleAssignToMe}>
              Assign to Me
            </button>
          )}
          
          {selectedCase.status === 'in_progress' && selectedCase.assignedTo === 'Current User' && (
            <div className="decision-actions">
              <h4>Make Decision</h4>
              <div className="decision-buttons">
                <button
                  className={`approve-button ${decision === 'approve' ? 'selected' : ''}`}
                  onClick={() => setDecision('approve')}
                >
                  Approve
                </button>
                <button
                  className={`reject-button ${decision === 'reject' ? 'selected' : ''}`}
                  onClick={() => setDecision('reject')}
                >
                  Reject
                </button>
              </div>
              
              <button
                className="submit-decision"
                disabled={!decision}
                onClick={handleSubmitDecision}
              >
                Submit Decision
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="human-review-container">
      <h2>Human Review Interface</h2>
      
      <div className="review-dashboard">
        <div className="filter-bar">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Cases</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="loan">Loan Cases</option>
            <option value="feedback">Feedback Cases</option>
            <option value="query">Query Cases</option>
          </select>
        </div>
        
        <div className="review-content">
          <div className="cases-list">
            <h3>Review Cases {loading && '(Loading...)'}</h3>
            
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && filteredCases.length === 0 && (
              <p className="no-cases">No cases match the current filter.</p>
            )}
            
            {!loading && !error && filteredCases.map(reviewCase => (
              <CaseListItem 
                key={reviewCase.id}
                reviewCase={reviewCase}
                isSelected={selectedCase?.id === reviewCase.id}
                onSelect={handleCaseSelect}
                formatDate={formatDate}
              />
            ))}
          </div>
          
          <div className="case-details-panel">
            {renderCaseDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanReviewInterface;
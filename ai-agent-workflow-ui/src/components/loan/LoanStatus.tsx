import React, { useState } from 'react';
import './LoanStatus.css';

interface LoanApplication {
  id: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedDate: Date;
  amount: number;
  term: number;
  currentStep: string;
  nextStep?: string;
  estimatedCompletionDate?: Date;
  notes?: string[];
}

const LoanStatus: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setError('Please enter a valid loan application ID');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      if (searchId.startsWith('LOAN-')) {
        // Mock successful response
        const mockApplication: LoanApplication = {
          id: searchId,
          status: ['pending', 'reviewing', 'approved', 'rejected'][Math.floor(Math.random() * 4)] as any,
          submittedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          amount: Math.floor(Math.random() * 50000) + 5000,
          term: [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)],
          currentStep: ['Application Received', 'Credit Check', 'Income Verification', 'Risk Assessment', 'Final Review'][Math.floor(Math.random() * 5)],
          nextStep: ['Credit Check', 'Income Verification', 'Risk Assessment', 'Final Review', 'Disbursement'][Math.floor(Math.random() * 5)],
          estimatedCompletionDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
          notes: [
            'Application is being processed according to standard procedures',
            'Additional documentation may be requested if needed',
            'Current processing time is 3-5 business days'
          ]
        };
        
        setApplication(mockApplication);
      } else {
        setError('No application found with the provided ID');
        setApplication(null);
      }
      
      setLoading(false);
    }, 1500);
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'reviewing': return 'status-reviewing';
      default: return 'status-pending';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="loan-status-container">
      <h2>Loan Application Status</h2>
      
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="applicationId">Application ID</label>
          <input
            type="text"
            id="applicationId"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="e.g., LOAN-1234"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Check Status'}
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <p>Try entering a loan ID in the format "LOAN-XXXX" for this demo.</p>
        </div>
      )}
      
      {application && (
        <div className="application-details">
          <div className="status-header">
            <h3>Application {application.id}</h3>
            <span className={`status-badge ${getStatusClass(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
          
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Submitted Date</span>
              <span className="detail-value">{formatDate(application.submittedDate)}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Loan Amount</span>
              <span className="detail-value">${application.amount.toLocaleString()}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Term</span>
              <span className="detail-value">{application.term} months</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Current Step</span>
              <span className="detail-value">{application.currentStep}</span>
            </div>
            
            {application.nextStep && (
              <div className="detail-item">
                <span className="detail-label">Next Step</span>
                <span className="detail-value">{application.nextStep}</span>
              </div>
            )}
            
            {application.estimatedCompletionDate && (
              <div className="detail-item">
                <span className="detail-label">Estimated Completion</span>
                <span className="detail-value">{formatDate(application.estimatedCompletionDate)}</span>
              </div>
            )}
          </div>
          
          {application.notes && application.notes.length > 0 && (
            <div className="notes-section">
              <h4>Notes</h4>
              <ul>
                {application.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="progress-tracker">
            <h4>Application Progress</h4>
            <div className="progress-steps">
              <div className={`progress-step ${application.status !== 'rejected' ? 'completed' : 'rejected'}`}>
                <div className="step-indicator">1</div>
                <div className="step-label">Application Received</div>
              </div>
              
              <div className={`progress-step ${['reviewing', 'approved'].includes(application.status) ? 'completed' : application.status === 'rejected' ? 'rejected' : 'pending'}`}>
                <div className="step-indicator">2</div>
                <div className="step-label">Initial Review</div>
              </div>
              
              <div className={`progress-step ${application.status === 'approved' ? 'completed' : application.status === 'rejected' ? 'rejected' : 'pending'}`}>
                <div className="step-indicator">3</div>
                <div className="step-label">Final Decision</div>
              </div>
              
              <div className={`progress-step ${application.status === 'approved' ? 'pending' : 'disabled'}`}>
                <div className="step-indicator">4</div>
                <div className="step-label">Disbursement</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanStatus;
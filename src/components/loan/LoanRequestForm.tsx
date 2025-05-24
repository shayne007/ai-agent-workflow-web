import React, { useState } from 'react';
import './LoanRequestForm.css';

interface LoanFormData {
  fullName: string;
  income: string;
  loanAmount: string;
  purpose: string;
  term: string;
  contactInfo: string;
}

const LoanRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<LoanFormData>({
    fullName: '',
    income: '',
    loanAmount: '',
    purpose: '',
    term: '12',
    contactInfo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean; message: string; workflowId?: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      setResult({
        success,
        message: success 
          ? 'Your loan request has been submitted successfully!' 
          : 'There was an error submitting your loan request. Please try again.',
        workflowId: success ? `LOAN-${Math.floor(Math.random() * 10000)}` : undefined
      });
      
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="loan-form-container">
      <h2>Personal Loan Request</h2>
      
      {result ? (
        <div className={`result-message ${result.success ? 'success' : 'error'}`}>
          <p>{result.message}</p>
          {result.workflowId && (
            <p>Your request ID: <strong>{result.workflowId}</strong></p>
          )}
          <button onClick={() => setResult(null)}>Submit Another Request</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="income">Monthly Income</label>
            <input
              type="number"
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="loanAmount">Loan Amount</label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="purpose">Loan Purpose</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="term">Loan Term (months)</label>
            <select
              id="term"
              name="term"
              value={formData.term}
              onChange={handleChange}
              required
            >
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="contactInfo">Contact Information</label>
            <textarea
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Loan Request'}
          </button>
        </form>
      )}
    </div>
  );
};

export default LoanRequestForm;
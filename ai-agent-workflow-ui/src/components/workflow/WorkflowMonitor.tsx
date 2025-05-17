import React, { useState, useEffect } from 'react';
import './WorkflowMonitor.css';

interface WorkflowInstance {
  id: string;
  type: 'loan' | 'feedback' | 'query';
  status: 'running' | 'completed' | 'failed' | 'waiting';
  startTime: Date;
  endTime?: Date;
  currentStep: string;
  steps: WorkflowStep[];
}

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  output?: any;
}

const WorkflowMonitor: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Simulate fetching workflow data
  useEffect(() => {
    const fetchWorkflows = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Generate mock workflow data
        const mockWorkflows: WorkflowInstance[] = Array.from({ length: 10 }, (_, i) => {
          const id = `WF-${100000 + i}`;
          const type = ['loan', 'feedback', 'query'][Math.floor(Math.random() * 3)] as 'loan' | 'feedback' | 'query';
          const status = ['running', 'completed', 'failed', 'waiting'][Math.floor(Math.random() * 4)] as 'running' | 'completed' | 'failed' | 'waiting';
          const startTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
          
          // Generate steps based on workflow type
          let steps: WorkflowStep[] = [];
          
          if (type === 'loan') {
            steps = [
              {
                id: `${id}-step-1`,
                name: 'Application Submission',
                status: 'completed',
                startTime: startTime,
                endTime: new Date(startTime.getTime() + 5 * 60 * 1000)
              },
              {
                id: `${id}-step-2`,
                name: 'Credit Check',
                status: 'completed',
                startTime: new Date(startTime.getTime() + 6 * 60 * 1000),
                endTime: new Date(startTime.getTime() + 10 * 60 * 1000)
              },
              {
                id: `${id}-step-3`,
                name: 'Income Verification',
                status: status === 'running' ? 'running' : status === 'completed' ? 'completed' : status === 'failed' ? 'failed' : 'pending',
                startTime: status !== 'waiting' ? new Date(startTime.getTime() + 11 * 60 * 1000) : undefined,
                endTime: status === 'completed' || status === 'failed' ? new Date(startTime.getTime() + 20 * 60 * 1000) : undefined
              },
              {
                id: `${id}-step-4`,
                name: 'Risk Assessment',
                status: status === 'completed' ? 'completed' : 'pending',
                startTime: status === 'completed' ? new Date(startTime.getTime() + 21 * 60 * 1000) : undefined,
                endTime: status === 'completed' ? new Date(startTime.getTime() + 30 * 60 * 1000) : undefined
              },
              {
                id: `${id}-step-5`,
                name: 'Final Decision',
                status: status === 'completed' ? 'completed' : 'pending',
                startTime: status === 'completed' ? new Date(startTime.getTime() + 31 * 60 * 1000) : undefined,
                endTime: status === 'completed' ? new Date(startTime.getTime() + 32 * 60 * 1000) : undefined
              }
            ];
          } else if (type === 'feedback') {
            steps = [
              {
                id: `${id}-step-1`,
                name: 'Feedback Collection',
                status: 'completed',
                startTime: startTime,
                endTime: new Date(startTime.getTime() + 2 * 60 * 1000)
              },
              {
                id: `${id}-step-2`,
                name: 'Sentiment Analysis',
                status: status === 'running' || status === 'completed' || status === 'failed' ? 'completed' : 'pending',
                startTime: status !== 'waiting' ? new Date(startTime.getTime() + 3 * 60 * 1000) : undefined,
                endTime: status !== 'waiting' && status !== 'running' ? new Date(startTime.getTime() + 5 * 60 * 1000) : undefined
              },
              {
                id: `${id}-step-3`,
                name: 'Category Classification',
                status: status === 'running' ? 'running' : status === 'completed' ? 'completed' : 'pending',
                startTime: status === 'running' || status === 'completed' ? new Date(startTime.getTime() + 6 * 60 * 1000) : undefined,
                endTime: status === 'completed' ? new Date(startTime.getTime() + 8 * 60 * 1000) : undefined
              },
              {
                id: `${id}-step-4`,
                name: 'Response Generation',
                status: status === 'completed' ? 'completed' : 'pending',
                startTime: status === 'completed' ? new Date(startTime.getTime() + 9 * 60 * 1000) : undefined,
                endTime: status === 'completed' ? new Date(startTime.getTime() + 10 * 60 * 1000) : undefined
              }
            ];
          } else {
            steps = [
              {
                id: `${id}-step-1`,
                name: 'Query Analysis',
                status: 'completed',
                startTime: startTime,
                endTime: new Date(startTime.getTime() + 1 * 60 * 1000)
              },
              {
                id: `${id}-step-2`,
                name: 'Information Retrieval',
                status: status === 'running' || status === 'completed' || status === 'failed' ? 'completed' : 'pending',
                startTime: status !== 'waiting' ? new Date(startTime.getTime() + 2 * 60 * 1000) : undefined,
                endTime: status !== 'waiting' && status !== 'running' ? new Date(startTime.getTime() + 3 * 60 * 1000) : undefined
              },
              {
                id: `${id}-step-3`,
                name: 'Response Generation',
                status: status === 'running' ? 'running' : status === 'completed' ? 'completed' : 'pending',
                startTime: status === 'running' || status === 'completed' ? new Date(startTime.getTime() + 4 * 60 * 1000) : undefined,
                endTime: status === 'completed' ? new Date(startTime.getTime() + 5 * 60 * 1000) : undefined
              }
            ];
          }
          
          // Determine current step
          let currentStep = steps.find(step => step.status === 'running')?.name || 
                           (status === 'completed' ? steps[steps.length - 1].name : 
                           (status === 'failed' ? steps.find(step => step.status === 'failed')?.name || 'Unknown' : 
                           steps.find(step => step.status === 'pending')?.name || 'Waiting'));
          
          return {
            id,
            type,
            status,
            startTime,
            endTime: status === 'completed' || status === 'failed' ? new Date(startTime.getTime() + Math.random() * 60 * 60 * 1000) : undefined,
            currentStep,
            steps
          };
        });
        
        setWorkflows(mockWorkflows);
        setIsLoading(false);
      }, 1500);
    };
    
    fetchWorkflows();
  }, []);

  const handleWorkflowSelect = (workflow: WorkflowInstance) => {
    setSelectedWorkflow(workflow);
  };

  const filteredWorkflows = filter === 'all' 
    ? workflows 
    : workflows.filter(wf => filter === 'status' ? wf.status === 'running' : wf.type === filter);

  return (
    <div className="workflow-monitor-container">
      <h2>Workflow Monitor</h2>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label>Filter by:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Workflows</option>
            <option value="status">Running Only</option>
            <option value="loan">Loan Workflows</option>
            <option value="feedback">Feedback Workflows</option>
            <option value="query">Query Workflows</option>
          </select>
        </div>
        <button className="refresh-btn" onClick={() => setIsLoading(true)}>
          Refresh
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading workflows...</p>
        </div>
      ) : (
        <div className="workflow-content">
          <div className="workflow-list">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Current Step</th>
                  <th>Start Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkflows.map(workflow => (
                  <tr 
                    key={workflow.id} 
                    className={selectedWorkflow?.id === workflow.id ? 'selected' : ''}
                    onClick={() => handleWorkflowSelect(workflow)}
                  >
                    <td>{workflow.id}</td>
                    <td>
                      <span className={`type-badge ${workflow.type}`}>
                        {workflow.type.charAt(0).toUpperCase() + workflow.type.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${workflow.status}`}>
                        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                      </span>
                    </td>
                    <td>{workflow.currentStep}</td>
                    <td>{workflow.startTime.toLocaleString()}</td>
                    <td>
                      <button className="view-btn" onClick={() => handleWorkflowSelect(workflow)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredWorkflows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="no-data">No workflows found matching the current filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {selectedWorkflow && (
            <div className="workflow-details">
              <h3>Workflow Details: {selectedWorkflow.id}</h3>
              
              <div className="details-header">
                <div className="detail-item">
                  <span className="label">Type:</span>
                  <span className={`type-badge ${selectedWorkflow.type}`}>
                    {selectedWorkflow.type.charAt(0).toUpperCase() + selectedWorkflow.type.slice(1)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${selectedWorkflow.status}`}>
                    {selectedWorkflow.status.charAt(0).toUpperCase() + selectedWorkflow.status.slice(1)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Started:</span>
                  <span>{selectedWorkflow.startTime.toLocaleString()}</span>
                </div>
                {selectedWorkflow.endTime && (
                  <div className="detail-item">
                    <span className="label">Completed:</span>
                    <span>{selectedWorkflow.endTime.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="workflow-steps">
                <h4>Workflow Steps</h4>
                <div className="step-timeline">
                  {selectedWorkflow.steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`step-item ${step.status}`}
                    >
                      <div className="step-connector">
                        {index > 0 && <div className="connector-line"></div>}
                        <div className="step-number">{index + 1}</div>
                      </div>
                      <div className="step-content">
                        <div className="step-header">
                          <h5>{step.name}</h5>
                          <span className={`step-status ${step.status}`}>
                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                          </span>
                        </div>
                        {step.startTime && (
                          <div className="step-time">
                            <span>Started: {step.startTime.toLocaleString()}</span>
                            {step.endTime && (
                              <span>Completed: {step.endTime.toLocaleString()}</span>
                            )}
                          </div>
                        )}
                        {step.output && (
                          <div className="step-output">
                            <h6>Output:</h6>
                            <pre>{JSON.stringify(step.output, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="workflow-actions">
                {selectedWorkflow.status === 'running' && (
                  <button className="action-btn cancel">Cancel Workflow</button>
                )}
                {selectedWorkflow.status === 'waiting' && (
                  <button className="action-btn start">Start Workflow</button>
                )}
                {selectedWorkflow.status === 'failed' && (
                  <button className="action-btn retry">Retry Workflow</button>
                )}
                <button className="action-btn export">Export Details</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowMonitor;
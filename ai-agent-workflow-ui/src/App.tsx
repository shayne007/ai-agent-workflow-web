import React, { useState, useEffect } from 'react';
import './App.css';
import WorkflowList from './components/WorkflowList';
import AgentConfig from './components/AgentConfig';
import ExecutionMonitor from './components/ExecutionMonitor';

interface Workflow {
  id: string;
  name: string;
  description: string;
  agents: Array<{
    id: string;
    name: string;
    parameters: Record<string, any>;
  }>;
}

const App: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        // TODO: Uncomment when backend is ready
        // const workflows = await fetchWorkflows();
        // setWorkflows(workflows);
        
        // Temporary mock data
        const mockWorkflows: Workflow[] = [
          {
            id: '1',
            name: 'Data Processing Pipeline',
            description: 'Process and analyze data',
            agents: [
              {
                id: 'agent1',
                name: 'Data Collector',
                parameters: { source: 'API', frequency: 'daily' }
              },
              {
                id: 'agent2',
                name: 'Data Analyzer',
                parameters: { method: 'regression', threshold: '0.05' }
              }
            ]
          }
        ];
        setWorkflows(mockWorkflows);
      } catch (error) {
        console.error('Failed to load workflows:', error);
      }
    };

    loadWorkflows();
  }, []);

  const handleWorkflowSelect = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setSelectedAgent(null);
  };

  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
  };

  const handleSaveConfig = (config: any) => {
    if (!selectedWorkflow || !selectedAgent) return;
    
    const updatedWorkflows = workflows.map(wf => {
      if (wf.id === selectedWorkflow.id) {
        const updatedAgents = wf.agents.map(agent => {
          if (agent.id === selectedAgent.id) {
            return { ...agent, parameters: config };
          }
          return agent;
        });
        return { ...wf, agents: updatedAgents };
      }
      return wf;
    });
    
    setWorkflows(updatedWorkflows);
    setSelectedAgent({ ...selectedAgent, parameters: config });
  };

  const handleStartExecution = () => {
    setExecutionStatus('running');
    setExecutionLogs([...executionLogs, {
      timestamp: new Date().toISOString(),
      message: 'Execution started',
      level: 'info'
    }]);
    
    // TODO: Add actual execution logic
  };

  const handleStopExecution = () => {
    setExecutionStatus('failed');
    setExecutionLogs([...executionLogs, {
      timestamp: new Date().toISOString(),
      message: 'Execution stopped by user',
      level: 'warning'
    }]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Agent Workflow</h1>
      </header>
      <main className="app-main">
        <div className="sidebar">
          <WorkflowList 
            workflows={workflows} 
            onSelect={handleWorkflowSelect} 
          />
        </div>
        <div className="content">
          {selectedWorkflow && (
            <div className="workflow-details">
              <h2>{selectedWorkflow.name}</h2>
              <p>{selectedWorkflow.description}</p>
              
              <div className="agents">
                <h3>Agents</h3>
                <ul>
                  {selectedWorkflow.agents.map(agent => (
                    <li 
                      key={agent.id} 
                      onClick={() => handleAgentSelect(agent)}
                      className={selectedAgent?.id === agent.id ? 'selected' : ''}
                    >
                      {agent.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedAgent && (
                <AgentConfig 
                  agent={selectedAgent} 
                  onSave={handleSaveConfig} 
                />
              )}
              
              <ExecutionMonitor 
                logs={executionLogs}
                status={executionStatus}
                onStart={handleStartExecution}
                onStop={handleStopExecution}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
import React from 'react';

interface ExecutionLog {
  timestamp: string;
  message: string;
  level: 'info' | 'warning' | 'error';
}

interface ExecutionMonitorProps {
  logs: ExecutionLog[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  onStart: () => void;
  onStop: () => void;
}

const ExecutionMonitor: React.FC<ExecutionMonitorProps> = ({ 
  logs, 
  status, 
  onStart, 
  onStop 
}) => {
  return (
    <div className="execution-monitor">
      <h3>Execution Monitor</h3>
      <div className="controls">
        <button 
          onClick={onStart} 
          disabled={status === 'running'}
        >
          Start
        </button>
        <button 
          onClick={onStop} 
          disabled={status !== 'running'}
        >
          Stop
        </button>
      </div>
      <div className="status">Status: {status}</div>
      <div className="logs">
        {logs.map((log, index) => (
          <div key={index} className={`log ${log.level}`}>
            [{log.timestamp}] {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionMonitor;
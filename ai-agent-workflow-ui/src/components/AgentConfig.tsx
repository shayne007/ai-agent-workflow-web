import React, { useState } from 'react';

interface AgentConfigProps {
  agent: {
    id: string;
    name: string;
    parameters: Record<string, any>;
  };
  onSave: (config: any) => void;
}

const AgentConfig: React.FC<AgentConfigProps> = ({ agent, onSave }) => {
  const [config, setConfig] = useState(agent.parameters);

  const handleChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="agent-config">
      <h3>Configure {agent.name}</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSave(config);
      }}>
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="form-field">
            <label>{key}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
        <button type="submit">Save Configuration</button>
      </form>
    </div>
  );
};

export default AgentConfig;
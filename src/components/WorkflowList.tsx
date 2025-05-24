import React from 'react';

interface Workflow {
  id: string;
  name: string;
  description: string;
}

interface WorkflowListProps {
  workflows: Workflow[];
  onSelect: (workflow: Workflow) => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({ workflows, onSelect }) => {
  return (
    <div className="workflow-list">
      <h3>Workflows</h3>
      <ul>
        {workflows.map((workflow) => (
          <li key={workflow.id} onClick={() => onSelect(workflow)}>
            {workflow.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkflowList;
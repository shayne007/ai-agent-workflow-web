import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h3>AI Agent Workflow</h3>
      </div>
      <div className="sidebar-content">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="icon chat-icon"></i>
              <span>Chat Interface</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/loan/request" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="icon loan-icon"></i>
              <span>Apply for Loan</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/loan/status" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="icon status-icon"></i>
              <span>Check Loan Status</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/workflow/monitor" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="icon monitor-icon"></i>
              <span>Workflow Monitor</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/review" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="icon review-icon"></i>
              <span>Human Review</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
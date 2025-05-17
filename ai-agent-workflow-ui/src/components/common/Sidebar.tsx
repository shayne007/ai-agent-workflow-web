import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <h3>Navigation</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink exact to="/" activeClassName="active">
              <i className="icon chat-icon"></i>
              <span>Chat Interface</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/loan/request" activeClassName="active">
              <i className="icon loan-icon"></i>
              <span>Apply for Loan</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/loan/status" activeClassName="active">
              <i className="icon status-icon"></i>
              <span>Check Loan Status</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/workflow/monitor" activeClassName="active">
              <i className="icon monitor-icon"></i>
              <span>Workflow Monitor</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/review" activeClassName="active">
              <i className="icon review-icon"></i>
              <span>Human Review</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
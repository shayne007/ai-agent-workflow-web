import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>AI Agent Workflow</h1>
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Chat</Link></li>
            <li><Link to="/loan/request">Loan Request</Link></li>
            <li><Link to="/loan/status">Loan Status</Link></li>
            <li><Link to="/workflow/monitor">Workflow Monitor</Link></li>
            <li><Link to="/review">Human Review</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
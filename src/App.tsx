import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import ChatInterface from './components/chat/ChatInterface';
import LoanRequestForm from './components/loan/LoanRequestForm';
import LoanStatus from './components/loan/LoanStatus';
import WorkflowMonitor from './components/workflow/WorkflowMonitor';
import HumanReviewInterface from './components/workflow/HumanReviewInterface';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Sidebar />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<ChatInterface />} />
              <Route path="/loan/request" element={<LoanRequestForm />} />
              <Route path="/loan/status" element={<LoanStatus />} />
              <Route path="/workflow/monitor" element={<WorkflowMonitor />} />
              <Route path="/review" element={<HumanReviewInterface />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatInterface.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: 'Hello! I\'m your AI assistant. How can I help you today? You can ask about investments, stocks, or provide feedback on our financial products.',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let botResponse: Message;
      
      // Simple response logic based on message content
      if (text.toLowerCase().includes('stock') || text.toLowerCase().includes('investment')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Based on current market analysis, diversified ETFs are showing strong performance. Would you like specific information about a particular stock or investment type?',
          sender: 'bot',
          timestamp: new Date()
        };
      } else if (text.toLowerCase().includes('loan') || text.toLowerCase().includes('borrow')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'I can help you with loan information. You can apply for a personal loan through our system. Would you like to start an application now?',
          sender: 'bot',
          timestamp: new Date()
        };
      } else if (text.toLowerCase().includes('feedback')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for wanting to provide feedback. Please share your thoughts about our financial products or services, and I\'ll make sure it gets to the right team.',
          sender: 'bot',
          timestamp: new Date()
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: 'I understand you\'re looking for information. Could you please specify if you\'re interested in investments, stocks, loans, or would like to provide feedback?',
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Financial Assistant</h2>
        <p>Ask about investments, stocks, or provide feedback</p>
      </div>
      
      <div className="chat-messages">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} isLoading={loading} />
    </div>
  );
};

export default ChatInterface;
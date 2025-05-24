import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import api from '../../services/api';
import './ChatInterface.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'button' | 'form';
  options?: { text: string; value: string }[];
  formData?: Record<string, any>;
}

interface WorkflowStatus {
  currentStep: string;
  progress: number;
  status: 'idle' | 'in_progress' | 'completed' | 'error';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>({
    currentStep: '',
    progress: 0,
    status: 'idle'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log('Attempting to start chat session...');
        const response = await api.post('/v1/dialog/start', {
          userId: "user_123",
          deviceType: "mobile",
          channel: "web"
        });

        const data = response.data;
        console.log('Chat session started successfully:', data);
        setSessionId(data.sessionId);

        // Create welcome message with suggested actions
        const welcomeMessage: Message = {
          id: 'welcome',
          text: data.responseText,
          sender: 'bot',
          timestamp: new Date(),
          type: 'button',
          options: data.suggestedActions.map((action: string) => ({
            text: action,
            value: action
          }))
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Error initializing chat:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
        const errorMessage: Message = {
          id: 'error',
          text: `Sorry, I encountered an error while starting the chat: ${error instanceof Error ? error.message : 'Unknown error'}. Please check if the server is running at http://localhost:8084.`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages([errorMessage]);
      }
    };

    initializeChat();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !sessionId) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      console.log('Sending message to continue dialog...');
      const response = await api.post('/v1/dialog/continue', {
        sessionId,
        message: text,
        userId: "user_123",
        deviceType: "mobile",
        channel: "web"
      });

      const data = response.data;
      console.log('Continue dialog response:', data);
      
      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.responseText,
        sender: 'bot',
        timestamp: new Date(),
        type: data.suggestedActions ? 'button' : 'text',
        options: data.suggestedActions?.map((action: string) => ({
          text: action,
          value: action
        }))
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: { text: string; value: string }) => {
    handleSendMessage(option.text);
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    // Handle form submission
    console.log('Form submitted:', formData);
    // TODO: Implement form submission logic
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Agent Workflow System</h2>
        {workflowStatus.status !== 'idle' && (
          <div className="workflow-status">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${workflowStatus.progress}%` }}
              />
            </div>
            <p className="current-step">{workflowStatus.currentStep}</p>
          </div>
        )}
      </div>
      
      <div className="chat-messages">
        <MessageList 
          messages={messages} 
          onOptionSelect={handleOptionSelect}
          onFormSubmit={handleFormSubmit}
        />
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} isLoading={loading} />
    </div>
  );
};

export default ChatInterface;
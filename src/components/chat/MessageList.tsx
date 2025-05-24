import React from 'react';
import './MessageList.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'button' | 'form';
  options?: { text: string; value: string }[];
  formData?: Record<string, any>;
}

interface MessageListProps {
  messages: Message[];
  onOptionSelect: (option: { text: string; value: string }) => void;
  onFormSubmit: (formData: Record<string, any>) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onOptionSelect, onFormSubmit }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'button':
        return (
          <div className="message-options">
            {message.options?.map((option, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => onOptionSelect(option)}
              >
                {option.text}
              </button>
            ))}
          </div>
        );
      case 'form':
        return (
          <form
            className="message-form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data: Record<string, any> = {};
              formData.forEach((value, key) => {
                data[key] = value;
              });
              onFormSubmit(data);
            }}
          >
            {message.formData && Object.entries(message.formData).map(([key, field]) => (
              <div key={key} className="form-field">
                <label htmlFor={key}>{field.label}</label>
                <input
                  type={field.type || 'text'}
                  id={key}
                  name={key}
                  required={field.required}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <button type="submit" className="submit-button">Submit</button>
          </form>
        );
      default:
        return <p>{message.text}</p>;
    }
  };

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
        >
          <div className="message-content">
            {renderMessageContent(message)}
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
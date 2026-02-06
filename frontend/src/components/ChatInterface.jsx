import { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

function ChatInterface({ messages, onSendQuestion, isLoading }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const question = inputValue.trim();
    if (!question || isLoading) return;

    onSendQuestion(question);
    
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-interface">
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p>Start by asking a question about your document!</p>
            <div className="example-questions">
              <p><strong>Example questions:</strong></p>
              <ul>
                <li>"What are the main topics covered?"</li>
                <li>"Explain [concept] in simple terms"</li>
                <li>"Summarize chapter [X]"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role}`}
              >
                <div className="message-avatar">
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <textarea
            ref={textareaRef}
            className="input-textarea"
            placeholder="Ask a question about your document..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            className="btn-send"
            disabled={!inputValue.trim() || isLoading}
            title="Send message (Enter)"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </form>
        <div className="input-hint">
          Press <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
import { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';

function App() {

  const [uploadedFilename, setUploadedFilename] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadSuccess = (filename) => {
    setUploadedFilename(filename);
    setMessages([{
      role: 'assistant',
      content: `✅ Successfully loaded "${filename}". You can now ask me questions about this document!`
    }]);
  };

  const handleSendQuestion = async (question) => {
    if (!uploadedFilename) {
      alert('Please upload a PDF first!');
      return;
    }

    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.filter(msg => msg.role !== 'system');

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: uploadedFilename,
          question: question,
          history: history
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.answer
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error asking question:', error);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${error.message}. Please try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedFilename(null);
    setMessages([]);
  };

  return (
    <div className="app">
      
      <header className="app-header">
        <h1>📚 Educational Content Assistant</h1>
        <p className="subtitle">Upload educational PDFs and get instant answers using RAG-powered AI</p>
      </header>

      <main className="app-main">
        {!uploadedFilename ? (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <div className="chat-container">
            
            <div className="file-info-bar">
              <span className="file-info">
                📄 <strong>{uploadedFilename}</strong>
              </span>
              <button 
                className="btn-reset" 
                onClick={handleReset}
                title="Upload a different file"
              >
                🔄 Change File
              </button>
            </div>

            <ChatInterface
              messages={messages}
              onSendQuestion={handleSendQuestion}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by OpenRouter AI • Built with React & FastAPI</p>
      </footer>
    </div>
  );
}

export default App;
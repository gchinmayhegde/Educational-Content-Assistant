import { useState } from 'react';
import './FileUpload.css';

function FileUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setError(null);

    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a PDF file');
        setSelectedFile(null);
        return;
      }

      const maxSize = 50 * 1024 * 1024; 
      if (file.size > maxSize) {
        setError('File size must be less than 50MB');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload success:', data);

      onUploadSuccess(data.filename);

    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-icon">📁</div>
        
        <h2>Upload Your Educational PDF</h2>
        <p className="upload-description">
          Select a textbook, lecture notes, or any educational PDF document. 
          The AI will analyze it and answer your questions.
        </p>

        <div className="file-input-wrapper">
          <input
            type="file"
            id="file-input"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            {selectedFile ? (
              <>
                <span className="file-icon">📄</span>
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </>
            ) : (
              <>
                <span className="upload-prompt">Click to select PDF file</span>
              </>
            )}
          </label>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <button
          className="btn-upload"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <>
              <span className="spinner"></span>
              Uploading...
            </>
          ) : (
            <>
              <span>📤</span>
              Upload & Process
            </>
          )}
        </button>

        <div className="upload-instructions">
          <p><strong>Tips:</strong></p>
          <ul>
            <li>Maximum file size: 50MB</li>
            <li>Only PDF files are supported</li>
            <li>Clear, text-based PDFs work best</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
// src/components/specific/FileUpload.jsx

import React, { useState } from 'react';
import { uploadAttachment } from '../../services/apiService';
import './FileUpload.css'; // We will create this CSS file next

const FileUpload = ({ task, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    // Reset file and error state when a new file is selected
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const response = await uploadAttachment(task._id, file);
      onUploadComplete(response.data.data.task); // Pass the updated task back
      setFile(null); // Clear the file input
      // Clear the file input element visually
      document.getElementById(`file-input-${task._id}`).value = '';
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h4>Attachments</h4>
      <div className="attachments-list">
        {task.attachments && task.attachments.length > 0 ? (
          task.attachments.map((att, index) => (
            <div key={index} className="attachment-item">
              <a href={att.fileUrl} target="_blank" rel="noopener noreferrer">
                {att.fileName}
              </a>
            </div>
          ))
        ) : (
          <p className="no-attachments-text">No files attached.</p>
        )}
      </div>
      <div className="upload-controls">
        <input type="file" id={`file-input-${task._id}`} onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FileUpload;

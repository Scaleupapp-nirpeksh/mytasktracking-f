import React, { useState, useRef, useEffect } from 'react';
import { uploadAttachment } from '../../services/apiService';

const FileUpload = ({ task, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadAttachment(task._id, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onUploadComplete(response.data.data.task);
        setFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploadProgress(0);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '📈',
      pptx: '📈',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      mp4: '🎥',
      mp3: '🎵',
      zip: '📦',
      rar: '📦',
      txt: '📄',
    };
    return iconMap[extension] || '📎';
  };

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes progressFill {
        from { width: 0%; }
        to { width: var(--progress-width); }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-4px); }
        60% { transform: translateY(-2px); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const styles = {
    fileUploadContainer: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      margin: '16px 0',
    },
    
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    attachmentsList: {
      marginBottom: '24px',
    },
    
    attachmentItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: '#f8fafc',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      marginBottom: '8px',
      transition: 'all 0.2s ease',
      animation: 'slideIn 0.3s ease-out',
    },
    
    attachmentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    attachmentIcon: {
      fontSize: '24px',
    },
    
    attachmentDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    
    attachmentName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    },
    
    attachmentSize: {
      fontSize: '12px',
      color: '#64748b',
      fontWeight: '500',
    },
    
    downloadButton: {
      padding: '8px 16px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      textDecoration: 'none',
    },
    
    noAttachmentsText: {
      fontSize: '16px',
      color: '#64748b',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '10px',
      border: '2px dashed #e2e8f0',
    },
    
    uploadSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    
    dropZone: {
      border: '2px dashed #cbd5e1',
      borderRadius: '12px',
      padding: '32px',
      textAlign: 'center',
      backgroundColor: '#f8fafc',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
    },
    
    dropZoneActive: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
      transform: 'scale(1.02)',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
    },
    
    dropZoneContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    },
    
    uploadIcon: {
      fontSize: '48px',
      opacity: 0.6,
      animation: isDragOver ? 'bounce 0.6s ease-in-out' : 'none',
    },
    
    uploadText: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#374151',
      margin: '0',
    },
    
    uploadSubtext: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0',
    },
    
    hiddenInput: {
      display: 'none',
    },
    
    filePreview: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: '#f0fdf4',
      borderRadius: '10px',
      border: '1px solid #10b981',
      marginBottom: '16px',
    },
    
    filePreviewIcon: {
      fontSize: '32px',
    },
    
    filePreviewDetails: {
      flex: 1,
    },
    
    filePreviewName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 4px 0',
    },
    
    filePreviewSize: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0',
    },
    
    removeFileButton: {
      padding: '6px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.2s ease',
    },
    
    uploadControls: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    
    uploadButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    },
    
    uploadButtonDisabled: {
      background: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    
    cancelButton: {
      padding: '12px 24px',
      backgroundColor: '#f8fafc',
      color: '#475569',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '8px',
    },
    
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    },
    
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    errorMessage: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px',
    },
  };

  return (
    <div style={styles.fileUploadContainer}>
      <h4 style={styles.sectionTitle}>
        <span>📎</span>
        Attachments
      </h4>

      {/* Existing Attachments */}
      <div style={styles.attachmentsList}>
        {task.attachments && task.attachments.length > 0 ? (
          task.attachments.map((att, index) => (
            <div 
              key={index} 
              style={{
                ...styles.attachmentItem,
                animationDelay: `${index * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={styles.attachmentInfo}>
                <span style={styles.attachmentIcon}>
                  {getFileIcon(att.fileName)}
                </span>
                <div style={styles.attachmentDetails}>
                  <span style={styles.attachmentName}>{att.fileName}</span>
                  {att.fileSize && (
                    <span style={styles.attachmentSize}>
                      {formatFileSize(att.fileSize)}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={att.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.downloadButton}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <span>⬇️</span>
                Download
              </a>
            </div>
          ))
        ) : (
          <div style={styles.noAttachmentsText}>
            <span>📁</span> No files attached yet
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div style={styles.uploadSection}>
        {!file ? (
          <div
            style={{
              ...styles.dropZone,
              ...(isDragOver ? styles.dropZoneActive : {})
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={styles.dropZoneContent}>
              <div style={styles.uploadIcon}>
                {isDragOver ? '📥' : '☁️'}
              </div>
              <p style={styles.uploadText}>
                {isDragOver ? 'Drop your file here!' : 'Drag & drop a file here'}
              </p>
              <p style={styles.uploadSubtext}>
                or click to browse files
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id={`file-input-${task._id}`}
              onChange={handleFileChange}
              style={styles.hiddenInput}
            />
          </div>
        ) : (
          <div style={styles.filePreview}>
            <span style={styles.filePreviewIcon}>
              {getFileIcon(file.name)}
            </span>
            <div style={styles.filePreviewDetails}>
              <p style={styles.filePreviewName}>{file.name}</p>
              <p style={styles.filePreviewSize}>{formatFileSize(file.size)}</p>
              {loading && uploadProgress > 0 && (
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${uploadProgress}%`
                    }}
                  />
                </div>
              )}
            </div>
            <button
              style={styles.removeFileButton}
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ef4444';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Controls */}
        {file && (
          <div style={styles.uploadControls}>
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              style={{
                ...styles.uploadButton,
                ...((!file || loading) ? styles.uploadButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (file && !loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (file && !loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <span>📤</span>
                  Upload File
                </>
              )}
            </button>

            <button
              style={styles.cancelButton}
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <span>⚠️</span>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
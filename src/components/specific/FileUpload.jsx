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

  // Add CSS animations matching the design system
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
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Professional SVG Icons matching the design system
  const PaperclipIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59722 21.9983 8.005 21.9983C6.41278 21.9983 4.88578 21.3658 3.76 20.24C2.63421 19.1142 2.00167 17.5872 2.00167 15.995C2.00167 14.4028 2.63421 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7186 1.38825 15.78 1.38825C16.8414 1.38825 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7818 4.32861 19.7818 5.39C19.7818 6.45139 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03494 17.7851 8.52433 17.9972 7.99 17.9972C7.45567 17.9972 6.94506 17.7851 6.57 17.41C6.19494 17.0349 5.98283 16.5243 5.98283 15.99C5.98283 15.4557 6.19494 14.9451 6.57 14.57L15.07 6.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const FileTextIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const UploadCloudIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 16L12 12L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="12" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20.39 18.39C21.3653 17.8583 22.1358 17.0169 22.5799 15.9986C23.024 14.9804 23.1162 13.8432 22.8422 12.7667C22.5682 11.6901 21.9434 10.7352 21.0657 10.0534C20.1881 9.37163 19.1078 8.99945 18 9H16.74C16.423 7.82793 15.8152 6.75154 14.9657 5.86198C14.1162 4.97241 13.0515 4.29524 11.8715 3.88796C10.6916 3.48068 9.43311 3.35372 8.19438 3.51944C6.95566 3.68516 5.77707 4.13838 4.75736 4.84677C3.73765 5.55517 2.90328 6.49691 2.32183 7.59543C1.74038 8.69394 1.4286 9.91055 1.40551 11.1473C1.38243 12.3841 1.64883 13.6119 2.18336 14.7336C2.71789 15.8553 3.50478 16.8374 4.48 17.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const UploadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17,6 12,1 7,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="1" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const FolderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 21.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const styles = {
    fileUploadContainer: {
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e5e5',
      margin: '0',
    },
    
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    attachmentsList: {
      marginBottom: '20px',
    },
    
    attachmentItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      marginBottom: '8px',
      transition: 'all 0.2s ease',
      animation: 'slideIn 0.3s ease-out',
    },
    
    attachmentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
      minWidth: 0,
    },
    
    attachmentIcon: {
      color: '#737373',
      flexShrink: 0,
    },
    
    attachmentDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      flex: 1,
      minWidth: 0,
    },
    
    attachmentName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    attachmentSize: {
      fontSize: '12px',
      color: '#737373',
      fontWeight: '400',
    },
    
    downloadButton: {
      padding: '6px 12px',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      textDecoration: 'none',
      flexShrink: 0,
    },
    
    emptyState: {
      fontSize: '14px',
      color: '#737373',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    },
    
    emptyIcon: {
      color: '#a3a3a3',
      opacity: 0.7,
    },
    
    uploadSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    
    dropZone: {
      border: '2px dashed #d4d4d4',
      borderRadius: '8px',
      padding: '24px',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
    },
    
    dropZoneActive: {
      borderColor: '#0a0a0a',
      backgroundColor: '#f5f5f5',
      transform: 'scale(1.01)',
    },
    
    dropZoneContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    },
    
    uploadIcon: {
      color: '#737373',
      opacity: 0.8,
    },
    
    uploadText: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: '0',
    },
    
    uploadSubtext: {
      fontSize: '14px',
      color: '#737373',
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
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      marginBottom: '16px',
    },
    
    filePreviewIcon: {
      color: '#737373',
      flexShrink: 0,
    },
    
    filePreviewDetails: {
      flex: 1,
      minWidth: 0,
    },
    
    filePreviewName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      margin: '0 0 4px 0',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    filePreviewSize: {
      fontSize: '12px',
      color: '#737373',
      margin: '0',
    },
    
    removeFileButton: {
      width: '24px',
      height: '24px',
      backgroundColor: '#f5f5f5',
      color: '#737373',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    
    uploadControls: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    
    uploadButton: {
      padding: '10px 16px',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    uploadButtonDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#a3a3a3',
      cursor: 'not-allowed',
    },
    
    cancelButton: {
      padding: '10px 16px',
      backgroundColor: '#ffffff',
      color: '#525252',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    progressBar: {
      width: '100%',
      height: '4px',
      backgroundColor: '#f5f5f5',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '8px',
    },
    
    progressFill: {
      height: '100%',
      backgroundColor: '#0a0a0a',
      borderRadius: '2px',
      transition: 'width 0.3s ease',
    },
    
    spinner: {
      width: '14px',
      height: '14px',
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
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px',
    },
  };

  return (
    <div style={styles.fileUploadContainer}>
      <h4 style={styles.sectionTitle}>
        <PaperclipIcon />
        File Attachments
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
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#d4d4d4';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e5e5e5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.attachmentInfo}>
                <div style={styles.attachmentIcon}>
                  <FileTextIcon />
                </div>
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
                  e.target.style.backgroundColor = '#262626';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0a0a0a';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <DownloadIcon />
                Download
              </a>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <FolderIcon />
            </div>
            <span>No files attached yet</span>
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
                <UploadCloudIcon />
              </div>
              <p style={styles.uploadText}>
                {isDragOver ? 'Drop your file here' : 'Drag & drop a file here'}
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
            <div style={styles.filePreviewIcon}>
              <FileTextIcon />
            </div>
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
                e.target.style.backgroundColor = '#e5e5e5';
                e.target.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.color = '#737373';
              }}
            >
              <XIcon />
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
                  e.target.style.backgroundColor = '#262626';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (file && !loading) {
                  e.target.style.backgroundColor = '#0a0a0a';
                  e.target.style.transform = 'translateY(0)';
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
                  <UploadIcon />
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
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#a3a3a3';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#d4d4d4';
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
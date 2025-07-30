import React, { useEffect } from 'react';

const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const TaskDetailModal = ({ task, workspaceName, onClose, onEdit, onDelete }) => {
  // Add CSS animations matching the design system
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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
  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const FlagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15S11 9 20 15L20 3S11 9 4 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const FolderIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 21.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ActivityIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const PaperclipIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59722 21.9983 8.005 21.9983C6.41278 21.9983 4.88578 21.3658 3.76 20.24C2.63421 19.1142 2.00167 17.5872 2.00167 15.995C2.00167 14.4028 2.63421 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7186 1.38825 15.78 1.38825C16.8414 1.38825 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7818 4.32861 19.7818 5.39C19.7818 6.45139 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03494 17.7851 8.52433 17.9972 7.99 17.9972C7.45567 17.9972 6.94506 17.7851 6.57 17.41C6.19494 17.0349 5.98283 16.5243 5.98283 15.99C5.98283 15.4557 6.19494 14.9451 6.57 14.57L15.07 6.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
    </svg>
  );

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'overlayFadeIn 0.3s ease-out',
    },
    
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto',
      animation: 'modalSlideIn 0.4s ease-out',
      border: '1px solid #e5e5e5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
    },
    
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '24px 32px',
      borderBottom: '1px solid #e5e5e5',
    },
    
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
      marginRight: '16px',
    },
    
    keyTaskIndicator: {
      color: '#ca8a04',
      flexShrink: 0,
    },
    
    modalTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0a0a0a',
      margin: 0,
      lineHeight: '1.3',
      wordBreak: 'break-word',
    },
    
    closeButton: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      backgroundColor: '#f5f5f5',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#737373',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    
    modalBody: {
      padding: '32px',
    },
    
    detailSection: {
      marginBottom: '32px',
      animation: 'fadeInUp 0.5s ease-out',
    },
    
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    
    detailItem: {
      backgroundColor: '#fafafa',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      transition: 'all 0.2s ease',
    },
    
    detailLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#737373',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    
    detailValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      display: 'block',
    },
    
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      display: 'inline-block',
      color: 'white',
    },
    
    priorityBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      display: 'inline-block',
      color: 'white',
    },
    
    description: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#0a0a0a',
      backgroundColor: '#fafafa',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      margin: 0,
      whiteSpace: 'pre-wrap',
    },
    
    attachmentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    
    attachmentItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
    
    attachmentIcon: {
      color: '#737373',
      marginRight: '12px',
      flexShrink: 0,
    },
    
    attachmentLink: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    downloadIcon: {
      color: '#737373',
      marginLeft: '12px',
      flexShrink: 0,
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      color: '#737373',
    },
    
    emptyIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      opacity: 0.5,
    },
    
    emptyText: {
      fontSize: '14px',
      color: '#737373',
      margin: 0,
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 32px',
      borderTop: '1px solid #e5e5e5',
      backgroundColor: '#fafafa',
    },
    
    footerActions: {
      display: 'flex',
      gap: '12px',
    },
    
    buttonSecondary: {
      padding: '10px 20px',
      backgroundColor: '#ffffff',
      color: '#525252',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    buttonPrimary: {
      padding: '10px 20px',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    buttonDanger: {
      padding: '10px 20px',
      backgroundColor: 'transparent',
      color: '#dc2626',
      border: '1px solid #dc2626',
      borderRadius: '8px',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#16a34a',
      'Medium': '#ca8a04',  
      'High': '#dc2626',
      'Critical': '#7c2d12',
    };
    return colors[priority] || '#737373';
  };

  const getStatusColor = (status) => {
    const colors = {
      'To Do': '#737373',
      'In Progress': '#0a0a0a',
      'Blocked': '#dc2626',
      'For Review': '#ca8a04',
      'Done': '#16a34a',
    };
    return colors[status] || '#737373';
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileTextIcon />;
    const extension = fileName.split('.').pop().toLowerCase();
    
    // Return the same icon for all file types to keep it professional
    return <FileTextIcon />;
  };

  if (!task) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleContainer}>
            {task.isKeyTask && (
              <div style={styles.keyTaskIndicator}>
                <StarIcon />
              </div>
            )}
            <h2 style={styles.modalTitle}>{task.title}</h2>
          </div>
          <button 
            style={styles.closeButton}
            onClick={onClose}
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

        <div style={styles.modalBody}>
          {/* Task Details Section */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>
              <ActivityIcon />
              Task Details
            </h3>
            <div style={styles.detailGrid}>
              <div 
                style={styles.detailItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = '#d4d4d4';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fafafa';
                  e.target.style.borderColor = '#e5e5e5';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span style={styles.detailLabel}>
                  <ActivityIcon />
                  Status
                </span>
                <span 
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(task.status)
                  }}
                >
                  {task.status}
                </span>
              </div>
              
              <div 
                style={styles.detailItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = '#d4d4d4';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fafafa';
                  e.target.style.borderColor = '#e5e5e5';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span style={styles.detailLabel}>
                  <FlagIcon />
                  Priority
                </span>
                <span 
                  style={{
                    ...styles.priorityBadge,
                    backgroundColor: getPriorityColor(task.priority)
                  }}
                >
                  {task.priority}
                </span>
              </div>
              
              <div 
                style={styles.detailItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = '#d4d4d4';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fafafa';
                  e.target.style.borderColor = '#e5e5e5';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span style={styles.detailLabel}>
                  <CalendarIcon />
                  Due Date
                </span>
                <span style={styles.detailValue}>{formatDate(task.dueDate)}</span>
              </div>
              
              <div 
                style={styles.detailItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = '#d4d4d4';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fafafa';
                  e.target.style.borderColor = '#e5e5e5';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span style={styles.detailLabel}>
                  <FolderIcon />
                  Workspace
                </span>
                <span style={styles.detailValue}>{workspaceName}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {task.description && (
            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>
                <FileTextIcon />
                Description
              </h3>
              <p style={styles.description}>{task.description}</p>
            </div>
          )}

          {/* Attachments Section */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>
              <PaperclipIcon />
              Attachments ({task.attachments ? task.attachments.length : 0})
            </h3>
            <div style={styles.attachmentsList}>
              {task.attachments && task.attachments.length > 0 ? (
                task.attachments.map((att, index) => (
                  <div 
                    key={index} 
                    style={styles.attachmentItem}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f5f5f5';
                      e.target.style.borderColor = '#d4d4d4';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#fafafa';
                      e.target.style.borderColor = '#e5e5e5';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={styles.attachmentIcon}>
                      {getFileIcon(att.fileName)}
                    </div>
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.attachmentLink}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#737373';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#0a0a0a';
                      }}
                    >
                      {att.fileName}
                    </a>
                    <div style={styles.downloadIcon}>
                      <DownloadIcon />
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <PaperclipIcon />
                  </div>
                  <p style={styles.emptyText}>No files attached to this task</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button 
            type="button" 
            style={styles.buttonDanger}
            onClick={onDelete}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
              e.target.style.color = '#ffffff';
              e.target.style.borderColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#dc2626';
              e.target.style.borderColor = '#dc2626';
            }}
          >
            <TrashIcon />
            Delete Task
          </button>
          
          <div style={styles.footerActions}>
            <button 
              type="button" 
              style={styles.buttonSecondary}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#a3a3a3';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#d4d4d4';
              }}
            >
              Close
            </button>
            <button 
              type="button" 
              style={styles.buttonPrimary}
              onClick={onEdit}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#262626';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0a0a0a';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <EditIcon />
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
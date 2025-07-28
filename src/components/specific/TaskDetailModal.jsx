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
  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-50px) scale(0.95);
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
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
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
      
      @keyframes shine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'overlayFadeIn 0.3s ease-out',
    },
    
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      width: '100%',
      maxWidth: '700px',
      maxHeight: '90vh',
      overflow: 'auto',
      animation: 'modalSlideIn 0.4s ease-out',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '32px 32px 0 32px',
      borderBottom: 'none',
    },
    
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
      marginRight: '16px',
    },
    
    keyTaskIndicator: {
      fontSize: '28px',
      color: '#f59e0b',
      filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))',
      animation: 'pulse 2s infinite',
    },
    
    modalTitle: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0,
      background: 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1.2',
      wordBreak: 'break-word',
    },
    
    closeButton: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#f1f5f9',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#64748b',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    
    modalBody: {
      padding: '32px',
    },
    
    detailSection: {
      marginBottom: '32px',
      animation: 'slideInUp 0.5s ease-out',
    },
    
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e2e8f0',
    },
    
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    },
    
    detailItem: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
    },
    
    detailLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
      display: 'block',
    },
    
    detailValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'block',
    },
    
    priorityBadge: {
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'inline-block',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    
    statusBadge: {
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'inline-block',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    
    description: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#374151',
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      margin: 0,
      whiteSpace: 'pre-wrap',
    },
    
    attachmentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    
    attachmentItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      animation: 'slideInUp 0.3s ease-out',
    },
    
    attachmentIcon: {
      fontSize: '24px',
      marginRight: '12px',
    },
    
    attachmentLink: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#10b981',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      flex: 1,
    },
    
    downloadIcon: {
      fontSize: '18px',
      color: '#64748b',
      marginLeft: '12px',
    },
    
    placeholderText: {
      fontSize: '16px',
      color: '#64748b',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '32px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '2px dashed #e2e8f0',
      margin: 0,
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 32px 32px 32px',
      borderTop: 'none',
    },
    
    footerActions: {
      display: 'flex',
      gap: '12px',
    },
    
    buttonSecondary: {
      padding: '14px 24px',
      backgroundColor: '#f8fafc',
      color: '#475569',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    buttonPrimary: {
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    buttonDanger: {
      padding: '14px 24px',
      backgroundColor: 'transparent',
      color: '#dc2626',
      border: '2px solid #dc2626',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  const getPriorityStyle = (priority) => {
    const priorityStyles = {
      'Low': {
        backgroundColor: '#dcfce7',
        color: '#15803d',
        border: '1px solid #bbf7d0',
      },
      'Medium': {
        backgroundColor: '#fef3c7',
        color: '#d97706',
        border: '1px solid #fde68a',
      },
      'High': {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fecaca',
      },
      'Critical': {
        backgroundColor: '#450a0a',
        color: '#fecaca',
        border: '1px solid #7f1d1d',
      },
    };
    return { ...styles.priorityBadge, ...priorityStyles[priority] };
  };

  const getStatusStyle = (status) => {
    const statusStyles = {
      'To Do': {
        backgroundColor: '#f1f5f9',
        color: '#64748b',
        border: '1px solid #e2e8f0',
      },
      'In Progress': {
        backgroundColor: '#dbeafe',
        color: '#2563eb',
        border: '1px solid #bfdbfe',
      },
      'Blocked': {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fecaca',
      },
      'For Review': {
        backgroundColor: '#fef3c7',
        color: '#d97706',
        border: '1px solid #fde68a',
      },
      'Done': {
        backgroundColor: '#dcfce7',
        color: '#15803d',
        border: '1px solid #bbf7d0',
      },
    };
    return { ...styles.statusBadge, ...statusStyles[status] };
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📎';
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

  if (!task) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleContainer}>
            {task.isKeyTask && (
              <span style={styles.keyTaskIndicator}>⭐</span>
            )}
            <h2 style={styles.modalTitle}>{task.title}</h2>
          </div>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.color = 'white';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.color = '#64748b';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* Details Section */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>
              <span>📋</span>
              Task Details
            </h3>
            <div style={styles.detailGrid}>
              <div 
                style={styles.detailItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={styles.detailLabel}>📊 Status</span>
                <span style={getStatusStyle(task.status)}>{task.status}</span>
              </div>
              
              <div 
                style={styles.detailItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={styles.detailLabel}>🎯 Priority</span>
                <span style={getPriorityStyle(task.priority)}>
                  {task.priority}
                </span>
              </div>
              
              <div 
                style={styles.detailItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={styles.detailLabel}>📅 Due Date</span>
                <span style={styles.detailValue}>{formatDate(task.dueDate)}</span>
              </div>
              
              <div 
                style={styles.detailItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={styles.detailLabel}>🏢 Workspace</span>
                <span style={styles.detailValue}>{workspaceName}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {task.description && (
            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>
                <span>📝</span>
                Description
              </h3>
              <p style={styles.description}>{task.description}</p>
            </div>
          )}

          {/* Attachments Section */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>
              <span>📎</span>
              Attachments
            </h3>
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
                      e.currentTarget.style.backgroundColor = '#f0fdf4';
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={styles.attachmentIcon}>
                      {getFileIcon(att.fileName)}
                    </span>
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.attachmentLink}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#059669';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#10b981';
                      }}
                    >
                      {att.fileName}
                    </a>
                    <span style={styles.downloadIcon}>⬇️</span>
                  </div>
                ))
              ) : (
                <p style={styles.placeholderText}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📁</span>
                  No files attached to this task
                </p>
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
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#dc2626';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span>🗑️</span>
            Delete Task
          </button>
          
          <div style={styles.footerActions}>
            <button 
              type="button" 
              style={styles.buttonSecondary}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Close
            </button>
            <button 
              type="button" 
              style={styles.buttonPrimary}
              onClick={onEdit}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
              }}
            >
              <span>✏️</span>
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
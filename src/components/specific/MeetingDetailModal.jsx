import React, { useState, useEffect } from 'react';
import { updateMeetingNotes } from '../../services/apiService';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const MeetingDetailModal = ({ meeting, onClose, onMeetingUpdated }) => {
  const [notes, setNotes] = useState(meeting.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(notes !== (meeting.notes || ''));
  }, [notes, meeting.notes]);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    setError('');
    try {
      const response = await updateMeetingNotes(meeting._id, notes);
      onMeetingUpdated(response.data.data.meeting);
      setIsEditingNotes(false);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError('Failed to save notes. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNotes(meeting.notes || '');
    setIsEditingNotes(false);
    setHasUnsavedChanges(false);
    setError('');
  };

  const getStatusColor = (status) => {
    const colors = {
      'To Do': '#64748b',
      'In Progress': '#3b82f6',
      'Blocked': '#ef4444',
      'For Review': '#f59e0b',
      'Done': '#10b981',
    };
    return colors[status] || '#64748b';
  };

  const getStatusBadgeStyle = (status) => ({
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'white',
    backgroundColor: getStatusColor(status),
    display: 'inline-block',
  });

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
      maxWidth: '900px',
      maxHeight: '90vh',
      overflow: 'auto',
      animation: 'modalSlideIn 0.4s ease-out',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '32px 32px 0 32px',
      borderBottom: 'none',
    },
    
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
    },
    
    meetingIcon: {
      fontSize: '32px',
      filter: 'drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3))',
    },
    
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    
    modalTitle: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    
    meetingDate: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '500',
      margin: 0,
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
    
    section: {
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
    
    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    
    taskCard: {
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
    },
    
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    
    taskTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
      flex: 1,
      marginRight: '16px',
    },
    
    taskDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.5',
    },
    
    notesSection: {
      position: 'relative',
    },
    
    notesHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    
    notesActions: {
      display: 'flex',
      gap: '8px',
    },
    
    actionButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    editButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    
    saveButton: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    
    cancelButton: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      border: '1px solid #e2e8f0',
    },
    
    saveButtonDisabled: {
      backgroundColor: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
    },
    
    notesDisplay: {
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#374151',
      minHeight: '100px',
      whiteSpace: 'pre-wrap',
    },
    
    notesTextarea: {
      width: '100%',
      minHeight: '150px',
      padding: '20px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#374151',
      backgroundColor: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    
    notesTextareaFocused: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
    
    emptyNotes: {
      color: '#94a3b8',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '40px 20px',
    },
    
    errorMessage: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '16px',
    },
    
    unsavedChanges: {
      backgroundColor: '#fef3c7',
      color: '#d97706',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #fde68a',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
    },
    
    spinner: {
      width: '14px',
      height: '14px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    noTasks: {
      textAlign: 'center',
      padding: '40px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '2px dashed #e2e8f0',
    },
    
    noTasksIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      opacity: 0.6,
    },
    
    noTasksText: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
    },
  };

  if (!meeting) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.headerContent}>
            <span style={styles.meetingIcon}>📋</span>
            <div style={styles.headerText}>
              <h2 style={styles.modalTitle}>Meeting Details</h2>
              <p style={styles.meetingDate}>{formatDate(meeting.meetingDate)}</p>
            </div>
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
          {/* Task Snapshots Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span>✅</span>
              Key Tasks Reviewed ({meeting.taskSnapshots.length})
            </h3>
            
            {meeting.taskSnapshots.length > 0 ? (
              <div style={styles.tasksList}>
                {meeting.taskSnapshots.map((task, index) => (
                  <div 
                    key={task.originalTaskId || index}
                    style={{
                      ...styles.taskCard,
                      animationDelay: `${index * 0.1}s`,
                    }}
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
                    <div style={styles.taskHeader}>
                      <h4 style={styles.taskTitle}>{task.title}</h4>
                      <span style={getStatusBadgeStyle(task.status)}>
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p style={styles.taskDescription}>{task.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noTasks}>
                <div style={styles.noTasksIcon}>📝</div>
                <p style={styles.noTasksText}>
                  No key tasks were captured for this meeting
                </p>
              </div>
            )}
          </div>

          {/* Meeting Notes Section */}
          <div style={styles.section}>
            <div style={styles.notesHeader}>
              <h3 style={styles.sectionTitle}>
                <span>📝</span>
                Meeting Notes
              </h3>
              <div style={styles.notesActions}>
                {!isEditingNotes ? (
                  <button 
                    style={{...styles.actionButton, ...styles.editButton}}
                    onClick={() => setIsEditingNotes(true)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2563eb';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#3b82f6';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    ✏️ Edit Notes
                  </button>
                ) : (
                  <>
                    <button 
                      style={{...styles.actionButton, ...styles.cancelButton}}
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      onMouseEnter={(e) => {
                        if (!isSaving) {
                          e.target.style.backgroundColor = '#e2e8f0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSaving) {
                          e.target.style.backgroundColor = '#f1f5f9';
                        }
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      style={{
                        ...styles.actionButton, 
                        ...styles.saveButton,
                        ...(isSaving ? styles.saveButtonDisabled : {})
                      }}
                      onClick={handleSaveNotes}
                      disabled={isSaving}
                      onMouseEnter={(e) => {
                        if (!isSaving) {
                          e.target.style.backgroundColor = '#059669';
                          e.target.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSaving) {
                          e.target.style.backgroundColor = '#10b981';
                          e.target.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {isSaving ? (
                        <>
                          <span style={styles.spinner}></span>
                          Saving...
                        </>
                      ) : (
                        '💾 Save Notes'
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {hasUnsavedChanges && isEditingNotes && (
              <div style={styles.unsavedChanges}>
                <span>⚠️</span>
                You have unsaved changes
              </div>
            )}

            {error && (
              <div style={styles.errorMessage}>
                <span>❌</span>
                {error}
              </div>
            )}

            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your meeting notes here... What was discussed? What are the next steps? Any key decisions made?"
                style={styles.notesTextarea}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.notesTextareaFocused);
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ) : (
              <div style={styles.notesDisplay}>
                {notes ? (
                  notes
                ) : (
                  <div style={styles.emptyNotes}>
                    No notes have been added for this meeting yet. Click "Edit Notes" to add your thoughts and action items.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailModal;
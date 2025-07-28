import React, { useState, useEffect } from 'react';
import { updateMeetingNotes } from '../../services/apiService';

const ActiveMeetingModal = ({ meeting, onClose, onMeetingUpdated }) => {
  const [notes, setNotes] = useState(meeting.notes || '');
  const [discussedTasks, setDiscussedTasks] = useState(new Set());
  const [startTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [error, setError] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-save notes every 30 seconds if there are changes
  useEffect(() => {
    if (notes !== (meeting.notes || '')) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [notes]);

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
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
      }
      
      @keyframes checkmark {
        0% { transform: scale(0) rotate(45deg); }
        50% { transform: scale(1.2) rotate(45deg); }
        100% { transform: scale(1) rotate(45deg); }
      }
      
      @keyframes progressFill {
        from { width: 0%; }
        to { width: var(--progress-width); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleAutoSave = async () => {
    if (notes === (meeting.notes || '')) return;
    
    setAutoSaving(true);
    try {
      const response = await updateMeetingNotes(meeting._id, notes);
      onMeetingUpdated(response.data.data.meeting);
      setLastSaved(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSaveAndClose = async () => {
    setIsSaving(true);
    setError('');
    try {
      if (notes !== (meeting.notes || '')) {
        const response = await updateMeetingNotes(meeting._id, notes);
        onMeetingUpdated(response.data.data.meeting);
      }
      onClose();
    } catch (err) {
      setError('Failed to save notes. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTaskDiscussed = (taskId) => {
    const newDiscussedTasks = new Set(discussedTasks);
    if (newDiscussedTasks.has(taskId)) {
      newDiscussedTasks.delete(taskId);
    } else {
      newDiscussedTasks.add(taskId);
    }
    setDiscussedTasks(newDiscussedTasks);
  };

  const formatDuration = (start, end) => {
    const diffMs = end - start;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  const progressPercentage = meeting.taskSnapshots.length > 0 
    ? Math.round((discussedTasks.size / meeting.taskSnapshots.length) * 100)
    : 0;

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
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
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      width: '100%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      overflow: 'auto',
      animation: 'modalSlideIn 0.4s ease-out',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
    },
    
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '32px 32px 0 32px',
      borderBottom: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
    },
    
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
    },
    
    meetingIcon: {
      fontSize: '32px',
      animation: 'pulse 2s ease-in-out infinite',
    },
    
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    
    modalTitle: {
      fontSize: '28px',
      fontWeight: '800',
      margin: 0,
    },
    
    meetingInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      fontSize: '16px',
      fontWeight: '500',
      opacity: 0.9,
    },
    
    timer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '18px',
      fontWeight: '700',
      background: 'rgba(255, 255, 255, 0.2)',
      padding: '8px 16px',
      borderRadius: '12px',
    },
    
    closeButton: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    
    modalBody: {
      display: 'flex',
      flex: 1,
      minHeight: '600px',
    },
    
    leftPanel: {
      flex: 1,
      padding: '32px',
      borderRight: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
    },
    
    rightPanel: {
      flex: 1,
      padding: '32px',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
    },
    
    progressSection: {
      marginBottom: '32px',
      animation: 'slideInUp 0.5s ease-out',
    },
    
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    
    progressTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
    },
    
    progressStats: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '600',
    },
    
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
      width: `${progressPercentage}%`,
    },
    
    progressText: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '600',
      textAlign: 'center',
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
    
    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      maxHeight: '500px',
      overflowY: 'auto',
      paddingRight: '8px',
    },
    
    taskCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
    },
    
    taskCardDiscussed: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
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
    
    taskActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    discussedCheckbox: {
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      border: '2px solid #e2e8f0',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      position: 'relative',
    },
    
    discussedCheckboxChecked: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      color: 'white',
    },
    
    checkmark: {
      fontSize: '14px',
      fontWeight: 'bold',
      animation: 'checkmark 0.3s ease-out',
    },
    
    taskDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.5',
    },
    
    notesSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    
    notesHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    
    saveStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#64748b',
    },
    
    notesTextarea: {
      flex: 1,
      minHeight: '300px',
      padding: '20px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#374151',
      backgroundColor: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      resize: 'none',
      fontFamily: 'inherit',
    },
    
    notesTextareaFocused: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 32px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
    },
    
    footerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '14px',
      color: '#64748b',
    },
    
    footerActions: {
      display: 'flex',
      gap: '12px',
    },
    
    buttonSecondary: {
      padding: '12px 24px',
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
      padding: '12px 28px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    buttonPrimaryDisabled: {
      background: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
      boxShadow: 'none',
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
  };

  if (!meeting) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <div style={styles.headerContent}>
            <span style={styles.meetingIcon}>🎯</span>
            <div style={styles.headerText}>
              <h2 style={styles.modalTitle}>Active Meeting Session</h2>
              <div style={styles.meetingInfo}>
                <div style={styles.timer}>
                  <span>⏱️</span>
                  {formatDuration(startTime, currentTime)}
                </div>
                <span>📋 {meeting.taskSnapshots.length} key tasks</span>
                <span>✅ {discussedTasks.size} discussed</span>
              </div>
            </div>
          </div>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* Left Panel - Tasks */}
          <div style={styles.leftPanel}>
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <h3 style={styles.progressTitle}>Meeting Progress</h3>
                <span style={styles.progressStats}>
                  {discussedTasks.size} of {meeting.taskSnapshots.length}
                </span>
              </div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill} />
              </div>
              <p style={styles.progressText}>{progressPercentage}% Complete</p>
            </div>

            <h3 style={styles.sectionTitle}>
              <span>📋</span>
              Key Tasks to Review
            </h3>
            
            <div style={styles.tasksList}>
              {meeting.taskSnapshots.map((task, index) => {
                const isDiscussed = discussedTasks.has(task.originalTaskId);
                return (
                  <div 
                    key={task.originalTaskId || index}
                    style={{
                      ...styles.taskCard,
                      ...(isDiscussed ? styles.taskCardDiscussed : {}),
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => toggleTaskDiscussed(task.originalTaskId)}
                    onMouseEnter={(e) => {
                      if (!isDiscussed) {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDiscussed) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <div style={styles.taskHeader}>
                      <h4 style={styles.taskTitle}>{task.title}</h4>
                      <div style={styles.taskActions}>
                        <span style={getStatusBadgeStyle(task.status)}>
                          {task.status}
                        </span>
                        <div style={{
                          ...styles.discussedCheckbox,
                          ...(isDiscussed ? styles.discussedCheckboxChecked : {})
                        }}>
                          {isDiscussed && (
                            <span style={styles.checkmark}>✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {task.description && (
                      <p style={styles.taskDescription}>{task.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Notes */}
          <div style={styles.rightPanel}>
            <div style={styles.notesSection}>
              <div style={styles.notesHeader}>
                <h3 style={styles.sectionTitle}>
                  <span>📝</span>
                  Meeting Notes
                </h3>
                <div style={styles.saveStatus}>
                  {autoSaving && (
                    <>
                      <span style={styles.spinner}></span>
                      Auto-saving...
                    </>
                  )}
                  {lastSaved && !autoSaving && (
                    <>
                      <span>✅</span>
                      Saved {lastSaved.toLocaleTimeString()}
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div style={styles.errorMessage}>
                  <span>❌</span>
                  {error}
                </div>
              )}

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during your meeting...

What are the key discussion points?
What decisions were made?
What are the next action items?
Any blockers or challenges discussed?"
                style={styles.notesTextarea}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.notesTextareaFocused);
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        <div style={styles.modalFooter}>
          <div style={styles.footerInfo}>
            <span>💡 Click tasks to mark as discussed</span>
            <span>💾 Notes auto-save every 30 seconds</span>
          </div>
          <div style={styles.footerActions}>
            <button 
              style={styles.buttonSecondary}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
              }}
            >
              Continue Later
            </button>
            <button 
              style={{
                ...styles.buttonPrimary,
                ...(isSaving ? styles.buttonPrimaryDisabled : {})
              }}
              onClick={handleSaveAndClose}
              disabled={isSaving}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {isSaving ? (
                <>
                  <span style={styles.spinner}></span>
                  Saving & Closing...
                </>
              ) : (
                <>
                  <span>🎯</span>
                  End Meeting
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMeetingModal;
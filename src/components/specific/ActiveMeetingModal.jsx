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
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes checkmark {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      .fade-in-up {
        animation: fadeInUp 0.3s ease-out;
      }
      
      /* Custom scrollbar */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #d4d4d4;
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #a3a3a3;
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
      'To Do': '#737373',
      'In Progress': '#0a0a0a',
      'Blocked': '#dc2626',
      'For Review': '#ca8a04',
      'Done': '#16a34a',
    };
    return colors[status] || '#737373';
  };

  const getStatusBadgeStyle = (status) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'white',
    backgroundColor: getStatusColor(status),
    display: 'inline-block',
  });

  const progressPercentage = meeting.taskSnapshots.length > 0 
    ? Math.round((discussedTasks.size / meeting.taskSnapshots.length) * 100)
    : 0;

  // Professional SVG Icons
  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const TargetIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '40px 20px',
      overflowY: 'auto',
      animation: 'overlayFadeIn 0.3s ease-out',
    },
    
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '1200px',
      minHeight: '600px',
      animation: 'modalSlideIn 0.4s ease-out',
      border: '1px solid #e5e5e5',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
      margin: 'auto',
    },
    
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 32px',
      borderBottom: '1px solid #e5e5e5',
      backgroundColor: '#ffffff',
      flexShrink: 0,
    },
    
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
    },
    
    meetingIcon: {
      width: '48px',
      height: '48px',
      backgroundColor: '#0a0a0a',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      flexShrink: 0,
    },
    
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    
    modalTitle: {
      fontSize: '24px',
      fontWeight: '700',
      margin: 0,
      color: '#0a0a0a',
    },
    
    meetingInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#737373',
    },
    
    timer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#0a0a0a',
      backgroundColor: '#f5f5f5',
      padding: '6px 12px',
      borderRadius: '8px',
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
      display: 'flex',
      flex: 1,
      minHeight: 0, // Important: allows flex children to shrink
    },
    
    leftPanel: {
      flex: 1,
      borderRight: '1px solid #e5e5e5',
      backgroundColor: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    
    rightPanel: {
      flex: 1,
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    
    scrollableContent: {
      flex: 1,
      overflow: 'auto',
      padding: '32px',
    },
    
    progressSection: {
      marginBottom: '32px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '20px',
    },
    
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    
    progressTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: 0,
    },
    
    progressStats: {
      fontSize: '14px',
      color: '#737373',
      fontWeight: '500',
    },
    
    progressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#f5f5f5',
      borderRadius: '3px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    
    progressFill: {
      height: '100%',
      backgroundColor: '#0a0a0a',
      borderRadius: '3px',
      transition: 'width 0.3s ease',
      width: `${progressPercentage}%`,
    },
    
    progressText: {
      fontSize: '12px',
      color: '#737373',
      fontWeight: '500',
      textAlign: 'center',
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
    
    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    
    taskCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e5e5e5',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      position: 'relative',
    },
    
    taskCardDiscussed: {
      borderColor: '#16a34a',
      backgroundColor: '#f0fdf4',
      boxShadow: '0 2px 8px rgba(22, 163, 74, 0.1)',
    },
    
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
    },
    
    taskTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: 0,
      flex: 1,
      marginRight: '16px',
      lineHeight: 1.4,
    },
    
    taskActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    discussedCheckbox: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: '2px solid #d4d4d4',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      position: 'relative',
    },
    
    discussedCheckboxChecked: {
      backgroundColor: '#16a34a',
      borderColor: '#16a34a',
      color: '#ffffff',
    },
    
    checkmark: {
      animation: 'checkmark 0.3s ease-out',
    },
    
    taskDescription: {
      fontSize: '14px',
      color: '#737373',
      margin: 0,
      lineHeight: 1.5,
    },
    
    notesSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '32px',
      minHeight: 0, // Important: allows flex children to shrink
    },
    
    notesHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      flexShrink: 0,
    },
    
    saveStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#737373',
      fontWeight: '500',
    },
    
    textareaContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },
    
    notesTextarea: {
      flex: 1,
      minHeight: '300px',
      padding: '16px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: 1.6,
      color: '#0a0a0a',
      backgroundColor: '#ffffff',
      outline: 'none',
      transition: 'all 0.2s ease',
      resize: 'none',
      fontFamily: 'inherit',
    },
    
    notesTextareaFocused: {
      borderColor: '#0a0a0a',
      boxShadow: '0 0 0 3px rgba(10, 10, 10, 0.1)',
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 32px',
      borderTop: '1px solid #e5e5e5',
      backgroundColor: '#fafafa',
      flexShrink: 0,
    },
    
    footerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '12px',
      color: '#737373',
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
    
    buttonPrimaryDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#a3a3a3',
      cursor: 'not-allowed',
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
      marginBottom: '16px',
    },
  };

  if (!meeting) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <div style={styles.headerContent}>
            <div style={styles.meetingIcon}>
              <TargetIcon />
            </div>
            <div style={styles.headerText}>
              <h2 style={styles.modalTitle}>Active Meeting Session</h2>
              <div style={styles.meetingInfo}>
                <div style={styles.timer}>
                  <ClockIcon />
                  {formatDuration(startTime, currentTime)}
                </div>
                <span>{meeting.taskSnapshots.length} key tasks</span>
                <span>{discussedTasks.size} discussed</span>
              </div>
            </div>
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
          {/* Left Panel - Tasks */}
          <div style={styles.leftPanel}>
            <div style={styles.scrollableContent} className="custom-scrollbar">
              <div style={styles.progressSection} className="fade-in-up">
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
                <FileTextIcon />
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
                      }}
                      className="fade-in-up"
                      onClick={() => toggleTaskDiscussed(task.originalTaskId)}
                      onMouseEnter={(e) => {
                        if (!isDiscussed) {
                          e.currentTarget.style.borderColor = '#d4d4d4';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isDiscussed) {
                          e.currentTarget.style.borderColor = '#e5e5e5';
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
                              <div style={styles.checkmark}>
                                <CheckIcon />
                              </div>
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
          </div>

          {/* Right Panel - Notes */}
          <div style={styles.rightPanel}>
            <div style={styles.notesSection}>
              <div style={styles.notesHeader}>
                <h3 style={styles.sectionTitle}>
                  <EditIcon />
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
                      <CheckIcon />
                      Saved {lastSaved.toLocaleTimeString()}
                    </>
                  )}
                </div>
              </div>

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

              <div style={styles.textareaContainer}>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes during your meeting...

What are the key discussion points?
What decisions were made?
What are the next action items?
Any blockers or challenges discussed?"
                  style={styles.notesTextarea}
                  className="custom-scrollbar"
                  onFocus={(e) => {
                    Object.assign(e.target.style, styles.notesTextareaFocused);
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d4d4d4';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={styles.modalFooter}>
          <div style={styles.footerInfo}>
            <span>Click tasks to mark as discussed</span>
            <span>Notes auto-save every 30 seconds</span>
          </div>
          <div style={styles.footerActions}>
            <button 
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
                  e.target.style.backgroundColor = '#262626';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.target.style.backgroundColor = '#0a0a0a';
                  e.target.style.transform = 'translateY(0)';
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
                  <SaveIcon />
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
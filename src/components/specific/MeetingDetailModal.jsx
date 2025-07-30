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
      
      @keyframes spin {
        to { transform: rotate(360deg); }
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
      'To Do': '#737373',
      'In Progress': '#0a0a0a',
      'Blocked': '#dc2626',
      'For Review': '#ca8a04',
      'Done': '#16a34a',
    };
    return colors[status] || '#737373';
  };

  // Professional SVG Icons matching the design system
  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const CheckSquareIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="9,11 12,14 22,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const InboxIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      maxWidth: '900px',
      maxHeight: '90vh',
      overflow: 'auto',
      animation: 'modalSlideIn 0.4s ease-out',
      border: '1px solid #e5e5e5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
    },
    
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 32px',
      borderBottom: '1px solid #e5e5e5',
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
      color: '#0a0a0a',
      margin: 0,
    },
    
    meetingDate: {
      fontSize: '14px',
      color: '#737373',
      fontWeight: '500',
      margin: 0,
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
    
    section: {
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
    
    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    
    taskCard: {
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e5e5e5',
      transition: 'all 0.2s ease',
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
    
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'white',
      display: 'inline-block',
    },
    
    taskDescription: {
      fontSize: '14px',
      color: '#737373',
      margin: 0,
      lineHeight: 1.5,
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
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    editButton: {
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
    },
    
    saveButton: {
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
    },
    
    cancelButton: {
      backgroundColor: '#ffffff',
      color: '#525252',
      border: '1px solid #d4d4d4',
    },
    
    saveButtonDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#a3a3a3',
      cursor: 'not-allowed',
    },
    
    notesDisplay: {
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e5e5e5',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#0a0a0a',
      minHeight: '100px',
      whiteSpace: 'pre-wrap',
    },
    
    notesTextarea: {
      width: '100%',
      minHeight: '150px',
      padding: '16px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#0a0a0a',
      backgroundColor: '#ffffff',
      outline: 'none',
      transition: 'all 0.2s ease',
      resize: 'vertical',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    
    notesTextareaFocused: {
      borderColor: '#0a0a0a',
      boxShadow: '0 0 0 3px rgba(10, 10, 10, 0.1)',
    },
    
    emptyNotes: {
      color: '#737373',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '32px 20px',
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
    
    unsavedChanges: {
      backgroundColor: '#fefce8',
      color: '#ca8a04',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #fde68a',
      fontSize: '14px',
      fontWeight: '500',
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
    
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      color: '#737373',
    },
    
    emptyIcon: {
      color: '#a3a3a3',
      marginBottom: '12px',
    },
    
    emptyText: {
      fontSize: '14px',
      color: '#737373',
      margin: 0,
    },
  };

  if (!meeting) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.headerContent}>
            <div style={styles.meetingIcon}>
              <CalendarIcon />
            </div>
            <div style={styles.headerText}>
              <h2 style={styles.modalTitle}>Meeting Details</h2>
              <p style={styles.meetingDate}>{formatDate(meeting.meetingDate)}</p>
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
          {/* Task Snapshots Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <CheckSquareIcon />
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
                    <div style={styles.taskHeader}>
                      <h4 style={styles.taskTitle}>{task.title}</h4>
                      <span 
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(task.status)
                        }}
                      >
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
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <InboxIcon />
                </div>
                <p style={styles.emptyText}>
                  No key tasks were captured for this meeting
                </p>
              </div>
            )}
          </div>

          {/* Meeting Notes Section */}
          <div style={styles.section}>
            <div style={styles.notesHeader}>
              <h3 style={styles.sectionTitle}>
                <FileTextIcon />
                Meeting Notes
              </h3>
              <div style={styles.notesActions}>
                {!isEditingNotes ? (
                  <button 
                    style={{...styles.actionButton, ...styles.editButton}}
                    onClick={() => setIsEditingNotes(true)}
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
                    Edit Notes
                  </button>
                ) : (
                  <>
                    <button 
                      style={{...styles.actionButton, ...styles.cancelButton}}
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      onMouseEnter={(e) => {
                        if (!isSaving) {
                          e.target.style.backgroundColor = '#f5f5f5';
                          e.target.style.borderColor = '#a3a3a3';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSaving) {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.borderColor = '#d4d4d4';
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
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon />
                          Save Notes
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {hasUnsavedChanges && isEditingNotes && (
              <div style={styles.unsavedChanges}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.29 3.86L1.82 18C1.64466 18.3024 1.55611 18.6453 1.56331 18.9931C1.57051 19.3408 1.67325 19.6798 1.86037 19.9764C2.04749 20.273 2.31324 20.5157 2.6295 20.6777C2.94576 20.8396 3.29973 20.9148 3.65 20.895H20.35C20.7003 20.9148 21.0542 20.8396 21.3705 20.6777C21.6868 20.5157 21.9525 20.273 22.1396 19.9764C22.3268 19.6798 22.4295 19.3408 22.4367 18.9931C22.4439 18.6453 22.3553 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15447C12.6817 2.98582 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98582 11.0188 3.15447C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                You have unsaved changes
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

            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your meeting notes here...

What was discussed?
What are the next steps?
Any key decisions made?
Action items and owners?"
                style={styles.notesTextarea}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.notesTextareaFocused);
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d4d4d4';
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
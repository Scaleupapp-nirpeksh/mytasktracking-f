import React, { useState, useEffect } from 'react';
import { updateTask } from '../../services/apiService';
import FileUpload from './FileUpload';

const EditTaskModal = ({ task, workspaces, onClose, onTaskUpdated }) => {
  // Use a local state for the task to manage attachments internally
  const [currentTask, setCurrentTask] = useState(task);

  // Form field states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [isKeyTask, setIsKeyTask] = useState(false);
  
  // Recurring task states
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [interval, setInterval] = useState(1);
  const [endDate, setEndDate] = useState('');

  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  // Effect to populate the form whenever the task prop changes
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || '');
      setWorkspace(currentTask.workspace);
      setPriority(currentTask.priority);
      setStatus(currentTask.status);
      setIsKeyTask(currentTask.isKeyTask || false);
      setDueDate(currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : '');

      if (currentTask.recurring) {
        setIsRecurring(true);
        setFrequency(currentTask.recurring.frequency);
        setInterval(currentTask.recurring.interval);
        setEndDate(currentTask.recurring.endDate ? new Date(currentTask.recurring.endDate).toISOString().split('T')[0] : '');
      } else {
        setIsRecurring(false);
      }
    }
  }, [currentTask]);

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
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes checkmark {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !workspace) {
      setError('Title and workspace are required.');
      return;
    }
    if (isRecurring && !dueDate) {
      setError('A start date is required for recurring tasks.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const updatedData = {
        title,
        description,
        workspace,
        priority,
        status,
        isKeyTask,
        dueDate: dueDate || null,
        recurring: isRecurring ? { 
          frequency, 
          interval: parseInt(interval, 10), 
          nextDueDate: dueDate, 
          endDate: endDate || null 
        } : null,
      };

      const response = await updateTask(currentTask._id, updatedData);
      onTaskUpdated(response.data.data.task);
      onClose();
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (updatedTaskWithAttachment) => {
    setCurrentTask(updatedTaskWithAttachment);
    onTaskUpdated(updatedTaskWithAttachment);
  };

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

  const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="23,4 23,10 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="1,20 1,14 7,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.49 9C19.05 5.99 16.2 4 12.89 4C8.51 4 4.96 7.36 4.46 11.73M3.51 15C4.95 18.01 7.8 20 11.11 20C15.49 20 19.04 16.64 19.54 12.27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const FlagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15S11 9 20 15L20 3S11 9 4 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      maxWidth: '700px',
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
    
    modalTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0a0a0a',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
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
    },
    
    modalBody: {
      padding: '32px',
    },
    
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    
    formRowThree: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px',
    },
    
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    input: {
      padding: '12px 16px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff',
      outline: 'none',
      color: '#0a0a0a',
      boxSizing: 'border-box',
    },
    
    inputFocused: {
      borderColor: '#0a0a0a',
      boxShadow: '0 0 0 3px rgba(10, 10, 10, 0.1)',
    },
    
    textarea: {
      padding: '12px 16px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: 'inherit',
      color: '#0a0a0a',
      boxSizing: 'border-box',
    },
    
    select: {
      padding: '12px 16px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff',
      outline: 'none',
      cursor: 'pointer',
      color: '#0a0a0a',
      boxSizing: 'border-box',
    },
    
    keyTaskSection: {
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e5e5',
      transition: 'all 0.3s ease',
    },
    
    keyTaskSectionActive: {
      backgroundColor: '#fefce8',
      borderColor: '#ca8a04',
    },
    
    keyTaskToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    keyTaskLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      cursor: 'pointer',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      flex: 1,
    },
    
    checkbox: {
      width: '18px',
      height: '18px',
      borderRadius: '4px',
      border: '1px solid #d4d4d4',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease',
      appearance: 'none',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
    },
    
    checkboxChecked: {
      backgroundColor: '#0a0a0a',
      borderColor: '#0a0a0a',
      color: '#ffffff',
    },
    
    recurringSection: {
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e5e5',
      transition: 'all 0.3s ease',
    },
    
    recurringSectionActive: {
      backgroundColor: '#f0fdf4',
      borderColor: '#16a34a',
    },
    
    recurringToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    
    recurringLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      cursor: 'pointer',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    recurringOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      animation: 'slideDown 0.3s ease-out',
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
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '20px 32px',
      borderTop: '1px solid #e5e5e5',
      backgroundColor: '#fafafa',
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
    
    checkmark: {
      animation: 'checkmark 0.3s ease-out',
    },
  };

  const getPriorityColor = (priorityValue) => {
    const colors = {
      'Low': '#16a34a',
      'Medium': '#ca8a04',  
      'High': '#dc2626',
      'Critical': '#7c2d12',
    };
    return colors[priorityValue] || '#737373';
  };

  const getStatusColor = (statusValue) => {
    const colors = {
      'To Do': '#737373',
      'In Progress': '#0a0a0a',
      'Blocked': '#dc2626',
      'For Review': '#ca8a04',
      'Done': '#16a34a',
    };
    return colors[statusValue] || '#737373';
  };

  if (!currentTask) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            <EditIcon />
            Edit Task
          </h2>
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
          <form style={styles.form} onSubmit={handleSubmit}>
            {/* Title Field */}
            <div style={styles.formGroup}>
              <label htmlFor="edit-title" style={styles.label}>
                Task Title *
              </label>
              <input
                type="text"
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === 'title' ? styles.inputFocused : {})
                }}
                placeholder="e.g., Finalize Q3 report"
                required
              />
            </div>

            {/* Description Field */}
            <div style={styles.formGroup}>
              <label htmlFor="edit-description" style={styles.label}>
                Description (Optional)
              </label>
              <textarea
                id="edit-description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.textarea,
                  ...(focusedField === 'description' ? styles.inputFocused : {})
                }}
                placeholder="Add more details about this task..."
              />
            </div>

            {/* Status, Priority, and Workspace Row */}
            <div style={styles.formRowThree}>
              <div style={styles.formGroup}>
                <label htmlFor="edit-status" style={styles.label}>
                  Status
                </label>
                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onFocus={() => setFocusedField('status')}
                  onBlur={() => setFocusedField('')}
                  style={{
                    ...styles.select,
                    color: getStatusColor(status),
                    ...(focusedField === 'status' ? styles.inputFocused : {})
                  }}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="For Review">For Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="edit-priority" style={styles.label}>
                  <FlagIcon />
                  Priority Level
                </label>
                <select
                  id="edit-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  onFocus={() => setFocusedField('priority')}
                  onBlur={() => setFocusedField('')}
                  style={{
                    ...styles.select,
                    color: getPriorityColor(priority),
                    ...(focusedField === 'priority' ? styles.inputFocused : {})
                  }}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical Priority</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="edit-workspace" style={styles.label}>
                  Workspace *
                </label>
                <select
                  id="edit-workspace"
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  onFocus={() => setFocusedField('workspace')}
                  onBlur={() => setFocusedField('')}
                  style={{
                    ...styles.select,
                    ...(focusedField === 'workspace' ? styles.inputFocused : {})
                  }}
                  required
                >
                  {workspaces.map((ws) => (
                    <option key={ws._id} value={ws._id}>{ws.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date Field */}
            <div style={styles.formGroup}>
              <label htmlFor="edit-dueDate" style={styles.label}>
                <CalendarIcon />
                {isRecurring ? 'Start Date' : 'Due Date'} (Optional)
              </label>
              <input
                type="date"
                id="edit-dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onFocus={() => setFocusedField('dueDate')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === 'dueDate' ? styles.inputFocused : {})
                }}
              />
            </div>

            {/* Key Task Toggle */}
            <div style={{
              ...styles.keyTaskSection,
              ...(isKeyTask ? styles.keyTaskSectionActive : {})
            }}>
              <div style={styles.keyTaskToggle}>
                <div
                  style={{
                    ...styles.checkbox,
                    ...(isKeyTask ? styles.checkboxChecked : {})
                  }}
                  onClick={() => setIsKeyTask(!isKeyTask)}
                >
                  {isKeyTask && (
                    <div style={styles.checkmark}>
                      <CheckIcon />
                    </div>
                  )}
                </div>
                <label 
                  style={styles.keyTaskLabel}
                  onClick={() => setIsKeyTask(!isKeyTask)}
                >
                  <StarIcon />
                  Mark as Key Task for Manager Reviews
                </label>
              </div>
            </div>

            {/* Recurring Task Section */}
            <div style={{
              ...styles.recurringSection,
              ...(isRecurring ? styles.recurringSectionActive : {})
            }}>
              <div style={styles.recurringToggle}>
                <div
                  style={{
                    ...styles.checkbox,
                    ...(isRecurring ? styles.checkboxChecked : {})
                  }}
                  onClick={() => setIsRecurring(!isRecurring)}
                >
                  {isRecurring && (
                    <div style={styles.checkmark}>
                      <CheckIcon />
                    </div>
                  )}
                </div>
                <label 
                  style={styles.recurringLabel}
                  onClick={() => setIsRecurring(!isRecurring)}
                >
                  <RefreshIcon />
                  Make this a recurring task
                </label>
              </div>

              {isRecurring && (
                <div style={styles.recurringOptions}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label htmlFor="frequency-edit" style={styles.label}>
                        Frequency
                      </label>
                      <select 
                        id="frequency-edit" 
                        value={frequency} 
                        onChange={(e) => setFrequency(e.target.value)}
                        onFocus={() => setFocusedField('frequency')}
                        onBlur={() => setFocusedField('')}
                        style={{
                          ...styles.select,
                          ...(focusedField === 'frequency' ? styles.inputFocused : {})
                        }}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="interval-edit" style={styles.label}>
                        Repeat Every
                      </label>
                      <input 
                        type="number"
                        id="interval-edit"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                        onFocus={() => setFocusedField('interval')}
                        onBlur={() => setFocusedField('')}
                        style={{
                          ...styles.input,
                          ...(focusedField === 'interval' ? styles.inputFocused : {})
                        }}
                        min="1"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="endDate-edit" style={styles.label}>
                      <CalendarIcon />
                      End Date (Optional)
                    </label>
                    <input 
                      type="date"
                      id="endDate-edit"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={() => setFocusedField('endDate')}
                      onBlur={() => setFocusedField('')}
                      style={{
                        ...styles.input,
                        ...(focusedField === 'endDate' ? styles.inputFocused : {})
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* File Upload Component */}
            <FileUpload 
              task={currentTask} 
              onUploadComplete={handleUploadComplete} 
            />

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
          </form>
        </div>

        <div style={styles.modalFooter}>
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
            Cancel
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading || !title || !workspace}
            style={{
              ...styles.buttonPrimary,
              ...(loading || !title || !workspace ? styles.buttonPrimaryDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!loading && title && workspace) {
                e.target.style.backgroundColor = '#262626';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && title && workspace) {
                e.target.style.backgroundColor = '#0a0a0a';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Saving Changes...
              </>
            ) : (
              <>
                <SaveIcon />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
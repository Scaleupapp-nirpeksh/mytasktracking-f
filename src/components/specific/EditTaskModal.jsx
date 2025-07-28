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
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes toggleSlide {
        from { transform: translateX(0); }
        to { transform: translateX(24px); }
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
      alignItems: 'center',
      padding: '32px 32px 0 32px',
      borderBottom: 'none',
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
      gap: '8px',
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
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      transition: 'color 0.2s ease',
    },
    
    labelFocused: {
      color: '#10b981',
    },
    
    input: {
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      fontWeight: '500',
      outline: 'none',
    },
    
    inputFocused: {
      borderColor: '#10b981',
      boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)',
      transform: 'translateY(-1px)',
    },
    
    textarea: {
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      fontWeight: '500',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: 'inherit',
    },
    
    select: {
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      fontWeight: '500',
      outline: 'none',
      cursor: 'pointer',
    },
    
    prioritySelect: {
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      fontWeight: '600',
      outline: 'none',
      cursor: 'pointer',
    },
    
    statusSelect: {
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      fontWeight: '600',
      outline: 'none',
      cursor: 'pointer',
    },
    
    keyTaskSection: {
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      padding: '20px',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease',
    },
    
    keyTaskSectionActive: {
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      boxShadow: '0 0 0 4px rgba(245, 158, 11, 0.05)',
    },
    
    keyTaskToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
    },
    
    keyTaskLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      flex: 1,
    },
    
    toggleSwitch: {
      position: 'relative',
      width: '52px',
      height: '28px',
      backgroundColor: '#e5e7eb',
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    },
    
    toggleSwitchActive: {
      backgroundColor: '#10b981',
      borderColor: '#059669',
    },
    
    toggleSlider: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'transform 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    
    toggleSliderActive: {
      transform: 'translateX(24px)',
    },
    
    toggleInput: {
      display: 'none',
    },
    
    recurringSection: {
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      padding: '20px',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease',
    },
    
    recurringSectionActive: {
      backgroundColor: '#f0fdf4',
      borderColor: '#10b981',
      boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.05)',
    },
    
    recurringToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    
    checkbox: {
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: '2px solid #e5e7eb',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease',
      appearance: 'none',
      outline: 'none',
    },
    
    checkboxChecked: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
    },
    
    checkboxLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      cursor: 'pointer',
      userSelect: 'none',
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
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '0 32px 32px 32px',
      borderTop: 'none',
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
  };

  const getPriorityColor = (priorityValue) => {
    const colors = {
      'Low': '#059669',
      'Medium': '#d97706',
      'High': '#dc2626',
      'Critical': '#7c2d12',
    };
    return colors[priorityValue] || '#64748b';
  };

  const getStatusColor = (statusValue) => {
    const colors = {
      'To Do': '#64748b',
      'In Progress': '#3b82f6',
      'Blocked': '#ef4444',
      'For Review': '#f59e0b',
      'Done': '#10b981',
    };
    return colors[statusValue] || '#64748b';
  };

  const getPrioritySelectStyle = (currentPriority) => ({
    ...styles.prioritySelect,
    color: getPriorityColor(currentPriority),
    borderColor: focusedField === 'priority' ? '#10b981' : '#e5e7eb',
    boxShadow: focusedField === 'priority' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
  });

  const getStatusSelectStyle = (currentStatus) => ({
    ...styles.statusSelect,
    color: getStatusColor(currentStatus),
    borderColor: focusedField === 'status' ? '#10b981' : '#e5e7eb',
    boxShadow: focusedField === 'status' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
  });

  if (!currentTask) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>✏️ Edit Task</h2>
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
          <form style={styles.form} onSubmit={handleSubmit}>
            {/* Title Field */}
            <div style={styles.formGroup}>
              <label 
                htmlFor="edit-title" 
                style={{
                  ...styles.label,
                  ...(focusedField === 'title' ? styles.labelFocused : {})
                }}
              >
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
              <label 
                htmlFor="edit-description"
                style={{
                  ...styles.label,
                  ...(focusedField === 'description' ? styles.labelFocused : {})
                }}
              >
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
                  borderColor: focusedField === 'description' ? '#10b981' : '#e5e7eb',
                  boxShadow: focusedField === 'description' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
                  transform: focusedField === 'description' ? 'translateY(-1px)' : 'translateY(0)',
                }}
                placeholder="Add more details about this task..."
              />
            </div>

            {/* Status, Priority, and Workspace Row */}
            <div style={styles.formRowThree}>
              <div style={styles.formGroup}>
                <label 
                  htmlFor="edit-status"
                  style={{
                    ...styles.label,
                    ...(focusedField === 'status' ? styles.labelFocused : {})
                  }}
                >
                  Status
                </label>
                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onFocus={() => setFocusedField('status')}
                  onBlur={() => setFocusedField('')}
                  style={getStatusSelectStyle(status)}
                >
                  <option value="To Do" style={{ color: '#64748b' }}>📋 To Do</option>
                  <option value="In Progress" style={{ color: '#3b82f6' }}>🔄 In Progress</option>
                  <option value="Blocked" style={{ color: '#ef4444' }}>🚫 Blocked</option>
                  <option value="For Review" style={{ color: '#f59e0b' }}>👁️ For Review</option>
                  <option value="Done" style={{ color: '#10b981' }}>✅ Done</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label 
                  htmlFor="edit-priority"
                  style={{
                    ...styles.label,
                    ...(focusedField === 'priority' ? styles.labelFocused : {})
                  }}
                >
                  Priority Level
                </label>
                <select
                  id="edit-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  onFocus={() => setFocusedField('priority')}
                  onBlur={() => setFocusedField('')}
                  style={getPrioritySelectStyle(priority)}
                >
                  <option value="Low" style={{ color: '#059669' }}>🟢 Low Priority</option>
                  <option value="Medium" style={{ color: '#d97706' }}>🟡 Medium Priority</option>
                  <option value="High" style={{ color: '#dc2626' }}>🔴 High Priority</option>
                  <option value="Critical" style={{ color: '#7c2d12' }}>🚨 Critical Priority</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label 
                  htmlFor="edit-workspace"
                  style={{
                    ...styles.label,
                    ...(focusedField === 'workspace' ? styles.labelFocused : {})
                  }}
                >
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
                    borderColor: focusedField === 'workspace' ? '#10b981' : '#e5e7eb',
                    boxShadow: focusedField === 'workspace' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
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
              <label 
                htmlFor="edit-dueDate"
                style={{
                  ...styles.label,
                  ...(focusedField === 'dueDate' ? styles.labelFocused : {})
                }}
              >
                {isRecurring ? '📅 Start Date' : '📅 Due Date'} (Optional)
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
                <label htmlFor="keyTask" style={styles.keyTaskLabel}>
                  ⭐ Mark as Key Task for Manager Reviews
                </label>
                <div 
                  style={{
                    ...styles.toggleSwitch,
                    ...(isKeyTask ? styles.toggleSwitchActive : {})
                  }}
                  onClick={() => setIsKeyTask(!isKeyTask)}
                >
                  <input
                    type="checkbox"
                    id="keyTask"
                    checked={isKeyTask}
                    onChange={(e) => setIsKeyTask(e.target.checked)}
                    style={styles.toggleInput}
                  />
                  <div style={{
                    ...styles.toggleSlider,
                    ...(isKeyTask ? styles.toggleSliderActive : {})
                  }} />
                </div>
              </div>
            </div>

            {/* Recurring Task Section */}
            <div style={{
              ...styles.recurringSection,
              ...(isRecurring ? styles.recurringSectionActive : {})
            }}>
              <div style={styles.recurringToggle}>
                <input
                  type="checkbox"
                  id="isRecurring-edit"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  style={{
                    ...styles.checkbox,
                    ...(isRecurring ? styles.checkboxChecked : {})
                  }}
                />
                {isRecurring && (
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                  }}>
                    ✓
                  </span>
                )}
                <label htmlFor="isRecurring-edit" style={styles.checkboxLabel}>
                  🔄 Make this a recurring task
                </label>
              </div>

              {isRecurring && (
                <div style={styles.recurringOptions}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label 
                        htmlFor="frequency-edit"
                        style={{
                          ...styles.label,
                          ...(focusedField === 'frequency' ? styles.labelFocused : {})
                        }}
                      >
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
                          borderColor: focusedField === 'frequency' ? '#10b981' : '#e5e7eb',
                          boxShadow: focusedField === 'frequency' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
                        }}
                      >
                        <option value="daily">📅 Daily</option>
                        <option value="weekly">📆 Weekly</option>
                        <option value="monthly">🗓️ Monthly</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label 
                        htmlFor="interval-edit"
                        style={{
                          ...styles.label,
                          ...(focusedField === 'interval' ? styles.labelFocused : {})
                        }}
                      >
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
                    <label 
                      htmlFor="endDate-edit"
                      style={{
                        ...styles.label,
                        ...(focusedField === 'endDate' ? styles.labelFocused : {})
                      }}
                    >
                      🏁 End Date (Optional)
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
                <span style={{ fontSize: '18px' }}>⚠️</span>
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
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && title && workspace) {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
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
                <span style={{ fontSize: '16px' }}>💾</span>
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
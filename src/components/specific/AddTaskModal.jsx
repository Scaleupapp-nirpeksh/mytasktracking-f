import React, { useState, useEffect } from 'react';
import { createTask } from '../../services/apiService';

const AddTaskModal = ({ workspaces, initialData, onClose, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workspace, setWorkspace] = useState(workspaces[0]?._id || '');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  
  // --- State for Recurring Tasks ---
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [interval, setInterval] = useState(1);
  const [endDate, setEndDate] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      if (initialData.dueDate) {
        setDueDate(new Date(initialData.dueDate).toISOString().split('T')[0]);
      }
    }
  }, [initialData]);

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
      setError('A start date (Due Date) is required for recurring tasks.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const taskData = {
        title,
        description,
        workspace,
        priority,
        dueDate: dueDate || null,
      };

      // If recurring is enabled, add the recurring object to the payload
      if (isRecurring) {
        taskData.recurring = {
          frequency,
          interval: parseInt(interval, 10),
          nextDueDate: dueDate, // The first due date is the start date
          endDate: endDate || null,
        };
      }

      const response = await createTask(taskData);
      onTaskAdded(response.data.data.task);
      onClose();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Professional SVG Icons
  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const FlagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15S11 9 20 15L20 3S11 9 4 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
      maxWidth: '600px',
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
    
    checkboxLabel: {
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
    
    priorityOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    priorityDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      flexShrink: 0,
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

  const renderPriorityOption = (value, label) => (
    <option key={value} value={value}>
      {label}
    </option>
  );

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            <PlusIcon />
            Create New Task
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
              <label htmlFor="title" style={styles.label}>
                Task Title *
              </label>
              <input
                type="text"
                id="title"
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
              <label htmlFor="description" style={styles.label}>
                Description (Optional)
              </label>
              <textarea
                id="description"
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

            {/* Workspace and Priority Row */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="workspace" style={styles.label}>
                  Workspace *
                </label>
                <select
                  id="workspace"
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

              <div style={styles.formGroup}>
                <label htmlFor="priority" style={styles.label}>
                  <FlagIcon />
                  Priority Level
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  onFocus={() => setFocusedField('priority')}
                  onBlur={() => setFocusedField('')}
                  style={{
                    ...styles.select,
                    ...(focusedField === 'priority' ? styles.inputFocused : {}),
                    color: getPriorityColor(priority),
                  }}
                >
                  {renderPriorityOption('Low', 'Low Priority')}
                  {renderPriorityOption('Medium', 'Medium Priority')}
                  {renderPriorityOption('High', 'High Priority')}
                  {renderPriorityOption('Critical', 'Critical Priority')}
                </select>
              </div>
            </div>

            {/* Due Date Field */}
            <div style={styles.formGroup}>
              <label htmlFor="dueDate" style={styles.label}>
                <CalendarIcon />
                {isRecurring ? 'Start Date' : 'Due Date'} (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
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
                  {isRecurring && <CheckIcon />}
                </div>
                <label 
                  style={styles.checkboxLabel}
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
                      <label htmlFor="frequency" style={styles.label}>
                        Frequency
                      </label>
                      <select 
                        id="frequency" 
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
                      <label htmlFor="interval" style={styles.label}>
                        Repeat Every
                      </label>
                      <input 
                        type="number"
                        id="interval"
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
                    <label htmlFor="endDate" style={styles.label}>
                      <CalendarIcon />
                      End Date (Optional)
                    </label>
                    <input 
                      type="date"
                      id="endDate"
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
                Creating Task...
              </>
            ) : (
              <>
                <PlusIcon />
                Create Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
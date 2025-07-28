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
      maxWidth: '600px',
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

  const getPrioritySelectStyle = (currentPriority) => ({
    ...styles.prioritySelect,
    color: getPriorityColor(currentPriority),
    borderColor: focusedField === 'priority' ? '#10b981' : '#e5e7eb',
    boxShadow: focusedField === 'priority' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
  });

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>✨ Create New Task</h2>
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
                htmlFor="title" 
                style={{
                  ...styles.label,
                  ...(focusedField === 'title' ? styles.labelFocused : {})
                }}
              >
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
              <label 
                htmlFor="description"
                style={{
                  ...styles.label,
                  ...(focusedField === 'description' ? styles.labelFocused : {})
                }}
              >
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
                  borderColor: focusedField === 'description' ? '#10b981' : '#e5e7eb',
                  boxShadow: focusedField === 'description' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none',
                  transform: focusedField === 'description' ? 'translateY(-1px)' : 'translateY(0)',
                }}
                placeholder="Add more details about this task..."
              />
            </div>

            {/* Workspace and Priority Row */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label 
                  htmlFor="workspace"
                  style={{
                    ...styles.label,
                    ...(focusedField === 'workspace' ? styles.labelFocused : {})
                  }}
                >
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

              <div style={styles.formGroup}>
                <label 
                  htmlFor="priority"
                  style={{
                    ...styles.label,
                    ...(focusedField === 'priority' ? styles.labelFocused : {})
                  }}
                >
                  Priority Level
                </label>
                <select
                  id="priority"
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
            </div>

            {/* Due Date Field */}
            <div style={styles.formGroup}>
              <label 
                htmlFor="dueDate"
                style={{
                  ...styles.label,
                  ...(focusedField === 'dueDate' ? styles.labelFocused : {})
                }}
              >
                {isRecurring ? '📅 Start Date' : '📅 Due Date'} (Optional)
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
                <input
                  type="checkbox"
                  id="isRecurring"
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
                <label htmlFor="isRecurring" style={styles.checkboxLabel}>
                  🔄 Make this a recurring task
                </label>
              </div>

              {isRecurring && (
                <div style={styles.recurringOptions}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label 
                        htmlFor="frequency"
                        style={{
                          ...styles.label,
                          ...(focusedField === 'frequency' ? styles.labelFocused : {})
                        }}
                      >
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
                        htmlFor="interval"
                        style={{
                          ...styles.label,
                          ...(focusedField === 'interval' ? styles.labelFocused : {})
                        }}
                      >
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
                    <label 
                      htmlFor="endDate"
                      style={{
                        ...styles.label,
                        ...(focusedField === 'endDate' ? styles.labelFocused : {})
                      }}
                    >
                      🏁 End Date (Optional)
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
                Creating Task...
              </>
            ) : (
              <>
                <span style={{ fontSize: '16px' }}>✨</span>
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
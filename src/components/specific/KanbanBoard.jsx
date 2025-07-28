//src/components/specific/KanbanBoard.jsx
import React, { useState, useEffect } from 'react';
import { updateTask } from '../../services/apiService';

const KanbanBoard = ({ tasks, onTaskUpdated, onTaskClick }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
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
      
      @keyframes cardHover {
        from { transform: translateY(0) scale(1); }
        to { transform: translateY(-4px) scale(1.02); }
      }
      
      @keyframes cardDrag {
        from { transform: rotate(0deg) scale(1); }
        to { transform: rotate(5deg) scale(1.05); }
      }
      
      @keyframes columnPulse {
        0%, 100% { 
          background-color: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.3);
        }
        50% { 
          background-color: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.5);
        }
      }
      
      @keyframes taskDrop {
        0% { transform: scale(1.1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  const columns = [
    { 
      id: 'To Do', 
      title: 'To Do', 
      icon: '📋', 
      color: '#64748b',
      bgColor: '#f8fafc',
      borderColor: '#e2e8f0'
    },
    { 
      id: 'In Progress', 
      title: 'In Progress', 
      icon: '🔄', 
      color: '#3b82f6',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe'
    },
    { 
      id: 'Blocked', 
      title: 'Blocked', 
      icon: '🚫', 
      color: '#ef4444',
      bgColor: '#fef2f2',
      borderColor: '#fecaca'
    },
    { 
      id: 'For Review', 
      title: 'For Review', 
      icon: '👁️', 
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fde68a'
    },
    { 
      id: 'Done', 
      title: 'Done', 
      icon: '✅', 
      color: '#10b981',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    
    // Add visual feedback
    setTimeout(() => {
      e.target.style.opacity = '0.5';
      e.target.style.transform = 'rotate(5deg) scale(1.05)';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    e.target.style.transform = 'rotate(0deg) scale(1)';
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only clear drag over if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedTask || draggedTask.status === newStatus) {
      return;
    }

    setIsUpdating(true);
    
    try {
      const response = await updateTask(draggedTask._id, { status: newStatus });
      onTaskUpdated(response.data.data.task);
      
      // Add success animation to the dropped task
      const dropTarget = e.currentTarget.querySelector(`[data-task-id="${draggedTask._id}"]`);
      if (dropTarget) {
        dropTarget.style.animation = 'taskDrop 0.3s ease-out';
        setTimeout(() => {
          dropTarget.style.animation = '';
        }, 300);
      }
      
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Could add error notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#059669',
      'Medium': '#d97706',
      'High': '#dc2626',
      'Critical': '#7c2d12',
    };
    return colors[priority] || '#64748b';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}d overdue`, color: '#dc2626', urgent: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: '#f59e0b', urgent: true };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: '#f59e0b', urgent: false };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays}d`, color: '#64748b', urgent: false };
    } else {
      return { text: date.toLocaleDateString(), color: '#64748b', urgent: false };
    }
  };

  const styles = {
    kanbanContainer: {
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
    },
    
    kanbanHeader: {
      marginBottom: '32px',
      textAlign: 'center',
    },
    
    kanbanTitle: {
      fontSize: '32px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 12px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    
    kanbanSubtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
      fontWeight: '500',
    },
    
    board: {
      display: 'flex',
      gap: '24px',
      overflowX: 'auto',
      paddingBottom: '24px',
      minHeight: '600px',
    },
    
    column: {
      minWidth: '320px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      border: '2px solid transparent',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '80vh',
    },
    
    columnDragOver: {
      animation: 'columnPulse 1s ease-in-out infinite',
      transform: 'scale(1.02)',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
    },
    
    columnHeader: {
      padding: '24px 20px 16px 20px',
      borderBottom: '2px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    },
    
    columnTitle: {
      fontSize: '18px',
      fontWeight: '700',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    columnCount: {
      backgroundColor: '#e2e8f0',
      color: '#64748b',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: '24px',
      textAlign: 'center',
    },
    
    tasksContainer: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    
    taskCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      cursor: 'grab',
      transition: 'all 0.2s ease',
      animation: 'slideInUp 0.3s ease-out',
      position: 'relative',
      userSelect: 'none',
    },
    
    taskCardDragging: {
      opacity: 0.5,
      transform: 'rotate(5deg) scale(1.05)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
    },
    
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
      gap: '12px',
    },
    
    taskTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
      lineHeight: '1.4',
      flex: 1,
    },
    
    keyTaskBadge: {
      fontSize: '16px',
      filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))',
      animation: 'pulse 2s infinite',
      flexShrink: 0,
    },
    
    taskDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 12px 0',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    
    taskMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #f1f5f9',
    },
    
    priorityBadge: {
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: 'white',
    },
    
    dueDateBadge: {
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#f1f5f9',
      border: '1px solid #e2e8f0',
    },
    
    dueDateUrgent: {
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca',
      animation: 'pulse 2s infinite',
    },
    
    emptyColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      color: '#94a3b8',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
      border: '2px dashed #e2e8f0',
      borderRadius: '12px',
      backgroundColor: '#fafbfc',
    },
    
    emptyIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      opacity: 0.6,
    },
    
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
    },
    
    loadingSpinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #10b981',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    attachmentIndicator: {
      fontSize: '12px',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: '8px',
    },
  };

  return (
    <div style={styles.kanbanContainer}>
      {isUpdating && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner} />
        </div>
      )}
      
      <div style={styles.kanbanHeader}>
        <h1 style={styles.kanbanTitle}>
          <span>📋</span>
          Task Board
        </h1>
        <p style={styles.kanbanSubtitle}>
          Drag and drop tasks between columns to update their status
        </p>
      </div>

      <div style={styles.board}>
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const isDragOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              style={{
                ...styles.column,
                ...(isDragOver ? styles.columnDragOver : {}),
              }}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div style={styles.columnHeader}>
                <h3 style={{
                  ...styles.columnTitle,
                  color: column.color
                }}>
                  <span>{column.icon}</span>
                  {column.title}
                </h3>
                <div style={{
                  ...styles.columnCount,
                  backgroundColor: column.bgColor,
                  color: column.color,
                  border: `1px solid ${column.borderColor}`,
                }}>
                  {columnTasks.length}
                </div>
              </div>

              <div style={styles.tasksContainer}>
                {columnTasks.length === 0 ? (
                  <div style={styles.emptyColumn}>
                    <div style={styles.emptyIcon}>{column.icon}</div>
                    <div>No tasks in {column.title.toLowerCase()}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                      Drop tasks here
                    </div>
                  </div>
                ) : (
                  columnTasks.map((task, index) => {
                    const dueDateInfo = formatDate(task.dueDate);
                    
                    return (
                      <div
                        key={task._id}
                        data-task-id={task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onTaskClick && onTaskClick(task)}
                        style={{
                          ...styles.taskCard,
                          animationDelay: `${index * 0.1}s`,
                        }}
                        onMouseEnter={(e) => {
                          if (!draggedTask) {
                            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
                            e.currentTarget.style.cursor = 'grab';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!draggedTask) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                          }
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.cursor = 'grabbing';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.cursor = 'grab';
                        }}
                      >
                        <div style={styles.taskHeader}>
                          <h4 style={styles.taskTitle}>{task.title}</h4>
                          {task.isKeyTask && (
                            <span style={styles.keyTaskBadge}>⭐</span>
                          )}
                        </div>

                        {task.description && (
                          <p style={styles.taskDescription}>{task.description}</p>
                        )}

                        {task.attachments && task.attachments.length > 0 && (
                          <div style={styles.attachmentIndicator}>
                            <span>📎</span>
                            <span>{task.attachments.length} file{task.attachments.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}

                        <div style={styles.taskMeta}>
                          <div style={{
                            ...styles.priorityBadge,
                            backgroundColor: getPriorityColor(task.priority),
                          }}>
                            {task.priority}
                          </div>

                          {dueDateInfo && (
                            <div style={{
                              ...styles.dueDateBadge,
                              color: dueDateInfo.color,
                              ...(dueDateInfo.urgent ? styles.dueDateUrgent : {}),
                            }}>
                              {dueDateInfo.text}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
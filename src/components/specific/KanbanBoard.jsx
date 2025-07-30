import React, { useState, useEffect } from 'react';
import { updateTask } from '../../services/apiService';

const KanbanBoard = ({ tasks, onTaskUpdated, onTaskClick }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [collapsedColumns, setCollapsedColumns] = useState(new Set());

  // Professional CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes dragOverPulse {
        0%, 100% { 
          background-color: rgba(10, 10, 10, 0.02);
          border-color: rgba(10, 10, 10, 0.1);
        }
        50% { 
          background-color: rgba(10, 10, 10, 0.05);
          border-color: rgba(10, 10, 10, 0.2);
        }
      }
      
      .kanban-task-card {
        animation: fadeIn 0.3s ease-out;
      }
      
      .kanban-task-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .kanban-column-drag-over {
        animation: dragOverPulse 1s ease-in-out infinite;
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
      color: '#737373',
      bgColor: '#fafafa'
    },
    { 
      id: 'In Progress', 
      title: 'In Progress', 
      color: '#0a0a0a',
      bgColor: '#fafafa'
    },
    { 
      id: 'Blocked', 
      title: 'Blocked', 
      color: '#dc2626',
      bgColor: '#fef2f2'
    },
    { 
      id: 'For Review', 
      title: 'For Review', 
      color: '#ca8a04',
      bgColor: '#fefce8'
    },
    { 
      id: 'Done', 
      title: 'Done', 
      color: '#16a34a',
      bgColor: '#f0fdf4'
    }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    
    // Subtle visual feedback
    setTimeout(() => {
      e.target.style.opacity = '0.6';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
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
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleColumnCollapse = (columnId) => {
    const newCollapsed = new Set(collapsedColumns);
    if (newCollapsed.has(columnId)) {
      newCollapsed.delete(columnId);
    } else {
      newCollapsed.add(columnId);
    }
    setCollapsedColumns(newCollapsed);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#16a34a',
      'Medium': '#ca8a04',
      'High': '#dc2626',
      'Critical': '#7c2d12',
    };
    return colors[priority] || '#737373';
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
      return { text: 'Today', color: '#ca8a04', urgent: true };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', color: '#ca8a04', urgent: false };
    } else if (diffDays <= 7) {
      return { text: `${diffDays}d`, color: '#737373', urgent: false };
    } else {
      return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: '#737373', urgent: false };
    }
  };

  // Professional SVG Icons
  const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
    </svg>
  );

  const PaperclipIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59722 21.9983 8.005 21.9983C6.41278 21.9983 4.88578 21.3658 3.76 20.24C2.63421 19.1142 2.00167 17.5872 2.00167 15.995C2.00167 14.4028 2.63421 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7186 1.38825 15.78 1.38825C16.8414 1.38825 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7818 4.32861 19.7818 5.39C19.7818 6.45139 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03494 17.7851 8.52433 17.9972 7.99 17.9972C7.45567 17.9972 6.94506 17.7851 6.57 17.41C6.19494 17.0349 5.98283 16.5243 5.98283 15.99C5.98283 15.4557 6.19494 14.9451 6.57 14.57L15.07 6.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const styles = {
    kanbanContainer: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
    },
    
    board: {
      display: 'flex',
      minHeight: '500px',
      maxHeight: '600px',
      overflow: 'hidden',
    },
    
    column: {
      flex: 1,
      minWidth: '0',
      borderRight: '1px solid #e5e5e5',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease',
    },
    
    columnLast: {
      borderRight: 'none',
    },
    
    columnCollapsed: {
      flex: '0 0 60px',
      minWidth: '60px',
    },
    
    columnDragOver: {
      backgroundColor: '#fafafa',
    },
    
    columnHeader: {
      padding: '16px 20px',
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      flexShrink: 0,
    },
    
    columnHeaderHover: {
      backgroundColor: '#fafafa',
    },
    
    columnTitleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 1,
      minWidth: 0,
    },
    
    columnTitle: {
      fontSize: '14px',
      fontWeight: '600',
      margin: 0,
      color: '#0a0a0a',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    
    columnCount: {
      backgroundColor: '#f5f5f5',
      color: '#737373',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      minWidth: '20px',
      textAlign: 'center',
      flexShrink: 0,
    },
    
    collapseIcon: {
      color: '#737373',
      transition: 'transform 0.2s ease, color 0.2s ease',
      flexShrink: 0,
      marginLeft: '8px',
    },
    
    collapseIconRotated: {
      transform: 'rotate(-90deg)',
    },
    
    tasksContainer: {
      flex: 1,
      padding: '12px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    
    tasksContainerCollapsed: {
      display: 'none',
    },
    
    taskCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '12px',
      border: '1px solid #e5e5e5',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
      userSelect: 'none',
    },
    
    taskCardDragging: {
      opacity: 0.6,
      transform: 'rotate(2deg) scale(1.02)',
    },
    
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
      gap: '8px',
    },
    
    taskTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: 0,
      lineHeight: '1.4',
      flex: 1,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    
    keyTaskIndicator: {
      color: '#ca8a04',
      flexShrink: 0,
      marginTop: '1px',
    },
    
    taskDescription: {
      fontSize: '12px',
      color: '#737373',
      margin: '0 0 8px 0',
      lineHeight: '1.4',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    
    taskMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px',
    },
    
    taskMetaLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    priorityBadge: {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'white',
    },
    
    attachmentIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      color: '#737373',
      fontSize: '10px',
    },
    
    dueDateBadge: {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '500',
      backgroundColor: '#f5f5f5',
      border: '1px solid #e5e5e5',
      flexShrink: 0,
    },
    
    dueDateUrgent: {
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca',
      color: '#dc2626',
      fontWeight: '600',
    },
    
    emptyColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      color: '#a3a3a3',
      fontSize: '12px',
      textAlign: 'center',
      border: '2px dashed #e5e5e5',
      borderRadius: '8px',
      margin: '8px',
    },
    
    emptyText: {
      margin: '8px 0 4px 0',
      fontWeight: '500',
    },
    
    emptySubtext: {
      fontSize: '11px',
      opacity: 0.7,
    },
    
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      borderRadius: '12px',
    },
    
    loadingSpinner: {
      width: '24px',
      height: '24px',
      border: '2px solid #e5e5e5',
      borderTop: '2px solid #0a0a0a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  return (
    <div style={styles.kanbanContainer}>
      {isUpdating && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner} />
        </div>
      )}
      
      <div style={styles.board}>
        {columns.map((column, index) => {
          const columnTasks = getTasksByStatus(column.id);
          const isDragOver = dragOverColumn === column.id;
          const isCollapsed = collapsedColumns.has(column.id);
          const isLast = index === columns.length - 1;

          return (
            <div
              key={column.id}
              style={{
                ...styles.column,
                ...(isLast ? styles.columnLast : {}),
                ...(isCollapsed ? styles.columnCollapsed : {}),
                ...(isDragOver ? styles.columnDragOver : {}),
              }}
              className={isDragOver ? 'kanban-column-drag-over' : ''}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div 
                style={styles.columnHeader}
                onClick={() => toggleColumnCollapse(column.id)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fafafa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <div style={styles.columnTitleContainer}>
                  <h3 style={styles.columnTitle}>
                    {isCollapsed ? column.title.charAt(0) : column.title}
                  </h3>
                  {!isCollapsed && (
                    <div style={{
                      ...styles.columnCount,
                      backgroundColor: column.bgColor,
                      color: column.color,
                    }}>
                      {columnTasks.length}
                    </div>
                  )}
                </div>
                <div style={{
                  ...styles.collapseIcon,
                  ...(isCollapsed ? styles.collapseIconRotated : {}),
                }}>
                  {isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
                </div>
              </div>

              <div style={{
                ...styles.tasksContainer,
                ...(isCollapsed ? styles.tasksContainerCollapsed : {}),
              }}>
                {columnTasks.length === 0 ? (
                  <div style={styles.emptyColumn}>
                    <div style={styles.emptyText}>No tasks</div>
                    <div style={styles.emptySubtext}>Drop tasks here</div>
                  </div>
                ) : (
                  columnTasks.map((task, taskIndex) => {
                    const dueDateInfo = formatDate(task.dueDate);
                    
                    return (
                      <div
                        key={task._id}
                        data-task-id={task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onTaskClick && onTaskClick(task)}
                        className="kanban-task-card"
                        style={{
                          ...styles.taskCard,
                          animationDelay: `${taskIndex * 0.05}s`,
                        }}
                      >
                        <div style={styles.taskHeader}>
                          <h4 style={styles.taskTitle}>{task.title}</h4>
                          {task.isKeyTask && (
                            <div style={styles.keyTaskIndicator}>
                              <StarIcon />
                            </div>
                          )}
                        </div>

                        {task.description && (
                          <p style={styles.taskDescription}>{task.description}</p>
                        )}

                        <div style={styles.taskMeta}>
                          <div style={styles.taskMetaLeft}>
                            <div style={{
                              ...styles.priorityBadge,
                              backgroundColor: getPriorityColor(task.priority),
                            }}>
                              {task.priority.charAt(0)}
                            </div>
                            
                            {task.attachments && task.attachments.length > 0 && (
                              <div style={styles.attachmentIndicator}>
                                <PaperclipIcon />
                                <span>{task.attachments.length}</span>
                              </div>
                            )}
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
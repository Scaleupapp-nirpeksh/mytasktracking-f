//src/components/specific/CalendarView.jsx
import React, { useState, useEffect, useMemo } from 'react';

const CalendarView = ({ tasks, onTaskClick, onTaskUpdated, onAddTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [selectedDate, setSelectedDate] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showTaskPopup, setShowTaskPopup] = useState(null);

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes popIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      .calendar-day-cell {
        animation: fadeIn 0.3s ease-out;
      }
      
      .calendar-task-item {
        animation: slideIn 0.2s ease-out;
      }
      
      .calendar-popup {
        animation: popIn 0.15s ease-out;
      }
      
      .calendar-day-hover {
        background-color: #fafafa !important;
      }
      
      .calendar-day-drag-over {
        background-color: rgba(10, 10, 10, 0.03) !important;
        border: 2px dashed #0a0a0a !important;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  // Calendar utilities
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    
    return week;
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, date) => {
    e.preventDefault();
    setHoveredDate(date);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setHoveredDate(null);
    }
  };

  const handleDrop = async (e, date) => {
    e.preventDefault();
    setHoveredDate(null);
    
    if (!draggedTask || isSameDay(new Date(draggedTask.dueDate), date)) {
      return;
    }

    // Update task due date
    const updatedTask = { ...draggedTask, dueDate: date.toISOString() };
    if (onTaskUpdated) {
      onTaskUpdated(updatedTask);
    }
    
    setDraggedTask(null);
  };

  // Task colors and priorities
  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#dc2626',
      'Medium': '#ca8a04',
      'Low': '#16a34a',
    };
    return colors[priority] || '#737373';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Done': '#16a34a',
      'In Progress': '#0a0a0a',
      'To Do': '#737373',
    };
    return colors[status] || '#737373';
  };

  // Icons
  const ChevronLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
    </svg>
  );

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
    },
    
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fafafa',
    },
    
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    
    monthTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#0a0a0a',
      margin: 0,
      minWidth: '200px',
    },
    
    navigationButtons: {
      display: 'flex',
      gap: '8px',
    },
    
    navButton: {
      width: '32px',
      height: '32px',
      border: '1px solid #e5e5e5',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#525252',
      transition: 'all 0.2s ease',
    },
    
    todayButton: {
      padding: '6px 12px',
      border: '1px solid #e5e5e5',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      color: '#525252',
      transition: 'all 0.2s ease',
    },
    
    viewToggle: {
      display: 'flex',
      backgroundColor: '#f5f5f5',
      borderRadius: '6px',
      padding: '2px',
    },
    
    viewButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'transparent',
      color: '#737373',
    },
    
    viewButtonActive: {
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
    },
    
    calendarGrid: {
      padding: '16px',
    },
    
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      marginBottom: '8px',
    },
    
    weekDay: {
      textAlign: 'center',
      fontSize: '12px',
      fontWeight: '600',
      color: '#737373',
      padding: '8px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    
    monthGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
    },
    
    dayCell: {
      aspectRatio: '1',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '8px',
      backgroundColor: '#ffffff',
      position: 'relative',
      minHeight: '100px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
    },
    
    dayNumber: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      marginBottom: '4px',
    },
    
    dayToday: {
      backgroundColor: '#fafafa',
      borderColor: '#0a0a0a',
    },
    
    dayOtherMonth: {
      opacity: 0.3,
    },
    
    dayWeekend: {
      backgroundColor: '#fafafa',
    },
    
    daySelected: {
      borderColor: '#0a0a0a',
      borderWidth: '2px',
    },
    
    tasksContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      maxHeight: '60px',
      overflow: 'hidden',
    },
    
    taskPill: {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500',
      color: '#ffffff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.15s ease',
    },
    
    moreTasksIndicator: {
      fontSize: '10px',
      color: '#737373',
      fontWeight: '600',
      marginTop: '2px',
      cursor: 'pointer',
    },
    
    taskPopup: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      marginTop: '4px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      minWidth: '200px',
    },
    
    addTaskButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      backgroundColor: '#f5f5f5',
      border: '1px solid #e5e5e5',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: 'all 0.2s ease',
    },
    
    dayHoverAddButton: {
      opacity: 1,
    },
    
    // Week view styles
    weekViewContainer: {
      padding: '16px',
      overflowX: 'auto',
    },
    
    weekGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      minWidth: '800px',
    },
    
    weekDayColumn: {
      minHeight: '400px',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '12px 8px',
      backgroundColor: '#ffffff',
    },
    
    weekDayHeader: {
      textAlign: 'center',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '1px solid #e5e5e5',
    },
    
    weekDayName: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#737373',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    
    weekDayDate: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0a0a0a',
      marginTop: '4px',
    },
    
    // Day view styles
    dayViewContainer: {
      padding: '16px',
    },
    
    dayViewHeader: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    
    dayViewTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0a0a0a',
      margin: '0 0 8px 0',
    },
    
    dayViewTasks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    
    dayViewTaskCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#737373',
    },
  };

  // Render month view
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    
    // Add empty cells to complete the grid
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    
    return (
      <div style={styles.calendarGrid}>
        <div style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={styles.weekDay}>{day}</div>
          ))}
        </div>
        
        <div style={styles.monthGrid}>
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} style={{ ...styles.dayCell, opacity: 0 }} />;
            }
            
            const dayTasks = getTasksForDate(date);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isSelected = isSameDay(date, selectedDate);
            const isDragOver = isSameDay(date, hoveredDate);
            
            return (
              <div
                key={date.toISOString()}
                className={`calendar-day-cell ${isDragOver ? 'calendar-day-drag-over' : ''}`}
                style={{
                  ...styles.dayCell,
                  ...(isToday(date) ? styles.dayToday : {}),
                  ...(isWeekend ? styles.dayWeekend : {}),
                  ...(isSelected ? styles.daySelected : {}),
                }}
                onClick={() => setSelectedDate(date)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
                onMouseEnter={(e) => {
                  e.currentTarget.classList.add('calendar-day-hover');
                  const addButton = e.currentTarget.querySelector('.add-task-button');
                  if (addButton) addButton.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.classList.remove('calendar-day-hover');
                  const addButton = e.currentTarget.querySelector('.add-task-button');
                  if (addButton) addButton.style.opacity = '0';
                }}
              >
                <div style={styles.dayNumber}>
                  {date.getDate()}
                  {isToday(date) && (
                    <span style={{ 
                      marginLeft: '4px', 
                      fontSize: '10px', 
                      color: '#0a0a0a',
                      fontWeight: '600',
                      backgroundColor: '#e5e5e5',
                      padding: '2px 4px',
                      borderRadius: '4px',
                    }}>
                      Today
                    </span>
                  )}
                </div>
                
                <div style={styles.tasksContainer}>
                  {dayTasks.slice(0, 3).map((task, i) => (
                    <div
                      key={task._id}
                      className="calendar-task-item"
                      style={{
                        ...styles.taskPill,
                        backgroundColor: getStatusColor(task.status),
                        animationDelay: `${i * 0.05}s`,
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick && onTaskClick(task);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {task.isKeyTask && <StarIcon />}
                      {task.title}
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div 
                      style={styles.moreTasksIndicator}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTaskPopup(date);
                      }}
                    >
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
                
                <button
                  className="add-task-button"
                  style={styles.addTaskButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTask && onAddTask(date);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e5e5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f5f5f5';
                  }}
                >
                  <PlusIcon />
                </button>
                
                {showTaskPopup && isSameDay(showTaskPopup, date) && dayTasks.length > 3 && (
                  <div 
                    className="calendar-popup"
                    style={styles.taskPopup}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
                      All tasks for {date.toLocaleDateString()}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {dayTasks.map(task => (
                        <div
                          key={task._id}
                          style={{
                            padding: '8px',
                            backgroundColor: '#fafafa',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            transition: 'all 0.15s ease',
                          }}
                          onClick={() => onTaskClick && onTaskClick(task)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#fafafa';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: getPriorityColor(task.priority),
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ fontWeight: '500' }}>{task.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    
    return (
      <div style={styles.weekViewContainer}>
        <div style={styles.weekGrid}>
          {weekDates.map(date => {
            const dayTasks = getTasksForDate(date);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            return (
              <div
                key={date.toISOString()}
                style={{
                  ...styles.weekDayColumn,
                  ...(isToday(date) ? styles.dayToday : {}),
                  ...(isWeekend ? styles.dayWeekend : {}),
                }}
              >
                <div style={styles.weekDayHeader}>
                  <div style={styles.weekDayName}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div style={styles.weekDayDate}>
                    {date.getDate()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dayTasks.length > 0 ? (
                    dayTasks.map(task => (
                      <div
                        key={task._id}
                        style={{
                          ...styles.taskPill,
                          backgroundColor: getStatusColor(task.status),
                          padding: '6px 8px',
                          fontSize: '12px',
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onClick={() => onTaskClick && onTaskClick(task)}
                      >
                        {task.isKeyTask && <StarIcon />}
                        {task.title}
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#a3a3a3', 
                      fontSize: '12px',
                      padding: '20px 0',
                    }}>
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate);
    
    return (
      <div style={styles.dayViewContainer}>
        <div style={styles.dayViewHeader}>
          <h2 style={styles.dayViewTitle}>
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </h2>
        </div>
        
        {dayTasks.length > 0 ? (
          <div style={styles.dayViewTasks}>
            {dayTasks.map(task => (
              <div
                key={task._id}
                style={styles.dayViewTaskCard}
                onClick={() => onTaskClick && onTaskClick(task)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(task.status),
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 4px 0', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#0a0a0a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      {task.isKeyTask && <StarIcon />}
                      {task.title}
                    </h3>
                    {task.description && (
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '14px', 
                        color: '#737373',
                        lineHeight: 1.5,
                      }}>
                        {task.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#ffffff',
                        backgroundColor: getPriorityColor(task.priority),
                      }}>
                        {task.priority}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#737373',
                      }}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <CalendarIcon />
            <p style={{ margin: '16px 0 0 0', fontSize: '16px', fontWeight: '500' }}>
              No tasks scheduled for this day
            </p>
            <button
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={() => onAddTask && onAddTask(currentDate)}
            >
              Add Task
            </button>
          </div>
        )}
      </div>
    );
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showTaskPopup && !e.target.closest('.calendar-popup')) {
        setShowTaskPopup(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTaskPopup]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.monthTitle}>
            {viewMode === 'month' && getMonthName(currentDate)}
            {viewMode === 'week' && `Week of ${getWeekDates(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h2>
          
          <div style={styles.navigationButtons}>
            <button
              style={styles.navButton}
              onClick={() => {
                if (viewMode === 'month') navigateMonth(-1);
                else if (viewMode === 'week') navigateWeek(-1);
                else navigateDay(-1);
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#d4d4d4';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e5e5e5';
              }}
            >
              <ChevronLeftIcon />
            </button>
            
            <button
              style={styles.todayButton}
              onClick={goToToday}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#d4d4d4';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e5e5e5';
              }}
            >
              Today
            </button>
            
            <button
              style={styles.navButton}
              onClick={() => {
                if (viewMode === 'month') navigateMonth(1);
                else if (viewMode === 'week') navigateWeek(1);
                else navigateDay(1);
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#d4d4d4';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#e5e5e5';
              }}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        
        <div style={styles.viewToggle}>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === 'month' ? styles.viewButtonActive : {}),
            }}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === 'week' ? styles.viewButtonActive : {}),
            }}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === 'day' ? styles.viewButtonActive : {}),
            }}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
        </div>
      </div>
      
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
    </div>
  );
};

export default CalendarView;
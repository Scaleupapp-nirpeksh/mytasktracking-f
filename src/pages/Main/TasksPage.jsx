import React, { useState, useEffect, useMemo } from 'react';
import { getAllTasks, getAllWorkspaces } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { Link, useParams, NavLink } from 'react-router-dom';
import AddTaskModal from '../../components/specific/AddTaskModal';
import TaskDetailModal from '../../components/specific/TaskDetailModal';
import EditTaskModal from '../../components/specific/EditTaskModal';
import ConfirmDeleteModal from '../../components/specific/ConfirmDeleteModal';
import MagicInput from '../../components/specific/MagicInput';
import KanbanBoard from '../../components/specific/KanbanBoard'; // Add this import

const TasksPage = () => {
  const { workspaceId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [prefilledData, setPrefilledData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', or 'kanban'
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [tasksResponse, workspacesResponse] = await Promise.all([
          getAllTasks(workspaceId),
          getAllWorkspaces()
        ]);
        setTasks(tasksResponse.data.data.tasks);
        setWorkspaces(workspacesResponse.data.data.workspaces);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workspaceId]);

  const currentWorkspace = useMemo(() => {
    return workspaces.find(ws => ws._id === workspaceId);
  }, [workspaces, workspaceId]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Done').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      pending: tasks.filter(t => t.status === 'To Do').length,
      keyTasks: tasks.filter(t => t.isKeyTask).length,
    };
  }, [tasks]);

  const handleTaskAdded = (newTask) => {
    if (!workspaceId || newTask.workspace === workspaceId) {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
    if (selectedTask && selectedTask._id === updatedTask._id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletedTaskId));
  };

  const handleOpenEditModal = () => {
    setEditingTask(selectedTask);
    setSelectedTask(null);
  };

  const handleOpenDeleteModal = () => {
    setTaskToDelete(selectedTask);
    setSelectedTask(null);
  };

  const handleParse = (parsedData) => {
    setPrefilledData(parsedData);
    setIsAddModalOpen(true);
  };
  
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setPrefilledData(null);
  };

  // Handler for Kanban task clicks
  const handleKanbanTaskClick = (task) => {
    setSelectedTask(task);
  };

  const getWorkspaceName = (wsId) => {
    const workspace = workspaces.find(ws => ws._id === wsId);
    return workspace ? workspace.name : 'Unknown';
  };

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: calc(200px + 100%) 0; }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  const styles = {
    layoutContainer: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      backgroundColor: '#f0fdf4',
      color: '#1e293b',
    },
    
    sidebar: {
      width: sidebarCollapsed ? '80px' : '280px',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '24px',
      boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative',
      background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
    },
    
    sidebarToggle: {
      position: 'absolute',
      top: '24px',
      right: '-12px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      transition: 'all 0.2s ease',
      zIndex: 10,
    },
    
    sidebarLogo: {
      fontSize: sidebarCollapsed ? '20px' : '28px',
      fontWeight: '900',
      margin: '0 0 32px 0',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: sidebarCollapsed ? 'center' : 'left',
      transition: 'all 0.3s ease',
      letterSpacing: '-0.02em',
    },
    
    workspaceNav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    
    navTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      margin: '0 0 12px 0',
      opacity: sidebarCollapsed ? 0 : 1,
      transition: 'opacity 0.3s ease',
    },
    
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    
    workspaceItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '10px',
      textDecoration: 'none',
      color: '#cbd5e1',
      fontWeight: '500',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    
    workspaceItemActive: {
      backgroundColor: '#10b981',
      color: 'white',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    
    workspaceIcon: {
      fontSize: '18px',
      minWidth: '18px',
    },
    
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f0fdf4',
    },
    
    mainHeader: {
      backgroundColor: 'white',
      padding: '24px 32px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    
    headerTitle: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0,
      background: 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    
    welcomeText: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#475569',
    },
    
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    
    logoutButton: {
      padding: '10px 20px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
    },
    
    tasksPageMain: {
      flex: 1,
      padding: viewMode === 'kanban' ? '0' : '32px', // Remove padding for kanban view
      overflow: 'auto',
    },
    
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
      padding: viewMode === 'kanban' ? '32px 32px 0 32px' : '0', // Add padding back for kanban
    },
    
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      transition: 'all 0.3s ease',
    },
    
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: 'white',
    },
    
    statContent: {
      flex: 1,
    },
    
    statNumber: {
      fontSize: '24px',
      fontWeight: '900',
      color: '#1e293b',
      margin: '0 0 4px 0',
    },
    
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
      margin: 0,
    },
    
    controlsSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      margin: viewMode === 'kanban' ? '0 32px 24px 32px' : '0 0 24px 0', // Adjust margin for kanban
    },
    
    magicInputWrapper: {
      marginBottom: '24px',
    },
    
    filtersRow: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '20px',
    },
    
    searchInput: {
      flex: 1,
      minWidth: '250px',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    
    filterSelect: {
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: 'white',
    },
    
    viewToggle: {
      display: 'flex',
      backgroundColor: '#f1f5f9',
      borderRadius: '8px',
      padding: '4px',
    },
    
    viewButton: {
      padding: '8px 12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    
    viewButtonActive: {
      backgroundColor: '#10b981',
      color: 'white',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    },
    
    viewButtonInactive: {
      backgroundColor: 'transparent',
      color: '#64748b',
    },
    
    tasksHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      padding: viewMode === 'kanban' ? '0 32px' : '0', // Add padding for kanban
    },
    
    tasksHeaderTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
    },
    
    addTaskButton: {
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
    
    tasksList: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : '1fr',
      padding: viewMode === 'kanban' ? '0 32px' : '0', // Add padding for kanban
    },
    
    taskItem: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      animation: 'slideIn 0.6s ease-out',
    },
    
    taskItemHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '12px',
    },
    
    keyTaskIndicator: {
      fontSize: '20px',
      color: '#f59e0b',
      textShadow: '0 2px 4px rgba(245, 158, 11, 0.3)',
    },
    
    taskTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0',
      lineHeight: 1.4,
      flex: 1,
    },
    
    taskDescription: {
      fontSize: '14px',
      color: '#64748b',
      lineHeight: 1.5,
      marginBottom: '16px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    
    taskItemDetails: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    
    taskWorkspaceBadge: {
      padding: '4px 12px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    taskPriority: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    taskStatus: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
      color: '#64748b',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    },
    
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #10b981',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px',
    },
    
    errorContainer: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      textAlign: 'center',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      border: '2px dashed #e2e8f0',
    },
    
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px',
      opacity: 0.5,
    },
    
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 12px 0',
    },
    
    emptyText: {
      fontSize: '16px',
      color: '#64748b',
      lineHeight: 1.6,
      maxWidth: '400px',
      margin: '0 auto',
    },

    // Kanban specific styles
    kanbanContainer: {
      backgroundColor: '#f8fafc',
      minHeight: 'calc(100vh - 200px)', // Adjust based on your header height
    },
  };

  const getPriorityStyles = (priority) => {
    const priorityMap = {
      'High': { backgroundColor: '#fef2f2', color: '#dc2626' },
      'Medium': { backgroundColor: '#fef3c7', color: '#d97706' },
      'Low': { backgroundColor: '#f0fdf4', color: '#059669' },
    };
    return { ...styles.taskPriority, ...priorityMap[priority] };
  };

  const getStatusStyles = (status) => {
    const statusMap = {
      'To Do': { backgroundColor: '#f1f5f9', color: '#475569' },
      'In Progress': { backgroundColor: '#dbeafe', color: '#1d4ed8' },
      'Done': { backgroundColor: '#f0fdf4', color: '#059669' },
    };
    return { ...styles.taskStatus, ...statusMap[status] };
  };

  const statConfigs = [
    { key: 'total', label: 'Total Tasks', icon: '📊', color: '#3b82f6' },
    { key: 'pending', label: 'To Do', icon: '📋', color: '#64748b' },
    { key: 'inProgress', label: 'In Progress', icon: '🔄', color: '#1d4ed8' },
    { key: 'completed', label: 'Completed', icon: '✅', color: '#059669' },
    { key: 'keyTasks', label: 'Key Tasks', icon: '⭐', color: '#f59e0b' },
  ];

  // Render content based on view mode
  const renderTasksContent = () => {
    if (viewMode === 'kanban') {
      return (
        <div style={styles.kanbanContainer}>
          <KanbanBoard
            tasks={filteredTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskClick={handleKanbanTaskClick}
          />
        </div>
      );
    }

    // Grid and List views
    return (
      <div style={styles.tasksList}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                ...styles.taskItem,
                animationDelay: `${index * 0.05}s`,
              }}
              onClick={() => setSelectedTask(task)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={styles.taskItemHeader}>
                {task.isKeyTask && (
                  <span style={styles.keyTaskIndicator}>⭐</span>
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={styles.taskTitle}>{task.title}</h4>
                  {task.description && (
                    <p style={styles.taskDescription}>{task.description}</p>
                  )}
                </div>
              </div>
              
              <div style={styles.taskItemDetails}>
                {!workspaceId && (
                  <span style={styles.taskWorkspaceBadge}>
                    {getWorkspaceName(task.workspace)}
                  </span>
                )}
                <span style={getPriorityStyles(task.priority)}>
                  {task.priority}
                </span>
                <span style={getStatusStyles(task.status)}>
                  {task.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <h3 style={styles.emptyTitle}>No Tasks Found</h3>
            <p style={styles.emptyText}>
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No tasks match your current filters. Try adjusting your search criteria.'
                : 'No tasks found in this workspace. Create your first task to get started!'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <button
          style={styles.sidebarToggle}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
        
        <h1 style={styles.sidebarLogo}>
          {sidebarCollapsed ? '🔑' : '🔑 Keystone'}
        </h1>
        
        <nav style={styles.workspaceNav}>
          {!sidebarCollapsed && <p style={styles.navTitle}>Workspaces</p>}
          <ul style={styles.navList}>
            {workspaces.map((ws) => (
              <li key={ws._id}>
                <NavLink
                  to={`/workspaces/${ws._id}/tasks`}
                  style={({ isActive }) => ({
                    ...styles.workspaceItem,
                    ...(isActive ? styles.workspaceItemActive : {}),
                  })}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.backgroundColor = '#475569';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#cbd5e1';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <span style={styles.workspaceIcon}>📁</span>
                  {!sidebarCollapsed && ws.name}
                </NavLink>
              </li>
            ))}
          </ul>
          
          {!sidebarCollapsed && <p style={styles.navTitle}>Views</p>}
          <ul style={styles.navList}>
            <li>
              <NavLink
                to="/tasks"
                end
                style={({ isActive }) => ({
                  ...styles.workspaceItem,
                  ...(isActive ? styles.workspaceItemActive : {}),
                })}
                onMouseEnter={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = '#475569';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#cbd5e1';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={styles.workspaceIcon}>📋</span>
                {!sidebarCollapsed && 'All Tasks'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/meetings"
                style={({ isActive }) => ({
                  ...styles.workspaceItem,
                  ...(isActive ? styles.workspaceItemActive : {}),
                })}
                onMouseEnter={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = '#475569';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#cbd5e1';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={styles.workspaceIcon}>👥</span>
                {!sidebarCollapsed && 'Meetings'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                style={({ isActive }) => ({
                  ...styles.workspaceItem,
                  ...(isActive ? styles.workspaceItemActive : {}),
                })}
                onMouseEnter={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = '#475569';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#cbd5e1';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={styles.workspaceIcon}>⚙️</span>
                {!sidebarCollapsed && 'Settings'}
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <header style={styles.mainHeader}>
          <h2 style={styles.headerTitle}>{currentWorkspace?.name || 'All Tasks'}</h2>
          <div style={styles.userMenu}>
            <span style={styles.welcomeText}>Welcome, {user?.name}</span>
            <div style={styles.userAvatar}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <button
              style={styles.logoutButton}
              onClick={logout}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ef4444';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
              }}
            >
              Log Out
            </button>
          </div>
        </header>

        <main style={styles.tasksPageMain}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p>Loading tasks...</p>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              {error}
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div style={styles.statsRow}>
                {statConfigs.map((config, index) => (
                  <div
                    key={config.key}
                    style={{
                      ...styles.statCard,
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <div
                      style={{
                        ...styles.statIcon,
                        backgroundColor: config.color,
                      }}
                    >
                      {config.icon}
                    </div>
                    <div style={styles.statContent}>
                      <div style={styles.statNumber}>{taskStats[config.key]}</div>
                      <div style={styles.statLabel}>{config.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls Section */}
              <div style={styles.controlsSection}>
                <div style={styles.magicInputWrapper}>
                  <MagicInput onParse={handleParse} />
                </div>
                
                <div style={styles.filtersRow}>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      ...styles.searchInput,
                      borderColor: searchTerm ? '#10b981' : '#e2e8f0',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = searchTerm ? '#10b981' : '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={styles.filterSelect}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    style={styles.filterSelect}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <option value="all">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  
                  <div style={styles.viewToggle}>
                    <button
                      onClick={() => setViewMode('grid')}
                      style={{
                        ...styles.viewButton,
                        ...(viewMode === 'grid' ? styles.viewButtonActive : styles.viewButtonInactive),
                      }}
                    >
                      <span>⊞</span> Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      style={{
                        ...styles.viewButton,
                        ...(viewMode === 'list' ? styles.viewButtonActive : styles.viewButtonInactive),
                      }}
                    >
                      <span>☰</span> List
                    </button>
                    <button
                      onClick={() => setViewMode('kanban')}
                      style={{
                        ...styles.viewButton,
                        ...(viewMode === 'kanban' ? styles.viewButtonActive : styles.viewButtonInactive),
                      }}
                    >
                      <span>📋</span> Kanban
                    </button>
                  </div>
                </div>
              </div>

              {/* Tasks Header */}
              {viewMode !== 'kanban' && (
                <div style={styles.tasksHeader}>
                  <h3 style={styles.tasksHeaderTitle}>
                    {filteredTasks.length} {currentWorkspace?.name || 'All'} Tasks
                  </h3>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={styles.addTaskButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                      e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>✨</span>
                    New Task
                  </button>
                </div>
              )}
              
              {/* Render Tasks Content */}
              {renderTasksContent()}
            </>
          )}
        </main>
      </div>

      {/* Render Modals */}
      {isAddModalOpen && (
        <AddTaskModal
          workspaces={workspaces}
          initialData={prefilledData}
          onClose={closeAddModal}
          onTaskAdded={handleTaskAdded}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          workspaceName={getWorkspaceName(selectedTask.workspace)}
          onClose={() => setSelectedTask(null)}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          workspaces={workspaces}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {taskToDelete && (
        <ConfirmDeleteModal
          task={taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  );
};

export default TasksPage;
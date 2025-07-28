//src/pages/Main/KanbanPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllTasks, getAllWorkspaces } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import KanbanBoard from '../../components/specific/KanbanBoard';
import TaskDetailModal from '../../components/specific/TaskDetailModal';
import EditTaskModal from '../../components/specific/EditTaskModal';
import AddTaskModal from '../../components/specific/AddTaskModal';
import ConfirmDeleteModal from '../../components/specific/ConfirmDeleteModal';

const KanbanPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter states
  const [selectedWorkspace, setSelectedWorkspace] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [tasksResponse, workspacesResponse] = await Promise.all([
        getAllTasks(),
        getAllWorkspaces()
      ]);
      
      setTasks(tasksResponse.data.data.tasks);
      setWorkspaces(workspacesResponse.data.data.workspaces);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load tasks and workspaces.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => 
      prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    );
    setSelectedTask(updatedTask);
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks(prev => prev.filter(task => task._id !== deletedTaskId));
    setSelectedTask(null);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const handleEditTask = () => {
    setShowTaskDetail(false);
    setShowEditTask(true);
  };

  const handleDeleteTask = () => {
    setShowTaskDetail(false);
    setShowDeleteConfirm(true);
  };

  const getWorkspaceName = (workspaceId) => {
    const workspace = workspaces.find(ws => ws._id === workspaceId);
    return workspace ? workspace.name : 'Unknown Workspace';
  };

  // Filter tasks based on workspace and search query
  const filteredTasks = tasks.filter(task => {
    const matchesWorkspace = selectedWorkspace === 'all' || task.workspace === selectedWorkspace;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesWorkspace && matchesSearch;
  });

  const styles = {
    layoutContainer: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
    },
    
    sidebar: {
      width: '280px',
      backgroundColor: 'white',
      borderRight: '1px solid #e2e8f0',
      padding: '0',
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
    },
    
    sidebarLogo: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0',
      padding: '32px 24px',
      borderBottom: '1px solid #e2e8f0',
    },
    
    workspaceNav: {
      padding: '24px',
    },
    
    navTitle: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      margin: '0 0 16px 0',
    },
    
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    
    navItem: {
      marginBottom: '8px',
    },
    
    workspaceItem: {
      display: 'block',
      padding: '12px 16px',
      color: '#64748b',
      textDecoration: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    
    mainHeader: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '24px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    
    headerTitle: {
      fontSize: '32px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    headerControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    
    searchInput: {
      padding: '10px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: 'white',
      outline: 'none',
      transition: 'all 0.2s ease',
      width: '240px',
    },
    
    workspaceSelect: {
      padding: '10px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    
    addTaskButton: {
      padding: '12px 20px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '500',
    },
    
    logoutButton: {
      padding: '10px 20px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    loadingContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 32px',
      backgroundColor: '#f8fafc',
    },
    
    loadingSpinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '24px',
    },
    
    loadingText: {
      fontSize: '18px',
      color: '#64748b',
      fontWeight: '600',
    },
    
    errorContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 32px',
      backgroundColor: '#f8fafc',
    },
    
    errorIcon: {
      fontSize: '64px',
      marginBottom: '24px',
    },
    
    errorTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#dc2626',
      margin: '0 0 12px 0',
    },
    
    errorText: {
      fontSize: '16px',
      color: '#64748b',
      textAlign: 'center',
      margin: '0 0 24px 0',
      lineHeight: '1.5',
    },
    
    retryButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    
    statsBar: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
    },
    
    statNumber: {
      fontSize: '18px',
      fontWeight: '800',
      color: '#1e293b',
    },
  };

  // Calculate task statistics
  const taskStats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter(t => t.status === 'To Do').length,
    inProgress: filteredTasks.filter(t => t.status === 'In Progress').length,
    blocked: filteredTasks.filter(t => t.status === 'Blocked').length,
    review: filteredTasks.filter(t => t.status === 'For Review').length,
    done: filteredTasks.filter(t => t.status === 'Done').length,
  };

  if (loading) {
    return (
      <div style={styles.layoutContainer}>
        <aside style={styles.sidebar}>
          <h1 style={styles.sidebarLogo}>🔑 Keystone</h1>
          <nav style={styles.workspaceNav}>
            <p style={styles.navTitle}>Navigation</p>
            <ul style={styles.navList}>
              <li style={styles.navItem}>
                <NavLink to="/" style={styles.workspaceItem}>📊 Dashboard</NavLink>
              </li>
              <li style={styles.navItem}>
                <NavLink to="/tasks" style={styles.workspaceItem}>✅ Tasks</NavLink>
              </li>
              <li style={styles.navItem}>
                <NavLink to="/kanban" style={styles.workspaceItem}>📋 Kanban</NavLink>
              </li>
              <li style={styles.navItem}>
                <NavLink to="/meetings" style={styles.workspaceItem}>🤝 Meetings</NavLink>
              </li>
              <li style={styles.navItem}>
                <NavLink to="/settings" style={styles.workspaceItem}>⚙️ Settings</NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        
        <div style={styles.mainContent}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading your task board...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.layoutContainer}>
        <aside style={styles.sidebar}>
          <h1 style={styles.sidebarLogo}>🔑 Keystone</h1>
          <nav style={styles.workspaceNav}>
            <p style={styles.navTitle}>Navigation</p>
            <ul style={styles.navList}>
              <li style={styles.navItem}>
                <NavLink to="/" style={styles.workspaceItem}>📊 Dashboard</NavLink>
              </li>
              <li style={styles.navItem}>
                <NavLink to="/tasks" style={styles.workspaceItem}>✅ Tasks</NavLink>
              </li>
              <li style={styles.navItem}>
                <NavLink to="/kanban" style={styles.workspaceItem}>📋 Kanban</NavLink>
              </li>
              <li style={styles.navItem}>
                <NavLink to="/meetings" style={styles.workspaceItem}>🤝 Meetings</NavLink>
              </li>
              <li style={styles.navItem}>
                <NavLink to="/settings" style={styles.workspaceItem}>⚙️ Settings</NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        
        <div style={styles.mainContent}>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>❌</div>
            <h2 style={styles.errorTitle}>Failed to Load Tasks</h2>
            <p style={styles.errorText}>
              We couldn't load your tasks and workspaces. Please check your connection and try again.
            </p>
            <button 
              style={styles.retryButton}
              onClick={fetchData}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              <span>🔄</span>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h1 style={styles.sidebarLogo}>🔑 Keystone</h1>
        <nav style={styles.workspaceNav}>
          <p style={styles.navTitle}>Navigation</p>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <NavLink 
                to="/" 
                style={styles.workspaceItem}
                className={({ isActive }) => isActive ? 'active' : ''}
                end
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li style={styles.navItem}>
              <NavLink 
                to="/tasks" 
                style={styles.workspaceItem}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                ✅ Tasks
              </NavLink>
            </li>
            <li style={styles.navItem}>
              <NavLink 
                to="/kanban" 
                style={styles.workspaceItem}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                📋 Kanban
              </NavLink>
            </li>
            <li style={styles.navItem}>
              <NavLink 
                to="/meetings" 
                style={styles.workspaceItem}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                🤝 Meetings
              </NavLink>
            </li>
            <li style={styles.navItem}>
              <NavLink 
                to="/settings" 
                style={styles.workspaceItem}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                ⚙️ Settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <header style={styles.mainHeader}>
          <div style={styles.headerLeft}>
            <h2 style={styles.headerTitle}>
              <span>📋</span>
              Kanban Board
            </h2>
            
            <div style={styles.headerControls}>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                style={styles.workspaceSelect}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">All Workspaces</option>
                {workspaces.map(workspace => (
                  <option key={workspace._id} value={workspace._id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
              
              <button 
                style={styles.addTaskButton}
                onClick={() => setShowAddTask(true)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                }}
              >
                <span>➕</span>
                Add Task
              </button>
            </div>
          </div>
          
          <div style={styles.userMenu}>
            <span>Welcome, {user?.name}</span>
            <button 
              onClick={logout} 
              style={styles.logoutButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ef4444';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Stats Bar */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{taskStats.total}</span>
            <span>Total Tasks</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{taskStats.todo}</span>
            <span>📋 To Do</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{taskStats.inProgress}</span>
            <span>🔄 In Progress</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{taskStats.blocked}</span>
            <span>🚫 Blocked</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{taskStats.review}</span>
            <span>👁️ Review</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{taskStats.done}</span>
            <span>✅ Done</span>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard
          tasks={filteredTasks}
          onTaskUpdated={handleTaskUpdated}
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Modals */}
      {showTaskDetail && selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          workspaceName={getWorkspaceName(selectedTask.workspace)}
          onClose={() => {
            setShowTaskDetail(false);
            setSelectedTask(null);
          }}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      {showEditTask && selectedTask && (
        <EditTaskModal 
          task={selectedTask}
          workspaces={workspaces}
          onClose={() => {
            setShowEditTask(false);
            setSelectedTask(null);
          }}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {showAddTask && (
        <AddTaskModal 
          workspaces={workspaces}
          onClose={() => setShowAddTask(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}

      {showDeleteConfirm && selectedTask && (
        <ConfirmDeleteModal 
          task={selectedTask}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedTask(null);
          }}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  );
};

export default KanbanPage;
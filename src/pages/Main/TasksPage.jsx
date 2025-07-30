//src/pages/Main/TasksPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { getAllTasks, getAllWorkspaces } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { Link, useParams, NavLink } from 'react-router-dom';
import AddTaskModal from '../../components/specific/AddTaskModal';
import TaskDetailModal from '../../components/specific/TaskDetailModal';
import EditTaskModal from '../../components/specific/EditTaskModal';
import ConfirmDeleteModal from '../../components/specific/ConfirmDeleteModal';
import MagicInput from '../../components/specific/MagicInput';
import KanbanBoard from '../../components/specific/KanbanBoard';

const TasksPage = () => {
  const { workspaceId } = useParams();
  const { user, logout } = useAuth();
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
  const [viewMode, setViewMode] = useState('grid');

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
      highPriority: tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length,
    };
  }, [tasks]);

  // Professional SVG Icons
  const FolderIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const TaskIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01127 9.77251C4.28054 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

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

  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const GridIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ListIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const KanbanIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="10" width="5" height="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10" y="3" width="5" height="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="17" y="3" width="5" height="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const LoadingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
      <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const KeystoneIcon = () => (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8V24" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 8V24" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3" fill="currentColor"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
    </svg>
  );

  // CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .fade-in {
        animation: fadeIn 0.3s ease-out;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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

  const handleKanbanTaskClick = (task) => {
    setSelectedTask(task);
  };

  const getWorkspaceName = (wsId) => {
    const workspace = workspaces.find(ws => ws._id === wsId);
    return workspace ? workspace.name : 'Unknown';
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
      backgroundColor: '#fafafa',
      color: '#0a0a0a',
    },
    
    sidebar: {
      width: sidebarCollapsed ? '64px' : '280px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e5e5',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      position: 'relative',
    },
    
    sidebarHeader: {
      padding: '20px',
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#0a0a0a',
      fontSize: '18px',
      fontWeight: '700',
      opacity: sidebarCollapsed ? 0 : 1,
      transition: 'opacity 0.2s ease',
    },
    
    collapseButton: {
      width: '32px',
      height: '32px',
      border: 'none',
      backgroundColor: '#f5f5f5',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#737373',
      transition: 'all 0.2s ease',
    },
    
    navigation: {
      flex: 1,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    
    navSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    
    navSectionTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#737373',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '8px',
      paddingLeft: '12px',
      opacity: sidebarCollapsed ? 0 : 1,
      transition: 'opacity 0.2s ease',
    },
    
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '6px',
      color: '#525252',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
    
    navItemActive: {
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
    },
    
    navItemText: {
      opacity: sidebarCollapsed ? 0 : 1,
      transition: 'opacity 0.2s ease',
    },
    
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    
    topBar: {
      height: '72px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
    },
    
    topBarLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    
    pageTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0a0a0a',
    },
    
    breadcrumb: {
      fontSize: '14px',
      color: '#737373',
    },
    
    topBarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#0a0a0a',
    },
    
    userAvatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
    },
    
    logoutButton: {
      padding: '8px 16px',
      backgroundColor: '#fafafa',
      border: '1px solid #e5e5e5',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#525252',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    pageContent: {
      flex: 1,
      padding: '32px',
      backgroundColor: '#fafafa',
      overflow: 'auto',
    },
    
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      color: '#737373',
    },
    
    errorContainer: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      textAlign: 'center',
      fontWeight: '500',
      margin: '20px 0',
    },
    
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    
    statCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.2s ease',
    },
    
    statCardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },
    
    statLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#737373',
    },
    
    statIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      color: '#525252',
    },
    
    statValue: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0a0a0a',
      marginBottom: '4px',
    },
    
    statDescription: {
      fontSize: '12px',
      color: '#737373',
    },
    
    controlsSection: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
    },
    
    controlsRow: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      marginBottom: '20px',
    },
    
    searchInputWrapper: {
      position: 'relative',
      flex: 1,
      maxWidth: '400px',
    },
    
    searchInput: {
      width: '100%',
      padding: '10px 16px 10px 40px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
    },
    
    searchInputIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#737373',
    },
    
    filterSelect: {
      padding: '10px 12px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff',
      minWidth: '120px',
    },
    
    viewToggle: {
      display: 'flex',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      padding: '2px',
      marginLeft: 'auto',
    },
    
    viewButton: {
      padding: '8px 12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: 'transparent',
      color: '#737373',
    },
    
    viewButtonActive: {
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
    },
    
    tasksHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    
    tasksTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0a0a0a',
    },
    
    addTaskButton: {
      padding: '10px 16px',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    tasksGrid: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
    },
    
    taskCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      position: 'relative',
    },
    
    taskHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '12px',
    },
    
    taskTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: '0 0 6px 0',
      lineHeight: 1.4,
      flex: 1,
    },
    
    taskDescription: {
      fontSize: '14px',
      color: '#737373',
      lineHeight: 1.5,
      marginBottom: '16px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    
    taskMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    },
    
    taskBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    
    workspaceBadge: {
      backgroundColor: '#f5f5f5',
      color: '#525252',
    },
    
    priorityHigh: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
    },
    
    priorityMedium: {
      backgroundColor: '#fefce8',
      color: '#ca8a04',
    },
    
    priorityLow: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
    },
    
    statusTodo: {
      backgroundColor: '#f5f5f5',
      color: '#525252',
    },
    
    statusInProgress: {
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
    },
    
    statusDone: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      color: '#737373',
    },
    
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      opacity: 0.5,
    },
    
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0a0a0a',
      marginBottom: '8px',
    },
    
    emptyText: {
      fontSize: '14px',
      color: '#737373',
      lineHeight: 1.5,
      maxWidth: '400px',
      margin: '0 auto',
    },
    
    keyTaskStar: {
      color: '#ca8a04',
      marginTop: '2px',
      flexShrink: 0,
    },

    kanbanWrapper: {
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      minHeight: '400px',
    },
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'High': return styles.priorityHigh;
      case 'Medium': return styles.priorityMedium;
      case 'Low': return styles.priorityLow;
      default: return styles.workspaceBadge;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'To Do': return styles.statusTodo;
      case 'In Progress': return styles.statusInProgress;
      case 'Done': return styles.statusDone;
      default: return styles.statusTodo;
    }
  };

  const renderTasksContent = () => {
    if (viewMode === 'kanban') {
      return (
        <div style={styles.kanbanWrapper}>
          <KanbanBoard
            tasks={filteredTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskClick={handleKanbanTaskClick}
          />
        </div>
      );
    }

    return (
      <div style={styles.tasksGrid}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              style={styles.taskCard}
              className="fade-in"
              onClick={() => setSelectedTask(task)}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d4d4d4';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e5e5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.taskHeader}>
                {task.isKeyTask && (
                  <div style={styles.keyTaskStar}>
                    <StarIcon />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={styles.taskTitle}>{task.title}</h4>
                  {task.description && (
                    <p style={styles.taskDescription}>{task.description}</p>
                  )}
                </div>
              </div>
              
              <div style={styles.taskMeta}>
                {!workspaceId && (
                  <span style={{ ...styles.taskBadge, ...styles.workspaceBadge }}>
                    {getWorkspaceName(task.workspace)}
                  </span>
                )}
                <span style={{ ...styles.taskBadge, ...getPriorityStyles(task.priority) }}>
                  {task.priority}
                </span>
                <span style={{ ...styles.taskBadge, ...getStatusStyles(task.status) }}>
                  {task.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h3 style={styles.emptyTitle}>No tasks found</h3>
            <p style={styles.emptyText}>
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No tasks match your current filters. Try adjusting your search criteria.'
                : 'No tasks in this workspace yet. Create your first task to get started.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <LoadingIcon />
          <p style={{ marginTop: '16px', fontSize: '16px' }}>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <KeystoneIcon />
            <span>Keystone</span>
          </div>
          <button 
            style={styles.collapseButton}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e5e5';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
            }}
          >
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
        
        <nav style={styles.navigation}>
          <div style={styles.navSection}>
            <div style={styles.navSectionTitle}>Workspaces</div>
            {workspaces.length > 0 ? workspaces.map((workspace) => (
              <NavLink
                key={workspace._id}
                to={`/workspaces/${workspace._id}/tasks`}
                style={({ isActive }) => ({
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                })}
                onMouseEnter={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <FolderIcon />
                <span style={styles.navItemText}>{workspace.name}</span>
              </NavLink>
            )) : (
              !sidebarCollapsed && <div style={{ padding: '12px', fontSize: '12px', color: '#737373' }}>No workspaces yet</div>
            )}
          </div>
          
          <div style={styles.navSection}>
            <div style={styles.navSectionTitle}>Views</div>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
              onMouseEnter={(e) => {
                if (!e.target.classList.contains('active')) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains('active')) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <TaskIcon />
              <span style={styles.navItemText}>Dashboard</span>
            </NavLink>
            <NavLink
              to="/tasks"
              end
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
              onMouseEnter={(e) => {
                if (!e.target.classList.contains('active')) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains('active')) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <TaskIcon />
              <span style={styles.navItemText}>All Tasks</span>
            </NavLink>
            <NavLink
              to="/meetings"
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
              onMouseEnter={(e) => {
                if (!e.target.classList.contains('active')) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains('active')) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <CalendarIcon />
              <span style={styles.navItemText}>Calendar</span>
            </NavLink>
            <NavLink
              to="/settings"
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
              onMouseEnter={(e) => {
                if (!e.target.classList.contains('active')) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains('active')) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <SettingsIcon />
              <span style={styles.navItemText}>Settings</span>
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <h1 style={styles.pageTitle}>{currentWorkspace?.name || 'All Tasks'}</h1>
            <div style={styles.breadcrumb}>
              {currentWorkspace ? `${filteredTasks.length} tasks in workspace` : `${filteredTasks.length} tasks across all workspaces`}
            </div>
          </div>
          
          <div style={styles.topBarRight}>
            <div style={styles.userSection}>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user?.name || 'User'}</div>
              </div>
              <div style={styles.userAvatar}>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <button 
              style={styles.logoutButton}
              onClick={logout}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#d4d4d4';
                e.target.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fafafa';
                e.target.style.borderColor = '#e5e5e5';
                e.target.style.color = '#525252';
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={styles.pageContent}>
          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d4d4d4';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e5e5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.statCardHeader}>
                <div style={styles.statLabel}>Total Tasks</div>
                <div style={styles.statIcon}>
                  <TaskIcon />
                </div>
              </div>
              <div style={styles.statValue}>{taskStats.total}</div>
              <div style={styles.statDescription}>Across all workspaces</div>
            </div>

            <div 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d4d4d4';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e5e5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.statCardHeader}>
                <div style={styles.statLabel}>To Do</div>
                <div style={styles.statIcon}>
                  <TaskIcon />
                </div>
              </div>
              <div style={styles.statValue}>{taskStats.pending}</div>
              <div style={styles.statDescription}>Pending tasks</div>
            </div>

            <div 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d4d4d4';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e5e5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.statCardHeader}>
                <div style={styles.statLabel}>In Progress</div>
                <div style={styles.statIcon}>
                  <TaskIcon />
                </div>
              </div>
              <div style={styles.statValue}>{taskStats.inProgress}</div>
              <div style={styles.statDescription}>Currently active</div>
            </div>

            <div 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#d4d4d4';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e5e5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.statCardHeader}>
                <div style={styles.statLabel}>Completed</div>
                <div style={styles.statIcon}>
                  <TaskIcon />
                </div>
              </div>
              <div style={styles.statValue}>{taskStats.completed}</div>
              <div style={styles.statDescription}>
                {taskStats.total > 0 ? `${Math.round((taskStats.completed / taskStats.total) * 100)}% completion rate` : 'No tasks yet'}
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div style={styles.controlsSection}>
            <div style={styles.controlsRow}>
              <div style={styles.searchInputWrapper}>
                <div style={styles.searchInputIcon}>
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0a0a0a';
                    e.target.style.boxShadow = '0 0 0 3px rgba(10, 10, 10, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d4d4d4';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.filterSelect}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0a0a0a';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d4d4d4';
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
                  e.target.style.borderColor = '#0a0a0a';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d4d4d4';
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
                    ...(viewMode === 'grid' ? styles.viewButtonActive : {}),
                  }}
                >
                  <GridIcon /> Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'list' ? styles.viewButtonActive : {}),
                  }}
                >
                  <ListIcon /> List
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'kanban' ? styles.viewButtonActive : {}),
                  }}
                >
                  <KanbanIcon /> Board
                </button>
              </div>
            </div>

            <MagicInput onParse={handleParse} />
          </div>

          {/* Tasks Header */}
          <div style={styles.tasksHeader}>
            <h2 style={styles.tasksTitle}>
              {filteredTasks.length} {viewMode === 'kanban' ? 'Tasks Board' : 'Tasks'}
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={styles.addTaskButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#262626';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0a0a0a';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <PlusIcon />
              New Task
            </button>
          </div>
          
          {/* Tasks Content */}
          {renderTasksContent()}
        </div>
      </main>

      {/* Modals */}
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
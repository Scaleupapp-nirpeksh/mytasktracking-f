//src/pages/Main/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../state/contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import { getAllWorkspaces, getAllTasks } from '../../services/apiService';

const DashboardPage = () => {
  // Use actual auth context and API data - NO MOCK DATA
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [workspacesResponse, tasksResponse] = await Promise.all([
          getAllWorkspaces(),
          getAllTasks(),
        ]);
        setWorkspaces(workspacesResponse.data.data.workspaces);
        setTasks(tasksResponse.data.data.tasks);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate real stats from actual backend data
  const summaryStats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    const dueToday = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= todayStart && dueDate <= todayEnd;
    }).length;

    const overdue = tasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < todayStart && task.status !== 'Done'
    ).length;

    const completed = tasks.filter(task => task.status === 'Done').length;
    const inProgress = tasks.filter(task => task.status === 'In Progress').length;
    const todo = tasks.filter(task => task.status === 'Todo').length;
    const highPriority = tasks.filter(task => task.priority === 'High' && task.status !== 'Done').length;

    return {
      total: tasks.length,
      dueToday,
      overdue,
      completed,
      inProgress,
      todo,
      highPriority,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
    };
  }, [tasks]);

  // Professional SVG Icons
  const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

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

  const TrendingUpIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17,6 23,6 23,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const AlertTriangleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.29 3.86L1.82 18C1.64466 18.3024 1.55611 18.6453 1.56331 18.9931C1.57051 19.3408 1.67325 19.6798 1.86037 19.9764C2.04749 20.273 2.31324 20.5157 2.6295 20.6777C2.94576 20.8396 3.29973 20.9148 3.65 20.895H20.35C20.7003 20.9148 21.0542 20.8396 21.3705 20.6777C21.6868 20.5157 21.9525 20.273 22.1396 19.9764C22.3268 19.6798 22.4295 19.3408 22.4367 18.9931C22.4439 18.6453 22.3553 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15447C12.6817 2.98582 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98582 11.0188 3.15447C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18203 2.99721 7.13214 4.39828 5.49883C5.79935 3.86553 7.69279 2.72636 9.79619 2.24223C11.8996 1.75809 14.1003 1.95185 16.07 2.79L17.25 3.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const LoadingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
      <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

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
    
    timeDisplay: {
      fontSize: '14px',
      color: '#737373',
      fontWeight: '500',
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
    
    userEmail: {
      fontSize: '12px',
      color: '#737373',
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
    
    dashboardContent: {
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    
    statCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '24px',
      transition: 'all 0.2s ease',
    },
    
    statCardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    
    statLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#737373',
    },
    
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      color: '#525252',
    },
    
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#0a0a0a',
      marginBottom: '4px',
    },
    
    statChange: {
      fontSize: '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    
    progressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#f5f5f5',
      borderRadius: '3px',
      overflow: 'hidden',
      marginTop: '12px',
    },
    
    progressFill: {
      height: '100%',
      backgroundColor: '#0a0a0a',
      borderRadius: '3px',
      transition: 'width 0.8s ease',
    },
    
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
    },
    
    mainSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    
    sideSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    
    section: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '24px',
    },
    
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0a0a0a',
    },
    
    viewAllLink: {
      fontSize: '14px',
      color: '#737373',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    
    taskList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    
    taskItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
    
    taskLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
      minWidth: 0,
    },
    
    taskStatus: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      flexShrink: 0,
    },
    
    taskTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    taskRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: 0,
    },
    
    taskPriority: {
      fontSize: '11px',
      fontWeight: '600',
      padding: '2px 8px',
      borderRadius: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    
    taskDate: {
      fontSize: '12px',
      color: '#737373',
      fontWeight: '500',
      minWidth: '60px',
      textAlign: 'right',
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#737373',
    },
    
    workspaceCount: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#737373',
      backgroundColor: '#f5f5f5',
      padding: '2px 6px',
      borderRadius: '8px',
      minWidth: '20px',
      textAlign: 'center',
    },
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'Done': return '#059669';
      case 'In Progress': return '#0a0a0a';
      case 'Todo': return '#d4d4d4';
      default: return '#d4d4d4';
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'High':
        return { backgroundColor: '#fef2f2', color: '#dc2626' };
      case 'Medium':
        return { backgroundColor: '#fefce8', color: '#ca8a04' };
      case 'Low':
        return { backgroundColor: '#f0fdf4', color: '#16a34a' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#737373' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get upcoming tasks from real data
  const upcomingTasks = tasks
    .filter(task => task.status !== 'Done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 6);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <LoadingIcon />
          <p style={{ marginTop: '16px', fontSize: '16px' }}>Loading your dashboard...</p>
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
            <div style={{ ...styles.navItem, ...styles.navItemActive }}>
              <TaskIcon />
              <span style={styles.navItemText}>Dashboard</span>
            </div>
            <NavLink
              to="/tasks"
              style={styles.navItem}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <CalendarIcon />
              <span style={styles.navItemText}>All Tasks</span>
            </NavLink>
            <NavLink
              to="/meetings"
              style={styles.navItem}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <CalendarIcon />
              <span style={styles.navItemText}>Meetings</span>
            </NavLink>
            <NavLink
              to="/settings"
              style={styles.navItem}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
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
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <div style={styles.timeDisplay}>
              {formatTime(currentTime)} • {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          <div style={styles.topBarRight}>
            <div style={styles.userSection}>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user?.name || 'User'}</div>
                <div style={styles.userEmail}>{user?.email || 'user@example.com'}</div>
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

        {/* Dashboard Content */}
        <div style={styles.dashboardContent}>
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
              <div style={styles.statValue}>{summaryStats.total}</div>
              <div style={{ ...styles.statChange, color: '#737373' }}>
                Across {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
              </div>
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
                <div style={styles.statLabel}>Due Today</div>
                <div style={{ ...styles.statIcon, backgroundColor: '#fefce8', color: '#ca8a04' }}>
                  <ClockIcon />
                </div>
              </div>
              <div style={styles.statValue}>{summaryStats.dueToday}</div>
              <div style={{ ...styles.statChange, color: summaryStats.dueToday > 0 ? '#ca8a04' : '#737373' }}>
                {summaryStats.dueToday > 0 ? 'Requires attention' : 'All clear for today'}
              </div>
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
                <div style={styles.statLabel}>Overdue</div>
                <div style={{ ...styles.statIcon, backgroundColor: summaryStats.overdue > 0 ? '#fef2f2' : '#f0fdf4', color: summaryStats.overdue > 0 ? '#dc2626' : '#16a34a' }}>
                  {summaryStats.overdue > 0 ? <AlertTriangleIcon /> : <CheckCircleIcon />}
                </div>
              </div>
              <div style={styles.statValue}>{summaryStats.overdue}</div>
              <div style={{ ...styles.statChange, color: summaryStats.overdue > 0 ? '#dc2626' : '#16a34a' }}>
                {summaryStats.overdue > 0 ? 'Needs immediate action' : 'All caught up'}
              </div>
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
                <div style={styles.statLabel}>Completion Rate</div>
                <div style={{ ...styles.statIcon, backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                  <TrendingUpIcon />
                </div>
              </div>
              <div style={styles.statValue}>{summaryStats.completionRate}%</div>
              <div style={{ ...styles.statChange, color: '#16a34a' }}>
                {summaryStats.completed} of {summaryStats.total} completed
              </div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${summaryStats.completionRate}%`,
                    backgroundColor: '#16a34a'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div style={styles.dashboardGrid}>
            <div style={styles.mainSection}>
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Upcoming Tasks</h2>
                  <NavLink 
                    to="/tasks" 
                    style={styles.viewAllLink}
                    onMouseEnter={(e) => e.target.style.color = '#0a0a0a'}
                    onMouseLeave={(e) => e.target.style.color = '#737373'}
                  >
                    View all
                  </NavLink>
                </div>
                <div style={styles.taskList}>
                  {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                    <div 
                      key={task._id} 
                      style={styles.taskItem}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.transform = 'translateX(2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fafafa';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={styles.taskLeft}>
                        <div 
                          style={{
                            ...styles.taskStatus,
                            backgroundColor: getTaskStatusColor(task.status)
                          }}
                        />
                        <div style={styles.taskTitle}>{task.title}</div>
                      </div>
                      <div style={styles.taskRight}>
                        {task.priority && (
                          <div 
                            style={{
                              ...styles.taskPriority,
                              ...getPriorityStyles(task.priority)
                            }}
                          >
                            {task.priority}
                          </div>
                        )}
                        <div style={styles.taskDate}>
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div style={styles.emptyState}>
                      <p>No upcoming tasks</p>
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>
                        All tasks are completed or no tasks have been created yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.sideSection}>
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Status Overview</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#737373' }}>High Priority</span>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>{summaryStats.highPriority}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#737373' }}>In Progress</span>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>{summaryStats.inProgress}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#737373' }}>To Do</span>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>{summaryStats.todo}</span>
                  </div>
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid #e5e5e5'
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#737373' }}>Workspaces</span>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>{workspaces.length}</span>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Performance</h2>
                </div>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '48px', fontWeight: '700', color: '#0a0a0a', marginBottom: '8px' }}>
                    {summaryStats.completionRate}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#737373', marginBottom: '16px' }}>
                    Overall task completion
                  </div>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${summaryStats.completionRate}%`
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: '#737373', marginTop: '8px' }}>
                    {summaryStats.completed} completed • {summaryStats.total - summaryStats.completed} remaining
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
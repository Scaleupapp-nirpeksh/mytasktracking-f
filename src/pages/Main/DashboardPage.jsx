import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../state/contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import { getAllWorkspaces, getAllTasks } from '../../services/apiService';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

    return {
      total: tasks.length,
      dueToday,
      overdue,
      completed,
      inProgress,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
    };
  }, [tasks]);

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
      
      @keyframes countUp {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const styles = {
    layoutContainer: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      backgroundColor: '#f8fafc',
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
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      transition: 'all 0.2s ease',
      zIndex: 10,
    },
    
    sidebarLogo: {
      fontSize: sidebarCollapsed ? '20px' : '28px',
      fontWeight: '900',
      margin: '0 0 32px 0',
      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
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
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    
    workspaceIcon: {
      fontSize: '18px',
      minWidth: '18px',
    },
    
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
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
      background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
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
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
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
    
    dashboardMain: {
      flex: 1,
      padding: '32px',
      overflow: 'auto',
    },
    
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    
    summaryCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      animation: 'slideIn 0.6s ease-out',
    },
    
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#475569',
      margin: 0,
    },
    
    cardIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
    },
    
    statNumber: {
      fontSize: '36px',
      fontWeight: '900',
      color: '#1e293b',
      margin: '8px 0 4px 0',
      animation: 'countUp 0.8s ease-out',
    },
    
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
    },
    
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '12px',
    },
    
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 1s ease-out',
    },
    
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
      color: '#64748b',
    },
    
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #3b82f6',
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
    },
  };

  const cardVariants = {
    total: {
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      progressColor: '#3b82f6',
    },
    dueToday: {
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      progressColor: '#f59e0b',
    },
    overdue: {
      iconBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      progressColor: '#ef4444',
    },
    completed: {
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      progressColor: '#10b981',
    },
    inProgress: {
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      progressColor: '#8b5cf6',
    },
  };

  const renderSummaryCard = (type, title, value, icon, showProgress = false, progressValue = 0) => (
    <div
      key={type}
      style={styles.summaryCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <div
          style={{
            ...styles.cardIcon,
            background: cardVariants[type]?.iconBg || cardVariants.total.iconBg,
            color: 'white',
          }}
        >
          {icon}
        </div>
      </div>
      <div style={styles.statNumber}>{value}</div>
      <div style={styles.statLabel}>{title}</div>
      {showProgress && (
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progressValue}%`,
              background: cardVariants[type]?.progressColor || cardVariants.total.progressColor,
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <button
          style={styles.sidebarToggle}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
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
                <span style={styles.workspaceIcon}>📅</span>
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
          <h2 style={styles.headerTitle}>Dashboard</h2>
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

        <main style={styles.dashboardMain}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p>Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div style={styles.errorContainer}>{error}</div>
          ) : (
            <div style={styles.dashboardGrid}>
              {renderSummaryCard('total', 'Total Tasks', summaryStats.total, '📊')}
              {renderSummaryCard('dueToday', 'Due Today', summaryStats.dueToday, '📅')}
              {renderSummaryCard('overdue', 'Overdue Tasks', summaryStats.overdue, '⚠️')}
              {renderSummaryCard('completed', 'Completed', summaryStats.completed, '✅', true, summaryStats.completionRate)}
              {renderSummaryCard('inProgress', 'In Progress', summaryStats.inProgress, '🔄')}
              <div
                style={{
                  ...styles.summaryCard,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Completion Rate</h3>
                  <div
                    style={{
                      ...styles.cardIcon,
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      color: 'white',
                    }}
                  >
                    📈
                  </div>
                </div>
                <div style={styles.statNumber}>{summaryStats.completionRate}%</div>
                <div style={styles.statLabel}>Overall Progress</div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${summaryStats.completionRate}%`,
                      background: 'linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
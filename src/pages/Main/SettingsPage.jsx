import React, { useState, useEffect } from 'react';
import { getGoogleAuthUrl } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { NavLink } from 'react-router-dom';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      
      @keyframes spin {
        to { transform: rotate(360deg); }
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

  const handleConnectGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getGoogleAuthUrl();
      window.location.href = response.data.data.authUrl;
    } catch (err) {
      setError('Failed to connect to Google. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

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
    
    settingsPageMain: {
      padding: '32px',
      flex: 1,
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%',
    },
    
    settingsCard: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
      marginBottom: '24px',
      animation: 'slideInUp 0.5s ease-out',
    },
    
    cardTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0 0 24px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      paddingBottom: '16px',
      borderBottom: '2px solid #e2e8f0',
    },
    
    cardDescription: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0 0 32px 0',
      lineHeight: '1.6',
    },
    
    integrationItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '20px',
      transition: 'all 0.2s ease',
    },
    
    integrationInfo: {
      flex: 1,
      marginRight: '20px',
    },
    
    integrationTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    integrationDescription: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.5',
    },
    
    connectButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    },
    
    connectButtonDisabled: {
      background: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    
    comingSoonItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      backgroundColor: '#f1f5f9',
      borderRadius: '16px',
      border: '2px dashed #cbd5e1',
      marginBottom: '20px',
      opacity: 0.7,
    },
    
    comingSoonBadge: {
      padding: '6px 12px',
      backgroundColor: '#fbbf24',
      color: '#92400e',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
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
      marginTop: '16px',
    },
    
    accountInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '24px',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '32px',
    },
    
    avatar: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: '#667eea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: '700',
      color: 'white',
    },
    
    accountDetails: {
      flex: 1,
    },
    
    accountName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 4px 0',
    },
    
    accountEmail: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
    },
  };

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
          <h2 style={styles.headerTitle}>
            <span>⚙️</span>
            Settings
          </h2>
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

        <main style={styles.settingsPageMain}>
          {/* Account Information */}
          <div style={styles.settingsCard}>
            <h3 style={styles.cardTitle}>
              <span>👤</span>
              Account Information
            </h3>
            
            <div style={styles.accountInfo}>
              <div style={styles.avatar}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div style={styles.accountDetails}>
                <h4 style={styles.accountName}>{user?.name || 'User'}</h4>
                <p style={styles.accountEmail}>{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Integrations - What Actually Works */}
          <div style={styles.settingsCard}>
            <h3 style={styles.cardTitle}>
              <span>🔗</span>
              Integrations
            </h3>
            <p style={styles.cardDescription}>
              Connect your favorite tools and services to enhance your productivity.
            </p>

            {/* Google Calendar - WORKING */}
            <div style={styles.integrationItem}>
              <div style={styles.integrationInfo}>
                <h4 style={styles.integrationTitle}>
                  <span>📅</span>
                  Google Calendar
                </h4>
                <p style={styles.integrationDescription}>
                  Sync your tasks with due dates directly to your Google Calendar and get reminders across all your devices.
                </p>
              </div>
              <button
                style={{
                  ...styles.connectButton,
                  ...(loading ? styles.connectButtonDisabled : {})
                }}
                onClick={handleConnectGoogle}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    Connect
                  </>
                )}
              </button>
            </div>

            {/* Coming Soon Items */}
            <div style={styles.comingSoonItem}>
              <div style={styles.integrationInfo}>
                <h4 style={styles.integrationTitle}>
                  <span>💬</span>
                  Slack Integration
                </h4>
                <p style={styles.integrationDescription}>
                  Get task notifications and updates directly in your Slack workspace.
                </p>
              </div>
              <div style={styles.comingSoonBadge}>
                Coming Soon
              </div>
            </div>

            <div style={styles.comingSoonItem}>
              <div style={styles.integrationInfo}>
                <h4 style={styles.integrationTitle}>
                  <span>📧</span>
                  Microsoft Outlook
                </h4>
                <p style={styles.integrationDescription}>
                  Sync tasks and meetings with your Outlook calendar and email.
                </p>
              </div>
              <div style={styles.comingSoonBadge}>
                Coming Soon
              </div>
            </div>

            {error && (
              <div style={styles.errorMessage}>
                <span>❌</span>
                {error}
              </div>
            )}
          </div>

          {/* Coming Soon Sections */}
          <div style={styles.settingsCard}>
            <h3 style={styles.cardTitle}>
              <span>🔔</span>
              Notification Preferences
            </h3>
            <p style={styles.cardDescription}>
              Control how and when you receive notifications about your tasks and meetings.
            </p>
            
            <div style={styles.comingSoonItem}>
              <div style={styles.integrationInfo}>
                <h4 style={styles.integrationTitle}>
                  <span>📧</span>
                  Email Notifications & Task Reminders
                </h4>
                <p style={styles.integrationDescription}>
                  Configure email alerts, weekly reports, and task due date reminders.
                </p>
              </div>
              <div style={styles.comingSoonBadge}>
                Coming Soon
              </div>
            </div>
          </div>

          <div style={styles.settingsCard}>
            <h3 style={styles.cardTitle}>
              <span>🔒</span>
              Security & Privacy
            </h3>
            <p style={styles.cardDescription}>
              Manage your account security and privacy settings.
            </p>
            
            <div style={styles.comingSoonItem}>
              <div style={styles.integrationInfo}>
                <h4 style={styles.integrationTitle}>
                  <span>🔐</span>
                  Password & Two-Factor Authentication
                </h4>
                <p style={styles.integrationDescription}>
                  Change your password and enable two-factor authentication for enhanced security.
                </p>
              </div>
              <div style={styles.comingSoonBadge}>
                Coming Soon
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
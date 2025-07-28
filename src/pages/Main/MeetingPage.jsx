import React, { useState, useEffect } from 'react';
import { startMeeting, getAllMeetings } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import MeetingDetailModal from '../../components/specific/MeetingDetailModal';
import ActiveMeetingModal from '../../components/specific/ActiveMeetingModal';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const MeetingPage = () => {
  const { user, logout } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  
  // Modal states
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showMeetingDetail, setShowMeetingDetail] = useState(false);
  const [showActiveMeeting, setShowActiveMeeting] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);

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
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getAllMeetings();
        setMeetings(response.data.data.meetings);
      } catch (err) {
        setError('Failed to load meeting history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleStartMeeting = async () => {
    setIsStarting(true);
    setError('');
    try {
      const response = await startMeeting();
      const newMeeting = response.data.data.meeting;
      setMeetings(prev => [newMeeting, ...prev]);
      
      // Open the active meeting modal
      setActiveMeeting(newMeeting);
      setShowActiveMeeting(true);
    } catch (err) {
      setError('Failed to start a new meeting. Make sure you have key tasks in your "Company" workspace.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetail(true);
  };

  const handleMeetingUpdated = (updatedMeeting) => {
    setMeetings(prev => 
      prev.map(meeting => 
        meeting._id === updatedMeeting._id ? updatedMeeting : meeting
      )
    );
    setSelectedMeeting(updatedMeeting);
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
    
    meetingPageMain: {
      padding: '32px',
      flex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    },
    
    meetingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
    },
    
    meetingHeaderContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    
    meetingIcon: {
      fontSize: '48px',
      animation: 'float 3s ease-in-out infinite',
      filter: 'drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3))',
    },
    
    meetingHeaderText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    
    meetingTitle: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
    },
    
    meetingSubtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
      fontWeight: '500',
    },
    
    startMeetingButton: {
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    startMeetingButtonDisabled: {
      background: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    meetingsList: {
      display: 'grid',
      gap: '20px',
    },
    
    meetingCard: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      animation: 'slideInUp 0.5s ease-out',
      position: 'relative',
      overflow: 'hidden',
    },
    
    meetingCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
    },
    
    meetingCardTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    meetingDate: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
    },
    
    meetingStats: {
      display: 'flex',
      gap: '24px',
      marginBottom: '16px',
    },
    
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
    },
    
    statNumber: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1e293b',
    },
    
    statLabel: {
      fontSize: '12px',
      color: '#64748b',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    meetingPreview: {
      fontSize: '16px',
      color: '#374151',
      lineHeight: '1.5',
      margin: 0,
    },
    
    noMeetings: {
      textAlign: 'center',
      padding: '80px 32px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '2px dashed #e2e8f0',
    },
    
    noMeetingsIcon: {
      fontSize: '64px',
      marginBottom: '24px',
      opacity: 0.6,
    },
    
    noMeetingsTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 12px 0',
    },
    
    noMeetingsText: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.5',
    },
    
    errorContainer: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '20px 24px',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      fontSize: '16px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 32px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
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
            <span>🤝</span>
            Manager 1-on-1s
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

        <main style={styles.meetingPageMain}>
          {/* Meeting Header with Start Button */}
          <div style={styles.meetingHeader}>
            <div style={styles.meetingHeaderContent}>
              <span style={styles.meetingIcon}>🎯</span>
              <div style={styles.meetingHeaderText}>
                <h3 style={styles.meetingTitle}>Meeting Center</h3>
                <p style={styles.meetingSubtitle}>
                  Track key tasks and conduct productive 1-on-1 meetings
                </p>
              </div>
            </div>
            <button 
              onClick={handleStartMeeting} 
              disabled={isStarting}
              style={{
                ...styles.startMeetingButton,
                ...(isStarting ? styles.startMeetingButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!isStarting) {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isStarting) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {isStarting ? (
                <>
                  <span style={styles.spinner}></span>
                  Starting Meeting...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '20px' }}>🚀</span>
                  Start New Meeting
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorContainer}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading meeting history...</p>
            </div>
          )}

          {/* Meetings List */}
          {!loading && !error && (
            <div style={styles.meetingsList}>
              {meetings.length > 0 ? (
                meetings.map((meeting, index) => (
                  <div 
                    key={meeting._id} 
                    style={{
                      ...styles.meetingCard,
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => handleMeetingClick(meeting)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    <div style={styles.meetingCardHeader}>
                      <h4 style={styles.meetingCardTitle}>
                        <span>📋</span>
                        Meeting Session
                      </h4>
                      <span style={styles.meetingDate}>
                        {formatDate(meeting.meetingDate)}
                      </span>
                    </div>
                    
                    <div style={styles.meetingStats}>
                      <div style={styles.statItem}>
                        <span style={styles.statNumber}>{meeting.taskSnapshots.length}</span>
                        <span style={styles.statLabel}>Key Tasks</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statNumber}>
                          {meeting.notes ? meeting.notes.length : 0}
                        </span>
                        <span style={styles.statLabel}>Notes (chars)</span>
                      </div>
                    </div>
                    
                    <p style={styles.meetingPreview}>
                      {meeting.notes 
                        ? meeting.notes.substring(0, 120) + (meeting.notes.length > 120 ? '...' : '')
                        : 'Click to view meeting details and add notes'
                      }
                    </p>
                  </div>
                ))
              ) : (
                <div style={styles.noMeetings}>
                  <div style={styles.noMeetingsIcon}>🤝</div>
                  <h3 style={styles.noMeetingsTitle}>No meetings yet</h3>
                  <p style={styles.noMeetingsText}>
                    Start your first meeting to create a snapshot of your key tasks and begin tracking your progress.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showMeetingDetail && selectedMeeting && (
        <MeetingDetailModal 
          meeting={selectedMeeting}
          onClose={() => {
            setShowMeetingDetail(false);
            setSelectedMeeting(null);
          }}
          onMeetingUpdated={handleMeetingUpdated}
        />
      )}

      {showActiveMeeting && activeMeeting && (
        <ActiveMeetingModal 
          meeting={activeMeeting}
          onClose={() => {
            setShowActiveMeeting(false);
            setActiveMeeting(null);
          }}
          onMeetingUpdated={handleMeetingUpdated}
        />
      )}
    </div>
  );
};

export default MeetingPage;
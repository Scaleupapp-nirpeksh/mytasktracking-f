//src/pages/Main/MeetingPage.jsx

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Modal states
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showMeetingDetail, setShowMeetingDetail] = useState(false);
  const [showActiveMeeting, setShowActiveMeeting] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .fade-in-up {
        animation: fadeInUp 0.3s ease-out;
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

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

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

  const UsersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2065 16.6977C21.6975 16.0413 20.9999 15.5787 20.2 15.3687" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3.36875C16.8003 3.57864 17.4985 4.04126 18.0078 4.69776C18.5171 5.35425 18.8018 6.16479 18.8018 7.00063C18.8018 7.83646 18.5171 8.647 18.0078 9.30349C17.4985 9.95999 16.8003 10.4226 16 10.6325" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
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

  const FileTextIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    
    pageContent: {
      flex: 1,
      padding: '32px',
      backgroundColor: '#fafafa',
      overflow: 'auto',
    },
    
    headerSection: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    
    headerIcon: {
      width: '56px',
      height: '56px',
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#525252',
      flexShrink: 0,
    },
    
    headerText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    
    headerTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0a0a0a',
      margin: 0,
    },
    
    headerSubtitle: {
      fontSize: '16px',
      color: '#737373',
      margin: 0,
      lineHeight: 1.5,
    },
    
    startMeetingButton: {
      padding: '12px 24px',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minHeight: '48px',
    },
    
    startMeetingButtonDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#a3a3a3',
      cursor: 'not-allowed',
    },
    
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    
    meetingsSection: {
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
    
    meetingsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    
    meetingCard: {
      backgroundColor: '#fafafa',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    meetingCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
    },
    
    meetingCardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    meetingDate: {
      fontSize: '12px',
      color: '#737373',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    
    meetingStats: {
      display: 'flex',
      gap: '24px',
      marginBottom: '12px',
    },
    
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    statNumber: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
    },
    
    statText: {
      fontSize: '12px',
      color: '#737373',
      fontWeight: '500',
    },
    
    meetingPreview: {
      fontSize: '14px',
      color: '#525252',
      lineHeight: 1.5,
      margin: 0,
    },
    
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#737373',
    },
    
    emptyIcon: {
      width: '64px',
      height: '64px',
      backgroundColor: '#f5f5f5',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      color: '#a3a3a3',
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
    
    errorContainer: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '16px 20px',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      textAlign: 'center',
      fontWeight: '500',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      color: '#737373',
    },
    
    loadingText: {
      marginTop: '16px',
      fontSize: '16px',
      fontWeight: '500',
    },
  };

  const meetingStats = {
    total: meetings.length,
    thisWeek: meetings.filter(m => {
      const meetingDate = new Date(m.meetingDate);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return meetingDate >= weekAgo;
    }).length,
    avgTasks: meetings.length > 0 
      ? Math.round(meetings.reduce((sum, m) => sum + m.taskSnapshots.length, 0) / meetings.length)
      : 0,
  };

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
              <UsersIcon />
              <span style={styles.navItemText}>Meetings</span>
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
            <h1 style={styles.pageTitle}>Meetings</h1>
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

        {/* Page Content */}
        <div style={styles.pageContent}>
          {/* Header Section */}
          <div style={styles.headerSection}>
            <div style={styles.headerContent}>
              <div style={styles.headerIcon}>
                <UsersIcon />
              </div>
              <div style={styles.headerText}>
                <h2 style={styles.headerTitle}>Meeting Center</h2>
                <p style={styles.headerSubtitle}>
                  Track key tasks and conduct productive 1-on-1 meetings with your team
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
                  e.target.style.backgroundColor = '#262626';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isStarting) {
                  e.target.style.backgroundColor = '#0a0a0a';
                  e.target.style.transform = 'translateY(0)';
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
                  <PlayIcon />
                  Start New Meeting
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorContainer}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}

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
                <div style={styles.statLabel}>Total Meetings</div>
                <div style={styles.statIcon}>
                  <UsersIcon />
                </div>
              </div>
              <div style={styles.statValue}>{meetingStats.total}</div>
              <div style={styles.statDescription}>All time sessions</div>
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
                <div style={styles.statLabel}>This Week</div>
                <div style={styles.statIcon}>
                  <CalendarIcon />
                </div>
              </div>
              <div style={styles.statValue}>{meetingStats.thisWeek}</div>
              <div style={styles.statDescription}>Recent sessions</div>
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
                <div style={styles.statLabel}>Avg Tasks</div>
                <div style={styles.statIcon}>
                  <TaskIcon />
                </div>
              </div>
              <div style={styles.statValue}>{meetingStats.avgTasks}</div>
              <div style={styles.statDescription}>Per meeting</div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={styles.loadingContainer}>
              <LoadingIcon />
              <p style={styles.loadingText}>Loading meeting history...</p>
            </div>
          )}

          {/* Meetings Section */}
          {!loading && (
            <div style={styles.meetingsSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Meeting History</h3>
              </div>
              
              <div style={styles.meetingsList}>
                {meetings.length > 0 ? (
                  meetings.map((meeting) => (
                    <div 
                      key={meeting._id} 
                      style={styles.meetingCard}
                      className="fade-in-up"
                      onClick={() => handleMeetingClick(meeting)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.borderColor = '#d4d4d4';
                        e.target.style.transform = 'translateX(2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fafafa';
                        e.target.style.borderColor = '#e5e5e5';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={styles.meetingCardHeader}>
                        <h4 style={styles.meetingCardTitle}>
                          <FileTextIcon />
                          Meeting Session
                        </h4>
                        <span style={styles.meetingDate}>
                          <ClockIcon />
                          {formatDate(meeting.meetingDate)}
                        </span>
                      </div>
                      
                      <div style={styles.meetingStats}>
                        <div style={styles.statItem}>
                          <span style={styles.statNumber}>{meeting.taskSnapshots.length}</span>
                          <span style={styles.statText}>key tasks</span>
                        </div>
                        <div style={styles.statItem}>
                          <span style={styles.statNumber}>
                            {meeting.notes ? meeting.notes.length : 0}
                          </span>
                          <span style={styles.statText}>characters</span>
                        </div>
                      </div>
                      
                      <p style={styles.meetingPreview}>
                        {meeting.notes 
                          ? meeting.notes.substring(0, 150) + (meeting.notes.length > 150 ? '...' : '')
                          : 'Click to view meeting details and add notes'
                        }
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                      <UsersIcon />
                    </div>
                    <h3 style={styles.emptyTitle}>No meetings yet</h3>
                    <p style={styles.emptyText}>
                      Start your first meeting to create a snapshot of your key tasks and begin tracking your progress with your team.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

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
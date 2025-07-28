// src/pages/Main/MeetingPage.jsx

import React, { useState, useEffect } from 'react';
import { startMeeting, getAllMeetings } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import './MeetingPage.css'; // We will create this CSS file next

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
      setMeetings(prev => [response.data.data.meeting, ...prev]);
      // In a real app, you might navigate to a live meeting view
      alert('New meeting started! You can now view it in your history.');
    } catch (err) {
      setError('Failed to start a new meeting. Make sure you have key tasks in your "Company" workspace.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-logo">Keystone</h1>
        <nav className="workspace-nav">
           <p className="nav-title">Navigation</p>
           <ul>
             <li><NavLink to="/" className="workspace-item" end>Dashboard</NavLink></li>
             <li><NavLink to="/tasks" className="workspace-item">Tasks</NavLink></li>
             <li><NavLink to="/meetings" className="workspace-item">Meetings</NavLink></li>
             <li><NavLink to="/settings" className="workspace-item">Settings</NavLink></li>
           </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h2>Manager 1-on-1s</h2>
          <div className="user-menu">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-button">
              Log Out
            </button>
          </div>
        </header>

        <main className="meeting-page-main">
          <div className="meeting-header">
            <h3>Meeting History</h3>
            <button onClick={handleStartMeeting} className="start-meeting-button" disabled={isStarting}>
              {isStarting ? 'Starting...' : '+ Start New Meeting'}
            </button>
          </div>
          {error && <p className="error-container">{error}</p>}

          {loading && <div className="loading-container">Loading history...</div>}
          
          {!loading && !error && (
            <div className="meetings-list">
              {meetings.length > 0 ? (
                meetings.map(meeting => (
                  <div key={meeting._id} className="meeting-item">
                    <h4>Meeting - {formatDate(meeting.meetingDate)}</h4>
                    <p><strong>{meeting.taskSnapshots.length}</strong> key tasks reviewed.</p>
                    {/* In a real app, clicking this would open a detail view */}
                  </div>
                ))
              ) : (
                <p>No meeting history found. Start a new meeting to create a snapshot of your key tasks.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MeetingPage;

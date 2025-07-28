// src/pages/Main/SettingsPage.jsx

import React, { useState } from 'react';
import { getGoogleAuthUrl } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import './SettingsPage.css'; // We will create this CSS file next

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnectGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getGoogleAuthUrl();
      // Redirect the user to the Google consent screen
      window.location.href = response.data.data.authUrl;
    } catch (err) {
      setError('Failed to connect to Google. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-logo">Keystone</h1>
        <nav className="workspace-nav">
           <p className="nav-title">Workspaces</p>
           <ul>
             {/* In a real app, you'd fetch and map workspaces here */}
             <li><NavLink to="/workspaces/personal/tasks" className="workspace-item">Personal</NavLink></li>
             <li><NavLink to="/workspaces/business/tasks" className="workspace-item">Business</NavLink></li>
           </ul>
           <p className="nav-title" style={{marginTop: '2rem'}}>Views</p>
           <ul>
             <li><NavLink to="/tasks" className="workspace-item" end>All Tasks</NavLink></li>
             <li><NavLink to="/settings" className="workspace-item">Settings</NavLink></li>
           </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h2>Settings</h2>
          <div className="user-menu">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-button">
              Log Out
            </button>
          </div>
        </header>

        <main className="settings-page-main">
          <div className="settings-card">
            <h3>Integrations</h3>
            <div className="integration-item">
              <div className="integration-info">
                <h4>Google Calendar</h4>
                <p>Sync your tasks with due dates directly to your Google Calendar.</p>
              </div>
              <button 
                className="connect-button" 
                onClick={handleConnectGoogle} 
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;

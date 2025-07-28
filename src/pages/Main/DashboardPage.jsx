// src/pages/Main/DashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../state/contexts/AuthContext';
import { getAllWorkspaces, getAllTasks } from '../../services/apiService';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch workspaces and tasks in parallel for better performance
        const [workspacesResponse, tasksResponse] = await Promise.all([
          getAllWorkspaces(),
          getAllTasks(),
        ]);

        const fetchedWorkspaces = workspacesResponse.data.data.workspaces;
        setWorkspaces(fetchedWorkspaces);
        setTasks(tasksResponse.data.data.tasks);

        // Set the first workspace as active by default
        if (fetchedWorkspaces.length > 0) {
          setActiveWorkspace(fetchedWorkspaces[0]);
        }
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use useMemo to avoid re-calculating on every render
  const filteredTasks = useMemo(() => {
    if (!activeWorkspace) return [];
    return tasks.filter((task) => task.workspace === activeWorkspace._id);
  }, [activeWorkspace, tasks]);

  const summaryStats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    const dueToday = filteredTasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= todayStart && dueDate <= todayEnd;
    }).length;

    const overdue = filteredTasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < todayStart && task.status !== 'Done'
    ).length;

    return {
      total: filteredTasks.length,
      dueToday,
      overdue,
    };
  }, [filteredTasks]);

  if (loading) {
    return <div className="loading-container">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-logo">Keystone</h1>
        <nav className="workspace-nav">
          <p className="nav-title">Workspaces</p>
          <ul>
            {workspaces.map((ws) => (
              <li
                key={ws._id}
                className={`workspace-item ${activeWorkspace?._id === ws._id ? 'active' : ''}`}
                onClick={() => setActiveWorkspace(ws)}
              >
                {ws.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h2>{activeWorkspace?.name || 'Dashboard'}</h2>
          <div className="user-menu">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-button">
              Log Out
            </button>
          </div>
        </header>

        <main className="dashboard-grid">
          <div className="summary-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{summaryStats.total}</p>
          </div>
          <div className="summary-card">
            <h3>Due Today</h3>
            <p className="stat-number">{summaryStats.dueToday}</p>
          </div>
          <div className="summary-card overdue-card">
            <h3>Overdue</h3>
            <p className="stat-number">{summaryStats.overdue}</p>
          </div>
        </main>
        
        <div className="quick-links">
            <Link to="/tasks" className="quick-link-button">View All Tasks</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

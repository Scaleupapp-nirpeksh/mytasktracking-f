// src/pages/Main/DashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../state/contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import { getAllWorkspaces, getAllTasks } from '../../services/apiService';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    return {
      total: tasks.length,
      dueToday,
      overdue,
    };
  }, [tasks]);

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-logo">Keystone</h1>
        <nav className="workspace-nav">
          <p className="nav-title">Workspaces</p>
          <ul>
            {workspaces.map((ws) => (
              <li key={ws._id}>
                <NavLink
                  to={`/workspaces/${ws._id}/tasks`}
                  className="workspace-item"
                >
                  {ws.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <p className="nav-title" style={{marginTop: '2rem'}}>Views</p>
           <ul>
             <li>
                <NavLink to="/tasks" className="workspace-item">All Tasks</NavLink>
             </li>
             <li>
                <NavLink to="/meetings" className="workspace-item">Meetings</NavLink>
             </li>
             <li>
                <NavLink to="/settings" className="workspace-item">Settings</NavLink>
             </li>
           </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h2>Dashboard Overview</h2>
          <div className="user-menu">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-button">
              Log Out
            </button>
          </div>
        </header>

        <main className="dashboard-grid">
          {loading ? (
            <p>Loading stats...</p>
          ) : error ? (
            <p className="error-container">{error}</p>
          ) : (
            <>
              <div className="summary-card">
                <h3>Total Tasks (All)</h3>
                <p className="stat-number">{summaryStats.total}</p>
              </div>
              <div className="summary-card">
                <h3>Due Today (All)</h3>
                <p className="stat-number">{summaryStats.dueToday}</p>
              </div>
              <div className="summary-card overdue-card">
                <h3>Overdue (All)</h3>
                <p className="stat-number">{summaryStats.overdue}</p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

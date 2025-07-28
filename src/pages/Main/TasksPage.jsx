// src/pages/Main/TasksPage.jsx

import React, { useState, useEffect } from 'react';
import { getAllTasks, getAllWorkspaces } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { Link } from 'react-router-dom';
import AddTaskModal from '../../components/specific/AddTaskModal';
import TaskDetailModal from '../../components/specific/TaskDetailModal';
import EditTaskModal from '../../components/specific/EditTaskModal';
import ConfirmDeleteModal from '../../components/specific/ConfirmDeleteModal'; // <-- IMPORT DELETE MODAL
import './TasksPage.css';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null); // <-- State for deletion confirmation
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [tasksResponse, workspacesResponse] = await Promise.all([
          getAllTasks(),
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
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
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
    setTaskToDelete(selectedTask); // Set the task to be deleted
    setSelectedTask(null); // Close the detail modal
  };

  const getWorkspaceName = (workspaceId) => {
    const workspace = workspaces.find(ws => ws._id === workspaceId);
    return workspace ? workspace.name : 'Unknown';
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-logo">Keystone</h1>
        <nav className="workspace-nav">
          <p className="nav-title">Navigation</p>
          <ul>
            <li className="workspace-item">
              <Link to="/" className="nav-link">Dashboard</Link>
            </li>
            <li className="workspace-item active">
              <Link to="/tasks" className="nav-link">Tasks</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h2>All Tasks</h2>
          <div className="user-menu">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-button">
              Log Out
            </button>
          </div>
        </header>

        <main className="tasks-page-main">
          <div className="tasks-header">
            <h3>Your To-Do List</h3>
            <button onClick={() => setIsAddModalOpen(true)} className="add-task-button">
              + New Task
            </button>
          </div>
          
          {loading && <div className="loading-container">Loading tasks...</div>}
          {error && <div className="error-container">{error}</div>}
          
          {!loading && !error && (
            <div className="tasks-list">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="task-item" onClick={() => setSelectedTask(task)}>
                    <span className="task-title">{task.title}</span>
                    <span className={`task-priority ${task.priority?.toLowerCase()}`}>{task.priority}</span>
                    <span className="task-status">{task.status}</span>
                  </div>
                ))
              ) : (
                <p>You have no tasks. Create one to get started!</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Render Modals */}
      {isAddModalOpen && (
        <AddTaskModal
          workspaces={workspaces}
          onClose={() => setIsAddModalOpen(false)}
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

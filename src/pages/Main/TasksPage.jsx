// src/pages/Main/TasksPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { getAllTasks, getAllWorkspaces } from '../../services/apiService';
import { useAuth } from '../../state/contexts/AuthContext';
import { Link, useParams, NavLink } from 'react-router-dom';
import AddTaskModal from '../../components/specific/AddTaskModal';
import TaskDetailModal from '../../components/specific/TaskDetailModal';
import EditTaskModal from '../../components/specific/EditTaskModal';
import ConfirmDeleteModal from '../../components/specific/ConfirmDeleteModal';
import MagicInput from '../../components/specific/MagicInput';
import './TasksPage.css';

const TasksPage = () => {
  const { workspaceId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [prefilledData, setPrefilledData] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [tasksResponse, workspacesResponse] = await Promise.all([
          getAllTasks(workspaceId),
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
  }, [workspaceId]);

  const currentWorkspace = useMemo(() => {
    return workspaces.find(ws => ws._id === workspaceId);
  }, [workspaces, workspaceId]);

  const handleTaskAdded = (newTask) => {
    if (!workspaceId || newTask.workspace === workspaceId) {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }
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
    setTaskToDelete(selectedTask);
    setSelectedTask(null);
  };

  const handleParse = (parsedData) => {
    setPrefilledData(parsedData);
    setIsAddModalOpen(true);
  };
  
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setPrefilledData(null);
  }

  const getWorkspaceName = (wsId) => {
    const workspace = workspaces.find(ws => ws._id === wsId);
    return workspace ? workspace.name : 'Unknown';
  };

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
                 <NavLink to={`/workspaces/${ws._id}/tasks`} className="workspace-item">
                   {ws.name}
                 </NavLink>
               </li>
             ))}
           </ul>
           <p className="nav-title" style={{marginTop: '2rem'}}>Views</p>
           <ul>
             <li>
                <NavLink to="/tasks" className="workspace-item" end>All Tasks</NavLink>
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
          <h2>{currentWorkspace?.name || 'All Tasks'}</h2>
          <div className="user-menu">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-button">
              Log Out
            </button>
          </div>
        </header>

        <main className="tasks-page-main">
          <MagicInput onParse={handleParse} />

          <div className="tasks-header">
            <h3>{currentWorkspace?.name || 'All'} Tasks</h3>
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
                    <div className="task-item-title-container">
                      {task.isKeyTask && <span className="key-task-list-indicator">★</span>}
                      <span className="task-title">{task.title}</span>
                    </div>
                    <div className="task-item-details">
                      {!workspaceId && <span className="task-workspace-badge">{getWorkspaceName(task.workspace)}</span>}
                      <span className={`task-priority ${task.priority?.toLowerCase()}`}>{task.priority}</span>
                      <span className="task-status">{task.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tasks found in this workspace. Create one to get started!</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Render Modals */}
      {isAddModalOpen && (
        <AddTaskModal
          workspaces={workspaces}
          initialData={prefilledData}
          onClose={closeAddModal}
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

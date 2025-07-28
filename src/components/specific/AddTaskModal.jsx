// src/components/specific/AddTaskModal.jsx

import React, { useState } from 'react';
import { createTask } from '../../services/apiService';
import './AddTaskModal.css';

const AddTaskModal = ({ workspaces, onClose, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workspace, setWorkspace] = useState(workspaces[0]?._id || '');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !workspace) {
      setError('Title and workspace are required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const taskData = {
        title,
        description,
        workspace,
        priority,
        dueDate: dueDate || null,
      };
      const response = await createTask(taskData);
      onTaskAdded(response.data.data.task); // Pass the new task back to the parent
      onClose(); // Close the modal on success
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Task</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finalize Q3 report"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
            ></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="workspace">Workspace</label>
              <select
                id="workspace"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                required
              >
                {workspaces.map((ws) => (
                  <option key={ws._id} value={ws._id}>{ws.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date (Optional)</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-footer">
            <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;

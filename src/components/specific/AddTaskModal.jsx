// src/components/specific/AddTaskModal.jsx

import React, { useState, useEffect } from 'react';
import { createTask } from '../../services/apiService';
import './AddTaskModal.css';

const AddTaskModal = ({ workspaces, initialData, onClose, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workspace, setWorkspace] = useState(workspaces[0]?._id || '');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  
  // --- State for Recurring Tasks ---
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [interval, setInterval] = useState(1);
  const [endDate, setEndDate] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      if (initialData.dueDate) {
        setDueDate(new Date(initialData.dueDate).toISOString().split('T')[0]);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !workspace) {
      setError('Title and workspace are required.');
      return;
    }
    if (isRecurring && !dueDate) {
      setError('A start date (Due Date) is required for recurring tasks.');
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

      // If recurring is enabled, add the recurring object to the payload
      if (isRecurring) {
        taskData.recurring = {
          frequency,
          interval: parseInt(interval, 10),
          nextDueDate: dueDate, // The first due date is the start date
          endDate: endDate || null,
        };
      }

      const response = await createTask(taskData);
      onTaskAdded(response.data.data.task);
      onClose();
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
          {/* ... other form groups ... */}
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
            <label htmlFor="dueDate">
              {isRecurring ? 'Start Date' : 'Due Date'} (Optional)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* --- Recurring Task Section --- */}
          <div className="form-group recurring-section">
            <div className="recurring-toggle">
              <input 
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <label htmlFor="isRecurring">Make this a recurring task</label>
            </div>

            {isRecurring && (
              <div className="recurring-options">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="frequency">Frequency</label>
                    <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value)}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="interval">Repeat Every</label>
                    <input 
                      type="number"
                      id="interval"
                      value={interval}
                      onChange={e => setInterval(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">End Date (Optional)</label>
                  <input 
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
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

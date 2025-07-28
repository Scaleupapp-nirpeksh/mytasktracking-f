// src/components/specific/EditTaskModal.jsx

import React, { useState, useEffect } from 'react';
import { updateTask } from '../../services/apiService';
import FileUpload from './FileUpload';
import './AddTaskModal.css';
import './EditTaskModal.css';

const EditTaskModal = ({ task, workspaces, onClose, onTaskUpdated }) => {
  // Use a local state for the task to manage attachments internally
  const [currentTask, setCurrentTask] = useState(task);

  // Form field states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [isKeyTask, setIsKeyTask] = useState(false);
  
  // Recurring task states
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [interval, setInterval] = useState(1);
  const [endDate, setEndDate] = useState('');

  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to populate the form whenever the task prop changes
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || '');
      setWorkspace(currentTask.workspace);
      setPriority(currentTask.priority);
      setStatus(currentTask.status);
      setIsKeyTask(currentTask.isKeyTask || false);
      setDueDate(currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : '');

      if (currentTask.recurring) {
        setIsRecurring(true);
        setFrequency(currentTask.recurring.frequency);
        setInterval(currentTask.recurring.interval);
        setEndDate(currentTask.recurring.endDate ? new Date(currentTask.recurring.endDate).toISOString().split('T')[0] : '');
      } else {
        setIsRecurring(false);
      }
    }
  }, [currentTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !workspace) {
      setError('Title and workspace are required.');
      return;
    }
    if (isRecurring && !dueDate) {
      setError('A start date is required for recurring tasks.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const updatedData = {
        title,
        description,
        workspace,
        priority,
        status,
        isKeyTask,
        dueDate: dueDate || null,
        recurring: isRecurring ? { 
          frequency, 
          interval: parseInt(interval, 10), 
          nextDueDate: dueDate, 
          endDate: endDate || null 
        } : null,
      };

      const response = await updateTask(currentTask._id, updatedData);
      onTaskUpdated(response.data.data.task);
      onClose();
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (updatedTaskWithAttachment) => {
    setCurrentTask(updatedTaskWithAttachment);
    onTaskUpdated(updatedTaskWithAttachment);
  };

  if (!currentTask) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-title">Task Title</label>
            <input type="text" id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea id="edit-description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-status">Status</label>
              <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="For Review">For Review</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-priority">Priority</label>
              <select id="edit-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="edit-dueDate">{isRecurring ? 'Start Date' : 'Due Date'}</label>
            <input type="date" id="edit-dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="key-task-toggle">
            <label htmlFor="keyTask">Mark as Key Task for Manager Reviews</label>
            <div className="toggle-switch">
              <input type="checkbox" id="keyTask" checked={isKeyTask} onChange={(e) => setIsKeyTask(e.target.checked)} />
              <span className="slider"></span>
            </div>
          </div>
          
          <div className="form-group recurring-section">
            <div className="recurring-toggle">
              <input type="checkbox" id="isRecurring-edit" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
              <label htmlFor="isRecurring-edit">Make this a recurring task</label>
            </div>
            {isRecurring && (
              <div className="recurring-options">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="frequency-edit">Frequency</label>
                    <select id="frequency-edit" value={frequency} onChange={e => setFrequency(e.target.value)}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="interval-edit">Repeat Every</label>
                    <input type="number" id="interval-edit" value={interval} onChange={e => setInterval(e.target.value)} min="1" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="endDate-edit">End Date (Optional)</label>
                  <input type="date" id="endDate-edit" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <FileUpload task={currentTask} onUploadComplete={handleUploadComplete} />

          {error && <p className="error-message">{error}</p>}
          <div className="modal-footer">
            <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;

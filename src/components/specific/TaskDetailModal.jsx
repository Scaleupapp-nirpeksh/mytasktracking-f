// src/components/specific/TaskDetailModal.jsx

import React from 'react';
import './TaskDetailModal.css';

const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const TaskDetailModal = ({ task, workspaceName, onClose, onEdit, onDelete }) => { // <-- Added onDelete prop
  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-detail" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="detail-title">{task.title}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <div className="detail-section">
            <h3 className="detail-section-title">Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value">{task.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority</span>
                <span className={`detail-value priority-badge ${task.priority?.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Due Date</span>
                <span className="detail-value">{formatDate(task.dueDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Workspace</span>
                <span className="detail-value">{workspaceName}</span>
              </div>
            </div>
          </div>

          {task.description && (
            <div className="detail-section">
              <h3 className="detail-section-title">Description</h3>
              <p className="detail-description">{task.description}</p>
            </div>
          )}

          <div className="detail-section">
            <h3 className="detail-section-title">Sub-tasks</h3>
            <p className="placeholder-text">Sub-task functionality coming soon.</p>
          </div>
          <div className="detail-section">
            <h3 className="detail-section-title">Attachments</h3>
            <p className="placeholder-text">Attachment viewing coming soon.</p>
          </div>

        </div>
        <div className="modal-footer-detail">
          <button type="button" className="button-danger-outline" onClick={onDelete}>Delete Task</button>
          <div className="footer-actions">
            <button type="button" className="button-secondary" onClick={onClose}>Close</button>
            <button type="button" className="button-primary" onClick={onEdit}>Edit Task</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

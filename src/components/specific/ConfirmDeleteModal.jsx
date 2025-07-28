// src/components/specific/ConfirmDeleteModal.jsx

import React from 'react';
import { deleteTask } from '../../services/apiService';
import './ConfirmDeleteModal.css'; // We will create this CSS file next

const ConfirmDeleteModal = ({ task, onClose, onTaskDeleted }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteTask(task._id);
      onTaskDeleted(task._id); // Pass the ID of the deleted task back
      onClose();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
      setLoading(false); // Stop loading on error
    }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirm Deletion</h2>
        </div>
        <div className="modal-body-confirm">
          <p>
            Are you sure you want to delete the task: <strong>"{task.title}"</strong>?
          </p>
          <p className="confirm-warning">This action cannot be undone.</p>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="modal-footer">
          <button type="button" className="button-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="button-danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

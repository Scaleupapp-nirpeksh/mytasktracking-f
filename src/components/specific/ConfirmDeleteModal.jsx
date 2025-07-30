import React, { useEffect } from 'react';
import { deleteTask } from '../../services/apiService';

const ConfirmDeleteModal = ({ task, onClose, onTaskDeleted }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Add CSS animations matching the design system
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteTask(task._id);
      onTaskDeleted(task._id);
      onClose();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  // Professional SVG Icons matching the design system
  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const AlertTriangleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.29 3.86L1.82 18C1.64466 18.3024 1.55611 18.6453 1.56331 18.9931C1.57051 19.3408 1.67325 19.6798 1.86037 19.9764C2.04749 20.273 2.31324 20.5157 2.6295 20.6777C2.94576 20.8396 3.29973 20.9148 3.65 20.895H20.35C20.7003 20.9148 21.0542 20.8396 21.3705 20.6777C21.6868 20.5157 21.9525 20.273 22.1396 19.9764C22.3268 19.6798 22.4295 19.3408 22.4367 18.9931C22.4439 18.6453 22.3553 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15447C12.6817 2.98582 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98582 11.0188 3.15447C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'overlayFadeIn 0.3s ease-out',
    },
    
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '480px',
      animation: 'modalSlideIn 0.4s ease-out',
      border: '1px solid #e5e5e5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
    },
    
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 32px',
      borderBottom: '1px solid #e5e5e5',
    },
    
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
    },
    
    warningIcon: {
      color: '#dc2626',
      flexShrink: 0,
    },
    
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: 0,
    },
    
    closeButton: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      backgroundColor: '#f5f5f5',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#737373',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    
    modalBody: {
      padding: '32px',
      animation: 'fadeInUp 0.5s ease-out',
    },
    
    confirmText: {
      fontSize: '16px',
      color: '#525252',
      margin: '0 0 16px 0',
      lineHeight: '1.5',
    },
    
    taskTitleContainer: {
      backgroundColor: '#fafafa',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '20px',
    },
    
    taskTitleLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#737373',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '4px',
      display: 'block',
    },
    
    taskTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: 0,
      wordBreak: 'break-word',
    },
    
    warningBox: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    
    warningBoxIcon: {
      color: '#dc2626',
      flexShrink: 0,
    },
    
    warningText: {
      fontSize: '14px',
      color: '#dc2626',
      fontWeight: '500',
      margin: 0,
    },
    
    errorMessage: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '16px',
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '20px 32px',
      borderTop: '1px solid #e5e5e5',
      backgroundColor: '#fafafa',
    },
    
    buttonSecondary: {
      padding: '10px 20px',
      backgroundColor: '#ffffff',
      color: '#525252',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    
    buttonSecondaryDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    
    buttonDanger: {
      padding: '10px 20px',
      backgroundColor: '#dc2626',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    buttonDangerDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#a3a3a3',
      cursor: 'not-allowed',
    },
    
    spinner: {
      width: '14px',
      height: '14px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  if (!task) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.headerContent}>
            <div style={styles.warningIcon}>
              <AlertTriangleIcon />
            </div>
            <h2 style={styles.modalTitle}>Delete Task</h2>
          </div>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e5e5';
              e.target.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.color = '#737373';
            }}
          >
            <XIcon />
          </button>
        </div>

        <div style={styles.modalBody}>
          <p style={styles.confirmText}>
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          
          <div style={styles.taskTitleContainer}>
            <span style={styles.taskTitleLabel}>Task to be deleted</span>
            <p style={styles.taskTitle}>{task.title}</p>
          </div>

          <div style={styles.warningBox}>
            <div style={styles.warningBoxIcon}>
              <AlertTriangleIcon />
            </div>
            <p style={styles.warningText}>
              This will permanently remove the task and all its data.
            </p>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        <div style={styles.modalFooter}>
          <button 
            type="button" 
            style={{
              ...styles.buttonSecondary,
              ...(loading ? styles.buttonSecondaryDisabled : {})
            }}
            onClick={onClose}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#a3a3a3';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#d4d4d4';
              }
            }}
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            style={{
              ...styles.buttonDanger,
              ...(loading ? styles.buttonDangerDisabled : {})
            }}
            onClick={handleDelete}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#b91c1c';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon />
                Delete Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
import React, { useEffect } from 'react';
import { deleteTask } from '../../services/apiService';

const ConfirmDeleteModal = ({ task, onClose, onTaskDeleted }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-50px) scale(0.95);
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
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes slideInUp {
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

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'overlayFadeIn 0.3s ease-out',
    },
    
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      width: '100%',
      maxWidth: '500px',
      animation: 'modalSlideIn 0.4s ease-out',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
    },
    
    modalHeader: {
      padding: '32px 32px 0 32px',
      textAlign: 'center',
      borderBottom: 'none',
    },
    
    modalTitle: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0,
      background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    
    warningIcon: {
      fontSize: '32px',
      filter: 'drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3))',
      animation: 'pulse 2s infinite',
    },
    
    modalBody: {
      padding: '32px',
      textAlign: 'center',
      animation: 'slideInUp 0.5s ease-out',
    },
    
    confirmText: {
      fontSize: '18px',
      color: '#374151',
      margin: '0 0 16px 0',
      lineHeight: '1.6',
      fontWeight: '500',
    },
    
    taskTitle: {
      color: '#dc2626',
      fontWeight: '700',
      backgroundColor: '#fef2f2',
      padding: '4px 12px',
      borderRadius: '8px',
      border: '1px solid #fecaca',
      display: 'inline-block',
      margin: '0 4px',
    },
    
    warningText: {
      fontSize: '16px',
      color: '#dc2626',
      fontWeight: '700',
      margin: '0 0 24px 0',
      padding: '16px',
      backgroundColor: '#fef2f2',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    
    errorMessage: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '16px',
      animation: 'shake 0.5s ease-in-out',
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      padding: '0 32px 32px 32px',
      borderTop: 'none',
    },
    
    buttonSecondary: {
      padding: '14px 28px',
      backgroundColor: '#f8fafc',
      color: '#475569',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '120px',
    },
    
    buttonSecondaryDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    
    buttonDanger: {
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      minWidth: '140px',
      justifyContent: 'center',
    },
    
    buttonDangerDisabled: {
      background: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80px',
      height: '80px',
      backgroundColor: '#fef2f2',
      borderRadius: '50%',
      margin: '0 auto 24px auto',
      border: '4px solid #fecaca',
    },
    
    dangerIcon: {
      fontSize: '40px',
      animation: 'pulse 2s infinite',
    },
  };

  if (!task) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.iconContainer}>
            <span style={styles.dangerIcon}>⚠️</span>
          </div>
          <h2 style={styles.modalTitle}>
            Confirm Deletion
          </h2>
        </div>

        <div style={styles.modalBody}>
          <p style={styles.confirmText}>
            Are you sure you want to delete the task:
          </p>
          <span style={styles.taskTitle}>"{task.title}"</span>
          
          <div style={styles.warningText}>
            <span style={{ fontSize: '20px' }}>🚨</span>
            This action cannot be undone
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <span style={{ fontSize: '18px' }}>❌</span>
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
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
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
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 35px rgba(220, 38, 38, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
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
                <span style={{ fontSize: '16px' }}>🗑️</span>
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
import React, { useState, useEffect } from 'react';
import { parseTaskText } from '../../services/apiService';

const MagicInput = ({ onParse }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Add professional CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
      }
      
      .fade-in {
        animation: fadeIn 0.3s ease-out;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleParse = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await parseTaskText(text);
      onParse(response.data.data);
      setText('');
    } catch (err) {
      setError('Could not understand the input. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleParse();
    }
  };

  // Professional SVG Icons
  const SparklesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0L9.937 15.5Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M20 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 5h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 17v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 18h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const BrainIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5C13.66 5 15 6.34 15 8C15 8.65 14.77 9.26 14.41 9.76L14.91 10.26C15.77 11.12 16.06 12.36 15.73 13.58C15.73 13.58 15.73 13.59 15.72 13.59C15.37 14.96 14.17 16 12.75 16H11.25C9.83 16 8.63 14.96 8.28 13.59C8.27 13.59 8.27 13.58 8.27 13.58C7.94 12.36 8.23 11.12 9.09 10.26L9.59 9.76C9.23 9.26 9 8.65 9 8C9 6.34 10.34 5 12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 8C7.34 8 6 6.66 6 5C6 3.34 7.34 2 9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 8C16.66 8 18 6.66 18 5C18 3.34 16.66 2 15 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 16C6.34 16 5 17.34 5 19C5 20.66 6.34 22 8 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 16C17.66 16 19 17.34 19 19C19 20.66 17.66 22 16 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e5e5',
      margin: '0',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    
    icon: {
      color: '#0a0a0a',
      flexShrink: 0,
    },
    
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0a0a0a',
      margin: 0,
    },
    
    subtitle: {
      fontSize: '14px',
      color: '#737373',
      margin: '0 0 16px 0',
      lineHeight: '1.5',
    },
    
    inputContainer: {
      position: 'relative',
      display: 'flex',
      gap: '12px',
      alignItems: 'stretch',
    },
    
    input: {
      flex: 1,
      padding: '12px 16px',
      fontSize: '16px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff',
      fontWeight: '400',
      color: '#0a0a0a',
      position: 'relative',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    
    inputFocused: {
      borderColor: '#0a0a0a',
      boxShadow: '0 0 0 3px rgba(10, 10, 10, 0.1)',
    },
    
    inputLoading: {
      backgroundColor: '#fafafa',
    },
    
    button: {
      padding: '12px 20px',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '120px',
      justifyContent: 'center',
      height: '48px',
      boxSizing: 'border-box',
    },
    
    buttonHover: {
      backgroundColor: '#262626',
      transform: 'translateY(-1px)',
    },
    
    buttonDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#a3a3a3',
      cursor: 'not-allowed',
      transform: 'none',
    },
    
    buttonIcon: {
      flexShrink: 0,
    },
    
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
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
      alignItems: 'flex-start',
      gap: '8px',
      animation: 'slideInUp 0.3s ease-out, shake 0.5s ease-in-out',
    },
    
    examples: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    
    examplesTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      margin: '0 0 8px 0',
    },
    
    examplesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '8px',
    },
    
    exampleChip: {
      padding: '8px 12px',
      backgroundColor: '#fafafa',
      color: '#525252',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '400',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid #e5e5e5',
      textAlign: 'left',
      lineHeight: '1.4',
    },
    
    exampleChipHover: {
      backgroundColor: '#f5f5f5',
      color: '#0a0a0a',
      borderColor: '#d4d4d4',
      transform: 'translateY(-1px)',
    },
    
    focusRing: {
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      borderRadius: '10px',
      border: '2px solid transparent',
      transition: 'border-color 0.2s ease',
      pointerEvents: 'none',
    },
    
    focusRingActive: {
      borderColor: 'rgba(10, 10, 10, 0.1)',
    },
  };

  const exampleTexts = [
    "Review quarterly budget by Friday",
    "Schedule team meeting for next Tuesday at 2pm",
    "Call client about contract renewal - high priority",
    "Finish project proposal due next week",
    "Review design mockups and provide feedback",
    "Prepare presentation for board meeting"
  ];

  const handleExampleClick = (example) => {
    setText(example);
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.focusRing} />
      
      <div style={styles.header}>
        <div style={styles.icon}>
          <BrainIcon />
        </div>
        <h3 style={styles.title}>AI Task Parser</h3>
      </div>
      
      <p style={styles.subtitle}>
        Describe your task naturally and our AI will automatically extract the details like priority, due date, and description.
      </p>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder='Try "Review budget by Friday 5pm with high priority"'
          style={{
            ...styles.input,
            ...(isFocused ? styles.inputFocused : {}),
            ...(loading ? styles.inputLoading : {}),
          }}
          disabled={loading}
        />
        
        <button 
          onClick={handleParse} 
          disabled={loading || !text.trim()}
          style={{
            ...styles.button,
            ...(loading || !text.trim() ? styles.buttonDisabled : {}),
          }}
          onMouseEnter={(e) => {
            if (!loading && text.trim()) {
              Object.assign(e.target.style, styles.buttonHover);
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && text.trim()) {
              e.target.style.backgroundColor = '#0a0a0a';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Processing...
            </>
          ) : (
            <>
              <div style={styles.buttonIcon}>
                <SparklesIcon />
              </div>
              Parse Task
            </>
          )}
        </button>
      </div>
      
      <div style={styles.examples}>
        <p style={styles.examplesTitle}>Try these examples:</p>
        <div style={styles.examplesGrid}>
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              style={styles.exampleChip}
              onClick={() => handleExampleClick(example)}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, styles.exampleChipHover);
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fafafa';
                e.target.style.color = '#525252';
                e.target.style.borderColor = '#e5e5e5';
                e.target.style.transform = 'translateY(0)';
              }}
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={styles.errorMessage}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default MagicInput;
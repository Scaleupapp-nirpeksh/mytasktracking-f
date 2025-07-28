import React, { useState, useEffect } from 'react';
import { parseTaskText } from '../../services/apiService';

const MagicInput = ({ onParse }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes magicShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes magicPulse {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
        50% { 
          box-shadow: 0 0 30px rgba(147, 51, 234, 0.5);
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
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
      }
      
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes glow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.2); }
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

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0',
      margin: '20px 0',
      position: 'relative',
      overflow: 'hidden',
    },
    
    magicHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    
    magicIcon: {
      fontSize: '28px',
      animation: 'float 3s ease-in-out infinite',
      filter: 'drop-shadow(0 2px 8px rgba(147, 51, 234, 0.3))',
    },
    
    magicTitle: {
      fontSize: '20px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #10b981 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
    },
    
    inputContainer: {
      position: 'relative',
      display: 'flex',
      gap: '12px',
      alignItems: 'stretch',
    },
    
    input: {
      flex: 1,
      padding: '16px 20px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      fontWeight: '500',
      color: '#1e293b',
      position: 'relative',
    },
    
    inputFocused: {
      borderColor: '#7c3aed',
      boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.1)',
      transform: 'translateY(-1px)',
      background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
    },
    
    inputMagic: {
      background: 'linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #faf5ff 50%, #f0fdf4 75%, #ffffff 100%)',
      backgroundSize: '200% 100%',
      animation: 'magicShimmer 3s linear infinite',
    },
    
    magicButton: {
      padding: '16px 28px',
      background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #10b981 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden',
      minWidth: '140px',
      justifyContent: 'center',
    },
    
    magicButtonHover: {
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: '0 12px 35px rgba(124, 58, 237, 0.4)',
      animation: 'magicPulse 2s ease-in-out infinite',
    },
    
    magicButtonDisabled: {
      background: '#e2e8f0',
      color: '#94a3b8',
      cursor: 'not-allowed',
      boxShadow: 'none',
      animation: 'none',
    },
    
    buttonIcon: {
      fontSize: '18px',
      animation: loading ? 'none' : 'glow 2s ease-in-out infinite',
    },
    
    spinner: {
      width: '18px',
      height: '18px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    errorMessage: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '14px 18px',
      borderRadius: '12px',
      border: '1px solid #fecaca',
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideInUp 0.3s ease-out, shake 0.5s ease-in-out',
    },
    
    suggestionText: {
      fontSize: '14px',
      color: '#64748b',
      fontStyle: 'italic',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      margin: '0',
    },
    
    sparkles: {
      position: 'absolute',
      top: '10px',
      right: '20px',
      fontSize: '12px',
      animation: 'sparkle 2s ease-in-out infinite',
      animationDelay: '1s',
    },
    
    magicBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(16, 185, 129, 0.05) 100%)',
      opacity: isFocused ? 1 : 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
      borderRadius: '20px',
    },
    
    examples: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '12px',
    },
    
    exampleChip: {
      padding: '6px 12px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid #e2e8f0',
    },
    
    exampleChipHover: {
      backgroundColor: '#e2e8f0',
      color: '#1e293b',
      transform: 'translateY(-1px)',
    },
  };

  const exampleTexts = [
    "Review Q3 report by Friday",
    "Team meeting tomorrow at 2pm",
    "Call client about project high priority",
    "Finish proposal due next week"
  ];

  const handleExampleClick = (example) => {
    setText(example);
  };

  return (
    <div style={styles.container}>
      <div style={styles.magicBackground} />
      {isFocused && <div style={styles.sparkles}>✨</div>}
      
      <div style={styles.magicHeader}>
        <span style={styles.magicIcon}>🪄</span>
        <h3 style={styles.magicTitle}>Magic Task Creator</h3>
      </div>
      
      <p style={styles.suggestionText}>
        <span>💫</span>
        Type naturally and let AI parse your task details
      </p>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder='Try "Review Q3 report by Friday at 5pm with high priority"'
          style={{
            ...styles.input,
            ...(isFocused ? styles.inputFocused : {}),
            ...(loading ? styles.inputMagic : {}),
          }}
          disabled={loading}
        />
        
        <button 
          onClick={handleParse} 
          disabled={loading || !text.trim()}
          style={{
            ...styles.magicButton,
            ...(loading || !text.trim() ? styles.magicButtonDisabled : {}),
          }}
          onMouseEnter={(e) => {
            if (!loading && text.trim()) {
              Object.assign(e.target.style, styles.magicButtonHover);
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && text.trim()) {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.3)';
              e.target.style.animation = 'none';
            }
          }}
        >
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Parsing...
            </>
          ) : (
            <>
              <span style={styles.buttonIcon}>✨</span>
              Magic Add
            </>
          )}
        </button>
      </div>
      
      <div style={styles.examples}>
        {exampleTexts.map((example, index) => (
          <button
            key={index}
            style={styles.exampleChip}
            onClick={() => handleExampleClick(example)}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, styles.exampleChipHover);
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.color = '#475569';
              e.target.style.transform = 'translateY(0)';
            }}
            disabled={loading}
          >
            {example}
          </button>
        ))}
      </div>

      {error && (
        <div style={styles.errorMessage}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default MagicInput;
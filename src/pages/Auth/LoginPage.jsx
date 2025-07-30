import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../state/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { login as loginUser } from '../../services/apiService';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const emailInputRef = useRef(null);
  const formRef = useRef(null);

  // Auto-focus first input on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Real-time validation
  useEffect(() => {
    const errors = {};
    
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (formData.password && formData.password.length < 1) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    setIsFormValid(
      formData.email && 
      formData.password && 
      Object.keys(errors).length === 0
    );
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setServerError('');
    setLoading(true);

    try {
      // Call actual login API
      const response = await loginUser(formData.email, formData.password);
      const { token, data } = response.data;
      const userData = { ...data.user, token };

      setShowSuccess(true);
      
      setTimeout(() => {
        login(userData);
        navigate('/');
      }, 1200);

    } catch (err) {
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setServerError('Invalid email or password');
      } else {
        setServerError('Authentication failed. Please check your credentials and try again.');
      }
      
      formRef.current?.classList.add('shake');
      setTimeout(() => formRef.current?.classList.remove('shake'), 600);
    } finally {
      setLoading(false);
    }
  };

  // Professional SVG Icons
  const ChartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 7H16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const TargetIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const EfficiencyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const KeystoneIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8V24" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 8V24" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3" fill="currentColor"/>
    </svg>
  );

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A16.16 16.16 0 0 1 6.06 6.06L17.94 17.94Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A16.16 16.16 0 0 1 19.04 17.94L9.9 4.24Z" stroke="currentColor" strokeWidth="2"/>
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Add CSS animations
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes shake {
        0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      .fade-in-up {
        animation: fadeInUp 0.5s ease-out;
      }
      
      .slide-in-left {
        animation: slideInLeft 0.5s ease-out;
      }
      
      .shake {
        animation: shake 0.4s ease-in-out;
      }
      
      .input-focus {
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }
      
      .button-hover {
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", sans-serif',
      backgroundColor: '#fafafa',
      color: '#1a1a1a',
    },
    
    leftPanel: {
      flex: 1,
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '80px 60px',
      position: 'relative',
      borderRight: '1px solid #262626',
    },
    
    brandSection: {
      marginBottom: '80px',
    },
    
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    
    logoIcon: {
      color: '#ffffff',
    },
    
    logoText: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: '-0.02em',
    },
    
    tagline: {
      fontSize: '16px',
      color: '#a3a3a3',
      fontWeight: '400',
      lineHeight: 1.5,
    },
    
    contentSection: {
      maxWidth: '480px',
    },
    
    headline: {
      fontSize: '40px',
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: 1.2,
      marginBottom: '24px',
      letterSpacing: '-0.02em',
    },
    
    description: {
      fontSize: '18px',
      color: '#d4d4d4',
      lineHeight: 1.6,
      marginBottom: '48px',
      fontWeight: '400',
    },
    
    valueProps: {
      display: 'grid',
      gap: '24px',
    },
    
    valueProp: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '24px',
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      border: '1px solid #262626',
      transition: 'all 0.2s ease',
      cursor: 'default',
    },
    
    propIcon: {
      width: '48px',
      height: '48px',
      backgroundColor: '#262626',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      flexShrink: 0,
      border: '1px solid #404040',
    },
    
    propContent: {
      flex: 1,
      paddingTop: '2px',
    },
    
    propTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '6px',
      lineHeight: 1.4,
    },
    
    propDescription: {
      fontSize: '14px',
      color: '#a3a3a3',
      lineHeight: 1.5,
    },
    
    rightPanel: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      backgroundColor: '#fafafa',
    },
    
    formCard: {
      width: '100%',
      maxWidth: '420px',
      padding: '48px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5e5e5',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    
    formHeader: {
      marginBottom: '32px',
    },
    
    formTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#0a0a0a',
      margin: '0 0 8px 0',
      letterSpacing: '-0.02em',
    },
    
    formSubtitle: {
      fontSize: '16px',
      color: '#737373',
      margin: '0',
      lineHeight: 1.5,
    },
    
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    
    inputLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0a0a0a',
      marginBottom: '6px',
    },
    
    inputWrapper: {
      position: 'relative',
    },
    
    formInput: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d4d4d4',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontWeight: '400',
      color: '#0a0a0a',
    },
    
    formInputFocused: {
      borderColor: '#0a0a0a',
      boxShadow: '0 0 0 3px rgba(10, 10, 10, 0.1)',
    },
    
    passwordInput: {
      paddingRight: '48px',
    },
    
    formInputError: {
      borderColor: '#dc2626',
      boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
    },
    
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      color: '#737373',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    optionsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '-8px',
    },
    
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    checkbox: {
      width: '18px',
      height: '18px',
      borderRadius: '4px',
      border: '1px solid #d4d4d4',
      cursor: 'pointer',
      position: 'relative',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    checkboxChecked: {
      backgroundColor: '#0a0a0a',
      borderColor: '#0a0a0a',
      color: '#ffffff',
    },
    
    checkboxLabel: {
      fontSize: '14px',
      color: '#0a0a0a',
      cursor: 'pointer',
      userSelect: 'none',
      fontWeight: '400',
    },
    
    forgotLink: {
      fontSize: '14px',
      color: '#0a0a0a',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    
    errorText: {
      fontSize: '13px',
      color: '#dc2626',
      marginTop: '4px',
      fontWeight: '400',
    },
    
    serverError: {
      padding: '12px 16px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      fontSize: '14px',
      fontWeight: '400',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    submitButton: {
      width: '100%',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '8px',
      minHeight: '48px',
    },
    
    submitButtonEnabled: {
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
    },
    
    submitButtonDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#a3a3a3',
      cursor: 'not-allowed',
    },
    
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    signupSection: {
      marginTop: '32px',
      textAlign: 'center',
      paddingTop: '24px',
      borderTop: '1px solid #e5e5e5',
    },
    
    signupText: {
      fontSize: '14px',
      color: '#737373',
      marginBottom: '8px',
    },
    
    signupLink: {
      display: 'inline-block',
      color: '#0a0a0a',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    
    successCard: {
      width: '100%',
      maxWidth: '420px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5e5e5',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '48px',
      textAlign: 'center',
    },
    
    successIcon: {
      width: '64px',
      height: '64px',
      backgroundColor: '#059669',
      color: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
    },
    
    successTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0a0a0a',
      margin: '0 0 12px 0',
      letterSpacing: '-0.02em',
    },
    
    successText: {
      fontSize: '16px',
      color: '#737373',
      margin: '0 0 24px 0',
      lineHeight: 1.5,
    },
    
    successSpinner: {
      width: '24px',
      height: '24px',
      border: '2px solid #f5f5f5',
      borderTop: '2px solid #0a0a0a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto',
    },
  };

  if (showSuccess) {
    return (
      <div style={styles.container}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
          <div style={styles.successCard} className="fade-in-up">
            <div style={styles.successIcon}>
              <CheckIcon />
            </div>
            <h2 style={styles.successTitle}>Access Granted</h2>
            <p style={styles.successText}>Redirecting to your productivity dashboard...</p>
            <div style={styles.successSpinner}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandSection} className="slide-in-left">
          <div style={styles.logo}>
            <KeystoneIcon />
            <div style={styles.logoText}>Keystone</div>
          </div>
          <div style={styles.tagline}>
            Enterprise productivity management
          </div>
        </div>
        
        <div style={styles.contentSection} className="slide-in-left">
          <h1 style={styles.headline}>Stay ahead of the curve</h1>
          <p style={styles.description}>
            Advanced task management and productivity optimization for professionals who demand excellence in personal and professional execution.
          </p>
          
          <div style={styles.valueProps}>
            <div 
              style={styles.valueProp}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#262626';
                e.currentTarget.style.borderColor = '#404040';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#262626';
              }}
            >
              <div style={styles.propIcon}>
                <EfficiencyIcon />
              </div>
              <div style={styles.propContent}>
                <div style={styles.propTitle}>Strategic Time Management</div>
                <div style={styles.propDescription}>Unified workspace for personal, professional, and strategic initiatives</div>
              </div>
            </div>
            
            <div 
              style={styles.valueProp}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#262626';
                e.currentTarget.style.borderColor = '#404040';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#262626';
              }}
            >
              <div style={styles.propIcon}>
                <TargetIcon />
              </div>
              <div style={styles.propContent}>
                <div style={styles.propTitle}>Performance Optimization</div>
                <div style={styles.propDescription}>Data-driven insights to maximize efficiency and eliminate bottlenecks</div>
              </div>
            </div>
            
            <div 
              style={styles.valueProp}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#262626';
                e.currentTarget.style.borderColor = '#404040';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#262626';
              }}
            >
              <div style={styles.propIcon}>
                <ChartIcon />
              </div>
              <div style={styles.propContent}>
                <div style={styles.propTitle}>Competitive Advantage</div>
                <div style={styles.propDescription}>Systematic approach to maintaining peak productivity across all domains</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div ref={formRef} style={styles.formCard} className="fade-in-up">
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSubtitle}>Continue optimizing your productivity</p>
          </div>

          <div style={styles.loginForm}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.inputLabel}>
                Email address
              </label>
              <div style={styles.inputWrapper}>
                <input
                  ref={emailInputRef}
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={(e) => {
                    setFocusedField('email');
                    Object.assign(e.target.style, styles.formInputFocused);
                    e.target.classList.add('input-focus');
                  }}
                  onBlur={(e) => {
                    setFocusedField('');
                    if (validationErrors.email) {
                      Object.assign(e.target.style, styles.formInputError);
                    } else {
                      e.target.style.borderColor = '#d4d4d4';
                      e.target.style.boxShadow = 'none';
                    }
                    e.target.classList.remove('input-focus');
                  }}
                  style={{
                    ...styles.formInput,
                    ...(validationErrors.email ? styles.formInputError : {})
                  }}
                  placeholder="name@company.com"
                  autoComplete="email"
                  aria-invalid={!!validationErrors.email}
                />
              </div>
              {validationErrors.email && (
                <span style={styles.errorText}>{validationErrors.email}</span>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.inputLabel}>
                Password
              </label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={(e) => {
                    setFocusedField('password');
                    Object.assign(e.target.style, styles.formInputFocused);
                    e.target.classList.add('input-focus');
                  }}
                  onBlur={(e) => {
                    setFocusedField('');
                    if (validationErrors.password) {
                      Object.assign(e.target.style, styles.formInputError);
                    } else {
                      e.target.style.borderColor = '#d4d4d4';
                      e.target.style.boxShadow = 'none';
                    }
                    e.target.classList.remove('input-focus');
                  }}
                  style={{
                    ...styles.formInput,
                    ...styles.passwordInput,
                    ...(validationErrors.password ? styles.formInputError : {})
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={!!validationErrors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#0a0a0a';
                    e.target.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#737373';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {validationErrors.password && (
                <span style={styles.errorText}>{validationErrors.password}</span>
              )}
            </div>

            <div style={styles.optionsRow}>
              <div style={styles.checkboxGroup}>
                <div
                  style={{
                    ...styles.checkbox,
                    ...(rememberMe ? styles.checkboxChecked : {})
                  }}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <label 
                  style={styles.checkboxLabel}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  Keep me signed in
                </label>
              </div>
              
              <a 
                href="#" 
                style={styles.forgotLink}
                onMouseEnter={(e) => {
                  e.target.style.color = '#737373';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#0a0a0a';
                }}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Forgot password?
              </a>
            </div>

            {serverError && (
              <div style={styles.serverError}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {serverError}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              style={{
                ...styles.submitButton,
                ...((!isFormValid || loading) ? styles.submitButtonDisabled : styles.submitButtonEnabled)
              }}
              onMouseEnter={(e) => {
                if (isFormValid && !loading) {
                  e.target.style.backgroundColor = '#262626';
                  e.target.classList.add('button-hover');
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid && !loading) {
                  e.target.style.backgroundColor = '#0a0a0a';
                  e.target.classList.remove('button-hover');
                }
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Authenticating...
                </>
              ) : (
                'Continue to Dashboard'
              )}
            </button>
          </div>

          <div style={styles.signupSection}>
            <p style={styles.signupText}>New to Keystone?</p>
            <a 
              href="/signup" 
              style={styles.signupLink}
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#737373';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#0a0a0a';
              }}
            >
              Create your account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
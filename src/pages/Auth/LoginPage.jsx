import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/contexts/AuthContext';
import { login as loginUser } from '../../services/apiService';

const LoginPage = () => {
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
  
  const { login } = useAuth();
  const navigate = useNavigate();
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
      const response = await loginUser(formData.email, formData.password);
      const { token, data } = response.data;
      const userData = { ...data.user, token };

      setShowSuccess(true);
      
      setTimeout(() => {
        login(userData);
        navigate('/');
      }, 1500);

    } catch (err) {
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setServerError('Invalid email or password. Please try again.');
      } else {
        setServerError('Unable to log in. Please try again.');
      }
      
      formRef.current?.classList.add('shake');
      setTimeout(() => formRef.current?.classList.remove('shake'), 600);
    } finally {
      setLoading(false);
    }
  };

  // Add CSS animations via a style element
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .shake {
        animation: shake 0.6s ease-in-out;
      }
      
      @keyframes shake {
        0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
      }
      
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
    },
    
    leftPanel: {
      flex: 1,
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%)',
      backgroundSize: '300% 300%',
      animation: 'gradientShift 10s ease infinite',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 60px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.1)',
    },
    
    welcomeSection: {
      textAlign: 'center',
      marginBottom: '60px',
    },
    
    logo: {
      fontSize: '64px',
      marginBottom: '32px',
      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
      animation: 'float 6s ease-in-out infinite',
    },
    
    welcomeTitle: {
      fontSize: '52px',
      fontWeight: '900',
      margin: '0 0 20px 0',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #e6f3ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
    },
    
    welcomeSubtitle: {
      fontSize: '24px',
      opacity: 0.95,
      margin: '0 0 40px 0',
      lineHeight: 1.6,
      color: '#f0f8ff',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    
    statsSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      width: '100%',
      maxWidth: '400px',
    },
    
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '24px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    
    statIcon: {
      fontSize: '36px',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      padding: '18px',
      borderRadius: '18px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
    
    statContent: {
      flex: 1,
    },
    
    statNumber: {
      fontSize: '28px',
        fontWeight: '900',
      margin: '0 0 4px 0',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    
    statLabel: {
      fontSize: '16px',
      opacity: 0.9,
      margin: '0',
      color: '#f0f8ff',
    },
    
    rightPanel: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    },
    
    formCard: {
      width: '100%',
      maxWidth: '480px',
      padding: '48px',
      backgroundColor: 'white',
      borderRadius: '28px',
      boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      animation: 'slideUp 0.6s ease-out',
      border: '1px solid rgba(255, 255, 255, 0.8)',
    },
    
    formHeader: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    
    formTitle: {
      fontSize: '36px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 12px 0',
      letterSpacing: '-0.025em',
    },
    
    formSubtitle: {
      fontSize: '18px',
      color: '#6b7280',
      margin: '0',
      lineHeight: 1.5,
    },
    
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
    },
    
    inputGroup: {
      position: 'relative',
    },
    
    inputLabel: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '700',
      color: '#374151',
      marginBottom: '12px',
      transition: 'color 0.2s ease',
    },
    
    inputLabelFocused: {
      color: '#4facfe',
    },
    
    inputWrapper: {
      position: 'relative',
    },
    
    formInput: {
      width: '100%',
      padding: '18px 22px',
      border: '2px solid #e5e7eb',
      borderRadius: '14px',
      fontSize: '18px',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      boxSizing: 'border-box',
      outline: 'none',
      lineHeight: 1.5,
      fontWeight: '500',
    },
    
    formInputFocused: {
      borderColor: '#4facfe',
      boxShadow: '0 0 0 4px rgba(79, 172, 254, 0.15)',
      transform: 'translateY(-2px)',
    },
    
    passwordInput: {
      paddingRight: '65px',
    },
    
    formInputError: {
      borderColor: '#ff4757',
      backgroundColor: '#fff5f5',
      boxShadow: '0 0 0 4px rgba(255, 71, 87, 0.1)',
    },
    
    formInputValid: {
      borderColor: '#00d2d3',
      backgroundColor: '#f0ffff',
      boxShadow: '0 0 0 4px rgba(0, 210, 211, 0.1)',
    },
    
    validIcon: {
      position: 'absolute',
      right: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#00d2d3',
      fontSize: '22px',
      fontWeight: 'bold',
      pointerEvents: 'none',
    },
    
    passwordToggle: {
      position: 'absolute',
      right: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '10px',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      color: 'white',
      boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
    },
    
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginTop: '-8px',
    },
    
    checkbox: {
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: '2px solid #e5e7eb',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease',
    },
    
    checkboxChecked: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      borderColor: '#4facfe',
    },
    
    checkboxLabel: {
      fontSize: '15px',
      color: '#374151',
      cursor: 'pointer',
      userSelect: 'none',
    },
    
    forgotLink: {
      fontSize: '15px',
      color: '#4facfe',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: 'auto',
      transition: 'color 0.2s ease',
    },
    
    errorText: {
      display: 'block',
      fontSize: '15px',
      color: '#ff4757',
      marginTop: '10px',
      fontWeight: '600',
    },
    
    serverError: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      padding: '18px',
      background: 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)',
      border: '1px solid #fecaca',
      borderRadius: '14px',
      color: '#dc2626',
      fontSize: '16px',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
    },
    
    errorIcon: {
      fontSize: '22px',
      marginTop: '2px',
    },
    
    submitButton: {
      width: '100%',
      padding: '20px',
      borderRadius: '14px',
      fontSize: '19px',
      fontWeight: '800',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      marginTop: '12px',
      minHeight: '64px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    
    submitButtonEnabled: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 3s ease infinite',
      color: 'white',
      boxShadow: '0 15px 35px -5px rgba(79, 172, 254, 0.4), 0 5px 15px -5px rgba(79, 172, 254, 0.2)',
      transform: 'translateY(0)',
    },
    
    submitButtonDisabled: {
      backgroundColor: '#e5e7eb',
      color: '#9ca3af',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    
    buttonIcon: {
      fontSize: '22px',
    },
    
    spinner: {
      width: '22px',
      height: '22px',
      border: '3px solid transparent',
      borderTop: '3px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    signupSection: {
      marginTop: '40px',
      textAlign: 'center',
    },
    
    divider: {
      position: 'relative',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    dividerText: {
      fontSize: '16px',
      color: '#6b7280',
      backgroundColor: 'white',
      padding: '0 24px',
      position: 'relative',
      zIndex: 1,
      fontWeight: '600',
    },
    
    signupLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textDecoration: 'none',
      fontSize: '18px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      padding: '14px 28px',
      borderRadius: '12px',
      border: '2px solid transparent',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    },
    
    successCard: {
      width: '100%',
      maxWidth: '480px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '28px',
      boxShadow: '0 35px 70px -12px rgba(0, 0, 0, 0.2)',
      padding: '60px 48px',
      textAlign: 'center',
      margin: '0 auto',
      border: '1px solid rgba(255, 255, 255, 0.8)',
    },
    
    successIcon: {
      width: '90px',
      height: '90px',
      background: 'linear-gradient(135deg, #00d2d3 0%, #2ed573 100%)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '45px',
      fontWeight: 'bold',
      margin: '0 auto 32px',
      animation: 'scaleIn 0.6s ease-out',
      boxShadow: '0 15px 35px -5px rgba(0, 210, 211, 0.4)',
    },
    
    successTitle: {
      fontSize: '32px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 18px 0',
      letterSpacing: '-0.025em',
    },
    
    successText: {
      fontSize: '20px',
      color: '#6b7280',
      margin: '0 0 32px 0',
      lineHeight: 1.6,
    },
    
    successSpinner: {
      width: '32px',
      height: '32px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #4facfe',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto',
    },
  };

  if (showSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>🎉</div>
          <h2 style={styles.successTitle}>Welcome Back!</h2>
          <p style={styles.successText}>Successfully logged in. Redirecting to dashboard...</p>
          <div style={styles.successSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.welcomeSection}>
          <div style={styles.logo}>🔑</div>
          <h1 style={styles.welcomeTitle}>Welcome Back</h1>
          <p style={styles.welcomeSubtitle}>Continue your journey with Keystone</p>
        </div>
        
        <div style={styles.statsSection}>
          <div 
            style={styles.stat}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>50K+</div>
              <div style={styles.statLabel}>Active Users</div>
            </div>
          </div>
          
          <div 
            style={styles.stat}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.statIcon}>⭐</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>99.9%</div>
              <div style={styles.statLabel}>Uptime</div>
            </div>
          </div>
          
          <div 
            style={styles.stat}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.statIcon}>🚀</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>10M+</div>
              <div style={styles.statLabel}>Tasks Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div ref={formRef} style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign In</h2>
            <p style={styles.formSubtitle}>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.loginForm} noValidate>
            {/* Email Field */}
            <div style={styles.inputGroup}>
              <label 
                htmlFor="email" 
                style={{
                  ...styles.inputLabel,
                  ...(focusedField === 'email' || formData.email ? styles.inputLabelFocused : {})
                }}
              >
                Email Address
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
                  }}
                  onBlur={(e) => {
                    setFocusedField('');
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = validationErrors.email ? '0 0 0 4px rgba(255, 71, 87, 0.1)' : 
                                              (formData.email && !validationErrors.email ? '0 0 0 4px rgba(0, 210, 211, 0.1)' : 'none');
                  }}
                  style={{
                    ...styles.formInput,
                    ...(validationErrors.email ? styles.formInputError : {}),
                    ...(formData.email && !validationErrors.email ? styles.formInputValid : {})
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={validationErrors.email ? "email-error" : undefined}
                />
                {formData.email && !validationErrors.email && (
                  <span style={styles.validIcon}>✓</span>
                )}
              </div>
              {validationErrors.email && (
                <span id="email-error" style={styles.errorText} role="alert">
                  {validationErrors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label 
                  htmlFor="password" 
                  style={{
                    ...styles.inputLabel,
                    margin: 0,
                    ...(focusedField === 'password' || formData.password ? styles.inputLabelFocused : {})
                  }}
                >
                  Password
                </label>
                <a 
                  href="#" 
                  style={styles.forgotLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#0066cc';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#4facfe';
                    e.target.style.textDecoration = 'none';
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Forgot password functionality would be implemented here');
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={(e) => {
                    setFocusedField('password');
                    Object.assign(e.target.style, styles.formInputFocused);
                  }}
                  onBlur={(e) => {
                    setFocusedField('');
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = validationErrors.password ? '0 0 0 4px rgba(255, 71, 87, 0.1)' : 
                                              (formData.password && !validationErrors.password ? '0 0 0 4px rgba(0, 210, 211, 0.1)' : 'none');
                  }}
                  style={{
                    ...styles.formInput,
                    ...styles.passwordInput,
                    ...(validationErrors.password ? styles.formInputError : {}),
                    ...(formData.password && !validationErrors.password ? styles.formInputValid : {})
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={!!validationErrors.password}
                  aria-describedby={validationErrors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    e.target.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.3)';
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {validationErrors.password && (
                <span id="password-error" style={styles.errorText} role="alert">
                  {validationErrors.password}
                </span>
              )}
            </div>

            {/* Remember Me */}
            <div style={styles.checkboxGroup}>
              <div
                style={{
                  ...styles.checkbox,
                  ...(rememberMe ? styles.checkboxChecked : {})
                }}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </span>
                )}
              </div>
              <label 
                style={styles.checkboxLabel}
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember me for 30 days
              </label>
            </div>

            {serverError && (
              <div style={styles.serverError} role="alert">
                <span style={styles.errorIcon}>⚠️</span>
                <div>
                  <strong>Error:</strong> {serverError}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              style={{
                ...styles.submitButton,
                ...((!isFormValid || loading) ? styles.submitButtonDisabled : styles.submitButtonEnabled)
              }}
              onMouseEnter={(e) => {
                if (isFormValid && !loading) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 20px 40px -5px rgba(79, 172, 254, 0.5), 0 10px 25px -5px rgba(79, 172, 254, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid && !loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 15px 35px -5px rgba(79, 172, 254, 0.4), 0 5px 15px -5px rgba(79, 172, 254, 0.2)';
                }
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Signing In...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>🚀</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div style={styles.signupSection}>
            <div style={styles.divider}>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent)',
                  zIndex: 0,
                }}
              />
              <span style={styles.dividerText}>Don't have an account?</span>
            </div>
            <Link 
              to="/signup" 
              style={styles.signupLink}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateX(6px) scale(1.05)';
                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateX(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
            >
              Create Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
//src/pages/Auth/SignupPage.jsx
import React, { useState, useEffect, useRef } from 'react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const nameInputRef = useRef(null);
  const formRef = useRef(null);

  // Auto-focus first input on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Real-time validation
  useEffect(() => {
    const errors = {};
    
    if (formData.name && formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      } else {
        let strength = 0;
        if (formData.password.length >= 8) strength += 1;
        if (/[A-Z]/.test(formData.password)) strength += 1;
        if (/[a-z]/.test(formData.password)) strength += 1;
        if (/[0-9]/.test(formData.password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
        setPasswordStrength(strength);
      }
    }
    
    setValidationErrors(errors);
    setIsFormValid(
      formData.name.length >= 2 && 
      formData.email && 
      formData.password.length >= 8 && 
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      
      setTimeout(() => {
        console.log('Signup successful, redirecting to dashboard...');
      }, 2000);

    } catch (err) {
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setServerError('An account with this email already exists');
      } else {
        setServerError('Unable to create account. Please try again');
      }
      
      formRef.current?.classList.add('shake');
      setTimeout(() => formRef.current?.classList.remove('shake'), 600);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#dc2626'; // Red
    if (passwordStrength <= 3) return '#f59e0b'; // Orange
    if (passwordStrength <= 4) return '#059669'; // Green
    return '#0a0a0a'; // Black for excellent
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Excellent';
  };

  // Professional SVG Icons
  const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22S8 18 8 12V7L12 5L16 7V12C16 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ZapIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="12,5 19,12 12,19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      maxWidth: '460px',
      padding: '48px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e5e5e5',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    
    formHeader: {
      marginBottom: '36px',
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
    
    signupForm: {
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
    
    formInputValid: {
      borderColor: '#059669',
      boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.1)',
    },
    
    validIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#059669',
      fontSize: '16px',
      fontWeight: 'bold',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    
    passwordStrength: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginTop: '8px',
    },
    
    strengthBar: {
      flex: 1,
      height: '6px',
      backgroundColor: '#f5f5f5',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    
    strengthFill: {
      height: '100%',
      transition: 'all 0.3s ease',
      borderRadius: '3px',
    },
    
    strengthText: {
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '60px',
      textAlign: 'right',
    },
    
    errorText: {
      fontSize: '13px',
      color: '#dc2626',
      marginTop: '4px',
      fontWeight: '400',
    },
    
    helpText: {
      fontSize: '12px',
      color: '#737373',
      marginTop: '4px',
      lineHeight: 1.4,
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
    
    termsSection: {
      textAlign: 'center',
      marginTop: '16px',
    },
    
    termsText: {
      fontSize: '12px',
      color: '#737373',
      lineHeight: 1.5,
    },
    
    termsLink: {
      color: '#0a0a0a',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    
    loginSection: {
      marginTop: '32px',
      textAlign: 'center',
      paddingTop: '24px',
      borderTop: '1px solid #e5e5e5',
    },
    
    loginText: {
      fontSize: '14px',
      color: '#737373',
      marginBottom: '8px',
    },
    
    loginLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: '#0a0a0a',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    
    successCard: {
      width: '100%',
      maxWidth: '460px',
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
            <h2 style={styles.successTitle}>Account Created Successfully</h2>
            <p style={styles.successText}>Setting up your productivity workspace...</p>
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
          <h1 style={styles.headline}>Join elite professionals</h1>
          <p style={styles.description}>
            Access advanced productivity tools designed for high-performing individuals and teams who demand excellence.
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
                <ZapIcon />
              </div>
              <div style={styles.propContent}>
                <div style={styles.propTitle}>Instant Setup</div>
                <div style={styles.propDescription}>Deploy your productivity workspace in under 60 seconds</div>
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
                <ShieldIcon />
              </div>
              <div style={styles.propContent}>
                <div style={styles.propTitle}>Enterprise Security</div>
                <div style={styles.propDescription}>Bank-grade encryption with SOC 2 Type II compliance</div>
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
                <UserIcon />
              </div>
              <div style={styles.propContent}>
                <div style={styles.propTitle}>Professional Network</div>
                <div style={styles.propDescription}>Connect with thousands of high-achievers and industry leaders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div ref={formRef} style={styles.formCard} className="fade-in-up">
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create your account</h2>
            <p style={styles.formSubtitle}>Start optimizing your productivity today</p>
          </div>

          <div style={styles.signupForm}>
            {/* Name Field */}
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={styles.inputLabel}>
                Full name
              </label>
              <div style={styles.inputWrapper}>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onFocus={(e) => {
                    setFocusedField('name');
                    Object.assign(e.target.style, styles.formInputFocused);
                    e.target.classList.add('input-focus');
                  }}
                  onBlur={(e) => {
                    setFocusedField('');
                    if (validationErrors.name) {
                      Object.assign(e.target.style, styles.formInputError);
                    } else if (formData.name && !validationErrors.name) {
                      Object.assign(e.target.style, styles.formInputValid);
                    } else {
                      e.target.style.borderColor = '#d4d4d4';
                      e.target.style.boxShadow = 'none';
                    }
                    e.target.classList.remove('input-focus');
                  }}
                  style={{
                    ...styles.formInput,
                    ...(validationErrors.name ? styles.formInputError : {}),
                    ...(formData.name && !validationErrors.name ? styles.formInputValid : {})
                  }}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  aria-invalid={!!validationErrors.name}
                />
                {formData.name && !validationErrors.name && (
                  <div style={styles.validIcon}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              {validationErrors.name && (
                <span style={styles.errorText}>{validationErrors.name}</span>
              )}
            </div>

            {/* Email Field */}
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.inputLabel}>
                Email address
              </label>
              <div style={styles.inputWrapper}>
                <input
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
                    } else if (formData.email && !validationErrors.email) {
                      Object.assign(e.target.style, styles.formInputValid);
                    } else {
                      e.target.style.borderColor = '#d4d4d4';
                      e.target.style.boxShadow = 'none';
                    }
                    e.target.classList.remove('input-focus');
                  }}
                  style={{
                    ...styles.formInput,
                    ...(validationErrors.email ? styles.formInputError : {}),
                    ...(formData.email && !validationErrors.email ? styles.formInputValid : {})
                  }}
                  placeholder="name@company.com"
                  autoComplete="email"
                  aria-invalid={!!validationErrors.email}
                />
                {formData.email && !validationErrors.email && (
                  <div style={styles.validIcon}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              {validationErrors.email && (
                <span style={styles.errorText}>{validationErrors.email}</span>
              )}
            </div>

            {/* Password Field */}
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
                    } else if (formData.password && !validationErrors.password) {
                      Object.assign(e.target.style, styles.formInputValid);
                    } else {
                      e.target.style.borderColor = '#d4d4d4';
                      e.target.style.boxShadow = 'none';
                    }
                    e.target.classList.remove('input-focus');
                  }}
                  style={{
                    ...styles.formInput,
                    ...styles.passwordInput,
                    ...(validationErrors.password ? styles.formInputError : {}),
                    ...(formData.password && !validationErrors.password ? styles.formInputValid : {})
                  }}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
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
              
              {formData.password && (
                <div style={styles.passwordStrength}>
                  <div style={styles.strengthBar}>
                    <div 
                      style={{
                        ...styles.strengthFill,
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    />
                  </div>
                  <span 
                    style={{ 
                      ...styles.strengthText, 
                      color: getPasswordStrengthColor() 
                    }}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
              
              {validationErrors.password && (
                <span style={styles.errorText}>{validationErrors.password}</span>
              )}
              
              {!validationErrors.password && formData.password && (
                <span style={styles.helpText}>
                  Use 8+ characters with uppercase, lowercase, numbers & symbols
                </span>
              )}
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div style={styles.termsSection}>
              <span style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <a href="#" style={styles.termsLink}>Terms of Service</a>{' '}
                and{' '}
                <a href="#" style={styles.termsLink}>Privacy Policy</a>
              </span>
            </div>
          </div>

          <div style={styles.loginSection}>
            <p style={styles.loginText}>Already have an account?</p>
            <a 
              href="/login" 
              style={styles.loginLink}
              onMouseEnter={(e) => {
                e.target.style.color = '#737373';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#0a0a0a';
              }}
            >
              Sign in instead
              <ArrowRightIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
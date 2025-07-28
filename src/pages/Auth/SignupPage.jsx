import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/contexts/AuthContext';
import { signup as signupUser } from '../../services/apiService';

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
  
  const { login } = useAuth();
  const navigate = useNavigate();
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
      const response = await signupUser(formData.name, formData.email, formData.password);
      const { token, data } = response.data;
      const userData = { ...data.user, token };

      setShowSuccess(true);
      
      setTimeout(() => {
        login(userData);
        navigate('/');
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
    if (passwordStrength <= 2) return '#ff4757'; // Vibrant red
    if (passwordStrength <= 3) return '#ffa502'; // Vibrant orange
    if (passwordStrength <= 4) return '#2ed573'; // Vibrant green
    return '#00d2d3'; // Vibrant cyan
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak Password';
    if (passwordStrength <= 3) return 'Fair Password';
    if (passwordStrength <= 4) return 'Good Password';
    return 'Strong Password';
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
    },
    
    leftPanel: {
      flex: 1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      backgroundSize: '300% 300%',
      animation: 'gradientShift 12s ease infinite',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 60px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.1)',
    },
    
    brandSection: {
      marginBottom: '60px',
      textAlign: 'center',
    },
    
    logo: {
      fontSize: '56px',
      marginBottom: '24px',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
      animation: 'pulse 3s ease-in-out infinite',
    },
    
    brandTitle: {
      fontSize: '48px',
      fontWeight: '900',
      margin: '0 0 16px 0',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #e6f3ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    
    brandSubtitle: {
      fontSize: '22px',
      opacity: 0.95,
      margin: '0',
      lineHeight: 1.5,
      color: '#f0f8ff',
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
    
    featuresSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '36px',
      marginTop: '40px',
    },
    
    feature: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '24px',
      padding: '20px',
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    
    featureIcon: {
      fontSize: '32px',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      padding: '16px',
      borderRadius: '16px',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    },
    
    featureContent: {
      flex: 1,
    },
    
    featureTitle: {
      fontSize: '22px',
      fontWeight: '800',
      margin: '0 0 8px 0',
      color: '#ffffff',
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
    
    featureText: {
      fontSize: '16px',
      opacity: 0.9,
      margin: '0',
      lineHeight: 1.6,
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
      maxWidth: '520px',
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
    
    signupForm: {
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
      color: '#667eea',
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
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.15)',
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
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '10px',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      color: 'white',
      boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)',
    },
    
    passwordStrength: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginTop: '14px',
    },
    
    strengthBar: {
      flex: 1,
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    },
    
    strengthFill: {
      height: '100%',
      transition: 'all 0.4s ease',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    
    strengthText: {
      fontSize: '14px',
      fontWeight: '700',
      minWidth: '130px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    errorText: {
      display: 'block',
      fontSize: '15px',
      color: '#ff4757',
      marginTop: '10px',
      fontWeight: '600',
    },
    
    helpText: {
      display: 'block',
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '10px',
      lineHeight: 1.5,
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 3s ease infinite',
      color: 'white',
      boxShadow: '0 15px 35px -5px rgba(102, 126, 234, 0.4), 0 5px 15px -5px rgba(102, 126, 234, 0.2)',
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
    
    termsSection: {
      textAlign: 'center',
      marginTop: '8px',
    },
    
    termsText: {
      fontSize: '14px',
      color: '#6b7280',
      lineHeight: 1.6,
    },
    
    termsLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '700',
      transition: 'color 0.2s ease',
    },
    
    loginSection: {
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
    
    loginLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      textDecoration: 'none',
      fontSize: '18px',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      padding: '14px 28px',
      borderRadius: '12px',
      border: '2px solid transparent',
      boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)',
    },
    
    successCard: {
      width: '100%',
      maxWidth: '520px',
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto',
    },
  };

  if (showSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Account Created Successfully!</h2>
          <p style={styles.successText}>Welcome to Keystone. We're setting up your dashboard...</p>
          <div style={styles.successSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>🔑</div>
          <h1 style={styles.brandTitle}>Keystone</h1>
          <p style={styles.brandSubtitle}>Your gateway to seamless productivity</p>
        </div>
        
        <div style={styles.featuresSection}>
          <div 
            style={styles.feature}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.featureIcon}>🚀</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Lightning Fast</h3>
              <p style={styles.featureText}>Get started in seconds with our streamlined onboarding</p>
            </div>
          </div>
          <div 
            style={styles.feature}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.featureIcon}>🔒</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Bank-Level Security</h3>
              <p style={styles.featureText}>Your data is protected with enterprise-grade encryption</p>
            </div>
          </div>
          <div 
            style={styles.feature}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.featureIcon}>⚡</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Powerful Features</h3>
              <p style={styles.featureText}>Everything you need to manage your workflow efficiently</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div ref={formRef} style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Your Account</h2>
            <p style={styles.formSubtitle}>Join thousands of users who trust Keystone</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.signupForm} noValidate>
            {/* Name Field */}
            <div style={styles.inputGroup}>
              <label 
                htmlFor="name" 
                style={{
                  ...styles.inputLabel,
                  ...(focusedField === 'name' || formData.name ? styles.inputLabelFocused : {})
                }}
              >
                Full Name
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
                  }}
                  onBlur={(e) => {
                    setFocusedField('');
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = validationErrors.name ? '0 0 0 4px rgba(255, 71, 87, 0.1)' : 
                                              (formData.name && !validationErrors.name ? '0 0 0 4px rgba(0, 210, 211, 0.1)' : 'none');
                  }}
                  style={{
                    ...styles.formInput,
                    ...(validationErrors.name ? styles.formInputError : {}),
                    ...(formData.name && !validationErrors.name ? styles.formInputValid : {})
                  }}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  aria-invalid={!!validationErrors.name}
                  aria-describedby={validationErrors.name ? "name-error" : undefined}
                />
                {formData.name && !validationErrors.name && (
                  <span style={styles.validIcon}>✓</span>
                )}
              </div>
              {validationErrors.name && (
                <span id="name-error" style={styles.errorText} role="alert">
                  {validationErrors.name}
                </span>
              )}
            </div>

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
                  placeholder="Enter your work email"
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
              <label 
                htmlFor="password" 
                style={{
                  ...styles.inputLabel,
                  ...(focusedField === 'password' || formData.password ? styles.inputLabelFocused : {})
                }}
              >
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
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  aria-invalid={!!validationErrors.password}
                  aria-describedby={validationErrors.password ? "password-error" : "password-help"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    e.target.style.boxShadow = '0 6px 20px rgba(240, 147, 251, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(240, 147, 251, 0.3)';
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
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
                <span id="password-error" style={styles.errorText} role="alert">
                  {validationErrors.password}
                </span>
              )}
              
              {!validationErrors.password && formData.password && (
                <span id="password-help" style={styles.helpText}>
                  Use 8+ characters with uppercase, lowercase, numbers & symbols
                </span>
              )}
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
                  e.target.style.boxShadow = '0 20px 40px -5px rgba(102, 126, 234, 0.5), 0 10px 25px -5px rgba(102, 126, 234, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid && !loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 15px 35px -5px rgba(102, 126, 234, 0.4), 0 5px 15px -5px rgba(102, 126, 234, 0.2)';
                }
              }}
              aria-describedby="submit-help"
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Creating Your Account...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>🚀</span>
                  Create Account
                </>
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
          </form>

          <div style={styles.loginSection}>
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
              <span style={styles.dividerText}>Already have an account?</span>
            </div>
            <Link 
              to="/login" 
              style={styles.loginLink}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateX(6px) scale(1.05)';
                e.target.style.boxShadow = '0 12px 35px rgba(240, 147, 251, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateX(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.3)';
              }}
            >
              Sign In Instead →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
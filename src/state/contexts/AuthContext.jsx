// src/state/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../../api/client';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for a logged-in user in localStorage on initial app load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Set the user in state
        setUser(userData);
        // Set the token for all subsequent apiClient requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = (userData) => {
    // Store user data (including token) in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    // Set the user in state
    setUser(userData);
    // Set the token for all subsequent apiClient requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  // Logout function
  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    // Clear the user from state
    setUser(null);
    // Remove the Authorization header from apiClient
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy context consumption
export const useAuth = () => {
  return useContext(AuthContext);
};

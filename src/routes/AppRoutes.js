// src/routes/AppRoutes.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../state/contexts/AuthContext';

// Import page components
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import DashboardPage from '../pages/Main/DashboardPage';
import TasksPage from '../pages/Main/TasksPage';

/**
 * A protected route component.
 * If the user is authenticated, it renders the requested component.
 * Otherwise, it redirects the user to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

/**
 * Defines all the routes for the application.
 * It uses the AuthContext to conditionally render routes based on
 * the user's authentication status.
 */
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading indicator while the auth state is being determined
  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <Router>
      <Routes>
        {/* Public routes accessible to everyone */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />} />

        {/* Protected routes accessible only to authenticated users */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        
        {/* Add other protected routes here */}

        {/* Fallback route for unknown paths */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

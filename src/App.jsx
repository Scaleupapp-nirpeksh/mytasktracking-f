// src/App.jsx

import React from 'react';
import { AuthProvider } from './state/contexts/AuthContext';
import AppRoutes from './routes/AppRoutes.jsx';
import './App.css';

/**
 * The root component of the application.
 *
 * It wraps the entire application with the AuthProvider to make authentication
 * state available globally. It then renders the AppRoutes component which
 * handles all the page navigation.
 */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

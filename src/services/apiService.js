// src/services/apiService.js

import apiClient from '../api/client';

/**
 * This file centralizes all API calls to the backend. Each function
 * corresponds to a specific backend endpoint, making the code in our
 * page components cleaner and easier to manage.
 */

// --- Auth Service ---

export const login = (email, password) => {
  return apiClient.post('/users/login', { email, password });
};

export const signup = (name, email, password) => {
  return apiClient.post('/users/signup', { name, email, password });
};


// --- Workspace Service ---

export const getAllWorkspaces = () => {
  return apiClient.get('/workspaces');
};

export const getWorkspaceById = (workspaceId) => {
  return apiClient.get(`/workspaces/${workspaceId}`);
};


// --- Task Service ---

export const getAllTasks = (workspaceId = null) => {
  // Handles both general task fetching and fetching for a specific workspace
  const url = workspaceId ? `/workspaces/${workspaceId}/tasks` : '/tasks';
  return apiClient.get(url);
};

export const getTaskById = (taskId) => {
  return apiClient.get(`/tasks/${taskId}`);
};

export const createTask = (taskData) => {
  return apiClient.post('/tasks', taskData);
};

export const updateTask = (taskId, updateData) => {
  return apiClient.patch(`/tasks/${taskId}`, updateData);
};

export const deleteTask = (taskId) => {
  return apiClient.delete(`/tasks/${taskId}`);
};

export const uploadAttachment = (taskId, file) => {
  const formData = new FormData();
  formData.append('attachment', file);
  // Important: Set the Content-Type header for file uploads
  return apiClient.post(`/tasks/${taskId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const parseTaskText = (text) => {
  return apiClient.post('/tasks/parse', { text });
};


// --- Meeting Service ---

export const startMeeting = (initialNotes = '') => {
  return apiClient.post('/meetings', { notes: initialNotes });
};

export const getAllMeetings = () => {
  return apiClient.get('/meetings');
};

export const getMeetingById = (meetingId) => {
  return apiClient.get(`/meetings/${meetingId}`);
};

export const updateMeetingNotes = (meetingId, notes) => {
  return apiClient.patch(`/meetings/${meetingId}`, { notes });
};


// --- Analytics Service ---

export const getWeeklyReport = (workspaceId) => {
  return apiClient.get(`/analytics/reports/weekly/${workspaceId}`);
};


// --- Search Service ---

export const globalSearch = (query) => {
  return apiClient.get(`/search?q=${encodeURIComponent(query)}`);
};


// --- Google Integration Service ---

export const getGoogleAuthUrl = () => {
  return apiClient.get('/integrations/google/auth');
};

import apiClient from '../api/client';

/**
 * API Service Layer
 * 
 * This file centralizes all API calls to the backend. Each function
 * corresponds to a specific backend endpoint, making the code in our
 * page components cleaner and easier to manage.
 * 
 * The service is organized into logical sections:
 * - Authentication
 * - Workspaces
 * - Tasks (CRUD, Status, Attachments, Notes, History)
 * - Meetings
 * - Analytics
 * - Search
 * - Integrations
 */

// =============================================================================
// AUTH SERVICE
// =============================================================================

/**
 * Authenticate user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} API response with user data and token
 */
export const login = (email, password) => {
  return apiClient.post('/users/login', { email, password });
};

/**
 * Register a new user account
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's chosen password
 * @returns {Promise} API response with user data and token
 */
export const signup = (name, email, password) => {
  return apiClient.post('/users/signup', { name, email, password });
};

// =============================================================================
// WORKSPACE SERVICE
// =============================================================================

/**
 * Fetch all workspaces for the authenticated user
 * @returns {Promise} API response with array of workspaces
 */
export const getAllWorkspaces = () => {
  return apiClient.get('/workspaces');
};

/**
 * Fetch a specific workspace by its ID
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise} API response with workspace details
 */
export const getWorkspaceById = (workspaceId) => {
  return apiClient.get(`/workspaces/${workspaceId}`);
};

// =============================================================================
// TASK SERVICE - CORE OPERATIONS
// =============================================================================

/**
 * Fetch all tasks, optionally filtered by workspace
 * @param {string|null} workspaceId - Optional workspace ID to filter tasks
 * @returns {Promise} API response with array of tasks
 */
export const getAllTasks = (workspaceId = null) => {
  // Handles both general task fetching and fetching for a specific workspace
  const url = workspaceId ? `/workspaces/${workspaceId}/tasks` : '/tasks';
  return apiClient.get(url);
};

/**
 * Fetch a specific task by its ID
 * @param {string} taskId - The task ID
 * @returns {Promise} API response with task details
 */
export const getTaskById = (taskId) => {
  return apiClient.get(`/tasks/${taskId}`);
};

/**
 * Create a new task
 * @param {Object} taskData - Task data (title, description, priority, etc.)
 * @returns {Promise} API response with created task
 */
export const createTask = (taskData) => {
  return apiClient.post('/tasks', taskData);
};

/**
 * Update an existing task
 * @param {string} taskId - The task ID to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise} API response with updated task
 */
export const updateTask = (taskId, updateData) => {
  return apiClient.patch(`/tasks/${taskId}`, updateData);
};

/**
 * Delete a task permanently
 * @param {string} taskId - The task ID to delete
 * @returns {Promise} API response confirming deletion
 */
export const deleteTask = (taskId) => {
  return apiClient.delete(`/tasks/${taskId}`);
};

/**
 * Parse natural language text to extract task details
 * @param {string} text - Natural language text describing a task
 * @returns {Promise} API response with parsed task data (title, dueDate, etc.)
 */
export const parseTaskText = (text) => {
  return apiClient.post('/tasks/parse', { text });
};

// =============================================================================
// TASK SERVICE - STATUS MANAGEMENT
// =============================================================================

/**
 * Mark a task as completed
 * @param {string} taskId - The task ID to mark as completed
 * @returns {Promise} API response with updated task
 */
export const markTaskCompleted = (taskId) => {
  return apiClient.patch(`/tasks/${taskId}/complete`);
};

/**
 * Mark a task as pending/incomplete (reopen completed task)
 * @param {string} taskId - The task ID to mark as pending
 * @returns {Promise} API response with updated task
 */
export const markTaskPending = (taskId) => {
  return apiClient.patch(`/tasks/${taskId}/pending`);
};

// =============================================================================
// TASK SERVICE - ATTACHMENTS
// =============================================================================

/**
 * Get all attachments for a specific task
 * @param {string} taskId - The task ID
 * @returns {Promise} API response with array of attachments
 */
export const getTaskAttachments = (taskId) => {
  return apiClient.get(`/tasks/${taskId}/attachments`);
};

/**
 * Upload a file and attach it to a task
 * @param {string} taskId - The task ID to attach the file to
 * @param {File} file - The file object to upload
 * @returns {Promise} API response with uploaded attachment details
 */
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

/**
 * Remove an attachment from a task
 * @param {string} taskId - The task ID
 * @param {string} attachmentId - The attachment ID to remove
 * @returns {Promise} API response confirming removal
 */
export const removeAttachmentFromTask = (taskId, attachmentId) => {
  return apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
};

// =============================================================================
// TASK SERVICE - NOTES
// =============================================================================

/**
 * Get all notes for a specific task with pagination
 * @param {string} taskId - The task ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @param {string} options.sortBy - Sort field (default: '-createdAt')
 * @returns {Promise} API response with paginated notes
 */
export const getTaskNotes = (taskId, options = {}) => {
  const { page = 1, limit = 10, sortBy = '-createdAt' } = options;
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
  });
  
  return apiClient.get(`/tasks/${taskId}/notes?${params}`);
};

/**
 * Add a new note to a task
 * @param {string} taskId - The task ID
 * @param {string} content - Note content
 * @returns {Promise} API response with created note
 */
export const addNoteToTask = (taskId, content) => {
  return apiClient.post(`/tasks/${taskId}/notes`, { content });
};

/**
 * Update an existing note in a task
 * @param {string} taskId - The task ID
 * @param {string} noteId - The note ID to update
 * @param {string} content - Updated note content
 * @returns {Promise} API response with updated note
 */
export const updateNoteInTask = (taskId, noteId, content) => {
  return apiClient.patch(`/tasks/${taskId}/notes/${noteId}`, { content });
};

/**
 * Delete a note from a task
 * @param {string} taskId - The task ID
 * @param {string} noteId - The note ID to delete
 * @returns {Promise} API response confirming deletion
 */
export const deleteNoteFromTask = (taskId, noteId) => {
  return apiClient.delete(`/tasks/${taskId}/notes/${noteId}`);
};

// =============================================================================
// TASK SERVICE - HISTORY & ACTIVITY
// =============================================================================

/**
 * Get task history/activity log with filtering and pagination
 * @param {string} taskId - The task ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.action - Filter by action type (optional)
 * @param {string} options.user - Filter by user ID (optional)
 * @returns {Promise} API response with paginated history entries
 */
export const getTaskHistory = (taskId, options = {}) => {
  const { page = 1, limit = 20, action, user } = options;
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (action) params.append('action', action);
  if (user) params.append('user', user);
  
  return apiClient.get(`/tasks/${taskId}/history?${params}`);
};

/**
 * Get task activity summary (recent notes, history, and statistics)
 * @param {string} taskId - The task ID
 * @returns {Promise} API response with activity summary
 */
export const getTaskActivitySummary = (taskId) => {
  return apiClient.get(`/tasks/${taskId}/activity`);
};

/**
 * Add a manual history entry to a task (for special events or custom tracking)
 * @param {string} taskId - The task ID
 * @param {string} action - Action type identifier
 * @param {string} description - Human-readable description of the event
 * @param {Object} metadata - Additional data for the history entry (optional)
 * @returns {Promise} API response with created history entry
 */
export const addHistoryEntry = (taskId, action, description, metadata = {}) => {
  return apiClient.post(`/tasks/${taskId}/history`, {
    action,
    description,
    metadata,
  });
};

// =============================================================================
// MEETING SERVICE
// =============================================================================

/**
 * Start a new meeting session
 * @param {string} initialNotes - Optional initial notes for the meeting
 * @returns {Promise} API response with meeting details
 */
export const startMeeting = (initialNotes = '') => {
  return apiClient.post('/meetings', { notes: initialNotes });
};

/**
 * Get all meetings for the authenticated user
 * @returns {Promise} API response with array of meetings
 */
export const getAllMeetings = () => {
  return apiClient.get('/meetings');
};

/**
 * Get a specific meeting by its ID
 * @param {string} meetingId - The meeting ID
 * @returns {Promise} API response with meeting details
 */
export const getMeetingById = (meetingId) => {
  return apiClient.get(`/meetings/${meetingId}`);
};

/**
 * Update meeting notes
 * @param {string} meetingId - The meeting ID
 * @param {string} notes - Updated meeting notes
 * @returns {Promise} API response with updated meeting
 */
export const updateMeetingNotes = (meetingId, notes) => {
  return apiClient.patch(`/meetings/${meetingId}`, { notes });
};

/**
 * Delete a meeting permanently
 * @param {string} meetingId - The meeting ID to delete
 * @returns {Promise} API response confirming deletion
 */
export const deleteMeeting = (meetingId) => {
  return apiClient.delete(`/meetings/${meetingId}`);
};

// =============================================================================
// ANALYTICS SERVICE
// =============================================================================

/**
 * Get weekly analytics report for a workspace
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise} API response with weekly report data
 */
export const getWeeklyReport = (workspaceId) => {
  return apiClient.get(`/analytics/reports/weekly/${workspaceId}`);
};

// =============================================================================
// SEARCH SERVICE
// =============================================================================

/**
 * Perform a global search across all user data
 * @param {string} query - Search query string
 * @returns {Promise} API response with search results
 */
export const globalSearch = (query) => {
  return apiClient.get(`/search?q=${encodeURIComponent(query)}`);
};

// =============================================================================
// INTEGRATION SERVICE
// =============================================================================

/**
 * Get Google OAuth authorization URL for calendar integration
 * @returns {Promise} API response with Google auth URL
 */
export const getGoogleAuthUrl = () => {
  return apiClient.get('/integrations/google/auth');
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Helper function to build query parameters for API requests
 * @param {Object} params - Key-value pairs for query parameters
 * @returns {string} URL-encoded query string
 */
export const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

/**
 * Helper function to handle file uploads with progress tracking
 * @param {string} taskId - The task ID
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback function (optional)
 * @returns {Promise} API response with upload result
 */
export const uploadAttachmentWithProgress = (taskId, file, onProgress = null) => {
  const formData = new FormData();
  formData.append('attachment', file);
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted);
    };
  }
  
  return apiClient.post(`/tasks/${taskId}/attachments`, formData, config);
};

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Batch update multiple tasks at once
 * @param {Array} taskUpdates - Array of {taskId, updateData} objects
 * @returns {Promise} Array of promises for each update operation
 */
export const batchUpdateTasks = (taskUpdates) => {
  return Promise.allSettled(
    taskUpdates.map(({ taskId, updateData }) => updateTask(taskId, updateData))
  );
};

/**
 * Batch delete multiple tasks at once
 * @param {Array} taskIds - Array of task IDs to delete
 * @returns {Promise} Array of promises for each delete operation
 */
export const batchDeleteTasks = (taskIds) => {
  return Promise.allSettled(
    taskIds.map(taskId => deleteTask(taskId))
  );
};

/**
 * Get comprehensive task data including notes and history
 * @param {string} taskId - The task ID
 * @returns {Promise} Object with task, notes, and activity data
 */
export const getTaskWithFullDetails = async (taskId) => {
  try {
    const [taskResponse, notesResponse, activityResponse] = await Promise.all([
      getTaskById(taskId),
      getTaskNotes(taskId, { limit: 5 }), // Get recent notes
      getTaskActivitySummary(taskId),
    ]);
    
    return {
      task: taskResponse.data.data.task,
      notes: notesResponse.data.data.notes,
      activity: activityResponse.data.data,
    };
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};
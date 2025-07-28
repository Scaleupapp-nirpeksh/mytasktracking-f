// src/api/client.js

import axios from 'axios';

/**
 * Creates a pre-configured instance of the Axios client.
 *
 * This instance is set up with the base URL of our backend API, which is
 * read from the environment variables. Using a single, configured instance
 * like this is a best practice that makes API requests cleaner and easier
 * to manage. It also provides a central place to add interceptors for
 * handling things like authentication tokens.
 */
const apiClient = axios.create({
  // Vite exposes environment variables on the `import.meta.env` object.
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/**
 * Axios request interceptor.
 *
 * This function automatically attaches the user's JWT token to the
 * Authorization header for every outgoing request. This allows the backend
 * to authenticate and authorize the user for protected routes.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the user data from local storage.
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      const token = userData?.token;
      if (token) {
        // If a token exists, add it to the request headers.
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Handle any errors during request configuration.
    return Promise.reject(error);
  }
);

export default apiClient;

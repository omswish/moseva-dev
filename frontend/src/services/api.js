import axios from 'axios';

let store;

/**
 * Dynamically inject Redux store to resolve circular dependency with auth state
 * @param {object} _store Redux store instance
 */
export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach access token from Redux store if available
api.interceptors.request.use(
  (config) => {
    if (store) {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle silent JWT refresh on 401 token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        
        // Call refresh endpoint (sends httpOnly cookies automatically)
        const response = await axios.post(
          `${refreshBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;

        if (store) {
          store.dispatch({ type: 'auth/tokenRefreshed', payload: accessToken });
        }

        // Retry original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        if (store) {
          store.dispatch({ type: 'auth/logout' });
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

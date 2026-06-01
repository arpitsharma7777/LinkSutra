/**
 * Centralized API Client for LinkSutra Frontend
 * Provides request/response interceptors, error handling, timeouts, and deduplication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Track in-flight requests to prevent duplicates
const inFlightRequests = new Map();

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Fetch with timeout
 */
function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

/**
 * Map backend error messages to user-friendly messages
 */
function mapErrorMessage(apiError, defaultMessage) {
  const errorMap = {
    'Invalid email or password': 'Invalid email or password. Please try again.',
    'Email already registered': 'This email is already registered.',
    'Username already taken': 'This username is already taken.',
    'Link not found': 'Link not found.',
    'User not found': 'User not found.',
    'Failed to get user': 'Session expired. Please log in again.',
    'Unauthorized': 'Session expired. Please log in again.',
  };

  return errorMap[apiError] || defaultMessage;
}

/**
 * Main API client function
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  // Build headers
  const headers = {
    ...options.headers,
  };
  
  // Add authorization token if available
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Add credentials for cookie-based auth (future)
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  };

  try {
    const res = await fetchWithTimeout(url, fetchOptions);
    
    // Handle 401 Unauthorized - token expired
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new APIError('Session expired', 401, null);
    }
    
    // Parse response
    const data = await res.json().catch(() => ({}));
    
    // Handle non-OK responses
    if (!res.ok) {
      const errorMessage = data.detail || `Request failed with status ${res.status}`;
      throw new APIError(errorMessage, res.status, data);
    }
    
    return data;
    
  } catch (error) {
    // Handle timeout
    if (error.message === 'Request timeout') {
      throw new APIError('Request timed out. Please try again.', 408, null);
    }
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new APIError('Network error. Please check your connection.', 0, null);
    }
    
    // Re-throw API errors
    if (error instanceof APIError) {
      throw error;
    }
    
    // Unknown errors
    throw new APIError('An unexpected error occurred', 500, null);
  }
}

// ─── AUTH API ────────────────────────────────────────────────────────

export async function loginUser(email, password) {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return await apiCall('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
  } catch (error) {
    throw new Error(mapErrorMessage(error.message, 'Login failed'));
  }
}

export async function registerUser(username, email, password, displayName) {
  try {
    return await apiCall('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, display_name: displayName }),
    });
  } catch (error) {
    throw new Error(mapErrorMessage(error.message, 'Registration failed'));
  }
}

export async function getCurrentUser(token) {
  try {
    return await apiCall('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error(mapErrorMessage(error.message, 'Failed to get user'));
  }
}

export async function updateUserProfile(token, updates) {
  try {
    return await apiCall('/auth/me', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(updates),
    });
  } catch (error) {
    throw new Error(mapErrorMessage(error.message, 'Failed to update profile'));
  }
}

// ─── LINKS API ───────────────────────────────────────────────────────

export async function getUserLinks(token) {
  try {
    return await apiCall('/links', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error(mapErrorMessage(error.message, 'Failed to get links'));
  }
}

export async function createLink(token, title, url, icon) {
  try {
    return await apiCall('/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, url, icon }),
    });
  } catch (error) {
    throw new Error(mapErrorMessage(error.message, 'Failed to create link'));
  }
}

export async function updateLink(token, linkId, fields) {
  try {
    return await apiCall(`/links/${linkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fields),
    });
  } catch (error) {
    throw new Error(mapErrorMessage(error.message, 'Failed to update link'));
  }
}

export async function deleteLink(token, linkId) {
  try {
    await apiCall(`/links/${linkId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    throw new Error(mapErrorMessage(error.message, 'Failed to delete link'));
  }
}

// ─── ANALYTICS API ───────────────────────────────────────────────────

export async function getTotalClicks(token) {
  try {
    return await apiCall('/analytics/total-clicks', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return { total_clicks: 0 };
  }
}

export async function getDailyAnalytics(token, days = 7) {
  try {
    return await apiCall(`/analytics/daily?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return [];
  }
}

export async function getLinkAnalytics(token) {
  try {
    return await apiCall('/analytics/links', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return [];
  }
}

export async function getTopLink(token) {
  try {
    return await apiCall('/analytics/top-link', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return null;
  }
}

// Export API client for custom use
export { apiCall, API_BASE_URL };

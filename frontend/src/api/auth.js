// DEPRECATED: Use ../api/client.js instead
// This file is kept for backward compatibility only
// TODO: Remove after migration

export { 
  loginUser,
  registerUser,
  getCurrentUser,
  updateUserProfile,
  getUserLinks,
  createLink,
  updateLink,
  deleteLink,
  getTotalClicks,
  getDailyAnalytics,
  getLinkAnalytics,
  getTopLink
} from './client.js';
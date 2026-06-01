const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Helper to extract clean error messages from FastAPI's 422 array structure
function getErrorMessage(data, defaultMsg) {
  if (!data || !data.detail) return defaultMsg;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map(err => {
      const field = err.loc ? err.loc[err.loc.length - 1] : "";
      const fieldName = field ? field.charAt(0).toUpperCase() + field.slice(1) : "";
      return `${fieldName ? fieldName + ": " : ""}${err.msg}`;
    }).join(", ");
  }
  return JSON.stringify(data.detail) || defaultMsg;
}

// ── Auth ──────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(getErrorMessage(data, "Login failed"));
  return data;
}

export async function registerUser(username, email, password, displayName) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, display_name: displayName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(getErrorMessage(data, "Registration failed"));
  return data;
}

export async function getCurrentUser(token) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to get user"));
  return data;
}

// ── Links ─────────────────────────────────────────────────────
export async function getUserLinks(token) {
  const res = await fetch(`${BASE_URL}/links`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to get links"));
  return data;
}

export async function createLink(token, title, url, icon) {
  const res = await fetch(`${BASE_URL}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, url, icon }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to create link"));
  return data;
}

export async function updateLink(token, linkId, fields) {
  const res = await fetch(`${BASE_URL}/links/${linkId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to update link"));
  return data;
}

export async function deleteLink(token, linkId) {
  const res = await fetch(`${BASE_URL}/links/${linkId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(getErrorMessage(data, "Failed to delete link"));
  }
  return true;
}

// ── Analytics ─────────────────────────────────────────────────
export async function getTotalClicks(token) {
  const res = await fetch(`${BASE_URL}/analytics/total-clicks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) return { total_clicks: 0 };
  return data;
}

export async function getDailyAnalytics(token, days = 7) {
  const res = await fetch(`${BASE_URL}/analytics/daily?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) return [];
  return data;
}

export async function getLinkAnalytics(token) {
  const res = await fetch(`${BASE_URL}/analytics/links`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) return [];
  return data;
}

export async function getTopLink(token) {
  const res = await fetch(`${BASE_URL}/analytics/top-link`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) return null;
  return data;
}

export async function updateUserProfile(token, updates) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to update profile"));
  return data;
}

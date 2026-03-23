const BASE_URL = "http://127.0.0.1:8000";

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
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
}

export async function registerUser(username, email, password, displayName) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, display_name: displayName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Registration failed");
  return data;
}

export async function getCurrentUser(token) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to get user");
  return data;
}

// ── Links ─────────────────────────────────────────────────────
export async function getUserLinks(token) {
  const res = await fetch(`${BASE_URL}/links`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to get links");
  return data;
}

export async function createLink(token, title, url) {
  const res = await fetch(`${BASE_URL}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to create link");
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
  if (!res.ok) throw new Error(data.detail || "Failed to update link");
  return data;
}

export async function deleteLink(token, linkId) {
  const res = await fetch(`${BASE_URL}/links/${linkId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to delete link");
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
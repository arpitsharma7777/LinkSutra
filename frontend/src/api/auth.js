const BASE_URL = "http://localhost:8000";

// POST /auth/login — sends form-encoded data (OAuth2PasswordRequestForm)
export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);   // backend uses email in "username" field
  formData.append("password", password);

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data; // { access_token, token_type }
}

// POST /auth/register — sends JSON
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

// GET /auth/me — get current user profile (requires token)
export async function getCurrentUser(token) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch user");
  return data; // { id, username, email, display_name, bio, avatar_url, created_at }
}

// GET /links — get user's links (requires token)
export async function getUserLinks(token) {
  const res = await fetch(`${BASE_URL}/links`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch links");
  return data; // array of links
}

// POST /links — create a new link (requires token)
export async function createLink(token, title, url, icon = null) {
  const res = await fetch(`${BASE_URL}/links`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, url, icon }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to create link");
  return data; // new link object
}

// PUT /links/{link_id} — update a link (requires token)
export async function updateLink(token, link_id, title, url, is_active = true) {
  const res = await fetch(`${BASE_URL}/links/${link_id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, url, is_active }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to update link");
  return data; // updated link object
}

// DELETE /links/{link_id} — delete a link (requires token)
export async function deleteLink(token, link_id) {
  const res = await fetch(`${BASE_URL}/links/${link_id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to delete link");
  return data; // { message: "Link deleted" }
}

// PUT /links/reorder — reorder links (requires token)
export async function reorderLinks(token, linkIds) {
  const res = await fetch(`${BASE_URL}/links/reorder`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(linkIds),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to reorder links");
  return data;
}
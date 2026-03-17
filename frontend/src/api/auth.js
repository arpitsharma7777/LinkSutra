const BASE_URL = "http://127.0.0.1:8000";

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
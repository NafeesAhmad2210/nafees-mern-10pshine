const API_BASE =
  import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()
    ? String(import.meta.env.VITE_API_URL).replace(/\/$/, "")
    : "";

function getToken() {
  return localStorage.getItem("token");
}

const USER_KEY = "user";

export function setUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function apiFetch(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? path : "/" + path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  // Handle 204 No Content or empty responses
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg =
      data?.error ||
      data?.message ||
      res.statusText ||
      `Request failed (${res.status})`;
    throw new Error(errorMsg);
  }
  return data;
}

export async function signup(name, email, password) {
  return apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email, password) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe() {
  return apiFetch("/api/auth/me");
}

export async function requestPasswordReset(email) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(email, otp) {
  return apiFetch("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function resetPassword(token, password) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
    setUser(null);
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export async function getNotes() {
  return apiFetch("/api/notes");
}

export async function getImportantNotes() {
  return apiFetch("/api/notes?important=true");
}

export async function getTrashedNotes() {
  return apiFetch("/api/notes?trashed=true");
}

export async function createNote(title, content, important) {
  return apiFetch("/api/notes", {
    method: "POST",
    body: JSON.stringify({
      title,
      content: content || "",
      important: Boolean(important),
    }),
  });
}

export async function updateNote(id, body) {
  const noteId = (id == null ? "" : String(id)).trim();
  if (!noteId) throw new Error("Note ID required");
  return apiFetch(`/api/notes/${encodeURIComponent(noteId)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function trashNote(id) {
  return updateNote(id, { trashed: true });
}

export async function restoreNote(id) {
  return updateNote(id, { trashed: false });
}

// Permanently delete a note from database
export async function deleteNotePermanent(id) {
  const noteId = (id == null ? "" : String(id)).trim();
  if (!noteId) throw new Error("Note ID required");
  return apiFetch(`/api/notes/${encodeURIComponent(noteId)}`, {
    method: "DELETE",
  });
}

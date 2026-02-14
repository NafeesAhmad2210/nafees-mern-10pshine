const API_BASE =
  import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()
    ? String(import.meta.env.VITE_API_URL).replace(/\/$/, "")
    : "";

function getToken() {
  return localStorage.getItem("token");
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
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
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

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
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
  const noteId = typeof id === "string" ? id : String(id);
  return apiFetch(`/api/notes/${noteId}`, {
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

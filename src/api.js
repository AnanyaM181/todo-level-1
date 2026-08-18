const BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getTodos: () => request("/todos"),
  addTodo: (text) => request("/todos", { method: "POST", body: JSON.stringify({ text }) }),
  updateTodo: (id, updates) =>
    request(`/todos/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: "DELETE" }),
};

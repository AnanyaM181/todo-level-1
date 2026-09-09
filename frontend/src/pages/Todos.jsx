import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import confetti from "canvas-confetti";

export default function Todos() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .catch((err) => {
        if (err.status === 401) logout();
        else setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setError("");
    try {
      const todo = await api.addTodo(trimmed, description.trim(), priority);
      setTodos((prev) => [todo, ...prev]);
      setText("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodo = async (todo) => {
    setTodos((prev) =>
      prev.map((t) => (t._id === todo._id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await api.updateTodo(todo._id, { completed: !todo.completed });
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? { ...t, completed: todo.completed } : t))
      );
      setError(err.message);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
    setEditDescription(todo.description || "");
    setEditPriority(todo.priority || "medium");
  };

  const saveEdit = async (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return setEditingId(null);
    try {
      const updated = await api.updateTodo(id, {
        text: trimmed,
        description: editDescription.trim(),
        priority: editPriority
      });
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    } finally {
      setEditingId(null);
    }
  };

  const removeTodo = async (id) => {
    const prev = todos;
    setTodos((p) => p.filter((t) => t._id !== id));
    try {
      await api.deleteTodo(id);
    } catch (err) {
      setTodos(prev);
      setError(err.message);
    }
  };

  const remaining = todos.filter((t) => !t.completed).length;
  useEffect(() => {
    if (todos.length > 0 && remaining === 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2f6d5a", "#d9a441", "#4a9e7f", "#e63946"],
      });
    }
  }, [remaining, todos.length]);
    const filteredTodos = todos
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) => {
      if (priorityFilter === "all") return true;
      return t.priority === priorityFilter;
    })
    .filter((t) => {
      if (!search.trim()) return true;
      return (
        t.text.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    });

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <span className="brand-mark">Daybook</span>
          <h1>{today}</h1>
          <p className="header-sub">
            Hey {user?.name?.split(" ")[0]}! —{" "}
            {todos.length === 0
              ? "your list is empty. Add your first task below."
              : remaining === 0
                ? "everything's done. Nice."
                : `${remaining} task${remaining === 1 ? "" : "s"} to go.`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="dark-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button className="btn-ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <form className="add-row" onSubmit={addTodo}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task…"
            maxLength={300}
            aria-label="New task"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description… (optional)"
            maxLength={1000}
            aria-label="Task description"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Add</button>
      </form>

      {error && <p className="form-error" role="alert">{error}</p>}

      {/* Filter Bar */}
            {/* Search Bar */}
      <div style={{ margin: "0 0 12px 0", position: "relative" }}>
        <span style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--ink-soft)",
          fontSize: "1rem"
        }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            borderRadius: "10px",
            border: "1px solid var(--line)",
            font: "inherit",
            background: "var(--card)",
            color: "var(--ink)",
            fontSize: "0.95rem"
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-soft)",
              fontSize: "1rem"
            }}
          >✕</button>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px", margin: "16px 0", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: filter === "all" ? "#2d6a4f" : "#eee",
              color: filter === "all" ? "white" : "#333",
              fontWeight: filter === "all" ? "bold" : "normal"
            }}
          >All</button>
          <button
            onClick={() => setFilter("active")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: filter === "active" ? "#2d6a4f" : "#eee",
              color: filter === "active" ? "white" : "#333",
              fontWeight: filter === "active" ? "bold" : "normal"
            }}
          >Pending</button>
          <button
            onClick={() => setFilter("completed")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: filter === "completed" ? "#2d6a4f" : "#eee",
              color: filter === "completed" ? "white" : "#333",
              fontWeight: filter === "completed" ? "bold" : "normal"
            }}
          >Completed</button>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setPriorityFilter("all")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: priorityFilter === "all" ? "#555" : "#eee",
              color: priorityFilter === "all" ? "white" : "#333",
            }}
          >All Priority</button>
          <button
            onClick={() => setPriorityFilter("high")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: priorityFilter === "high" ? "#e63946" : "#eee",
              color: priorityFilter === "high" ? "white" : "#333",
            }}
          >🔴 High</button>
          <button
            onClick={() => setPriorityFilter("medium")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: priorityFilter === "medium" ? "#f4a261" : "#eee",
              color: priorityFilter === "medium" ? "white" : "#333",
            }}
          >🟡 Medium</button>
          <button
            onClick={() => setPriorityFilter("low")}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: priorityFilter === "low" ? "#2d6a4f" : "#eee",
              color: priorityFilter === "low" ? "white" : "#333",
            }}
          >🟢 Low</button>
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading your list…</p>
      ) : (
        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li style={{ listStyle: "none" }} className="muted">No tasks found!</li>
          ) : filteredTodos.map((todo) => (
            <li key={todo._id} className={todo.completed ? "done" : ""}>
              <label className="check-wrap">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />
                <span className="checkmark" aria-hidden="true" />
              </label>

              <div style={{ flex: 1 }}>
                {editingId === todo._id ? (
                  <>
                    <input
                      className="edit-input"
                      value={editText}
                      autoFocus
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(todo._id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(todo._id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <input
                      className="edit-input"
                      value={editDescription}
                      placeholder="Edit description…"
                      onChange={(e) => setEditDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(todo._id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "4px" }}
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </>
                ) : (
                  <>
                    <span className="todo-text" onDoubleClick={() => startEdit(todo)}>
                      {todo.priority === "high" && "🔴 "}
                      {todo.priority === "medium" && "🟡 "}
                      {todo.priority === "low" && "🟢 "}
                      {todo.text}
                    </span>
                    {todo.description && (
                      <p style={{ fontSize: "0.85em", color: "#666", margin: "4px 0 0" }}>
                        {todo.description}
                      </p>
                    )}
                  </>
                )}
                <p style={{ fontSize: "0.75em", color: "#999", margin: "4px 0 0" }}>
                  Created: {new Date(todo.createdAt).toLocaleString()}
                  {todo.updatedAt !== todo.createdAt && (
                    <span> · Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
                  )}
                </p>
              </div>

              <div className="row-actions">
                <button className="btn-icon" onClick={() => startEdit(todo)} aria-label="Edit task">✎</button>
                <button className="btn-icon danger" onClick={() => removeTodo(todo._id)} aria-label="Delete task">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

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
        <button className="btn-ghost" onClick={logout}>
          Log out
        </button>
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

      {loading ? (
        <p className="muted">Loading your list…</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
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
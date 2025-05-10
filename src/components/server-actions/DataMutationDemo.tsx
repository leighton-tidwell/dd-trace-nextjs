"use client";

import { useState, useEffect } from "react";
import {
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
} from "@/utils/wrap-server-actions";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function DataMutationDemo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos on component mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const result = await getTodos();
        setTodos(result);
      } catch (err) {
        setError("Failed to load todos");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const newTodo = await addTodo(newTodoText);
      setTodos((prev) => [...prev, newTodo]);
      setNewTodoText("");
    } catch (err) {
      setError("Failed to add todo");
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await toggleTodo(id);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  return (
    <div className="todo-container">
      <h3>Todo List with Server Actions</h3>
      <p>This component uses server actions to mutate data.</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !newTodoText.trim()}>
          Add
        </button>
      </form>

      {isLoading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-state">No todos yet. Add one above!</li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  <span className="todo-text">{todo.text}</span>
                </label>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      <style jsx>{`
        .todo-container {
          padding: 1.5rem;
          border: 1px solid #333;
          border-radius: 8px;
          background-color: #1a1a1a;
          margin-bottom: 2rem;
          color: #dddddd;
        }

        .error-message {
          padding: 0.5rem 1rem;
          background-color: #3a1a1a;
          border: 1px solid #5a2a2a;
          color: #ff7875;
          border-radius: 4px;
          margin: 1rem 0;
        }

        .add-todo-form {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #444;
          border-radius: 4px;
          font-size: 1rem;
          background-color: #333333;
          color: #dddddd;
        }

        button {
          padding: 0.5rem 1rem;
          background-color: #1a3a4a;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
        }

        button:hover:not(:disabled) {
          background-color: #2a5a7a;
        }

        button:disabled {
          background-color: #333333;
          cursor: not-allowed;
        }

        .loading {
          padding: 1rem;
          text-align: center;
          color: #bbbbbb;
        }

        .todo-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .empty-state {
          padding: 1rem;
          text-align: center;
          color: #bbbbbb;
          font-style: italic;
          border: 1px dashed #444;
          border-radius: 4px;
        }

        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          border-bottom: 1px solid #333;
        }

        .todo-item:last-child {
          border-bottom: none;
        }

        .todo-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #dddddd;
        }

        .todo-text {
          transition: text-decoration 0.2s, opacity 0.2s;
          color: #dddddd;
        }

        .completed .todo-text {
          text-decoration: line-through;
          opacity: 0.6;
        }

        .delete-button {
          padding: 0.25rem 0.5rem;
          background-color: #5a2a2a;
          color: #ffffff;
          font-size: 0.8rem;
        }

        .delete-button:hover {
          background-color: #7a3a3a;
        }
      `}</style>
    </div>
  );
}

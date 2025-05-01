"use server";

// This file contains server actions for todo management

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// In-memory storage for todos (in a real app, this would be a database)
let todos: Todo[] = [
  { id: "1", text: "Learn React Server Components", completed: false },
  { id: "2", text: "Test Datadog with RSC", completed: false },
  { id: "3", text: "Build a demo application", completed: true },
];

export async function getTodos(): Promise<Todo[]> {
  // Simulate server latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Perform some CPU-intensive operations to test profiling
  performHeavyComputation();

  // Return a copy of the todos
  return [...todos];
}

export async function addTodo(text: string): Promise<Todo> {
  // Validate input
  if (!text || !text.trim()) {
    throw new Error("Todo text is required");
  }

  // Simulate server latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Create a new todo
  const newTodo: Todo = {
    id: generateId(),
    text: text.trim(),
    completed: false,
  };

  // Add to the list
  todos.push(newTodo);

  // Perform some CPU-intensive operations to test profiling
  performHeavyComputation();

  // Return the new todo
  return newTodo;
}

export async function toggleTodo(id: string): Promise<Todo> {
  // Find the todo
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    throw new Error(`Todo with id ${id} not found`);
  }

  // Simulate server latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Toggle the completed status
  todos[todoIndex] = {
    ...todos[todoIndex],
    completed: !todos[todoIndex].completed,
  };

  // Perform some CPU-intensive operations to test profiling
  performHeavyComputation();

  // Return the updated todo
  return todos[todoIndex];
}

export async function deleteTodo(id: string): Promise<void> {
  // Check if the todo exists
  const todoExists = todos.some((todo) => todo.id === id);
  if (!todoExists) {
    throw new Error(`Todo with id ${id} not found`);
  }

  // Simulate server latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Remove the todo
  todos = todos.filter((todo) => todo.id !== id);

  // Perform some CPU-intensive operations to test profiling
  performHeavyComputation();
}

// Helper functions
function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function performHeavyComputation(): number {
  // Simulate a CPU-intensive task
  let result = 0;
  for (let i = 0; i < 500000; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }

  return result;
}

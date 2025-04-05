'use client';

import { useOptimistic, useState, FormEvent } from 'react';

// Sample data model
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

// For demonstrating server delay
const simulateServerDelay = () => new Promise<void>(resolve => setTimeout(resolve, 1000));

export default function UseOptimisticDemo() {
  // Initial todos
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Learn Next.js', completed: false },
    { id: 3, text: 'Learn useOptimistic hook', completed: false },
  ]);

  // Track form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup optimistic state
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  // Handler for adding a new todo
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Store a reference to the form before async operations
    const form = e.currentTarget;
    
    // Get form data
    const formData = new FormData(form);
    const text = formData.get('todoText') as string;
    
    if (!text.trim()) {
      setIsSubmitting(false);
      return;
    }

    // Create a new todo object
    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      completed: false
    };

    // Show optimistic update immediately
    addOptimisticTodo(newTodo);

    // Simulate server delay
    await simulateServerDelay();

    // After "server" processing, update the actual state
    setTodos(prev => [...prev, newTodo]);
    
    // Clear the form and reset submission state using the stored reference
    form.reset();
    setIsSubmitting(false);
  }

  // Function to toggle todo completion status
  async function toggleTodo(id: number) {
    // Create an optimistic version of the updated todos
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    // Set optimistic state directly
    setTodos(updatedTodos);

    // Simulate server delay
    await simulateServerDelay();

    // In a real app, you'd verify the server response here
    // and potentially revert if there was an error
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-black">useOptimistic Demo</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Add a New Todo</h2>
        <form id="todo-form" onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            name="todoText"
            placeholder="Enter a new todo..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-r-lg bg-blue-600 text-white font-medium ${
              isSubmitting ? 'opacity-70' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </form>
        <p className="text-xs text-gray-700 mt-2">
          Note: There's a 1-second delay to simulate server latency, but the UI updates immediately.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Todo List</h2>
        <ul className="space-y-2">
          {optimisticTodos.map(todo => (
            <li 
              key={todo.id} 
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-3 h-5 w-5 text-blue-600"
              />
              <span className={`flex-grow text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

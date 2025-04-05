'use client';

import { useState, useTransition, ChangeEvent, FormEvent } from 'react';

// Sample data array - using a larger dataset to demonstrate performance benefits
const generateItems = () => {
  return Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    category: i % 5 === 0 ? 'A' : i % 3 === 0 ? 'B' : 'C'
  }));
};

export default function UseTransitionDemo() {
  // State for all items and filtered items
  const [items] = useState(() => generateItems());
  const [filteredItems, setFilteredItems] = useState(items);
  
  // State for the filter input
  const [filterText, setFilterText] = useState('');
  
  // Using useTransition for the filtering operation
  const [isPending, startTransition] = useTransition();
  
  // Handles the filter input change
  function handleFilterChange(e: ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    
    // Update the input value immediately (urgent update)
    setFilterText(text);
    
    // Wrap the filtering in startTransition (non-urgent update)
    startTransition(() => {
      if (text.trim() === '') {
        setFilteredItems(items);
      } else {
        // Intentionally use a slow filtering algorithm to demonstrate the benefit
        const filtered = items.filter(item => {
          // Artificial delay to simulate an expensive computation
          const start = performance.now();
          while (performance.now() - start < 0.1) {
            // Busy wait to simulate CPU-intensive work
          }
          
          return item.name.toLowerCase().includes(text.toLowerCase()) ||
                 item.category.toLowerCase().includes(text.toLowerCase());
        });
        
        setFilteredItems(filtered);
      }
    });
  }
  
  // Sorting functionality
  function handleSort(sortBy: 'id' | 'name' | 'category') {
    startTransition(() => {
      setFilteredItems(prev => [...prev].sort((a, b) => {
        if (sortBy === 'id') return a.id - b.id;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return a.category.localeCompare(b.category);
      }));
    });
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-black">useTransition Demo</h1>
        <p className="text-gray-700">
          This demo shows how <code className="bg-gray-100 px-1 py-0.5 rounded">useTransition</code> helps 
          maintain UI responsiveness during expensive operations like filtering and sorting large lists.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="relative w-full md:w-auto flex-grow">
            <input
              type="text"
              value={filterText}
              onChange={handleFilterChange}
              placeholder="Filter items..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            {isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleSort('id')}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-sm font-medium"
            >
              Sort by ID
            </button>
            <button 
              onClick={() => handleSort('name')}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-sm font-medium"
            >
              Sort by Name
            </button>
            <button 
              onClick={() => handleSort('category')}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-sm font-medium"
            >
              Sort by Category
            </button>
          </div>
        </div>
        
        {isPending && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
            Processing your request... The UI remains responsive while this happens!
          </div>
        )}
        
        <div className="text-sm text-gray-600 mb-2">
          {isPending ? 'Calculating...' : `Showing ${filteredItems.length} of ${items.length} items`}
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.slice(0, 20).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length > 20 && (
          <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
            Showing 20 of {filteredItems.length} items
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">How useTransition Works</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            <strong>Urgent updates</strong> (like typing in the input) happen immediately
          </li>
          <li>
            <strong>Non-urgent updates</strong> (filtering the list) are wrapped in startTransition
          </li>
          <li>
            React will <strong>prioritize</strong> keeping the UI responsive during expensive operations
          </li>
          <li>
            The <strong>isPending</strong> flag lets you show loading states while transitions are in progress
          </li>
        </ul>
      </div>
    </div>
  );
}

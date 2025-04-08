'use client';

import { useState, useTransition, ChangeEvent, useEffect } from 'react';

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
  
  // State to track the current sort type
  const [currentSort, setCurrentSort] = useState<string | null>(null);
  
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
        const filtered = items.filter(item => {
          return item.name.toLowerCase().includes(text.toLowerCase()) ||
                 item.category.toLowerCase().includes(text.toLowerCase());
        });
        
        setFilteredItems(filtered);
      }
    });
  }
  
  // Sorting functionality
  function handleSort(sortBy: 'id' | 'name' | 'category') {
    // Update current sort type for UI feedback
    setCurrentSort(sortBy);
    
    // Use startTransition to make this non-urgent
    startTransition(() => {
      // Sort the items
      const sorted = [...filteredItems].sort((a, b) => {
        if (sortBy === 'id') return a.id - b.id;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return a.category.localeCompare(b.category);
      });
      
      // Set the sorted items with a timeout to simulate server delay
      setTimeout(() => {
        setFilteredItems(sorted);
      }, 1000);
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
            {isPending && filterText && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500">isPending</div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {['id', 'name', 'category'].map((sortType) => (
              <button 
                key={sortType}
                onClick={() => handleSort(sortType as 'id' | 'name' | 'category')}
                disabled={isPending && currentSort === sortType}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                  isPending && currentSort === sortType
                    ? 'bg-blue-100 text-blue-700 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {isPending && currentSort === sortType ? (
                  <span className="animate-spin h-3 w-3 border-t-2 border-b-2 border-blue-500 rounded-full mr-2">isPending</span>
                ) : (
                  <span>Sort by {sortType.charAt(0).toUpperCase() + sortType.slice(1)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {isPending && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
            {currentSort ? 
              `Sorting by ${currentSort}...` : 
              `Filtering for "${filterText}"...`} 
            The UI remains responsive while this happens!
          </div>
        )}
        
        <div className="text-sm text-gray-600 mb-2">
          {isPending ? 'Processing...' : `Showing ${filteredItems.length} of ${items.length} items`}
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

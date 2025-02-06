import React, { useState } from 'react';
import { Code2 } from 'lucide-react';
import IDE from './components/IDE';
import Chat from './components/Chat';
import SearchBar from './components/SearchBar';

function App() {
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">CodeAnalyzer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} analyzing={analyzing} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
          <Chat query={query} />
          <IDE query={query} />
        </div>
      </main>
    </div>
  );
}

export default App;
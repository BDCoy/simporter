import React, { useState } from 'react';
import { 
  Beaker, 
  ShoppingCart, 
  DollarSign, 
  BarChart2, 
  Users, 
  Upload,
  Plus,
  X,
  ChevronDown,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

type TestType = 'monadic' | 'shelf' | 'price' | 'packaging' | 'claims';
type TestStatus = 'draft' | 'running' | 'completed' | 'analyzing';

interface ConceptTest {
  id: string;
  name: string;
  type: TestType;
  status: TestStatus;
  targetResponses: number;
  currentResponses: number;
  createdAt: Date;
  updatedAt: Date;
  products?: {
    name: string;
    image: string;
  }[];
  results?: {
    csvUrl?: string;
    summary?: string;
  };
}

export function ConceptTestPage() {
  const [tests, setTests] = useState<ConceptTest[]>([]);
  const [showNewTest, setShowNewTest] = useState(false);
  const [selectedType, setSelectedType] = useState<TestType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TestStatus | 'all'>('all');
  const { addPoints } = useStore();

  const handleCreateTest = (type: TestType) => {
    const newTest: ConceptTest = {
      id: crypto.randomUUID(),
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Test`,
      type,
      status: 'draft',
      targetResponses: 500,
      currentResponses: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTests(prev => [...prev, newTest]);
    setShowNewTest(false);
    setSelectedType(null);
    addPoints(50, 'Created new concept test');
  };

  const handleAnalyzeResults = async (testId: string) => {
    // Simulate analyzing results
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'analyzing' }
        : test
    ));

    // In a real implementation, this would call the AI service
    setTimeout(() => {
      setTests(prev => prev.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              status: 'completed',
              results: {
                csvUrl: 'results.csv',
                summary: 'AI analysis complete'
              }
            }
          : test
      ));
      addPoints(100, 'Analyzed test results');
    }, 2000);
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Concept Testing
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and manage concept tests with AI-powered analysis
          </p>
        </div>
        <button
          onClick={() => setShowNewTest(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Test
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TestStatus | 'all')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="analyzing">Analyzing</option>
          </select>
        </div>
      </div>

      {/* Test Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {test.type === 'monadic' && <Beaker className="w-5 h-5 text-purple-500" />}
                {test.type === 'shelf' && <ShoppingCart className="w-5 h-5 text-blue-500" />}
                {test.type === 'price' && <DollarSign className="w-5 h-5 text-green-500" />}
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {test.name}
                </h3>
              </div>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                test.status === 'draft' && "bg-gray-100 text-gray-800",
                test.status === 'running' && "bg-blue-100 text-blue-800",
                test.status === 'completed' && "bg-green-100 text-green-800",
                test.status === 'analyzing' && "bg-purple-100 text-purple-800"
              )}>
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Responses</span>
                  <span>{test.currentResponses} / {test.targetResponses}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(test.currentResponses / test.targetResponses) * 100}%` }}
                  />
                </div>
              </div>

              {test.products && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Products
                  </h4>
                  <div className="flex -space-x-2">
                    {test.products.map((product, index) => (
                      <img
                        key={index}
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                      />
                    ))}
                  </div>
                </div>
              )}

              {test.status === 'completed' && test.results && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => window.open(test.results.csvUrl)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </button>
                  <button
                    onClick={() => handleAnalyzeResults(test.id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Analyze
                  </button>
                </div>
              )}

              {test.status === 'draft' && (
                <div className="flex items-center justify-between">
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Products
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                    <Users className="w-4 h-4 mr-2" />
                    Set Audience
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Test Modal */}
      <AnimatePresence>
        {showNewTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Test
                </h2>
                <button
                  onClick={() => setShowNewTest(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleCreateTest('monadic')}
                    className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500"
                  >
                    <Beaker className="w-8 h-8 text-purple-500 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Monadic Test
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      Test single concepts in isolation
                    </p>
                  </button>

                  <button
                    onClick={() => handleCreateTest('shelf')}
                    className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500"
                  >
                    <ShoppingCart className="w-8 h-8 text-blue-500 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Shelf Test
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      Compare multiple products on shelf
                    </p>
                  </button>

                  <button
                    onClick={() => handleCreateTest('price')}
                    className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500"
                  >
                    <DollarSign className="w-8 h-8 text-green-500 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Price Test
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      Optimize pricing strategy
                    </p>
                  </button>

                  <button
                    onClick={() => handleCreateTest('packaging')}
                    className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500"
                  >
                    <ShoppingCart className="w-8 h-8 text-orange-500 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Packaging Test
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      Evaluate packaging designs
                    </p>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
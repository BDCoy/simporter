import React, { useState } from 'react';
import { 
  Search, 
  Code, 
  Terminal, 
  Webhook, 
  Database, 
  Lock,
  Copy,
  Check,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
}

const sections: Section[] = [
  { id: 'authentication', title: 'Authentication', icon: Lock },
  { id: 'inbound', title: 'Inbound API', icon: Terminal },
  { id: 'outbound', title: 'Outbound API', icon: Webhook },
  { id: 'data', title: 'Data Models', icon: Database },
  { id: 'sdks', title: 'SDKs & Examples', icon: Code },
];

export function ApiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('authentication');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => (
    <div className="relative group">
      <pre className={cn(
        "p-4 bg-gray-900 rounded-lg overflow-x-auto",
        "text-sm text-gray-300 font-mono"
      )}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={() => handleCopyCode(code)}
        className={cn(
          "absolute top-2 right-2 p-2 rounded-md transition-colors",
          "opacity-0 group-hover:opacity-100",
          copiedCode === code
            ? "bg-green-500/20 text-green-400"
            : "bg-gray-800 text-gray-400 hover:text-white"
        )}
      >
        {copiedCode === code ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  const Endpoint = ({ 
    method, 
    path, 
    description 
  }: { 
    method: string; 
    path: string; 
    description: string;
  }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-md",
              method === 'GET' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
              method === 'POST' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              method === 'PUT' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
              method === 'DELETE' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {method}
            </span>
            <code className="text-sm font-mono text-gray-900 dark:text-white">
              {path}
            </code>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            API Documentation
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Integrate with our platform using our REST APIs
          </p>
        </div>
        <a
          href="https://github.com/simporter/api"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Code className="w-4 h-4 mr-2" />
          View on GitHub
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>

      {/* Search and Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <section.icon className="w-4 h-4 mr-3" />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* Authentication Section */}
          <section id="authentication" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              All API requests require authentication using an API key. Include your API key in the Authorization header:
            </p>
            <CodeBlock code="Authorization: Bearer YOUR_API_KEY" />
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                To obtain an API key, visit your account settings in the Simporter dashboard.
              </p>
            </div>
          </section>

          {/* Inbound API Section */}
          <section id="inbound" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Inbound API
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Use these endpoints to integrate external systems with Simporter.
            </p>
            <div className="space-y-4">
              <Endpoint
                method="POST"
                path="/tests"
                description="Create a new concept test"
              />
              <Endpoint
                method="POST"
                path="/tests/{testId}/responses"
                description="Submit a response for a test"
              />
              <Endpoint
                method="GET"
                path="/tests/{testId}/results"
                description="Retrieve results for a completed test"
              />
            </div>
          </section>

          {/* Example Code */}
          <section className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Example Request
            </h3>
            <CodeBlock
              language="typescript"
              code={`import { SimporterClient } from '@simporter/sdk';

const client = new SimporterClient('YOUR_API_KEY');

// Create a test
const test = await client.tests.create({
  name: 'Product Concept Test',
  type: 'monadic',
  targetResponses: 500,
  audience: [
    {
      type: 'demographic',
      attribute: 'age',
      operator: 'between',
      value: ['25', '45']
    }
  ],
  content: [
    {
      type: 'product',
      name: 'Premium Shampoo',
      description: 'Natural ingredients',
      url: 'https://example.com/product.jpg'
    }
  ]
});`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
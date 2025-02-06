import React, { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';

interface IDEProps {
  query: string;
}

function IDE({ query }: IDEProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = document.querySelector('pre code')?.textContent;
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">Code Editor</h2>
          </div>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        <pre className="bg-gray-50 p-4 rounded-lg">
          <code className="text-gray-800">
            {`// Example authentication middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}`}
          </code>
        </pre>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="font-medium">Language:</span>
          <span>TypeScript</span>
        </div>
      </div>
    </div>
  );
}

export default IDE
"use client";

import React, { useState, useEffect } from "react";

interface FileNode {
  id: string;
  name: string;
  content: string;
}

const initialFiles: FileNode[] = [
  {
    id: "1",
    name: "index.ts",
    content: "// index.ts\nconsole.log('Hello, world!');",
  },
  {
    id: "2",
    name: "App.tsx",
    content:
      "// App.tsx\nexport default function App() {\n  return <div>Hello from App</div>;\n}",
  },
  {
    id: "3",
    name: "utils.ts",
    content: "// utils.ts\nexport const helper = () => {};\n",
  },
];

const CodeTab: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileNode>(initialFiles[0]);
  const [code, setCode] = useState<string>(initialFiles[0].content);

  // Update the editor content when the selected file changes
  useEffect(() => {
    setCode(selectedFile.content);
  }, [selectedFile]);

  const handleFileClick = (file: FileNode) => {
    setSelectedFile(file);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    // Also update the file's content in our file tree state
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === selectedFile.id ? { ...f, content: newCode } : f
      )
    );
  };

  return (
    <div className="h-full flex">
      {/* File Tree Panel */}
      <div className="w-1/4 border-r border-gray-300 dark:border-gray-600 p-2 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Files</h3>
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.id}>
              <button
                onClick={() => handleFileClick(file)}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedFile.id === file.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Code Editor Panel */}
      <div className="flex-1 p-2">
        <textarea
          className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          value={code}
          onChange={handleCodeChange}
        />
      </div>
    </div>
  );
};

export default CodeTab;

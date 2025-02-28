"use client";

import React, { useState, useEffect, useRef } from 'react';

interface ProjectAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface ProjectDropdownProps {
  projectName: string;
  onRename: (name: string) => void;
  onCollaborate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  projectName,
  onRename,
  onCollaborate,
  onArchive,
  onDelete
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(projectName);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Standard actions
  const actions: ProjectAction[] = [
    {
      id: 'rename',
      label: 'Rename',
      icon: (
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      onClick: () => setIsRenaming(true)
    },
    {
      id: 'collaborate',
      label: 'Collaboration',
      icon: (
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => {
        onCollaborate();
        setIsDropdownOpen(false);
      }
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: (
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      onClick: () => {
        onArchive();
        setIsDropdownOpen(false);
      }
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: (
        <svg className="w-4 h-4 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: () => setDeleteConfirmOpen(true),
      color: 'text-red-600'
    }
  ];

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        
        if (isRenaming) {
          setIsRenaming(false);
          setNewName(projectName); // Reset to current name if cancelled
        }
        
        if (deleteConfirmOpen) {
          setDeleteConfirmOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isRenaming, projectName, deleteConfirmOpen]);

  // Focus input when renaming starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(newName);
      setIsRenaming(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {isRenaming ? (
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRename();
              } else if (e.key === 'Escape') {
                setIsRenaming(false);
                setNewName(projectName);
              }
            }}
            className="px-2 py-1 border border-gray-300 rounded text-gray-800 font-semibold"
          />
          <button 
            onClick={handleRename}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button 
            onClick={() => {
              setIsRenaming(false);
              setNewName(projectName);
            }}
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <h2 className="text-lg font-semibold text-gray-800">
            {projectName}
          </h2>
          <svg 
            className={`ml-1 w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      {/* Dropdown Menu */}
      {isDropdownOpen && !isRenaming && !deleteConfirmOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10 w-48">
          <ul className="py-1">
            {actions.map((action) => (
              <li 
                key={action.id}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${action.color || 'text-gray-700'}`}
                onClick={action.onClick}
              >
                {action.icon}
                {action.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10 w-64 p-4">
          <h3 className="text-sm font-semibold mb-2">Delete "{projectName}"?</h3>
          <p className="text-xs text-gray-600 mb-3">This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs rounded"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onDelete();
                setDeleteConfirmOpen(false);
                setIsDropdownOpen(false);
              }}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDropdown;
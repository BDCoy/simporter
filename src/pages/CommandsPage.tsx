import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Save, Trash2, Edit2, FileText, Users, ShoppingBag, MessageSquare, BarChart2, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CommandTemplate {
  id: string;
  name: string;
  command: string;
  description: string;
  color: string;
  icon: string;
  template: string;
  promptTemplate: string;
  isActive: boolean;
}

const defaultTemplates: CommandTemplate[] = [
  {
    id: 'concept-portfolio',
    name: 'Concept Portfolio',
    command: '/portfolio',
    description: 'Create and manage product concept portfolios',
    color: 'emerald',
    icon: 'ShoppingBag',
    template: `# {topic} Concept Portfolio

## Overview
{overview}

## Concepts
{concepts.map(concept => `
### ${concept.name}
- Value Proposition: ${concept.value}
- Target Audience: ${concept.audience}
- Key Features: ${concept.features.join(', ')}
`).join('\n')}

## Market Opportunity
{marketOpportunity}

## Next Steps
{nextSteps}`,
    promptTemplate: `Create a concept portfolio for {topic} including:
1. Overview of the opportunity
2. 3-5 distinct concepts
3. Market opportunity assessment
4. Recommended next steps`,
    isActive: true
  },
  {
    id: 'social-analysis',
    name: 'Social & Review Analysis',
    command: '/social',
    description: 'Analyze consumer feedback and unmet needs',
    color: 'blue',
    icon: 'MessageSquare',
    template: `# Consumer Insights: {topic}

## Key Findings
{findings}

## Unmet Needs
{unmetNeeds}

## Pain Points
{painPoints}

## Sentiment Analysis
{sentiment}

## Recommendations
{recommendations}`,
    promptTemplate: `Analyze social media and review data for {topic} to identify:
1. Key consumer insights
2. Unmet needs and pain points
3. Sentiment analysis
4. Strategic recommendations`,
    isActive: true
  },
  // Add more default templates...
];

export function CommandsPage() {
  const { isOwner } = useStore();
  const [templates, setTemplates] = useState<CommandTemplate[]>(defaultTemplates);
  const [editingTemplate, setEditingTemplate] = useState<CommandTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This page is only accessible to owners.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveTemplate = (template: CommandTemplate) => {
    if (editingTemplate) {
      setTemplates(prev => 
        prev.map(t => t.id === template.id ? template : t)
      );
    } else {
      setTemplates(prev => [...prev, { ...template, id: Date.now().toString() }]);
    }
    setShowEditor(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setTemplates(prev =>
      prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Command Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and customize AI command templates
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowEditor(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div
            key={template.id}
            className={cn(
              "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6",
              "border-2",
              template.isActive
                ? "border-green-500/10 dark:border-green-500/20"
                : "border-gray-100 dark:border-gray-700"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {template.command}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingTemplate(template);
                    setShowEditor(true);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(template.id)}
                  className={cn(
                    "p-2 rounded-md text-sm font-medium",
                    template.isActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {template.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-2 text-red-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {template.description}
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Preview
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                  <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {template.template.slice(0, 150)}...
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-auto"
            >
              <TemplateEditor
                template={editingTemplate}
                onSave={handleSaveTemplate}
                onClose={() => {
                  setShowEditor(false);
                  setEditingTemplate(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TemplateEditorProps {
  template: CommandTemplate | null;
  onSave: (template: CommandTemplate) => void;
  onClose: () => void;
}

function TemplateEditor({ template, onSave, onClose }: TemplateEditorProps) {
  const [formData, setFormData] = useState<CommandTemplate>(
    template || {
      id: '',
      name: '',
      command: '',
      description: '',
      color: 'blue',
      icon: 'FileText',
      template: '',
      promptTemplate: '',
      isActive: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {template ? 'Edit Template' : 'New Template'}
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Command
              </label>
              <input
                type="text"
                value={formData.command}
                onChange={e => setFormData(prev => ({ ...prev, command: e.target.value }))}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Theme
              </label>
              <select
                value={formData.color}
                onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="blue">Blue</option>
                <option value="emerald">Emerald</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
                <option value="indigo">Indigo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="FileText">Document</option>
                <option value="ShoppingBag">Shopping Bag</option>
                <option value="MessageSquare">Message</option>
                <option value="BarChart2">Chart</option>
                <option value="Users">Users</option>
                <option value="DollarSign">Price</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Response Template
            </label>
            <textarea
              value={formData.template}
              onChange={e => setFormData(prev => ({ ...prev, template: e.target.value }))}
              className="w-full h-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 font-mono text-sm"
              placeholder="Use {placeholders} for dynamic content"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prompt Template
            </label>
            <textarea
              value={formData.promptTemplate}
              onChange={e => setFormData(prev => ({ ...prev, promptTemplate: e.target.value }))}
              className="w-full h-32 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 font-mono text-sm"
              placeholder="Template for generating the AI prompt"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          <Save className="w-4 h-4 mr-2 inline-block" />
          Save Template
        </button>
      </div>
    </form>
  );
}
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { 
  Plus, 
  ShoppingCart, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Map, 
  MessageCircle,
  Edit2,
  Trash2,
  Save,
  X,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CommandTemplate {
  id: string;
  name: string;
  command: string;
  description: string;
  color: string;
  icon: React.ElementType;
  systemPrompt: string;
  responseTemplate: string;
  isActive: boolean;
}

const defaultTemplates: CommandTemplate[] = [
  {
    id: 'category',
    name: 'Category Analysis',
    command: '/category',
    description: 'Generate comprehensive category analysis and insights',
    color: 'text-emerald-600',
    icon: ShoppingCart,
    systemPrompt: `You are a market research expert specializing in category analysis. Help analyze the specified category by:
1. Market size and growth
2. Competitive landscape
3. Consumer trends
4. Innovation opportunities
5. Strategic recommendations`,
    responseTemplate: `# {category} Category Analysis

## Market Overview
- Global Market Size: $XX billion (2024)
- CAGR: X.X% (2024-2028)
- Key Markets: North America (XX%), Europe (XX%), APAC (XX%)

## Competitive Landscape
### Market Leaders
1. Company A (XX% share)
   - Key strengths
   - Recent moves
2. Company B (XX% share)
   - Key strengths
   - Recent moves

## Consumer Trends
1. Trend One
   - Key insights
   - Impact
2. Trend Two
   - Key insights
   - Impact

## Innovation Spaces
1. Product Development
   - Opportunities
   - Challenges
2. Technology Integration
   - Opportunities
   - Challenges

## Strategic Recommendations
1. Short-term (0-6 months)
2. Medium-term (6-18 months)
3. Long-term (18+ months)`,
    isActive: true
  },
  {
    id: 'innovation',
    name: 'Innovation Brief',
    command: '/innovation',
    description: 'Create detailed innovation briefs and concepts',
    color: 'text-blue-600',
    icon: Lightbulb,
    systemPrompt: `You are an innovation strategist. Help create innovation briefs by:
1. Identifying market opportunities
2. Analyzing consumer needs
3. Developing concepts
4. Evaluating feasibility
5. Creating implementation plans`,
    responseTemplate: `# Innovation Brief: {topic}

## Market Opportunity
- Market size
- Growth potential
- Unmet needs

## Consumer Analysis
- Target segments
- Key pain points
- Jobs to be done

## Concept Development
1. Concept One
   - Value proposition
   - Key features
   - Target audience
2. Concept Two
   - Value proposition
   - Key features
   - Target audience

## Feasibility Assessment
- Technical requirements
- Resource needs
- Timeline
- Risk analysis

## Implementation Plan
1. Phase One (0-3 months)
2. Phase Two (3-6 months)
3. Phase Three (6+ months)`,
    isActive: true
  }
];

function TemplateEditor({ 
  template, 
  onSave, 
  onClose 
}: { 
  template: CommandTemplate | null;
  onSave: (template: CommandTemplate) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<CommandTemplate>(
    template || {
      id: crypto.randomUUID(),
      name: '',
      command: '/',
      description: '',
      color: 'text-blue-600',
      icon: MessageCircle,
      systemPrompt: '',
      responseTemplate: '',
      isActive: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const colorOptions = [
    { value: 'text-emerald-600', label: 'Emerald' },
    { value: 'text-blue-600', label: 'Blue' },
    { value: 'text-purple-600', label: 'Purple' },
    { value: 'text-orange-600', label: 'Orange' },
    { value: 'text-red-600', label: 'Red' },
    { value: 'text-indigo-600', label: 'Indigo' }
  ];

  const iconOptions = [
    { value: ShoppingCart, label: 'Shopping Cart' },
    { value: Lightbulb, label: 'Lightbulb' },
    { value: TrendingUp, label: 'Trending Up' },
    { value: Users, label: 'Users' },
    { value: Map, label: 'Map' },
    { value: MessageCircle, label: 'Message' }
  ];

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {template ? 'Edit Template' : 'New Template'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {colorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            <select
              value={iconOptions.findIndex(opt => opt.value === formData.icon)}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                icon: iconOptions[parseInt(e.target.value)].value 
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {iconOptions.map((option, index) => (
                <option key={index} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            System Prompt
          </label>
          <textarea
            value={formData.systemPrompt}
            onChange={e => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
            className="w-full h-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            placeholder="Instructions for the AI assistant..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Response Template
          </label>
          <textarea
            value={formData.responseTemplate}
            onChange={e => setFormData(prev => ({ ...prev, responseTemplate: e.target.value }))}
            className="w-full h-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            placeholder="Template for the AI response..."
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => {
              const testCommand = formData.command + ' Test';
              // TODO: Implement test functionality
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Test Template
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </button>
        </div>
      </div>
    </form>
  );
}

export function TemplatesPage() {
  const [templates, setTemplates] = useState<CommandTemplate[]>(defaultTemplates);
  const [editingTemplate, setEditingTemplate] = useState<CommandTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleSaveTemplate = (template: CommandTemplate) => {
    if (editingTemplate) {
      setTemplates(prev => 
        prev.map(t => t.id === template.id ? template : t)
      );
    } else {
      setTemplates(prev => [...prev, template]);
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
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Customize AI commands and response templates
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
        {templates.map(template => {
          const Icon = template.icon;
          return (
            <div
              key={template.id}
              className={cn(
                "relative bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6",
                "border-2",
                template.isActive
                  ? "border-green-500/10 dark:border-green-500/20"
                  : "border-gray-100 dark:border-gray-700"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn("p-2 rounded-lg", template.color.replace('text-', 'bg-').replace('600', '100'))}>
                    <Icon className={cn("w-5 h-5", template.color)} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <code className="text-sm font-mono text-gray-500 dark:text-gray-400">
                      {template.command}
                    </code>
                  </div>
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
                    System Prompt Preview
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                    <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {template.systemPrompt.slice(0, 150)}...
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
              className="fixed inset-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
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
"use client";

import React, { useState } from 'react';
import { Code, Copy, Play, Settings, FileText, Plus, Save, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  codeSnippet: string;
  type: 'radio' | 'dropdown' | 'matrix' | 'rating';
  scalePoints?: number;
}

interface GeneratedQuestion {
  id: string;
  type: string;
  text: string;
  code: string;
}

const ConceptTestAssistant = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('radio');
  const [scalePoints, setScalePoints] = useState<string>('5');
  
  const questionTemplates: QuestionTemplate[] = [
    {
      id: 'purchase_intent',
      name: 'Purchase Intent',
      description: 'Standard 5-point purchase intent scale',
      type: 'dropdown',
      scalePoints: 5,
      codeSnippet: `[question("dropdown")]
Purchase Intent
{choices:
  5="Definitely would purchase",
  4="Probably would purchase",
  3="Might or might not purchase",
  2="Probably would not purchase",
  1="Definitely would not purchase"
}`
    },
    {
      id: 'uniqueness',
      name: 'Uniqueness Rating',
      description: '7-point uniqueness scale with anchors',
      type: 'radio',
      scalePoints: 7,
      codeSnippet: `[question("radio")]
How unique is this concept?
{choices:
  7="Extremely unique",
  6="Very unique",
  5="Somewhat unique",
  4="Neither unique nor common",
  3="Somewhat common",
  2="Very common",
  1="Extremely common"
}`
    }
  ];

  const generateQuestionCode = () => {
    const template = questionTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const newQuestion: GeneratedQuestion = {
      id: `q_${Date.now()}`,
      type: selectedType,
      text: questionText,
      code: template.codeSnippet.replace('Purchase Intent', questionText)
    };

    setGeneratedQuestions([...generatedQuestions, newQuestion]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Concept Test Assistant</h1>
            <h2 className="text-2xl font-semibold text-gray-500">Alchemer Programming Helper</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Template
            </button>
            <button 
              className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2"
              onClick={generateQuestionCode}
            >
              <Plus className="w-4 h-4" />
              Generate Question
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questionTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                        selectedTemplate === template.id 
                          ? 'border-violet-600 bg-violet-50' 
                          : 'hover:border-violet-300'
                      }`}
                    >
                      <FileText className="w-5 h-5 text-violet-600" />
                      <div className="text-left">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generated Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedQuestions.map((question) => (
                    <div key={question.id} className="p-3 border rounded-lg">
                      <div className="font-medium mb-1">{question.text}</div>
                      <div className="text-xs text-gray-500">{question.type}</div>
                      <button className="text-violet-600 text-sm mt-2 flex items-center gap-1">
                        <Copy className="w-3 h-3" />
                        Copy Code
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Builder */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Question Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text
                    </label>
                    <input 
                      type="text"
                      className="w-full border rounded-lg p-2"
                      placeholder="Enter your question..."
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Type
                      </label>
                      <select 
                        className="w-full border rounded-lg p-2"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="radio">Radio Buttons</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="rating">Rating Scale</option>
                        <option value="matrix">Matrix</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scale Points
                      </label>
                      <select 
                        className="w-full border rounded-lg p-2"
                        value={scalePoints}
                        onChange={(e) => setScalePoints(e.target.value)}
                      >
                        <option value="5">5-point</option>
                        <option value="7">7-point</option>
                        <option value="9">9-point</option>
                        <option value="11">11-point</option>
                      </select>
                    </div>
                  </div>

                  {selectedTemplate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preview Code
                      </label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap">
                          {questionTemplates.find(t => t.id === selectedTemplate)?.codeSnippet}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      Include "Prefer not to answer" option
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      Randomize scale points
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      Force response
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptTestAssistant;
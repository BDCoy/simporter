"use client";

import React, { useState } from 'react';
import { Sparkles, FileText, Send, Save, Download, RotateCcw, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResearchStep {
  id: string;
  title: string;
  fields: FormField[];
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  placeholder?: string;
  options?: string[];
}

const ResearchProposalGenerator = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    projectTitle: '',
    category: '',
    objectives: '',
    targetAudience: '',
    timeline: '',
    methodology: '',
    deliverables: '',
    additionalContext: ''
  });

  const steps: ResearchStep[] = [
    {
      id: 'overview',
      title: 'Project Overview',
      fields: [
        {
          name: 'projectTitle',
          label: 'Project Title',
          type: 'text',
          placeholder: 'Enter a descriptive title for your research project'
        },
        {
          name: 'category',
          label: 'Research Category',
          type: 'select',
          options: ['Concept Testing', 'Market Sizing', 'Consumer Behavior', 'Brand Health']
        }
      ]
    },
    {
      id: 'objectives',
      title: 'Research Objectives',
      fields: [
        {
          name: 'objectives',
          label: 'Key Objectives',
          type: 'textarea',
          placeholder: 'What are the main questions you want to answer?'
        },
        {
          name: 'deliverables',
          label: 'Expected Deliverables',
          type: 'textarea',
          placeholder: 'What outputs do you need from this research?'
        }
      ]
    },
    {
      id: 'methodology',
      title: 'Methodology & Timeline',
      fields: [
        {
          name: 'methodology',
          label: 'Research Methodology',
          type: 'textarea',
          placeholder: 'Describe your preferred research approach'
        },
        {
          name: 'timeline',
          label: 'Project Timeline',
          type: 'text',
          placeholder: 'Expected duration or deadline'
        }
      ]
    }
  ];

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Research Proposal Generator</h1>
            <h2 className="text-2xl font-semibold text-gray-500">AI-Assisted Proposal Builder</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Proposal
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className={`h-2 ${index < steps.length - 1 ? 'mr-2' : ''} rounded-full ${
                  index <= currentStep ? 'bg-violet-600' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-violet-600 text-white' : 'bg-gray-200'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-gray-600">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep].title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {steps[currentStep].fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="w-full h-32 border rounded-lg p-2"
                          placeholder={field.placeholder}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          className="w-full border rounded-lg p-2"
                          value={formData[field.name as keyof typeof formData]}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="w-full border rounded-lg p-2"
                          placeholder={field.placeholder}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handlePrevStep}
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        currentStep === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700"
                    >
                      {currentStep === steps.length - 1 ? 'Generate' : 'Next'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-violet-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      I can help you refine your research objectives and suggest methodologies based on your goals.
                    </p>
                  </div>
                  <button className="w-full p-3 border rounded-lg hover:border-violet-300 flex items-center gap-2 text-left">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <span>Suggest Objectives</span>
                  </button>
                  <button className="w-full p-3 border rounded-lg hover:border-violet-300 flex items-center gap-2 text-left">
                    <FileText className="w-4 h-4 text-violet-600" />
                    <span>Improve Writing</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Consider adding specific success metrics',
                    'Include competitive analysis component',
                    'Specify demographic requirements'
                  ].map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-violet-600 mt-2" />
                      <span className="text-sm text-gray-600">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchProposalGenerator;
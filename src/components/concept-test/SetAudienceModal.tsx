import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Users, 
  Globe, 
  DollarSign, 
  Briefcase, 
  Heart,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Criterion {
  id: string;
  type: 'demographic' | 'geographic' | 'behavioral' | 'psychographic' | 'custom';
  attribute: string;
  operator: string;
  value: string | string[];
}

interface SetAudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (criteria: Criterion[]) => void;
  initialCriteria?: Criterion[];
}

export function SetAudienceModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialCriteria = []
}: SetAudienceModalProps) {
  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);
  const [estimatedReach, setEstimatedReach] = useState(5000);
  const [costEstimate, setCostEstimate] = useState(2500);

  const criteriaTypes = [
    { 
      id: 'demographic',
      label: 'Demographics',
      icon: Users,
      attributes: ['Age', 'Gender', 'Income', 'Education', 'Occupation']
    },
    {
      id: 'geographic',
      label: 'Geographic',
      icon: Globe,
      attributes: ['Country', 'Region', 'City', 'Urban/Rural']
    },
    {
      id: 'behavioral',
      label: 'Behavioral',
      icon: Heart,
      attributes: ['Purchase Frequency', 'Brand Loyalty', 'Usage Rate', 'Benefits Sought']
    },
    {
      id: 'psychographic',
      label: 'Psychographic',
      icon: Briefcase,
      attributes: ['Lifestyle', 'Values', 'Interests', 'Opinions']
    }
  ];

  const operators = {
    numeric: ['=', '>', '<', '>=', '<=', 'between'],
    categorical: ['is', 'is not', 'contains', 'does not contain'],
    multiple: ['any of', 'all of', 'none of']
  };

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      {
        id: crypto.randomUUID(),
        type: 'demographic',
        attribute: 'Age',
        operator: '=',
        value: ''
      }
    ]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const handleSave = () => {
    onSave(criteria);
    onClose();
  };

  if (!isOpen) return null;

  return (
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
        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Set Target Audience
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Define your target audience criteria for the concept test
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Criteria Builder */}
            <div className="space-y-4">
              {criteria.map((criterion, index) => (
                <div
                  key={criterion.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <select
                    value={criterion.type}
                    onChange={(e) => updateCriterion(criterion.id, { 
                      type: e.target.value as Criterion['type'],
                      attribute: criteriaTypes.find(t => t.id === e.target.value)?.attributes[0] || ''
                    })}
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    {criteriaTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={criterion.attribute}
                    onChange={(e) => updateCriterion(criterion.id, { attribute: e.target.value })}
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    {criteriaTypes
                      .find(t => t.id === criterion.type)
                      ?.attributes.map(attr => (
                        <option key={attr} value={attr}>
                          {attr}
                        </option>
                      ))}
                  </select>

                  <select
                    value={criterion.operator}
                    onChange={(e) => updateCriterion(criterion.id, { operator: e.target.value })}
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    {operators.categorical.map(op => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={criterion.value}
                    onChange={(e) => updateCriterion(criterion.id, { value: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                    placeholder="Enter value..."
                  />

                  <button
                    onClick={() => removeCriterion(criterion.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={addCriterion}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Criterion
              </button>
            </div>

            {/* Audience Insights */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-600 mb-2">
                  <Users className="w-5 h-5" />
                  <h3 className="font-medium">Estimated Reach</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {estimatedReach.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600/70">
                  Qualified respondents available
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <h3 className="font-medium">Cost Estimate</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ${costEstimate.toLocaleString()}
                </p>
                <p className="text-sm text-green-600/70">
                  Based on target sample size
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Audience
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
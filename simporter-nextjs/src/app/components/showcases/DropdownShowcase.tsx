"use client";

import React, { useState } from 'react';
import Dropdown, { OptionItem } from '@/components/ui/Dropdown';

const DropdownShowcase = () => {
  const [value, setValue] = useState('');
  
  // Use OptionItem objects:
  const options: OptionItem[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Dropdown</h3>
        <div className="max-w-xs">
          <Dropdown 
            options={options} 
            value={value} 
            onChange={setValue} 
            placeholder="Select an option" 
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Selected value: {value || 'None'}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Disabled Dropdown</h3>
        <div className="max-w-xs">
          <Dropdown 
            options={options} 
            value={options[0].value} 
            onChange={() => {}} 
            disabled 
          />
        </div>
      </div>
    </div>
  );
};

export default DropdownShowcase;

"use client"

import React from 'react';
import Button from '@/components/ui/Button';
import ComponentsDropdown from '@/components/ui/ComponentsDropdown';
import SearchInput from '@/components/ui/SearchInput';

// Individual component showcases
const ButtonShowcase = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-medium mb-4">Button Variants</h3>
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Button Sizes</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
        <Button size="icon">🔍</Button>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Buttons with Icons</h3>
      <div className="flex flex-wrap gap-4">
        <Button leftIcon="🔍">Search</Button>
        <Button rightIcon="→">Next</Button>
        <Button leftIcon="←" rightIcon="→">Navigate</Button>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Full Width Button</h3>
      <Button fullWidth>Full Width Button</Button>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Disabled Button</h3>
      <Button disabled>Disabled Button</Button>
    </div>
  </div>
);

const SearchShowcase = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-medium mb-4">Default Search Input</h3>
      <SearchInput onSearch={(query) => console.log(query)} />
    </div>
  </div>
);

// Import Card component
import Card from '@/components/ui/Card';
import Dropdown from '@/components/ui/Dropdown';

const CardShowcase = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-medium mb-4">Basic Card</h3>
      <Card content="This is a basic card with just content." />
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Card with Title</h3>
      <Card 
        title="Card Title" 
        content="This card has a title section above the content." 
      />
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Card with Footer</h3>
      <Card 
        content="This card has a footer section below the content." 
        footer={<Button size="small">Action</Button>}
      />
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Complete Card</h3>
      <Card 
        title="Product Analysis" 
        content={
          <div className="space-y-2">
            <p>This card has a title, content, and footer with actions.</p>
            <p>It can contain more complex content like paragraphs and lists.</p>
          </div>
        } 
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="small">Cancel</Button>
            <Button size="small">Submit</Button>
          </div>
        }
      />
    </div>
  </div>
);

export default function ComponentsPage() {
  // Define all the component showcases
  // Dropdown Showcase
const DropdownShowcase = () => {
  const [value, setValue] = React.useState('');
  
  const options = [
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

const componentsList = [
    { name: "Buttons", component: <ButtonShowcase /> },
    { name: "Search Input", component: <SearchShowcase /> },
    { name: "Cards", component: <CardShowcase /> },
    { name: "Dropdowns", component: <DropdownShowcase /> },
    // Add more components here as you build them
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Simporter UI Components</h1>
      <ComponentsDropdown components={componentsList} />
    </div>
  );
}
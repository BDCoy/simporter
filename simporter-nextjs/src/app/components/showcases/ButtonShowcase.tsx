"use client"

import React from 'react';
import Button from '@/components/ui/Button';

// SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const LoadingIcon = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const ButtonShowcase = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-medium mb-4">Button Variants</h3>
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="primary" className="bg-green-600 hover:bg-green-700">Success</Button>
        <Button variant="primary" className="bg-red-600 hover:bg-red-700">Danger</Button>
        <Button variant="primary" className="bg-amber-500 hover:bg-amber-600">Warning</Button>
        <Button variant="primary" className="bg-cyan-500 hover:bg-cyan-600">Info</Button>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Outline Buttons</h3>
      <div className="flex flex-wrap gap-4">
        <Button variant="outline">Outline</Button>
        <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">Purple</Button>
        <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">Green</Button>
        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Red</Button>
        <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">Amber</Button>
        <Button variant="outline" className="text-cyan-600 border-cyan-600 hover:bg-cyan-50">Cyan</Button>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Button Sizes</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
        <Button size="icon" variant="outline"><SearchIcon /></Button>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Buttons with Icons</h3>
      <div className="flex flex-wrap gap-4">
        <Button leftIcon={<SearchIcon />}>Search</Button>
        <Button rightIcon={<ArrowRightIcon />}>Next</Button>
        <Button leftIcon={<ArrowLeftIcon />} rightIcon={<ArrowRightIcon />}>Navigate</Button>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Icon Buttons</h3>
      <div className="flex flex-wrap gap-4">
        <Button leftIcon={<SearchIcon />}>Search</Button>
        <Button leftIcon={<SettingsIcon />} variant="secondary">Settings</Button>
        <Button leftIcon={<RefreshIcon />} variant="outline">Refresh</Button>
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
    
    <div>
      <h3 className="text-lg font-medium mb-4">Loading Button</h3>
      <Button leftIcon={<LoadingIcon />} disabled>
        Loading...
      </Button>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Ghost Button</h3>
      <Button variant="ghost">Ghost Button</Button>
    </div>
    
    <div>
      <h3 className="text-lg font-medium mb-4">Link Button</h3>
      <Button variant="link">Link Button</Button>
    </div>
  </div>
);

export default ButtonShowcase;
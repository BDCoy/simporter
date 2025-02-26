"use client"

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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
            <Button variant="outline" size="small">Cancel</Button>
            <Button size="small">Submit</Button>
          </div>
        }
      />
    </div>
  </div>
);

export default CardShowcase;
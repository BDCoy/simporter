import { marked } from 'marked';

export interface Slide {
  content: string;
  notes?: string;
}

export function generateSlides(content: string): Slide[] {
  if (!content) {
    return [];
  }

  // Split content into sections based on headers
  const sections = content.split(/(?=^#\s)/m);
  
  return sections.map(section => {
    const [content, notes] = section.split('---');
    const parsedContent = marked.parse(content.trim(), {
      mangle: false,
      headerIds: false
    });
    
    return {
      content: parsedContent,
      notes: notes ? marked.parse(notes.trim(), {
        mangle: false,
        headerIds: false
      }) : undefined,
    };
  }).filter(slide => slide.content.trim() !== '');
}

export function generatePresentationCode(slides: Slide[]): string {
  return `
import React from 'react';
import { Presentation } from './components/Presentation';

const slides = ${JSON.stringify(slides, null, 2)};

export default function MarketAnalysisPresentation() {
  return (
    <div className="h-full">
      <Presentation slides={slides} />
    </div>
  );
}
`.trim();
}
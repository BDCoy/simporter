import { CommandTemplate } from './types';
import { Lightbulb } from 'lucide-react';

export const conceptCommand: CommandTemplate = {
  name: 'Concept Portfolio',
  description: 'Create and manage product concept portfolios',
  color: 'text-emerald-600',
  icon: Lightbulb,
  
  generateResponse: async (topic: string) => [
    `# ${topic} Concept Portfolio\n\n`,
    
    `## Overview\n`,
    `- Market Opportunity\n`,
    `- Target Consumer\n`,
    `- Strategic Fit\n\n`,
    
    `## Concepts\n\n`,
    `### Concept 1: [Name]\n`,
    `- Value Proposition\n`,
    `- Target Audience\n`,
    `- Key Features\n`,
    `- Unique Benefits\n\n`,
    
    `### Concept 2: [Name]\n`,
    `- Value Proposition\n`,
    `- Target Audience\n`,
    `- Key Features\n`,
    `- Unique Benefits\n\n`,
    
    `### Concept 3: [Name]\n`,
    `- Value Proposition\n`,
    `- Target Audience\n`,
    `- Key Features\n`,
    `- Unique Benefits\n\n`,
    
    `## Market Opportunity\n`,
    `- Market Size\n`,
    `- Growth Potential\n`,
    `- Competitive Landscape\n\n`,
    
    `## Next Steps\n`,
    `1. Concept Testing\n`,
    `2. Development Timeline\n`,
    `3. Resource Requirements\n`,
    
    `Would you like to explore any of these concepts in more detail?`
  ],
  
  generatePrompt: (topic: string) => `
    Create a concept portfolio for ${topic} including:
    1. Overview of the opportunity
    2. 3-5 distinct concepts with detailed descriptions
    3. Market opportunity assessment
    4. Recommended next steps
    
    Format the response with clear sections and bullet points.
  `
};
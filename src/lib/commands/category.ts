import { CommandTemplate } from './types';
import { ShoppingCart } from 'lucide-react';

export const categoryCommand: CommandTemplate = {
  name: 'Category Analysis',
  description: 'Generate comprehensive category analysis and insights',
  color: 'text-emerald-600',
  icon: ShoppingCart,
  
  generateResponse: async (topic: string) => [
    `# ${topic} Category Analysis\n\n`,
    `## Market Overview\n`,
    `- Global Market Size: $XX billion (2024)\n`,
    `- CAGR: X.X% (2024-2028)\n`,
    `- Key Markets: North America (XX%), Europe (XX%), APAC (XX%)\n\n`,
    
    `## Competitive Landscape\n`,
    `### Market Leaders\n`,
    `1. Company A (XX% share)\n`,
    `   - Key strengths: Innovation, Distribution\n`,
    `   - Recent moves: Product launches, Acquisitions\n\n`,
    `2. Company B (XX% share)\n`,
    `   - Key strengths: Brand equity, Scale\n`,
    `   - Recent moves: Sustainability initiatives\n\n`,
    
    `## Consumer Trends\n`,
    `1. Health & Wellness\n`,
    `   - Clean label demand\n`,
    `   - Functional benefits\n`,
    `2. Sustainability\n`,
    `   - Eco-friendly packaging\n`,
    `   - Ethical sourcing\n\n`,
    
    `## Innovation Spaces\n`,
    `1. Product Development\n`,
    `   - Novel ingredients\n`,
    `   - Format innovation\n`,
    `2. Technology Integration\n`,
    `   - Smart packaging\n`,
    `   - Digital engagement\n\n`,
    
    `## Strategic Recommendations\n`,
    `1. Short-term (0-6 months)\n`,
    `   - Focus areas\n`,
    `   - Quick wins\n`,
    `2. Medium-term (6-18 months)\n`,
    `   - Strategic initiatives\n`,
    `   - Partnership opportunities\n\n`,
    
    `Would you like to explore any specific aspect in more detail?`
  ],
  
  generatePrompt: (topic: string) => `
    Analyze the ${topic} category with focus on:
    1. Market size and growth
    2. Competitive landscape
    3. Consumer trends
    4. Innovation opportunities
    5. Strategic recommendations
    
    Format the response with clear sections and bullet points.
  `
};
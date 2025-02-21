import { CommandTemplate } from './types';
import { TrendingUp } from 'lucide-react';

export const trendsCommand: CommandTemplate = {
  name: 'Trend Analysis',
  description: 'Analyze emerging trends and future predictions',
  color: 'text-purple-600',
  icon: TrendingUp,
  
  generateResponse: async (topic: string) => [
    `# ${topic} Trend Analysis\n\n`,
    
    `## Consumer Behavior Shifts\n`,
    `1. Purchase Patterns\n`,
    `   - Channel preferences\n`,
    `   - Decision factors\n`,
    `2. Usage Occasions\n`,
    `   - New moments\n`,
    `   - Habit changes\n\n`,
    
    `## Product Innovation Trends\n`,
    `1. Formulation\n`,
    `   - Ingredient trends\n`,
    `   - Health benefits\n`,
    `2. Packaging\n`,
    `   - Materials\n`,
    `   - Design evolution\n\n`,
    
    `## Digital & Technology\n`,
    `1. E-commerce\n`,
    `   - Platform dynamics\n`,
    `   - Growth drivers\n`,
    `2. Social Media\n`,
    `   - Content trends\n`,
    `   - Influencer impact\n\n`,
    
    `## Future Outlook\n`,
    `1. Short-term Predictions\n`,
    `   - Next 12 months\n`,
    `   - Key drivers\n`,
    `2. Long-term Vision\n`,
    `   - Category evolution\n`,
    `   - Emerging spaces\n\n`,
    
    `Would you like to explore any of these trends in more detail?`
  ],
  
  generatePrompt: (topic: string) => `
    Analyze emerging trends for ${topic} focusing on:
    1. Consumer behavior changes
    2. Product innovation
    3. Digital transformation
    4. Future predictions
    
    Format the response with clear sections and bullet points.
  `
};
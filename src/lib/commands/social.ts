import { CommandTemplate } from './types';
import { MessageCircle } from 'lucide-react';

export const socialCommand: CommandTemplate = {
  name: 'Social & Review Analysis',
  description: 'Analyze consumer feedback and unmet needs',
  color: 'text-blue-600',
  icon: MessageCircle,
  
  generateResponse: async (topic: string) => [
    `# Consumer Insights: ${topic}\n\n`,
    
    `## Key Findings\n`,
    `1. Consumer Sentiment\n`,
    `2. Purchase Drivers\n`,
    `3. Usage Patterns\n\n`,
    
    `## Unmet Needs\n`,
    `1. Primary Pain Points\n`,
    `2. Feature Requests\n`,
    `3. Service Gaps\n\n`,
    
    `## Sentiment Analysis\n`,
    `- Overall Rating: X.X/5.0\n`,
    `- Positive Themes\n`,
    `- Negative Themes\n`,
    `- Trend Analysis\n\n`,
    
    `## Channel Analysis\n`,
    `1. Social Media\n`,
    `   - Platform breakdown\n`,
    `   - Engagement metrics\n`,
    `2. Review Sites\n`,
    `   - Rating distribution\n`,
    `   - Key themes\n\n`,
    
    `## Recommendations\n`,
    `1. Product Improvements\n`,
    `2. Communication Strategy\n`,
    `3. Service Enhancements\n\n`,
    
    `Would you like to explore any of these insights in more detail?`
  ],
  
  generatePrompt: (topic: string) => `
    Analyze social media and review data for ${topic} to identify:
    1. Key consumer insights
    2. Unmet needs and pain points
    3. Sentiment analysis
    4. Channel-specific insights
    5. Strategic recommendations
    
    Format the response with clear sections and bullet points.
  `
};
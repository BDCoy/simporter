import { CommandTemplate } from './types';
import { ShoppingCart, MessageCircle, TrendingUp, Users, Map, Lightbulb } from 'lucide-react';

export const commands: Record<string, CommandTemplate> = {
  '/category': {
    name: 'Category Analysis',
    description: 'Generate comprehensive category analysis and insights',
    color: 'text-emerald-600',
    icon: ShoppingCart,
    systemPrompt: `You are a market research expert specializing in category analysis. Help analyze the specified category by:
      1. Market size and growth
      2. Competitive landscape
      3. Consumer trends
      4. Innovation opportunities
      5. Strategic recommendations
      
      First acknowledge the request, then provide a detailed analysis with code examples.`
  },
  '/innovation': {
    name: 'Innovation Brief',
    description: 'Create detailed innovation briefs and concepts',
    color: 'text-blue-600',
    icon: Lightbulb,
    systemPrompt: `You are an innovation strategist. Help create innovation briefs by:
      1. Identifying market opportunities
      2. Analyzing consumer needs
      3. Developing concepts
      4. Evaluating feasibility
      5. Creating implementation plans
      
      First acknowledge the request, then provide detailed concepts with code examples.`
  },
  '/trends': {
    name: 'Trend Analysis',
    description: 'Analyze emerging trends and future predictions',
    color: 'text-purple-600',
    icon: TrendingUp,
    systemPrompt: `You are a trend analyst specializing in consumer goods. Help analyze trends by:
      1. Identifying emerging patterns
      2. Analyzing consumer behavior shifts
      3. Evaluating market impact
      4. Predicting future developments
      5. Recommending actions
      
      First acknowledge the request, then provide detailed analysis with code examples.`
  },
  '/profile': {
    name: 'Consumer Profile',
    description: 'Build detailed consumer segment profiles',
    color: 'text-orange-600',
    icon: Users,
    systemPrompt: `You are a consumer insights expert. Help create consumer profiles by:
      1. Demographics analysis
      2. Psychographic insights
      3. Behavior patterns
      4. Purchase drivers
      5. Opportunity spaces
      
      First acknowledge the request, then provide detailed profiles with code examples.`
  },
  '/landscape': {
    name: 'Competitive Landscape',
    description: 'Map and analyze competitive landscape',
    color: 'text-red-600',
    icon: Map,
    systemPrompt: `You are a competitive intelligence expert. Help analyze the competitive landscape by:
      1. Market mapping
      2. Competitor analysis
      3. Strategic positioning
      4. Opportunity gaps
      5. Threat assessment
      
      First acknowledge the request, then provide detailed analysis with code examples.`
  },
  '/concept': {
    name: 'Product Concept',
    description: 'Design and evaluate product concepts',
    color: 'text-indigo-600',
    icon: MessageCircle,
    systemPrompt: `You are a product innovation expert. Help design product concepts by:
      1. Consumer need identification
      2. Concept development
      3. Feature definition
      4. Value proposition
      5. Go-to-market strategy
      
      First acknowledge the request, then provide detailed concepts with code examples.`
  }
};

export const getCommand = (input: string) => {
  const command = Object.keys(commands).find(cmd => input.startsWith(cmd));
  return command ? commands[command] : null;
};

export const getCommandColor = (input: string) => {
  const command = getCommand(input);
  return command?.color || '';
};

export const getCommandIcon = (input: string) => {
  const command = getCommand(input);
  return command?.icon || null;
};

export const getSystemPrompt = (input: string) => {
  const command = getCommand(input);
  return command?.systemPrompt || null;
};
"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  ChevronRight, BarChart2, TrendingUp, LineChart, Video, 
  FileText, Sparkles, Search, MessageSquare, PenTool, Brain,
  Globe, Target
} from 'lucide-react';
import Link from 'next/link';

interface Tool {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  benefits: string[];
  category: 'research' | 'analysis' | 'content' | 'automation';
  newFeature?: boolean;
}

const tools: Tool[] = [
  {
    title: 'AI Video Creator',
    description: 'Transform your research presentations into engaging video content with AI-powered automation.',
    icon: Video,
    href: '/tools/video-creator',
    color: 'bg-violet-500',
    benefits: [
      'Convert screenshots to professional videos',
      'AI-generated script and voiceover',
      'Custom branding and transitions'
    ],
    category: 'content',
    newFeature: true
  },
  {
    title: 'Automated Reports',
    description: 'Generate SEO-optimized marketing reports and blogs with data-driven insights.',
    icon: FileText,
    href: '/tools/automated-reports',
    color: 'bg-emerald-500',
    benefits: [
      'Monthly report automation',
      'SEO optimization built-in',
      'Multiple format support (PPTX, Blog)'
    ],
    category: 'automation'
  },
  {
    title: 'Price Channel Analytics',
    description: 'Analyze pricing trends and consumer sentiment across retail channels.',
    icon: LineChart,
    href: '/tools/price-channel-analytics',
    color: 'bg-blue-500',
    benefits: [
      'Review-based price analysis',
      'Cross-channel comparison',
      'Sentiment correlation'
    ],
    category: 'analysis'
  },
  {
    title: 'Research Proposal Generator',
    description: 'Create professional research proposals with AI assistance and best practices.',
    icon: PenTool,
    href: '/tools/research-proposals',
    color: 'bg-amber-500',
    benefits: [
      'Template-based generation',
      'Methodology suggestions',
      'Budget optimization'
    ],
    category: 'research'
  },
  {
    title: 'Market Expansion Planner',
    description: 'Strategic planning tools for market expansion and opportunity analysis.',
    icon: Globe,
    href: '/tools/market-expansion',
    color: 'bg-indigo-500',
    benefits: [
      'Market size estimation',
      'Opportunity scoring',
      'Risk assessment'
    ],
    category: 'analysis'
  },
  {
    title: 'AI Insights Generator',
    description: 'Generate company-specific market insights using advanced AI analysis.',
    icon: Brain,
    href: '/tools/insights-generator',
    color: 'bg-rose-500',
    benefits: [
      'Real-time market intelligence',
      'Custom company context',
      'Actionable recommendations'
    ],
    category: 'analysis',
    newFeature: true
  },
  {
    title: 'Concept Test Assistant',
    description: 'Streamline survey programming and concept testing workflow.',
    icon: Target,
    href: '/tools/concept-test-assistant',
    color: 'bg-cyan-500',
    benefits: [
      'Survey template library',
      'Quick code generation',
      'Best practice integration'
    ],
    category: 'research'
  },
  {
    title: 'Company Chat',
    description: 'Collaborate with your team in a dedicated research workspace.',
    icon: MessageSquare,
    href: '/tools/company-chat',
    color: 'bg-purple-500',
    benefits: [
      'Real-time collaboration',
      'Research thread organization',
      'File sharing & integration'
    ],
    category: 'automation'
  }
];

export default function ToolsPage() {
  const categories = {
    research: 'Research Tools',
    analysis: 'Analysis & Insights',
    content: 'Content Creation',
    automation: 'Automation Tools'
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Research Tools</h1>
        <p className="text-lg text-gray-600">
          Discover the latest AI-powered tools to enhance your research, analysis, content creation, and workflow automation.
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {Object.entries(categories).map(([key, categoryTitle]) => (
          <div key={key}>
            <h2 className="text-2xl font-semibold mb-4">{categoryTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter((tool) => tool.category === key)
                .map((tool) => (
                  <Link key={tool.href} href={tool.href}>
                    <Card className="group hover:shadow-xl transition-all duration-300">
                      <CardHeader className="flex flex-col items-center text-center">
                        <div
                          className={`w-16 h-16 mb-4 rounded-full ${tool.color} flex items-center justify-center`}
                        >
                          <tool.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle>{tool.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{tool.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

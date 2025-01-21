"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronRight, Video, BarChart2, FileText, Settings, PieChart, Package, Shield, Cloud, Monitor, Globe, Star, Clipboard, Folder, Code, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: 'AI Insights Generator',
    description: 'Generate actionable insights from large datasets.',
    icon: <PieChart className="w-8 h-8 text-white" />,
    href: '/tools/ai-insights-generator/page',
    color: 'bg-gradient-to-r from-rose-500 to-pink-500',
    category: 'Insights'
  },
  {
    title: 'AI Video Creator',
    description: 'Transform research into professional videos with AI.',
    icon: <Video className="w-8 h-8 text-white" />,
    href: '/tools/ai-video-creator/page',
    color: 'bg-gradient-to-r from-purple-500 to-blue-500',
    category: 'Content Creation'
  },
  {
    title: 'Automated Marketing Reports',
    description: 'Automatically generate marketing reports based on key data points.',
    icon: <FileText className="w-8 h-8 text-white" />,
    href: '/tools/automated-marketing-reports/page',
    color: 'bg-gradient-to-r from-green-500 to-teal-500',
    category: 'Automation'
  },
  {
    title: 'Concept Art',
    description: 'Create and explore variations of your ideas with AI-powered tools for concept generation.',
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    href: '/tools/concept-art',
    color: 'bg-gradient-to-r from-orange-500 to-red-500',
    category: 'Content Creation'
  },  
  {
    title: 'AI Blog Writer',
    description: 'Write and update AI-powered blogs in 800-word chunks with fresh monthly data and embedded images.',
    icon: <FileText className="w-8 h-8 text-white" />,
    href: '/tools/ai-blog-writer',
    color: 'bg-gradient-to-r from-teal-500 to-green-500',
    category: 'Content Creation'
  },  
  {
    title: 'Brand Health Monitor',
    description: 'Track brand perception and identify areas for improvement.',
    icon: <BarChart2 className="w-8 h-8 text-white" />,
    href: '/tools/brand-health-monitor/page',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    category: 'Insights'
  },
  {
    title: 'Company Chat',
    description: 'Collaborate with your team in a dedicated research workspace.',
    icon: <Monitor className="w-8 h-8 text-white" />,
    href: '/tools/company-chat/page',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    category: 'Automation'
  },
  {
    title: 'Concept Test Programming Assistant',
    description: 'Streamline survey programming and concept testing workflows.',
    icon: <Clipboard className="w-8 h-8 text-white" />,
    href: '/tools/concept-test-programming-assistant/page',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    category: 'Research'
  },
  {
    title: 'Consumer Behavior Lab',
    description: 'Analyze and understand consumer behavior trends.',
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    href: '/tools/consumer-behavior-lab/page',
    color: 'bg-gradient-to-r from-pink-500 to-red-500',
    category: 'Insights'
  },
  {
    title: 'DTC Optimization',
    description: 'Enhance your direct-to-consumer strategy with AI insights.',
    icon: <Package className="w-8 h-8 text-white" />,
    href: '/tools/dtc-optimization/page',
    color: 'bg-gradient-to-r from-teal-500 to-green-500',
    category: 'Optimization'
  },
  {
    title: 'Dynamic Pricing Strategy',
    description: 'Data-driven pricing optimization for maximum market impact.',
    icon: <Shield className="w-8 h-8 text-white" />,
    href: '/tools/dynamic-pricing/page',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    category: 'Optimization'
  },
  {
    title: 'Innovation Cycle Accelerator',
    description: 'Optimize your product development timeline and track milestones.',
    icon: <Star className="w-8 h-8 text-white" />,
    href: '/tools/innovation-cycle/page',
    color: 'bg-gradient-to-r from-violet-500 to-indigo-500',
    category: 'Optimization'
  },
  {
    title: 'Market Expansion Planner',
    description: 'Strategic planning tools for market expansion and opportunity analysis.',
    icon: <Globe className="w-8 h-8 text-white" />,
    href: '/tools/market-expansion-planner/page',
    color: 'bg-gradient-to-r from-indigo-500 to-blue-500',
    category: 'Insights'
  },
  {
    title: 'Price Channel Analytics',
    description: 'Analyze pricing trends and consumer sentiment across retail channels.',
    icon: <BarChart2 className="w-8 h-8 text-white" />,
    href: '/tools/price-channel-analytics/page',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    category: 'Insights'
  },
  {
    title: 'Project Management Tool',
    description: 'Organize tasks and collaborate efficiently with your team.',
    icon: <Folder className="w-8 h-8 text-white" />,
    href: '/tools/project-management-tool/page',
    color: 'bg-gradient-to-r from-green-500 to-emerald-500',
    category: 'Automation'
  },
  {
    title: 'Research Proposal Generator',
    description: 'Create professional research proposals with AI assistance.',
    icon: <Code className="w-8 h-8 text-white" />,
    href: '/tools/research-proposal-generator/page',
    color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    category: 'Research'
  },
  {
    title: 'Retail Media Optimization',
    description: 'Maximize ad spend efficiency in retail media campaigns.',
    icon: <Settings className="w-8 h-8 text-white" />,
    href: '/tools/retail-media-optimization/page',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    category: 'Optimization'
  },
  {
    title: 'Retail Performance Analyzer',
    description: 'Evaluate and enhance retail performance with detailed analytics.',
    icon: <Cloud className="w-8 h-8 text-white" />,
    href: '/tools/retail-performance-analyzer/page',
    color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    category: 'Insights'
  },
  {
    title: 'Trends Analyzer',
    description: 'Track and analyze emerging consumer behavior patterns.',
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    href: '/tools/trends-analyzer/page',
    color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    category: 'Insights'
  }
];

const categories = [
  {
    name: 'Insights',
    description: 'Discover trends and generate actionable insights for smarter decisions.'
  },
  {
    name: 'Content Creation',
    description: 'Create compelling content with AI-powered tools for every use case.'
  },
  {
    name: 'Automation',
    description: 'Streamline workflows and maximize efficiency with smart tools.'
  },
  {
    name: 'Optimization',
    description: 'Enhance strategies and achieve better outcomes with advanced optimization.'
  },
  {
    name: 'Research',
    description: 'Explore and develop professional research materials with ease.'
  }
];

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Discover Our Tools</h1>
        <p className="text-gray-600 text-lg">
          Empower your business with AI-driven solutions for insights, optimization, and content creation.
        </p>
      </header>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category.name}>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools
                .filter((tool) => tool.category === category.name)
                .map((tool) => (
                  <Link key={tool.href} href={tool.href}>
                    <Card className="group hover:shadow-xl transition-all duration-300">
                      <CardHeader className="flex flex-col items-center text-center">
                        <div
                          className={`w-16 h-16 mb-4 rounded-full ${tool.color} flex items-center justify-center shadow-lg`}
                        >
                          {tool.icon}
                        </div>
                        <CardTitle className="text-lg font-bold">{tool.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm">{tool.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

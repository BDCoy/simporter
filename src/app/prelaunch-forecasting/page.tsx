"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { 
  ArrowRight, ChevronLeft, Calendar,
  BarChart3, Globe2, Users, TrendingUp,
  DollarSign, Target, Share2, CheckCircle,
  Settings, Star, Brain, XCircle,
  Download // Import Download icon
} from 'lucide-react';
import PptxGenJS from 'pptxgenjs'; // Import pptxgenjs

interface FormData {
  industry: string;
  price: number;
  audience: number;
  timeline: number;
  marketingBudget: number;
  purchaseInterest: number;
  aiScore: number;
  seasonalPattern: string;
  revenueGoal: number;
}

interface ForecastDataPoint {
  day: number;
  revenue: number;
  customers: number;
  projectedGrowth: number;
}

interface Industry {
  id: string;
  name: string;
  multiplier: number;
  icon: React.ReactNode;
}

interface SeasonalPattern {
  id: string;
  name: string;
  description: string;
  multipliers: number[];
}

interface StepProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const industries: Industry[] = [
  { id: 'tech', name: 'Technology & SaaS', multiplier: 1.2, icon: <Settings className="w-5 h-5" /> },
  { id: 'ecommerce', name: 'E-Commerce', multiplier: 0.9, icon: <Globe2 className="w-5 h-5" /> },
  { id: 'enterprise', name: 'Enterprise Software', multiplier: 1.3, icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'consumer', name: 'Consumer Products', multiplier: 0.85, icon: <Users className="w-5 h-5" /> }
];

const seasonalPatterns: SeasonalPattern[] = [
  { 
    id: 'none', 
    name: 'No Seasonality',
    description: 'Consistent demand throughout the year',
    multipliers: Array(12).fill(1)
  },
  {
    id: 'holiday',
    name: 'Holiday Peak',
    description: 'Strong Q4 with December peak',
    multipliers: [0.8, 0.8, 0.9, 0.9, 0.9, 1.0, 1.0, 1.1, 1.2, 1.3, 1.5, 2.0]
  },
  {
    id: 'summer',
    name: 'Summer Peak',
    description: 'Strong performance in summer months',
    multipliers: [0.8, 0.9, 1.0, 1.2, 1.4, 1.6, 1.8, 1.6, 1.2, 1.0, 0.9, 0.8]
  },
  {
    id: 'backToSchool',
    name: 'Back to School',
    description: 'Peaks in late summer/early fall',
    multipliers: [0.7, 0.7, 0.8, 0.9, 1.0, 1.1, 1.4, 1.8, 1.6, 1.1, 0.9, 0.8]
  }
];

const ForecastPage: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showInsights, setShowInsights] = useState<boolean>(false);
  const [forecast, setForecast] = useState<ForecastDataPoint[] | null>(null);
  const [formData, setFormData] = useState<FormData>({
    industry: '',
    price: 0,
    audience: 0,
    timeline: 30,
    marketingBudget: 0,
    purchaseInterest: 0,
    aiScore: 0,
    seasonalPattern: 'none',
    revenueGoal: 0
  });

  const calculateForecast = (): void => {
    setIsCalculating(true);
    const selectedIndustry = industries.find(i => i.id === formData.industry);
    const selectedPattern = seasonalPatterns.find(p => p.id === formData.seasonalPattern);
    
    if (!selectedIndustry || !selectedPattern) {
      setIsCalculating(false);
      return;
    }

    const baseConversion = 0.02;
    const purchaseInterestMultiplier = (formData.purchaseInterest / 10) * 1.5;
    const aiScoreMultiplier = (formData.aiScore / 100) * 1.3;
    
    const forecastData: ForecastDataPoint[] = Array.from({ length: formData.timeline }, (_, i) => {
      const day = i + 1;
      const month = Math.floor((i / formData.timeline) * 12);
      const seasonalMultiplier = selectedPattern.multipliers[month];
      
      const marketingImpact = (formData.marketingBudget / 1000) * 0.01;
      const audienceReach = formData.audience * (1 + marketingImpact);
      const conversion = baseConversion * selectedIndustry.multiplier * purchaseInterestMultiplier * aiScoreMultiplier * seasonalMultiplier;
      const sales = Math.floor(audienceReach * conversion * (1 + Math.random() * 0.1));
      const revenue = sales * formData.price;

      return {
        day,
        revenue: Math.round(revenue),
        customers: sales,
        projectedGrowth: revenue * (1 + (day / formData.timeline) * 0.2)
      };
    });

    setTimeout(() => {
      setForecast(forecastData);
      setIsCalculating(false);
    }, 1500);
  };

  const ResultsSection: React.FC = () => {
    if (!forecast) return null;

    const totalRevenue = forecast.reduce((sum, day) => sum + day.revenue, 0);
    const totalCustomers = forecast.reduce((sum, day) => sum + day.customers, 0);
    const projectedGrowth = forecast[forecast.length - 1].projectedGrowth;
    const goalMet = totalRevenue >= formData.revenueGoal;

    // Function to handle PPTX download
    const downloadPPTX = () => {
      const pptx = new PptxGenJS();
      
      // Add slides for each step
      steps.forEach((stepItem, index) => {
        const slide = pptx.addSlide();
        slide.addText(stepItem.title, { x: 0.5, y: 0.5, fontSize: 24, bold: true });
        slide.addText(stepItem.subtitle, { x: 0.5, y: 1.0, fontSize: 16 });
        // Note: Adding complex React components as slides is not straightforward.
        // Here, we add the content as plain text. You can customize this as needed.
        // For example, if content is JSX, you might need to extract relevant text.
        if (React.isValidElement(stepItem.content)) {
          // Attempt to extract text from the content
          const textContent = extractTextFromJSX(stepItem.content);
          slide.addText(textContent, { x: 0.5, y: 1.5, fontSize: 14 });
        }
      });

      // Add a slide for the results
      const resultsSlide = pptx.addSlide();
      resultsSlide.addText("Forecast Results", { x: 0.5, y: 0.5, fontSize: 24, bold: true });
      resultsSlide.addText(`Total Revenue: $${new Intl.NumberFormat().format(totalRevenue)}`, { x: 0.5, y: 1.0, fontSize: 16 });
      resultsSlide.addText(`Total Customers: ${new Intl.NumberFormat().format(totalCustomers)}`, { x: 0.5, y: 1.5, fontSize: 16 });
      resultsSlide.addText(`Projected Growth: ${((projectedGrowth / forecast[0].revenue - 1) * 100).toFixed(1)}%`, { x: 0.5, y: 2.0, fontSize: 16 });
      resultsSlide.addText(`Revenue Goal ${goalMet ? 'Achieved' : 'Not Met'}`, { x: 0.5, y: 2.5, fontSize: 16, color: goalMet ? '00AA00' : 'FF0000' });

      pptx.writeFile({ fileName: "Revenue_Forecast_Report.pptx" });
    };

    // Helper function to extract text from JSX elements
    const extractTextFromJSX = (element: React.ReactNode): string => {
      let text = '';

      React.Children.forEach(element, (child) => {
        if (typeof child === "string" || typeof child === "number") {
          text += child + " ";
        } else if (React.isValidElement(child)) {
          const props = child.props as { children?: React.ReactNode };
          if (props.children) {
            text += extractTextFromJSX(props.children);
          }
        }
      });      

      return text.trim();
    };

    return (
      <div className="space-y-8">
        <div className={`p-4 rounded-lg ${
          goalMet ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {goalMet ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <div className={`font-semibold ${goalMet ? 'text-green-700' : 'text-red-700'}`}>
                {goalMet ? 'Revenue Goal Achieved!' : 'Revenue Goal Not Met'}
              </div>
              <div className="text-sm">
                {goalMet 
                  ? `Projected revenue exceeds goal by $${new Intl.NumberFormat().format(totalRevenue - formData.revenueGoal)}`
                  : `Projected revenue is $${new Intl.NumberFormat().format(formData.revenueGoal - totalRevenue)} below goal`
                }
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Projected Revenue</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${new Intl.NumberFormat().format(totalRevenue)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Expected Customers</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat().format(totalCustomers)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Growth Trajectory</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {((projectedGrowth / forecast[0].revenue - 1) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Revenue Forecast</h3>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="text-sm text-violet-600 hover:text-violet-700"
            >
              {showInsights ? 'Hide' : 'Show'} Insights
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              />
              <ReferenceLine 
                y={formData.revenueGoal / formData.timeline} 
                stroke="#FF6B6B" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Goal', 
                  position: 'right',
                  fill: '#FF6B6B',
                  fontSize: 12
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
              />
              {showInsights && (
                <Line
                  type="monotone"
                  dataKey="projectedGrowth"
                  stroke="#34D399"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setStep(0);
              setForecast(null);
            }}
            className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Adjust Parameters
          </button>
          <button
            className="px-6 py-3 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Export Analysis
          </button>
          {/* Added Download PPTX Button */}
          <button
            onClick={downloadPPTX}
            className="px-6 py-3 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" /> {/* Download icon */}
            Download PPTX
          </button>
        </div>
      </div>
    );
  };

  const steps: StepProps[] = [
    {
      title: "Select Your Industry",
      subtitle: "We'll customize our analysis model based on your sector",
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setFormData({ ...formData, industry: ind.id })}
              className={`p-6 rounded-lg text-left transition-all duration-300 ${
                formData.industry === ind.id
                  ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white hover:shadow-xl border border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {ind.icon}
                <span className="font-semibold">{ind.name}</span>
              </div>
              <div className="text-sm opacity-80">
                {formData.industry === ind.id && 'Selected for Analysis'}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Define Your Pricing Strategy",
      subtitle: "Set your product price point for revenue modeling",
      icon: <DollarSign className="w-6 h-6" />,
      content: (
        <div className="space-y-8">
          <div className="relative bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full text-5xl font-bold bg-transparent focus:outline-none text-center"
              placeholder="0"
            />
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300">$</div>
          </div>
          <div className="flex justify-center gap-4">
            {[4.95, 14.95, 34.95, 68.95].map((price) => (
              <button
                key={price}
                onClick={() => setFormData({ ...formData, price })}
                className="px-6 py-3 rounded-lg bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                ${price}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Enter Simporter Scores",
      subtitle: "Input your product's Purchase Interest and AI scores",
      icon: <Star className="w-6 h-6" />,
      content: (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-violet-600" />
                <label className="font-semibold">Purchase Interest Score (0-10)</label>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={formData.purchaseInterest}
                onChange={(e) => setFormData({ ...formData, purchaseInterest: Number(e.target.value) })}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-4xl font-bold text-center mt-4">
                {formData.purchaseInterest.toFixed(1)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-violet-600" />
                <label className="font-semibold">AI Score (0-100%)</label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={formData.aiScore}
                onChange={(e) => setFormData({ ...formData, aiScore: Number(e.target.value) })}
                className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-4xl font-bold text-center mt-4">
                {formData.aiScore}%
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Target Audience Reach",
      subtitle: "Estimate your potential market reach",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <input
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: Number(e.target.value) })}
            className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-5xl font-bold text-center">
            {new Intl.NumberFormat().format(formData.audience)}
          </div>
          <div className="text-center text-gray-500 text-sm">Potential Users</div>
        </div>
      )
    },
    {
      title: "Marketing Investment",
      subtitle: "Set your marketing budget for maximum impact",
      icon: <TrendingUp className="w-6 h-6" />,
      content: (
        <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <input
            type="range"
            min="1000"
            max="10000000"
            step="1000"
            value={formData.marketingBudget}
            onChange={(e) => setFormData({ ...formData, marketingBudget: Number(e.target.value) })}
            className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-5xl font-bold text-center">
            ${new Intl.NumberFormat().format(formData.marketingBudget)}
          </div>
        </div>
      )
    },
    {
      title: "Seasonal Pattern & Goals",
      subtitle: "Select your seasonal pattern and set revenue goals",
      icon: <Calendar className="w-6 h-6" />,
      content: (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Seasonal Pattern</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasonalPatterns.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => setFormData({ ...formData, seasonalPattern: pattern.id })}
                  className={`p-6 rounded-lg text-left transition-all duration-300 ${
                    formData.seasonalPattern === pattern.id
                      ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-semibold mb-2">{pattern.name}</div>
                  <div className="text-sm opacity-80">{pattern.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Revenue Goal</h3>
            <div className="relative">
              <input
                type="number"
                value={formData.revenueGoal || ''}
                onChange={(e) => setFormData({ ...formData, revenueGoal: Number(e.target.value) })}
                className="w-full text-5xl font-bold bg-transparent focus:outline-none text-center"
                placeholder="0"
              />
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300">$</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-br from-violet-600 to-indigo-600 text-transparent bg-clip-text">
            Revenue Forecast Engine
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Advanced revenue modeling with Simporter insights, seasonality analysis and goal tracking
          </p>
        </div>

        {!forecast ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="h-1 bg-gray-200 rounded-full">
                <div
                  className="h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${(step + 1) * (100 / steps.length)}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                {steps[step].icon}
                <h2 className="text-2xl font-bold">{steps[step].title}</h2>
              </div>
              <p className="text-gray-500">{steps[step].subtitle}</p>
            </div>

            {steps[step].content}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  step === 0
                    ? 'opacity-0'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                disabled={step === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => {
                  if (step < steps.length - 1) {
                    setStep(step + 1);
                  } else {
                    calculateForecast();
                  }
                }}
                className="px-6 py-2 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-indigo-700 flex items-center gap-2"
                disabled={
                  (step === 0 && !formData.industry) ||
                  (step === 1 && !formData.price) ||
                  (step === 2 && (!formData.purchaseInterest || !formData.aiScore)) ||
                  (step === 3 && !formData.audience) ||
                  (step === 4 && !formData.marketingBudget) ||
                  (step === 5 && (!formData.seasonalPattern || !formData.revenueGoal))
                }
              >
                {step === steps.length - 1 ? 'Generate Forecast' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : isCalculating ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-xl font-semibold">Calculating your forecast...</div>
          </div>
        ) : (
          <ResultsSection />
        )}
      </div>

      {formData.seasonalPattern !== 'none' && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="text-sm font-semibold mb-2">Seasonal Pattern: {seasonalPatterns.find(p => p.id === formData.seasonalPattern)?.name}</div>
          <div className="flex items-center gap-1">
            {seasonalPatterns.find(p => p.id === formData.seasonalPattern)?.multipliers.map((multiplier, index) => (
              <div
                key={index}
                className="w-2 bg-violet-600"
                style={{
                  height: `${multiplier * 40}px`,
                  opacity: 0.5 + multiplier * 0.5
                }}
                title={`Month ${index + 1}: ${multiplier.toFixed(2)}x`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">Monthly multipliers visualization</div>
        </div>
      )}
    </div>
  );
};

export default ForecastPage;  
"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Clock, Save, RotateCcw, AlertCircle, Info, CheckCircle, Eye } from 'lucide-react';

interface VersionHistory {
  id: string;
  timestamp: string;
  tokensUsed: number;
  changeDescription: string;
  content?: string; // Simulated content for preview
}

const TokensTab: React.FC = () => {
  // States for token usage and version history
  const [tokensUsed, setTokensUsed] = useState<number>(1234);
  const [tokenBalance, setTokenBalance] = useState<number>(5000);
  const [subscriptionLimit, setSubscriptionLimit] = useState<number>(100000); // Total tokens in subscription
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([]);

  // Function to handle top up
  const handleTopUp = () => {
    alert('Redirecting to payment page to add more tokens...');
    // In a real app, this would redirect to a payment page or open a modal
  };

  // Simulated fetch for token usage and version history
  useEffect(() => {
    // Simulate API call delay
    const fetchData = async () => {
      setIsLoading(true);
      // Static data with realistic timestamps (most recent first)
      setTimeout(() => {
        const now = new Date();
        setTokensUsed(1234);
        // Uncomment the next line to test the low balance state and show the Top Up button
        // setTokenBalance(9000); // This is less than 10% of 100000
        setTokenBalance(5000);
        setSubscriptionLimit(100000); // Set the subscription limit
        
        // Create version history with realistic timestamps
        const history = [
          {
            id: "v5",
            timestamp: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 minutes ago
            tokensUsed: 1234,
            changeDescription: "Added data visualization section",
            content: "This is a preview of version 5 content with data visualization section."
          },
          {
            id: "v4",
            timestamp: new Date(now.getTime() - 20 * 60000).toISOString(), // 20 minutes ago
            tokensUsed: 1100,
            changeDescription: "Refined analysis parameters",
            content: "This is a preview of version 4 content with refined analysis parameters."
          },
          {
            id: "v3",
            timestamp: new Date(now.getTime() - 35 * 60000).toISOString(), // 35 minutes ago
            tokensUsed: 950,
            changeDescription: "Initial data processing",
            content: "This is a preview of version 3 content with initial data processing."
          },
          {
            id: "v2",
            timestamp: new Date(now.getTime() - 60 * 60000).toISOString(), // 1 hour ago
            tokensUsed: 800,
            changeDescription: "Started new project",
            content: "This is a preview of version 2 content from started project."
          },
          {
            id: "v1",
            timestamp: new Date(now.getTime() - 90 * 60000).toISOString(), // 1.5 hours ago
            tokensUsed: 600,
            changeDescription: "Created document",
            content: "This is a preview of version 1 content from document creation."
          }
        ];
        
        setVersionHistory(history);
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  // Format the timestamp for display
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  
  // Get relative time (e.g., "5 minutes ago")
  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  // Prepare data for the chart - used vs balance
  const chartData = [...versionHistory]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(version => {
      // Calculate remaining balance for that point in time
      const totalAvailable = tokenBalance + tokensUsed; // Total tokens the user had
      const remainingAtTime = totalAvailable - version.tokensUsed;
      
      return {
        time: formatTime(version.timestamp),
        Used: version.tokensUsed,
        Available: remainingAtTime,
        timestamp: version.timestamp
      };
    });

  // Handle restore version
  const handleRestore = (versionId: string) => {
    // In a real app, this would restore the selected version
    alert(`Version ${versionId} restored successfully!`);
    setSelectedVersion(null);
    setShowPreview(false);
  };

  // Get selected version content
  const getSelectedVersionContent = () => {
    if (!selectedVersion) return null;
    const version = versionHistory.find(v => v.id === selectedVersion);
    return version?.content || "No preview available";
  };

  // Toggle preview panel
  const togglePreview = (versionId: string) => {
    setSelectedVersion(versionId);
    setShowPreview(true);
  };

  // Simple optimization tips for non-technical users
  const optimizationTips = [
    "Be specific in your questions instead of asking open-ended ones",
    "Break complex tasks into smaller, separate steps",
    "Use shorter messages when possible",
    "Ask for summarized responses when you don't need details"
  ];

  return (
    <div className="p-6 h-full overflow-auto bg-white">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Main panel with all content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Header with quick stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Token Usage</h2>
                <p className="text-gray-500">Track and manage your token consumption</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="text-right mr-8">
                  <p className="text-sm text-gray-500">Used</p>
                  <p className="text-xl font-bold text-blue-600">{tokensUsed.toLocaleString()}</p>
                </div>
                <div className="text-right flex items-center">
                  <div>
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-xl font-bold text-green-600">{tokenBalance.toLocaleString()}</p>
                  </div>
                  {/* Top Up button that appears when balance is below 10% of subscription limit */}
                  {tokenBalance < (subscriptionLimit * 0.1) && (
                    <button 
                      onClick={handleTopUp}
                      className="ml-4 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Top Up
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Usage chart and tips in one row */}
            <div className="flex flex-col lg:flex-row mb-8 gap-6">
              {/* Chart takes more space */}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Info className="mr-2 text-blue-500" size={20} />
                  Token Usage Over Time
                </h3>
                <div className="h-80 border border-gray-100 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                      barGap={0}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6B7280"
                        angle={-45}
                        textAnchor="end"
                        tick={{ fontSize: 12 }}
                        height={60}
                      />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.375rem",
                          border: "1px solid #E5E7EB",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#111827" }}
                        formatter={(value: number) => [`${value.toLocaleString()} tokens`, ""]}
                      />
                      <Legend />
                      <Bar 
                        dataKey="Used" 
                        name="Tokens Used" 
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="Available" 
                        name="Available Balance" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tips take less space */}
              <div className="lg:w-80">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="mr-2 text-amber-500" size={20} />
                  Save Tokens Easily
                </h3>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <ul className="space-y-3">
                    {optimizationTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Version history section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2 text-purple-500" size={20} />
                Version History
              </h3>
              <p className="text-gray-500 mb-4">
                Previous versions may be available for a limited time. No guarantee is made regarding availability or retention of earlier versions.
              </p>
              
              {/* Preview panel - shows when a version is selected for preview */}
              {showPreview && selectedVersion && (
                <div className="mb-6 border border-blue-100 bg-blue-50 rounded-lg overflow-hidden">
                  <div className="bg-blue-100 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">Previewing version {selectedVersion}</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleRestore(selectedVersion)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                      >
                        Restore This Version
                      </button>
                      <button 
                        onClick={() => setShowPreview(false)}
                        className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-blue-100">
                    <div className="p-3 bg-gray-50 rounded border border-gray-100 min-h-40">
                      {getSelectedVersionContent()}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Available Versions</span>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {versionHistory.map((version, index) => (
                    <div 
                      key={version.id} 
                      className={`p-4 flex items-center ${selectedVersion === version.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Save className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-800">{version.changeDescription}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-500 mr-3">{getRelativeTime(version.timestamp)}</span>
                              <span className="text-xs text-gray-400">{formatTime(version.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {version.tokensUsed.toLocaleString()} tokens
                        </span>
                        
                        <button 
                          onClick={() => togglePreview(version.id)}
                          className="ml-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokensTab;
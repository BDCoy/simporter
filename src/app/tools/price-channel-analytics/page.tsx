"use client";

import React, { useState } from 'react';
import { DollarSign, BarChart2, Filter, Search, Download, RefreshCcw, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type CategoryType = 'skincare' | 'haircare' | 'oral_care';
type RetailerType = 'amazon' | 'walmart' | 'target';

interface Categories {
  skincare: string[];
  haircare: string[];
  oral_care: string[];
}

const PriceChannelAnalytics = () => {
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerType>('amazon');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('skincare');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  
  const categories: Categories = {
    skincare: ['Cleansers', 'Moisturizers', 'Serums', 'Masks'],
    haircare: ['Shampoo', 'Conditioner', 'Treatments', 'Styling'],
    oral_care: ['Toothpaste', 'Mouthwash', 'Whitening', 'Floss']
  };

  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Price Channel Analytics</h1>
            <h2 className="text-2xl font-semibold text-gray-500">Review-Based Price Analysis</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analysis Controls */}
          <div className="space-y-6">
            {/* Retailer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Data Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'amazon', label: 'Amazon', reviews: '125K+' },
                    { name: 'walmart', label: 'Walmart', reviews: '45K+' },
                    { name: 'target', label: 'Target', reviews: '30K+' }
                  ].map((retailer) => (
                    <button
                      key={retailer.name}
                      onClick={() => setSelectedRetailer(retailer.name as RetailerType)}
                      className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                        selectedRetailer === retailer.name
                          ? 'border-violet-600 bg-violet-50'
                          : 'hover:border-violet-300'
                      }`}
                    >
                      <Star className="w-5 h-5 text-violet-600" />
                      <div className="text-left flex-1">
                        <div className="font-medium">{retailer.label}</div>
                        <div className="text-xs text-gray-500">{retailer.reviews} reviews analyzed</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Category Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select 
                    className="w-full border rounded-lg p-2"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as CategoryType)}
                  >
                    <option value="skincare">Skincare</option>
                    <option value="haircare">Haircare</option>
                    <option value="oral_care">Oral Care</option>
                  </select>
                  
                  <div className="space-y-2">
                    {categories[selectedCategory].map((subcategory) => (
                      <label key={subcategory} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        {subcategory}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Range Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Price Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Min ($)</label>
                      <input 
                        type="number" 
                        className="w-full border rounded-lg p-2"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Max ($)</label>
                      <input 
                        type="number" 
                        className="w-full border rounded-lg p-2"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      />
                    </div>
                  </div>
                  
                  <button className="w-full bg-violet-600 text-white rounded-lg py-2 hover:bg-violet-700 flex items-center justify-center gap-2">
                    <Filter className="w-4 h-4" />
                    Apply Filters
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rest of the component remains the same... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChannelAnalytics;
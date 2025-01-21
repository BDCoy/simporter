"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function CreatePage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState("");
  const [reportName, setReportName] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [innovationFocuses, setInnovationFocuses] = useState<string[]>([]);

  const totalSteps = 5;
  const progress = Math.round((step / totalSteps) * 100);

  const handleNextStep = () => {
    if (step === totalSteps) {
      if (!reportType || !reportName || countries.length === 0 || categories.length === 0 || innovationFocuses.length === 0) {
        alert("Please complete all fields.");
        return;
      }

      const queryParams = new URLSearchParams({
        reportType,
        reportName,
        countries: JSON.stringify(countries),
        categories: JSON.stringify(categories),
        innovationFocuses: JSON.stringify(innovationFocuses),
      }).toString();

      router.push(`/report-builder?${queryParams}`);
    } else {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const focusOptions: Record<string, string[]> = {
    "New Concept Portfolio": ["Novel Ideas", "Emerging Trends", "Core Benefits", "Key Audiences", "Form Factors", "Flavor Innovations", "Sustainability", "Packaging", "Design Trends", "Fragrances"],
    "Improve Existing Concepts": ["Consumer Feedback", "Product Failures", "Enhancement Opportunities", "Cost Improvements", "Durability", "New Benefits", "Targeting Audiences", "Seasonal Trends", "Performance Features", "Reusability"],
    "Consumer Trend Prediction": ["Market Growth", "Emerging Niches", "Consumer Habits", "Sustainability Trends", "Digital Behavior", "Health Trends", "Technology Adoption", "Cultural Influences", "Global Insights", "Demographics"],
    "New Product Forecast": ["Demand Projections", "Pricing", "Revenue Streams", "Adoption Rates", "Competitor Analysis", "Feature Preferences", "Innovation Potential", "Supply Chain", "Technology Integration", "Global Growth"],
    "Target Audience Analysis": ["Demographics", "Consumer Habits", "Brand Preferences", "Spending Patterns", "Loyalty Drivers", "Geographical Segments", "Psychographics", "Influencer Impact", "Value Perceptions", "Needs"],
    "Competitive Analysis": ["Strengths", "Weaknesses", "Market Positioning", "Pricing Models", "Technology Edge", "Customer Sentiment", "Sales Channels", "Brand Perception", "Marketing Strategies", "Global Reach"],
  };

  const currentFocusOptions = focusOptions[reportType] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-violet-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">What is your report about?</h1>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border rounded-lg p-3 bg-white"
            >
              <option value="">Select a Report Type</option>
              {Object.keys(focusOptions).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">What should we call this report?</h1>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter report name"
              className="w-full border rounded-lg p-3 bg-white"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Select relevant countries</h1>
            <select
              value={countries[0] || ""}
              onChange={(e) => setCountries([e.target.value])}
              className="w-full border rounded-lg p-3 bg-white"
            >
              <option value="">Select a Country</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              <option value="Germany">Germany</option>
              <option value="India">India</option>
            </select>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Select relevant categories</h1>
            <select
              value={categories[0] || ""}
              onChange={(e) => setCategories([e.target.value])}
              className="w-full border rounded-lg p-3 bg-white"
            >
              <option value="">Select a Category</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Tech">Tech</option>
              <option value="Household">Household</option>
            </select>
          </div>
        )}

        {step === 5 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Select your innovation focuses</h1>
            <div className="grid grid-cols-2 gap-4">
              {currentFocusOptions.map((focus) => (
                <label key={focus} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={innovationFocuses.includes(focus)}
                    onChange={() =>
                      setInnovationFocuses((prev) =>
                        prev.includes(focus)
                          ? prev.filter((item) => item !== focus)
                          : [...prev, focus]
                      )
                    }
                  />
                  {focus}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={handlePreviousStep}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg flex items-center gap-2"
          >
            {step === totalSteps ? "Create Report" : "Next"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

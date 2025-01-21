"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const REPORT_TYPES = [
  "New Concept Portfolio",
  "Improve Existing Concepts",
  "Consumer Trend Prediction",
  "New Product Forecast",
  "Target Audience Analysis",
  "Competitive Analysis",
];

const INNOVATION_FOCUSES = [
  "Form Factors",
  "Needs",
  "Benefits",
  "Ingredients",
  "Audiences",
  "Flavors",
  "Materials",
  "Fragrances",
  "Sustainability",
  "Packaging",
  "Design Trends",
];

export default function CreatePage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState("");
  const [reportName, setReportName] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [innovationFocuses, setInnovationFocuses] = useState<string[]>([]);

  const totalSteps = 5;

  // Navigation Handlers
  const handleNext = () => {
    if (step === totalSteps) {
      router.push(
        `/report-builder?reportType=${encodeURIComponent(
          reportType
        )}&reportName=${encodeURIComponent(
          reportName
        )}&countries=${encodeURIComponent(
          JSON.stringify(countries)
        )}&categories=${encodeURIComponent(
          JSON.stringify(categories)
        )}&innovationFocuses=${encodeURIComponent(
          JSON.stringify(innovationFocuses)
        )}`
      );
    } else if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Validation for each step
  const validateStep = () => {
    switch (step) {
      case 1:
        return reportType !== "";
      case 2:
        return reportName !== "";
      case 3:
        return countries.length > 0;
      case 4:
        return categories.length > 0;
      case 5:
        return innovationFocuses.length > 0;
      default:
        return false;
    }
  };

  // Input Handlers
  const handleCheckboxToggle = (value: string, setter: Function, state: string[]) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-violet-600 h-2 rounded-full transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">What is your report about?</h1>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border rounded-lg p-3 bg-white text-gray-900"
            >
              <option value="">Select a Report Type</option>
              {REPORT_TYPES.map((type) => (
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
              className="w-full border rounded-lg p-3 bg-white text-gray-900"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Select relevant countries</h1>
            <div className="grid grid-cols-2 gap-4">
              {["USA", "Canada", "UK", "Germany", "India"].map((country) => (
                <button
                  key={country}
                  onClick={() => handleCheckboxToggle(country, setCountries, countries)}
                  className={`p-3 rounded-lg border ${
                    countries.includes(country) ? "bg-violet-100" : "bg-gray-50"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Select categories</h1>
            <div className="grid grid-cols-2 gap-4">
              {["Food & Beverage", "Personal Care", "Tech", "Household"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCheckboxToggle(category, setCategories, categories)}
                  className={`p-3 rounded-lg border ${
                    categories.includes(category) ? "bg-violet-100" : "bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Select your innovation focuses</h1>
            <div className="grid grid-cols-2 gap-4">
              {INNOVATION_FOCUSES.map((focus) => (
                <button
                  key={focus}
                  onClick={() => handleCheckboxToggle(focus, setInnovationFocuses, innovationFocuses)}
                  className={`p-3 rounded-lg border ${
                    innovationFocuses.includes(focus) ? "bg-violet-100" : "bg-gray-50"
                  }`}
                >
                  {focus}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-lg ${
              step === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={step === 1}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            {step === totalSteps ? "Start Creating Report" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

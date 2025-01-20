// File: ./src/app/report-builder/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ArrowRight, X, AlertTriangle, Check } from "lucide-react";
import Alert from "@/components/ui/alert";

interface Attribute {
  id: number;
  category: string;
  description: string;
  aiScore: number;
  passionScore?: string;
  shareOfVoice?: string;
  confidence?: number;
  viralityScore?: string;
  [key: string]: any;
}

interface InitialData {
  platforms: Attribute[];
  pains: Attribute[];
  claims: Attribute[];
  viral: Attribute[];
  jtbd: Attribute[];
  occasions: Attribute[];
  audience: Attribute[];
  sensory: Attribute[];
}

const INITIAL_DATA: InitialData = {
  platforms: [
    { id: 1, category: "Bars", description: "protein bars, granola bars", aiScore: 95, passionScore: "Very Positive", shareOfVoice: "Very High", confidence: 0.92 },
    { id: 2, category: "Bites", description: "energy bites, snack balls", aiScore: 88, passionScore: "Positive", shareOfVoice: "High", confidence: 0.88 },
    { id: 3, category: "Powders", description: "drink mixes, meal replacement powders", aiScore: 78, passionScore: "Positive", shareOfVoice: "Medium", confidence: 0.85 },
    { id: 4, category: "RTD", description: "Ready-to-Drink beverages", aiScore: 92, passionScore: "Very Positive", shareOfVoice: "Very High", confidence: 0.95 },
    { id: 5, category: "Chips", description: "veggie chips, protein chips", aiScore: 85, passionScore: "Positive", shareOfVoice: "High", confidence: 0.87 },
    { id: 6, category: "Cookies", description: "keto-friendly, high-protein cookies", aiScore: 82, passionScore: "Positive", shareOfVoice: "High", confidence: 0.84 },
    { id: 7, category: "Crackers", description: "seed-based, gluten-free crackers", aiScore: 75, passionScore: "Positive", shareOfVoice: "Medium", confidence: 0.82 },
    { id: 8, category: "Spreads", description: "nut butters, protein spreads", aiScore: 89, passionScore: "Very Positive", shareOfVoice: "High", confidence: 0.91 },
    { id: 9, category: "Trail Mixes", description: "functional blends with added ingredients", aiScore: 76, passionScore: "Positive", shareOfVoice: "Medium", confidence: 0.83 },
    { id: 10, category: "Gummies", description: "vitamin-infused or functional", aiScore: 91, passionScore: "Very Positive", shareOfVoice: "Very High", confidence: 0.93 },
    { id: 11, category: "Chews", description: "energy chews, collagen chews", aiScore: 83, passionScore: "Positive", shareOfVoice: "High", confidence: 0.86 },
    { id: 12, category: "Jerky", description: "plant-based or meat-based functional jerky", aiScore: 79, passionScore: "Positive", shareOfVoice: "Medium", confidence: 0.84 },
    { id: 13, category: "Pouches", description: "squeezable fruit or yogurt blends", aiScore: 87, passionScore: "Very Positive", shareOfVoice: "High", confidence: 0.89 },
    { id: 14, category: "Cereal/Granola", description: "nutrient-packed breakfast or snack options", aiScore: 86, passionScore: "Positive", shareOfVoice: "High", confidence: 0.88 },
    { id: 15, category: "Frozen Snacks", description: "functional frozen yogurt bites, popsicles", aiScore: 72, passionScore: "Positive", shareOfVoice: "Medium", confidence: 0.79 },
    { id: 16, category: "Wafers", description: "high-protein wafers or layered snacks", aiScore: 93, passionScore: "Very Positive", shareOfVoice: "Very High", confidence: 0.94 },
    { id: 17, category: "Rice Cakes", description: "flavored with functional toppings", aiScore: 68, passionScore: "Neutral", shareOfVoice: "Medium", confidence: 0.76 },
    { id: 18, category: "Crisps", description: "protein crisps, air-popped varieties", aiScore: 81, passionScore: "Positive", shareOfVoice: "High", confidence: 0.85 },
    { id: 19, category: "Savory Puffs", description: "lentil puffs, chickpea puffs", aiScore: 84, passionScore: "Positive", shareOfVoice: "High", confidence: 0.87 },
    { id: 20, category: "Snackable Cubes", description: "cheese or meat cubes with added functional benefits", aiScore: 74, passionScore: "Positive", shareOfVoice: "Medium", confidence: 0.81 },
  ],
  pains: [],
  claims: [],
  viral: [],
  jtbd: [],
  occasions: [],
  audience: [],
  sensory: [],
};

const STEPS = [
  { id: "platforms", title: "Platforms", description: "Select key platforms" },
  { id: "pains", title: "Consumer Pains", description: "Identify major pain points and challenges" },
  { id: "claims", title: "Claims", description: "Choose compelling product claims and benefits" },
  { id: "viral", title: "Viral Value Adds", description: "Select features with viral potential" },
  { id: "jtbd", title: "Jobs To Be Done", description: "Define key user needs and jobs" },
  { id: "occasions", title: "Occasions", description: "Select key usage occasions" },
  { id: "audience", title: "Audience", description: "Define target audience segments" },
  { id: "sensory", title: "Sensory Attributes", description: "Select key sensory characteristics" },
];

const ReportBuilder: React.FC = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Attribute>("aiScore");

  // Data
  const [data, setData] = useState<InitialData>(INITIAL_DATA);
  const [filteredData, setFilteredData] = useState<Attribute[]>([]);

  // Attributes in the user's report
  const [addedAttributes, setAddedAttributes] = useState<Attribute[]>([]);

  // Toast / Notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Drag & Drop
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Context state
  const [category, setCategory] = useState("Functional Snacks");
  const [market, setMarket] = useState("USA");
  const [brandContext, setBrandContext] = useState("Kellanova's Poptarts");

  // Define Step Keys
  type StepKey = "platforms" | "pains" | "claims" | "viral" | "jtbd" | "occasions" | "audience" | "sensory";

  // On mount or on step change, filter + sort data
  useEffect(() => {
    const stepKey = STEPS[currentStep].id as StepKey;
    const stepData: Attribute[] = data[stepKey] || [];

    // Filter
    let filtered = stepData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Sort
    filtered = filtered.sort((a, b) => {
      if (sortBy === "aiScore" || sortBy === "confidence") {
        return (b[sortBy] as number) - (a[sortBy] as number);
      }
      if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
        return a[sortBy].localeCompare(b[sortBy]);
      }
      return 0;
    });

    setFilteredData(filtered);
  }, [currentStep, data, searchTerm, sortBy]);

  function showSuccessToast(message: string) {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  // Add to the report
  function handleAddToReport(attribute: Attribute) {
    if (addedAttributes.length >= 10) {
      showSuccessToast("Maximum 10 attributes allowed");
      return;
    }
    // Ensure it's not already in the list
    if (!addedAttributes.some(a => a.id === attribute.id)) {
      setAddedAttributes(prev => [...prev, attribute]);
      showSuccessToast("Attribute added!");
    }
  }

  // Remove from the report
  function handleRemoveFromReport(id: number) {
    setAddedAttributes(prev => prev.filter(attr => attr.id !== id));
    showSuccessToast("Attribute removed");
  }

  // Step navigation
  function handleNext() {
    // Enforce minimum attributes if desired
    if (addedAttributes.length < 3 && currentStep < STEPS.length - 1) {
      showSuccessToast("Please add at least 3 attributes before proceeding");
      return;
    }

    if (currentStep < STEPS.length - 1) {
      // Move to next step, reset added attributes
      setCurrentStep(prev => prev + 1);
      setAddedAttributes([]);
    } else {
      // Last step completed - redirect
      showSuccessToast("Report completed! Redirecting...");
      setTimeout(() => {
        router.push("/create-concepts");
      }, 1500);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setAddedAttributes([]);
    }
  }

  function handleSkip() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setAddedAttributes([]);
    } else {
      showSuccessToast("No more steps to skip, redirecting...");
      setTimeout(() => {
        router.push("/create-concepts");
      }, 1500);
    }
  }

  // --- Drag & Drop Handlers for "addedAttributes" Reordering ---
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newList = [...addedAttributes];
    const draggedItem = newList[draggedItemIndex];
    newList.splice(draggedItemIndex, 1);
    newList.splice(index, 0, draggedItem);

    setDraggedItemIndex(index);
    setAddedAttributes(newList);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  // Helper for color badges
  function getColorBadge(value: string | number) {
    let style = "bg-gray-100 text-gray-700";
    if (typeof value === "number") {
      if (value >= 85) {
        style = "bg-green-100 text-green-800";
      } else if (value >= 70) {
        style = "bg-yellow-100 text-yellow-800";
      } else {
        style = "bg-red-100 text-red-800";
      }
    } else {
      const str = value.toLowerCase();
      if (str.includes("very high") || str.includes("very positive")) {
        style = "bg-green-100 text-green-800";
      } else if (str.includes("high") || str.includes("positive")) {
        style = "bg-yellow-100 text-yellow-800";
      } else if (str.includes("neutral")) {
        style = "bg-gray-100 text-gray-800";
      } else if (str.includes("medium")) {
        style = "bg-blue-100 text-blue-800";
      }
      // Add more conditions if needed
    }
    return style;
  }

  // Reusable card for an attribute
  function AttributeCard({
    attribute,
    isInReport,
    onAdd,
    onRemove,
    draggableProps,
  }: {
    attribute: Attribute;
    isInReport?: boolean;
    onAdd?: (attr: Attribute) => void;
    onRemove?: (id: number) => void;
    draggableProps?: React.HTMLAttributes<HTMLDivElement>;
  }) {
    return (
      <div
        {...(draggableProps || {})}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors
                   mb-2 animate-fade-in shadow-sm"
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {attribute.category}
            </span>
            {/* AI Score Badge */}
            <span
              className={
                "text-xs font-medium px-2 py-0.5 rounded " +
                getColorBadge(attribute.aiScore)
              }
            >
              AI: {attribute.aiScore}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {attribute.description}
          </div>

          {/* Additional badges below */}
          <div className="flex flex-wrap gap-2 text-xs mt-2">
            {/* Confidence */}
            {attribute.confidence !== undefined && (
              <span
                className={
                  "px-2 py-0.5 rounded font-medium " +
                  getColorBadge(Math.round(attribute.confidence * 100))
                }
              >
                Confidence: {(attribute.confidence * 100).toFixed(0)}%
              </span>
            )}
            {/* Passion */}
            {attribute.passionScore && (
              <span
                className={
                  "px-2 py-0.5 rounded font-medium " +
                  getColorBadge(attribute.passionScore)
                }
              >
                Passion: {attribute.passionScore}
              </span>
            )}
            {/* Share of Voice */}
            {attribute.shareOfVoice && (
              <span
                className={
                  "px-2 py-0.5 rounded font-medium " +
                  getColorBadge(attribute.shareOfVoice)
                }
              >
                Share: {attribute.shareOfVoice}
              </span>
            )}
            {/* Virality */}
            <span
              className={
                "px-2 py-0.5 rounded font-medium " +
                getColorBadge(attribute.viralityScore || "Medium")
              }
            >
              Virality: {attribute.viralityScore || "Medium"}
            </span>
            {/* Suggested by AI */}
            <span className="italic text-gray-400">
              Suggested by AI
            </span>
          </div>
        </div>

        {/* The button changes depending on whether it's in the report or not */}
        {isInReport ? (
          <button
            onClick={() => onRemove && onRemove(attribute.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => onAdd && onAdd(attribute)}
            disabled={addedAttributes.some(a => a.id === attribute.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              addedAttributes.some(a => a.id === attribute.id)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-violet-600 text-white hover:bg-violet-700"
            }`}
          >
            {addedAttributes.some(a => a.id === attribute.id) ? "Added" : "Add"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Context Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm text-gray-500">Category</label>
                <input
                  type="text"
                  value={category}
                  readOnly
                  className="font-semibold text-lg focus:outline-none bg-transparent rounded px-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Market</label>
                <input
                  type="text"
                  value={market}
                  readOnly
                  className="font-semibold text-lg focus:outline-none bg-transparent rounded px-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Brand Context</label>
                <input
                  type="text"
                  value={brandContext}
                  readOnly
                  className="font-semibold text-lg focus:outline-none bg-transparent rounded px-2"
                />
              </div>
            </div>
            <button
              className="text-violet-600 hover:text-violet-700 text-sm font-medium"
              onClick={() => {
                // If you need an edit flow, implement it here
              }}
            >
              Edit Context
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-violet-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                index === currentStep
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">
                {index + 1}. {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Section 2: Selecting Relevant Attributes</h1>
          <p className="text-lg text-gray-600">
            Build your concept foundation by selecting key attributes across multiple dimensions
          </p>
        </div>

        {/* Step Header + Top Buttons (Back/Skip/Next) */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-semibold">{STEPS[currentStep].title}</h2>
            <p className="text-sm text-gray-500">{STEPS[currentStep].description}</p>
          </div>
          <div className="flex gap-2">
            {/* Back */}
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {/* Skip */}
            {currentStep < STEPS.length - 1 && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200"
              >
                Skip
              </button>
            )}
            {/* Next / Complete */}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 flex items-center gap-2"
            >
              {currentStep === STEPS.length - 1 ? "Proceed to Concepts | Step 2 / 3" : "Next Step"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Attributes in Report (Draggable) */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Attributes in Report</h2>

            {addedAttributes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <AlertTriangle className="w-12 h-12 mb-2" />
                <p>No attributes selected yet</p>
                <p className="text-sm">Add from the list on the right</p>
              </div>
            ) : (
              <div>
                {addedAttributes.map((attr, index) => (
                  <div
                    key={attr.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                  >
                    <AttributeCard
                      attribute={attr}
                      isInReport={true}
                      onRemove={handleRemoveFromReport}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Top Attributes (includes search + filter + “Add”) */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Top Attributes</h2>
            </div>

            {/* Search and Filter inside this box */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search attributes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as keyof Attribute)}
                className="px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="aiScore">Sort by AI Score</option>
                <option value="confidence">Sort by Confidence</option>
                <option value="category">Sort by Name</option>
                <option value="shareOfVoice">Sort by Share of Voice</option>
              </select>
            </div>

            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <AlertTriangle className="w-12 h-12 mb-2" />
                <p>No matching attributes found</p>
              </div>
            ) : (
              <div>
                {filteredData.map((attr) => (
                  <AttributeCard
                    key={attr.id}
                    attribute={attr}
                    onAdd={handleAddToReport}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            {toastMessage.toLowerCase().includes("error") ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <Check className="w-5 h-5 text-green-400" />
            )}
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for color badges
const getColorBadge = (value: string | number) => {
  let style = "bg-gray-100 text-gray-700";
  if (typeof value === "number") {
    if (value >= 85) {
      style = "bg-green-100 text-green-800";
    } else if (value >= 70) {
      style = "bg-yellow-100 text-yellow-800";
    } else {
      style = "bg-red-100 text-red-800";
    }
  } else {
    const str = value.toLowerCase();
    if (str.includes("very high") || str.includes("very positive")) {
      style = "bg-green-100 text-green-800";
    } else if (str.includes("high") || str.includes("positive")) {
      style = "bg-yellow-100 text-yellow-800";
    } else if (str.includes("neutral")) {
      style = "bg-gray-100 text-gray-800";
    } else if (str.includes("medium")) {
      style = "bg-blue-100 text-blue-800";
    }
    // Add more conditions if needed
  }
  return style;
};

export default ReportBuilder;

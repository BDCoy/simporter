import React, { useEffect, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { DataView } from "./DataView";
import { Presentation } from "./Presentation";
import { DocumentView } from "./DocumentView";
import { QAView } from "./QAView";
import { FileTree } from "./FileTree";
import {
  Code,
  Database,
  Presentation as PresentationIcon,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/lib/messages";

type ViewType = "code" | "data" | "slides" | "document" | "qa";

interface ViewOption {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

const viewOptions: ViewOption[] = [
  { id: "code", label: "Code", icon: Code },
  { id: "data", label: "Data", icon: Database },
  { id: "slides", label: "Slides", icon: PresentationIcon },
  { id: "document", label: "Document", icon: FileText },
  { id: "qa", label: "Q&A", icon: HelpCircle },
];

export function IDE() {
  const { messages } = useMessagesStore();
  const [activeView, setActiveView] = useState<ViewType>("code");
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [data, setData] = useState<string>('');
  const [qAndA, setQAndA] = useState<Array<{ question: string; answer: string }>>([]);
  const [executiveSummary, setExecutiveSummary] = useState('');

  useEffect(() => {
    if (messages && messages.length > 0) {
      try {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.type === 'assistant') {
          // Try to parse the response as JSON
          const parsedJson = JSON.parse(lastMessage.content);
          
          // Update state with parsed data
          if (parsedJson.deliverables) {
            // Set code
            if (parsedJson.deliverables.code) {
              setCode(parsedJson.deliverables.code.content || '');
            }
            
            // Set slides
            if (parsedJson.deliverables.slides && parsedJson.deliverables.slides.slides) {
              setSlides(parsedJson.deliverables.slides.slides);
            }
            
            // Set data
            if (parsedJson.deliverables.data) {
              setData(parsedJson.deliverables.data);
            }
            
            // Set Q&A
            if (parsedJson.deliverables.q_and_a) {
              setQAndA(parsedJson.deliverables.q_and_a);
            }
            
            // Set executive summary
            if (parsedJson.deliverables.executive_summary) {
              setExecutiveSummary(parsedJson.deliverables.executive_summary);
            }
          }
        }
      } catch (error) {
        console.error("Failed to parse message content:", error);
      }
    }
  }, [messages]);

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* File Tree Sidebar */}
      <div
        className={cn(
          "flex-shrink-0 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
          isFileTreeCollapsed ? "w-0" : "w-64"
        )}
      >
        <div className="h-full">
          <FileTree onSelect={setSelectedFile} selectedFile={selectedFile} />
        </div>
      </div>

      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsFileTreeCollapsed(!isFileTreeCollapsed)}
        className="absolute left-[320px] top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r p-1 shadow-sm"
      >
        {isFileTreeCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* View Selector */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {viewOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveView(option.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeView === option.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              <option.icon className="w-4 h-4" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-hidden">
          {activeView === "code" && (
            <CodeEditor 
              value={code} 
              onChange={(value) => setCode(value || '')} 
              language="typescript" 
            />
          )}
          {activeView === "data" && (
            <DataView data={data} />
          )}
          {activeView === "slides" && (
            <Presentation slides={slides} />
          )}
          {activeView === "document" && (
            <DocumentView content={executiveSummary} />
          )}
          {activeView === "qa" && (
            <QAView questions={qAndA} />
          )}
        </div>
      </div>
    </div>
  );
}
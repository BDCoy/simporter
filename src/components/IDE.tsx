import React, { useEffect, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { DataView } from "./DataView";
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
import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/services/project";
import PPTXEditor from "./PPTXEditor";
import { Message } from "@/pages/ProjectsPage";

type ViewType = "code" | "data" | "slides" | "document" | "qa";

interface ViewOption {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

interface IDEProps {
  project?: Project;
  initialContext?: Record<string, any>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const viewOptions: ViewOption[] = [
  { id: "code", label: "Code", icon: Code },
  { id: "data", label: "Data", icon: Database },
  { id: "slides", label: "Slides", icon: PresentationIcon },
  { id: "document", label: "Document", icon: FileText },
  { id: "qa", label: "Q&A", icon: HelpCircle },
];

export function IDE({ project, messages }: IDEProps) {
  const [activeView, setActiveView] = useState<ViewType>("code");
  const [isFileTreeCollapsed, setIsFileTreeCollapsed] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [data, setData] = useState<string>("");
  const [qAndA, setQAndA] = useState<
    Array<{ question: string; answer: string }>
  >([]);
  const [executiveSummary, setExecutiveSummary] = useState("");


  useEffect(() => {
    fetchLastMessageFromDatabase();
  }, [messages]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      updateStateFromMessage(messages);
    }
  }, [messages]);

  const fetchLastMessageFromDatabase = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", project.id)
      .eq("type", "assistant")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching last message:", error);
      return;
    }

    if (data && data.length > 0) {
      updateStateFromMessage(data);
    }
  };

  const updateStateFromMessage = (messages: any[]) => {
    const lastMessage = messages[0];
    if (!lastMessage) return;
    try {
      const parsedJson = JSON.parse(lastMessage.content);
      if (parsedJson.deliverables) {
        setCode(parsedJson.deliverables.code?.content || "");
        setSlides(parsedJson.deliverables.slides?.slides || []);
        setData(parsedJson.deliverables.data || "");
        setQAndA(parsedJson.deliverables.q_and_a || []);
        setExecutiveSummary(parsedJson.deliverables.executive_summary || "");
      }
    } catch (error) {
      console.error("Failed to parse message content:", error);
    }
  };

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
        <div className="flex-1 overflow-y-auto">
          {activeView === "code" && (
            <CodeEditor
              value={code}
              onChange={(value) => setCode(value || "")}
              language="typescript"
            />
          )}
          {activeView === "data" && <DataView data={data} />}
          {/* {activeView === "slides" && <Presentation slides={slides} />} */}
          {activeView === "slides" && <PPTXEditor slidesData={slides} />}
          {activeView === "document" && (
            <DocumentView content={executiveSummary} />
          )}
          {activeView === "qa" && <QAView questions={qAndA} />}
        </div>
      </div>
    </div>
  );
}

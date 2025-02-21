import { useState, useEffect } from "react";
import { Chat } from "@/components/Chat";
import { IDE } from "@/components/IDE";
import { EmptyStatePopup } from "@/components/EmptyStatePopup";
import { useStore } from "@/lib/store";
import type { Project } from "@/lib/services/project";

import { supabase } from "@/lib/supabase";

export interface Message {
  id: string;
  type: "user" | "assistant" | "error";
  content: string;
  created_at: Date;
  tokens_used?: number;
  isStreaming?: boolean;
  command?: {
    type: string;
    color: string;
  };
}

export function ProjectsPage() {
  const { projects, viewParams } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    const projectId = viewParams?.projectId;
    if (projectId) {
      loadProject(projectId);
    } else if (projects.length === 0) {
      setShowEmptyState(true);
    }
  }, [viewParams, projects]);

  const loadProject = async (projectId: string) => {
    try {
      const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setCurrentProject(project);
    } catch (error) {
      console.error("Error loading project:", error);
    }
  };

  if (!currentProject) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {/* Back to Welcome Button */}

      <div className="flex h-full gap-4 mt-16">
        {/* Left Panel - AI Chat Interface (1/3 width) */}
        <div className="w-1/3 min-w-[320px]">
          <Chat
            project={currentProject}
            messages={messages}
            setMessages={setMessages}
            initialContext={currentProject?.settings?.metadata}
          />
        </div>

        {/* Right Panel - AI-powered IDE (2/3 width) */}
        <div className="flex-1">
          <IDE
            project={currentProject}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>

      {/* Empty State Popup */}
      {showEmptyState && (
        <EmptyStatePopup onClose={() => setShowEmptyState(false)} />
      )}
    </>
  );
}

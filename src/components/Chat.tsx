import React, { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, RefreshCw } from "lucide-react";
import { useStore } from "@/lib/store";
import { streamAIResponse } from "@/lib/ai";
import { getSystemPrompt } from "@/lib/commands";
import { cn } from "@/lib/utils";
import { AuthModal } from "./AuthModal";
import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/services/project";
import { Message } from "@/pages/ProjectsPage";

interface ChatProps {
  project?: Project;
  initialContext?: Record<string, any>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

let messageCounter = 0;
const generateMessageId = () => `msg-${Date.now()}-${messageCounter++}`;

// const commandTypes = {
//   "/category": { color: "text-emerald-600" },
//   "/innovation": { color: "text-blue-600" },
//   "/trends": { color: "text-purple-600" },
//   "/profile": { color: "text-orange-600" },
//   "/landscape": { color: "text-red-600" },
//   "/concept": { color: "text-indigo-600" },
// };

export function Chat({ project, messages, setMessages }: ChatProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("project_id", project?.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }

        if (data.length > 0) {
          setMessages(data);
        } else {
          sendMessage(project?.name || "", true);
        }
      } catch (err) {
        console.error("Unexpected error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [project?.id]);

  const sendMessage = async (content: string, isInitial = false) => {
    if (processingRef.current) return;
    processingRef.current = true;

    setIsLoading(true);

    try {
      const userMessage: Message = {
        id: generateMessageId(),
        type: "user",
        content,
        created_at: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      const assistantMessage: Message = {
        id: generateMessageId(),
        type: "assistant",
        content: "",
        created_at: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const systemPrompt = getSystemPrompt(content);
      const stream = streamAIResponse(content, systemPrompt);
      let streamContent = "";

      for await (const chunk of stream) {
        streamContent += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: streamContent }
              : msg
          )
        );
      }

      await supabase.from("messages").insert([
        {
          content: userMessage.content,
          user_id: project?.owner_id,
          type: "user",
          project_id: project?.id,
        },
        {
          content: streamContent,
          user_id: project?.owner_id,
          type: "assistant",
          project_id: project?.id,
        },
      ]);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: streamContent, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          type: "error",
          content: "An error occurred.",
          created_at: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      processingRef.current = false;
    }
  };

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1);
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === "error") {
        sendMessage(lastMessage.content);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white/40 backdrop-blur-sm dark:bg-gray-800/40 rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "group flex flex-col",
                message.type === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-4 py-2 rounded-2xl relative font-sf-pro",
                  message.type === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : message.type === "error"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500 rounded-bl-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm"
                )}
              >
                {message.type === "error" ? (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <div className="flex-1">{message.content}</div>
                    <button
                      onClick={() => handleRetry()}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                ) : message.command ? (
                  <div className="whitespace-pre-wrap font-medium">
                    <span
                      className={cn(message.command.color, "font-semibold")}
                    >
                      {message.command.type}
                    </span>
                    <span className="text-current">
                      {message.content.slice(message.command.type.length)}
                    </span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-medium">
                    {message.content}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 px-2 font-medium">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 text-sm px-4">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse animation-delay-200">●</span>
              <span className="animate-pulse animation-delay-400">●</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              className={cn(
                "flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "font-medium text-[15px] leading-normal"
              )}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-2 rounded-full transition-colors",
                !input.trim() || isLoading
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
